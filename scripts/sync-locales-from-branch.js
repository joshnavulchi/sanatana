#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const TARGET_DIR = path.join(REPO_ROOT, 'public', 'locales');
const STATE_FILE = path.join(REPO_ROOT, '.cache', 'locales-sync-state.json');
const BRANCH_NAME = process.env.LOCALES_REF || 'locales';
const FORCE_FULL_SYNC = process.argv.includes('--full') || process.env.LOCALES_SYNC_FULL === '1';
const VERBOSE_SYNC = process.argv.includes('--verbose') || process.env.LOCALES_SYNC_VERBOSE === '1';
const PROGRESS_EVERY = 50;
const WRITE_CONCURRENCY = Number.parseInt(process.env.LOCALES_SYNC_WRITE_CONCURRENCY || '16', 10);
const GIT_BATCH_SIZE = Number.parseInt(process.env.LOCALES_SYNC_BATCH_SIZE || '300', 10);

function log(message) {
  console.log(`[locales-sync] ${message}`);
}

function logProgress(current, total, label) {
  if (current === total || current % PROGRESS_EVERY === 0 || VERBOSE_SYNC) {
    log(`${label}: ${current}/${total}`);
  }
}

function runGit(args, options = {}) {
  return execFileSync('git', ['-C', REPO_ROOT, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 1024 * 1024 * 128,
    ...options,
  });
}

function readFilesFromRefBatch(ref, sourcePaths) {
  if (!sourcePaths.length) return [];

  const specs = sourcePaths.map((sourcePath) => `${ref}:${sourcePath}`).join('\n') + '\n';
  const result = spawnSync('git', ['-C', REPO_ROOT, 'cat-file', '--batch'], {
    input: specs,
    encoding: null,
    maxBuffer: 1024 * 1024 * 256,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const stderr = (result.stderr || Buffer.from('')).toString('utf8').trim();
    throw new Error(stderr || `git cat-file --batch failed with code ${result.status}`);
  }

  const output = result.stdout || Buffer.from('');
  const contents = [];
  let offset = 0;

  for (let index = 0; index < sourcePaths.length; index += 1) {
    const headerEnd = output.indexOf(10, offset);
    if (headerEnd === -1) {
      throw new Error(`Invalid git batch output while reading ${sourcePaths[index]}.`);
    }

    const header = output.toString('utf8', offset, headerEnd);
    offset = headerEnd + 1;

    if (header.endsWith(' missing')) {
      contents.push(null);
      continue;
    }

    const headerParts = header.split(' ');
    if (headerParts.length < 3) {
      throw new Error(`Unexpected git batch header: ${header}`);
    }

    const size = Number.parseInt(headerParts[2], 10);
    if (!Number.isFinite(size) || size < 0) {
      throw new Error(`Invalid blob size in git batch header: ${header}`);
    }

    const contentEnd = offset + size;
    if (contentEnd > output.length) {
      throw new Error(`Truncated git batch output for ${sourcePaths[index]}.`);
    }

    const content = output.toString('utf8', offset, contentEnd);
    contents.push(content);
    offset = contentEnd;

    if (output[offset] === 10) {
      offset += 1;
    }
  }

  return contents;
}

function resolveRef() {
  const candidates = [BRANCH_NAME];
  if (!BRANCH_NAME.startsWith('origin/')) {
    candidates.push(`origin/${BRANCH_NAME}`);
  }

  for (const candidate of candidates) {
    try {
      runGit(['rev-parse', '--verify', '--quiet', candidate]);
      return candidate;
    } catch (_error) {
      // Continue checking candidates
    }
  }

  throw new Error(
    `Could not resolve locales ref. Tried: ${candidates.join(', ')}. ` +
      'Set LOCALES_REF to a valid local or remote ref.'
  );
}

function getCommitSha(ref) {
  return runGit(['rev-parse', `${ref}^{commit}`]).trim();
}

function isAncestorCommit(olderCommit, newerCommit) {
  try {
    runGit(['merge-base', '--is-ancestor', olderCommit, newerCommit]);
    return true;
  } catch (_error) {
    return false;
  }
}

function commitExists(commit) {
  try {
    runGit(['cat-file', '-e', `${commit}^{commit}`]);
    return true;
  } catch (_error) {
    return false;
  }
}

function listLocaleFiles(ref) {
  const output = runGit(['ls-tree', '-r', '--name-only', ref, 'locales']);
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('locales/'));
}

