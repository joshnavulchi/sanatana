/* Copyright (c) 2025 sanatanadharmam.in
 * Licensed under SEE LICENSE IN LICENSE.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

/* ================= CONFIG ================= */

const GITHUB_REPO = 'vulchivijay/first-contributes';
const GITHUB_BRANCH = 'production';
const REMOTE_LOCALES_PATH = 'locales';

const LOCAL_LOCALES_DIR = path.join(__dirname, '../public/locales');
const META_FILE = path.join(LOCAL_LOCALES_DIR, '.locales-meta.json');
const BRANCH_META_FILE = path.join(LOCAL_LOCALES_DIR, '.branch-meta.json');

/* ================= UTIL ================= */

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadJSON(file) {
  try {
    if (!fs.existsSync(file)) return {};
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}

function saveJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error(`Failed to write ${file}:`, e.message);
  }
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          'User-Agent': 'locale-downloader',
          Accept: 'application/vnd.github.v3+json'
        }
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          if (res.statusCode === 200) resolve(data);
          else reject(new Error(`HTTP ${res.statusCode}`));
        });
      }
    ).on('error', reject);
  });
}

/* ================= GITHUB ================= */

async function getLatestCommitSha() {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/commits/${GITHUB_BRANCH}`;
  const res = JSON.parse(await fetch(url));
  return res.sha;
}

async function listLocales() {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${REMOTE_LOCALES_PATH}?ref=${GITHUB_BRANCH}`;
  const res = JSON.parse(await fetch(url));
  return res.filter((x) => x.type === 'dir').map((x) => x.name);
}

async function listLocaleFiles(locale) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${REMOTE_LOCALES_PATH}/${locale}?ref=${GITHUB_BRANCH}`;
  const res = JSON.parse(await fetch(url));
  return res.filter((x) => x.type === 'file' && x.name.endsWith('.json'));
}

async function downloadRaw(url) {
  return fetch(url);
}

/* ================= MAIN ================= */

async function downloadLocales({ force = false } = {}) {
  console.log('\nChecking GitHub branch changes...');

  ensureDir(LOCAL_LOCALES_DIR);

  const branchMeta = loadJSON(BRANCH_META_FILE);
  const latestSha = await getLatestCommitSha();

  if (!force && branchMeta.lastCommit === latestSha) {
    console.log('✓ No new commit detected. Skipping locale download completely.\n');
    return;
  }

  console.log('→ New commit detected. Syncing locales...\n');

  const meta = loadJSON(META_FILE);
  const locales = await listLocales();

  for (const locale of locales) {
    console.log(`→ ${locale}`);
    const localeDir = path.join(LOCAL_LOCALES_DIR, locale);
    ensureDir(localeDir);

    const files = await listLocaleFiles(locale);

    for (const file of files) {
      const outputPath = path.join(localeDir, file.name);
      const metaKey = `${locale}/${file.name}`;

      if (!force && meta[metaKey] === file.sha) {
        continue;
      }

      try {
        const content = await downloadRaw(file.download_url);
        fs.writeFileSync(outputPath, content, 'utf8');
        meta[metaKey] = file.sha;
        console.log(`✓ ${locale}/${file.name}`);
      } catch (e) {
        console.error(`Failed ${locale}/${file.name}:`, e.message);
      }
    }
  }

  saveJSON(META_FILE, meta);

  branchMeta.lastCommit = latestSha;
  saveJSON(BRANCH_META_FILE, branchMeta);

  console.log('\n✓ Locale sync completed successfully.\n');
}

/* ================= CLI ================= */

if (require.main === module) {
  (async () => {
    const force =
      process.argv.includes('--force') ||
      process.env.FORCE_LOCALE_DOWNLOAD === '1';

    const skip =
      process.argv.includes('--skip') ||
      process.env.SKIP_LOCALE_DOWNLOAD === '1';

    if (skip) {
      console.log('SKIP_LOCALE_DOWNLOAD=1 — skipping locale download');
      process.exit(0);
    }

    try {
      await downloadLocales({ force });
      process.exit(0);
    } catch (err) {
      console.error('Locale download failed:', err.message);
      process.exit(0); // never break production build
    }
  })();
}

module.exports = { downloadLocales };