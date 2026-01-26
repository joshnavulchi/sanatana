/* Copyright (c) 2025 sanatanadharmam.in
 * Licensed under SEE LICENSE IN LICENSE.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

/* ================= CONFIG ================= */

const GITHUB_REPO = 'vulchivijay/first-contributes';
const GITHUB_BRANCH = 'main';
const REMOTE_LOCALES_PATH = 'locales';
const LOCAL_LOCALES_DIR = path.join(__dirname, '../public/locales');

/* ============== UTILITIES ================= */

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
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

/* ============== GITHUB API ================= */

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

/* ============== MAIN LOGIC ================= */

async function downloadLocales({ force = false } = {}) {
  console.log('\nDownloading locales from GitHub');
  console.log(`Repo: ${GITHUB_REPO} (${GITHUB_BRANCH})`);
  console.log(`Output: ${LOCAL_LOCALES_DIR}\n`);

  ensureDir(LOCAL_LOCALES_DIR);

  const locales = await listLocales();

  for (const locale of locales) {
    console.log(`→ ${locale}`);
    const localeDir = path.join(LOCAL_LOCALES_DIR, locale);
    ensureDir(localeDir);

    const files = await listLocaleFiles(locale);

    for (const file of files) {
      const outputPath = path.join(localeDir, file.name);

      if (!force && fs.existsSync(outputPath)) {
        continue; // keep existing namespace file
      }

      const content = await downloadRaw(file.download_url);
      fs.writeFileSync(outputPath, content, 'utf8');
      console.log(`  ✓ ${file.name}`);
    }

    console.log('');
  }

  console.log('✓ Locale download completed\n');
}

/* ============== CLI ================= */

if (require.main === module) {
  const force = process.argv.includes('--force');
  downloadLocales({ force }).catch((err) => {
    console.error('Locale download failed:', err.message);
    process.exit(1);
  });
}

module.exports = { downloadLocales };