function readSyncState() {
  if (!fs.existsSync(STATE_FILE)) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    if (!parsed || typeof parsed !== 'object') return null;
    const ref = typeof parsed.ref === 'string' ? parsed.ref : '';
    const commit = typeof parsed.commit === 'string' ? parsed.commit : '';
    if (!ref || !commit) return null;
    return { ref, commit };
  } catch (_error) {
    return null;
  }
}

function writeSyncState(ref, commit) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify({ ref, commit }, null, 2), 'utf8');
}

function toPublicPath(sourcePath) {
  const relativePath = sourcePath.slice('locales/'.length);
  return path.join(TARGET_DIR, relativePath);
}

function sourcePathFromPublicPath(publicPath) {
  const relativePath = path.relative(TARGET_DIR, publicPath).split(path.sep).join('/');
  return `locales/${relativePath}`;
}

function listPublicLocaleSourcePaths() {
  if (!fs.existsSync(TARGET_DIR)) return [];

  const output = [];
  const stack = [TARGET_DIR];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;

    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
        output.push(sourcePathFromPublicPath(fullPath));
      }
    }
  }

  return output;
}

async function writeFilesFromRef(ref, sourcePaths, progressLabel) {
  if (!sourcePaths.length) return;

  let processed = 0;

  for (let batchStart = 0; batchStart < sourcePaths.length; batchStart += GIT_BATCH_SIZE) {
    const batchPaths = sourcePaths.slice(batchStart, batchStart + GIT_BATCH_SIZE);
    const contents = readFilesFromRefBatch(ref, batchPaths);

    for (let writeStart = 0; writeStart < batchPaths.length; writeStart += WRITE_CONCURRENCY) {
      const groupPaths = batchPaths.slice(writeStart, writeStart + WRITE_CONCURRENCY);
      const tasks = groupPaths.map((sourcePath, groupIndex) => {
        const content = contents[writeStart + groupIndex];
        if (content === null) {
          throw new Error(`Locale file missing in ref "${ref}": ${sourcePath}`);
        }

        const outputPath = toPublicPath(sourcePath);
        return fs.promises
          .mkdir(path.dirname(outputPath), { recursive: true })
          .then(() => fs.promises.writeFile(outputPath, content, 'utf8'));
      });

      await Promise.all(tasks);
      processed += groupPaths.length;
      logProgress(processed, sourcePaths.length, progressLabel);
    }
  }
}

async function writeChangedFilesFromRef(ref, sourcePaths, progressLabel) {
  if (!sourcePaths.length) return { scanned: 0, written: 0 };

  let scanned = 0;
  let written = 0;

  for (let batchStart = 0; batchStart < sourcePaths.length; batchStart += GIT_BATCH_SIZE) {
    const batchPaths = sourcePaths.slice(batchStart, batchStart + GIT_BATCH_SIZE);
    const contents = readFilesFromRefBatch(ref, batchPaths);

    for (let writeStart = 0; writeStart < batchPaths.length; writeStart += WRITE_CONCURRENCY) {
      const groupPaths = batchPaths.slice(writeStart, writeStart + WRITE_CONCURRENCY);
      const tasks = groupPaths.map(async (sourcePath, groupIndex) => {
        const content = contents[writeStart + groupIndex];
        if (content === null) {
          throw new Error(`Locale file missing in ref "${ref}": ${sourcePath}`);
        }

        const outputPath = toPublicPath(sourcePath);
        let currentContent = null;

        try {
          currentContent = await fs.promises.readFile(outputPath, 'utf8');
        } catch (_error) {
          currentContent = null;
        }

        if (currentContent === content) {
          return false;
        }

        await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.promises.writeFile(outputPath, content, 'utf8');
        return true;
      });

      const results = await Promise.all(tasks);
      scanned += groupPaths.length;
      written += results.filter(Boolean).length;
      logProgress(scanned, sourcePaths.length, progressLabel);
    }
  }

  return { scanned, written };
}

