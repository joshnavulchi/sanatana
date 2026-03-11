#!/usr/bin/env node
/**
 * Append new keywords to `meta.keywords` (array or CSV string) in all JSON files under ./locales/<lang>/**.json
 *
 * Usage examples:
 *   node append-keywords.js --add "alpha,beta,gamma"
 *   node append-keywords.js --file new_keywords.txt
 *   node append-keywords.js --add "foo,bar" --jsonPath meta.seo.keywords
 *   node append-keywords.js --add "one,two" --no-backup
 *   node append-keywords.js --add "a,b" --dry-run
 */

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

function parseArgs(argv) {
  const args = {
    root: process.cwd(),
    locales: 'locales',
    addCsv: '',
    file: '',
    // Default to meta.keywords now
    jsonPath: 'meta.keywords',
    dryRun: false,
    backup: true,
    help: false,
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--root') args.root = argv[++i];
    else if (a === '--locales') args.locales = argv[++i];
    else if (a === '--add') args.addCsv = argv[++i] || '';
    else if (a === '--file') args.file = argv[++i] || '';
    else if (a === '--jsonPath') args.jsonPath = argv[++i] || 'meta.keywords';
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--no-backup') args.backup = false;
    else if (a === '--help' || a === '-h') args.help = true;
    else console.warn(`Unknown argument: ${a}`);
  }
  return args;
}

function printHelp() {
  console.log(`
Append keywords to JSON files under ./locales/<lang>/ at a dot path (default: meta.keywords).

Usage:
  node append-keywords.js --add "alpha,beta"
  node append-keywords.js --file new_keywords.txt
  node append-keywords.js --add "a,b" --jsonPath "seo.meta.keywords"
  node append-keywords.js --add "a,b" --dry-run
  node append-keywords.js --add "a,b" --no-backup

Notes:
  - Works whether the target is an array ["a","b"] or a CSV string "a, b".
  - Preserves original type on write (array remains array; CSV remains CSV).
  - Skips duplicates (case-sensitive).
  - Pretty-prints JSON with 2 spaces.
`);
}

function uniqueAppend(existingArr, newItems) {
  const set = new Set(existingArr);
  const toAdd = [];
  for (const item of newItems) {
    if (!set.has(item)) {
      set.add(item);
      toAdd.push(item);
    }
  }
  return { updated: Array.from(set), added: toAdd };
}

function normalizeKeywordsList(listLike) {
  // Turn input into a clean array of trimmed, non-empty strings
  return listLike
    .map(s => (typeof s === 'string' ? s.trim() : ''))
    .filter(Boolean);
}

function splitCsv(str) {
  // Split by comma, keep simple
  return str
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

function joinCsv(arr) {
  // Join as CSV with a space after comma for readability
  return arr.join(', ');
}

// Resolve a dot-path within an object, creating objects if needed
function getAtPath(rootObj, dotPath, create = true) {
  const parts = dotPath.split('.').filter(Boolean);
  let current = rootObj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (!(key in current)) {
      if (!create) return undefined;
      current[key] = {};
    } else if (typeof current[key] !== 'object' || current[key] === null || Array.isArray(current[key])) {
      if (!create) return undefined;
      current[key] = {}; // normalize intermediate non-object
    }
    current = current[key];
  }
  const lastKey = parts[parts.length - 1];
  return { parent: current, lastKey };
}

async function readKeywordsFromFile(filePath) {
  const text = await fsp.readFile(filePath, 'utf8');
  return text
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean);
}

function parseCsvKeywords(csv) {
  if (!csv) return [];
  return csv
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

async function* walkJsonFiles(localesRoot) {
  const langs = await fsp.readdir(localesRoot, { withFileTypes: true });
  for (const langDir of langs) {
    if (!langDir.isDirectory()) continue;
    const langPath = path.join(localesRoot, langDir.name);
    yield* walkJsonFilesRecursive(langPath);
  }
}

async function* walkJsonFilesRecursive(dir) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walkJsonFilesRecursive(p);
    } else if (e.isFile() && e.name.endsWith('.json')) {
      yield p;
    }
  }
}

async function ensureBackup(filePath) {
  const bakPath = `${filePath}.bak`;
  if (!fs.existsSync(bakPath)) {
    await fsp.copyFile(filePath, bakPath);
  }
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const newKeywordsRaw = [
    ...parseCsvKeywords(args.addCsv),
    ...(args.file ? await readKeywordsFromFile(args.file) : [])
  ];
  const newKeywords = normalizeKeywordsList(newKeywordsRaw);

  if (newKeywords.length === 0) {
    console.error('No keywords provided. Use --add "a,b,c" or --file keywords.txt');
    printHelp();
    process.exit(1);
  }

  const root = path.resolve(args.root);
  const localesRoot = path.join(root, args.locales);

  if (!fs.existsSync(localesRoot)) {
    console.error(`Locales folder not found: ${localesRoot}`);
    process.exit(1);
  }

  let filesScanned = 0;
  let filesChanged = 0;
  let totalAdded = 0;

  for await (const filePath of walkJsonFiles(localesRoot)) {
    filesScanned++;

    let jsonText;
    try {
      jsonText = await fsp.readFile(filePath, 'utf8');
    } catch (e) {
      console.warn(`Skipping (cannot read): ${filePath} -> ${e.message}`);
      continue;
    }

    let data;
    try {
      data = JSON.parse(jsonText);
    } catch (e) {
      console.warn(`Skipping (invalid JSON): ${filePath} -> ${e.message}`);
      continue;
    }

    const ref = getAtPath(data, args.jsonPath, true);
    if (!ref || !ref.parent) {
      console.warn(`Skipping (cannot resolve path): ${filePath} -> ${args.jsonPath}`);
      continue;
    }

    const originalValue = ref.parent[ref.lastKey];

    // Determine existing list and original type
    let originalType = 'missing'; // 'array' | 'csv' | 'missing' | 'other'
    let existingList = [];

    if (Array.isArray(originalValue)) {
      originalType = 'array';
      existingList = normalizeKeywordsList(originalValue.filter(v => typeof v === 'string'));
    } else if (typeof originalValue === 'string') {
      originalType = 'csv';
      existingList = normalizeKeywordsList(splitCsv(originalValue));
    } else if (originalValue == null) {
      originalType = 'missing';
      existingList = [];
    } else {
      // Non-supported type; coerce to array but remember to write as array
      originalType = 'other';
      existingList = [];
    }

    const { updated, added } = uniqueAppend(existingList, newKeywords);

    if (added.length > 0) {
      // Write back preserving the original type when possible
      if (originalType === 'csv') {
        ref.parent[ref.lastKey] = joinCsv(updated);
      } else {
        // For array/missing/other → write as array
        ref.parent[ref.lastKey] = updated;
      }

      if (!args.dryRun) {
        if (args.backup) await ensureBackup(filePath);
        const pretty = JSON.stringify(data, null, 2) + '\n';
        await fsp.writeFile(filePath, pretty, 'utf8');
      }

      filesChanged++;
      totalAdded += added.length;
      console.log(`${args.dryRun ? '[DRY-RUN] ' : ''}Updated: ${path.relative(root, filePath)} (+${added.length})`);
    }
  }

  console.log(`\nScanned: ${filesScanned} file(s)`);
  console.log(`Changed: ${filesChanged} file(s)`);
  console.log(`Keywords added (sum across files): ${totalAdded}`);
  if (args.dryRun) console.log('No files were written (dry-run).');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