function removePublicFile(sourcePath) {
  const outputPath = toPublicPath(sourcePath);
  if (fs.existsSync(outputPath)) {
    fs.rmSync(outputPath, { force: true });
  }
}

function listChangedLocaleFiles(previousCommit, currentCommit) {
  const output = runGit([
    'diff',
    '--name-status',
    previousCommit,
    currentCommit,
    '--',
    'locales',
  ]);

  const lines = output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const changed = [];
  for (const line of lines) {
    const parts = line.split('\t').filter(Boolean);
    if (parts.length < 2) continue;
    const status = parts[0];
    const kind = status[0];

    if (kind === 'D') {
      changed.push({ action: 'delete', sourcePath: parts[1] });
      continue;
    }

    if ((kind === 'R' || kind === 'C') && parts.length >= 3) {
      changed.push({ action: 'delete', sourcePath: parts[1] });
      changed.push({ action: 'upsert', sourcePath: parts[2] });
      continue;
    }

    changed.push({ action: 'upsert', sourcePath: parts[1] });
  }

  return changed.filter((item) => item.sourcePath.startsWith('locales/'));
}

async function syncLocales() {
  const ref = resolveRef();
  const targetCommit = getCommitSha(ref);
  const state = readSyncState();

  log(`Starting sync from "${ref}" at ${targetCommit.slice(0, 12)}.`);

  if (FORCE_FULL_SYNC) {
    log('Forced full sync enabled.');
  }

  if (!FORCE_FULL_SYNC && state?.commit === targetCommit && fs.existsSync(TARGET_DIR)) {
    log(`No changes detected for "${ref}" (${targetCommit.slice(0, 12)}).`);
    return;
  }

  const shouldIncremental =
    !FORCE_FULL_SYNC &&
    Boolean(state) &&
    state.ref === ref &&
    commitExists(state.commit) &&
    fs.existsSync(TARGET_DIR) &&
    isAncestorCommit(state.commit, targetCommit);

  if (shouldIncremental) {
    log(`Using incremental mode from ${state.commit.slice(0, 12)} to ${targetCommit.slice(0, 12)}.`);
    const changed = listChangedLocaleFiles(state.commit, targetCommit);
    if (!changed.length) {
      writeSyncState(ref, targetCommit);
      log(`No locale file diffs between ${state.commit.slice(0, 12)} and ${targetCommit.slice(0, 12)}.`);
      return;
    }

    let upserts = 0;
    let deletes = 0;
    log(`Changed locale entries: ${changed.length}.`);

    const upsertPaths = [];
    for (const item of changed) {
      if (item.action === 'delete') {
        removePublicFile(item.sourcePath);
        deletes += 1;
      } else {
        upsertPaths.push(item.sourcePath);
      }
    }

    const uniqueUpserts = [...new Set(upsertPaths)];
    const incrementalResult = await writeChangedFilesFromRef(
      ref,
      uniqueUpserts,
      'Incremental upsert progress'
    );
    upserts = incrementalResult.written;

    writeSyncState(ref, targetCommit);
    log(`Incremental sync complete: ${upserts} updated, ${deletes} removed (${targetCommit.slice(0, 12)}).`);
    return;
  }

  const files = listLocaleFiles(ref);

  if (!files.length) {
    throw new Error(`No locale files found in ref "${ref}" under locales/.`);
  }

  fs.mkdirSync(TARGET_DIR, { recursive: true });
  log(`Using compare mode. Total locale files in ref: ${files.length}.`);

  const remoteSet = new Set(files);
  const existingSourcePaths = listPublicLocaleSourcePaths();
  let deletes = 0;

  for (const sourcePath of existingSourcePaths) {
    if (!remoteSet.has(sourcePath)) {
      removePublicFile(sourcePath);
      deletes += 1;
    }
  }

  const fullResult = await writeChangedFilesFromRef(ref, files, 'Compare sync progress');

  writeSyncState(ref, targetCommit);

  log(
    `Compare sync complete: ${fullResult.written} updated, ${deletes} removed ` +
      `from ${files.length} file(s) in "${ref}" (${targetCommit.slice(0, 12)}).`
  );
}

syncLocales().catch((error) => {
  console.error(`[locales-sync] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
