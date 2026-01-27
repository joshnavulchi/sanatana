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
const META_FILE = path.join(LOCAL_LOCALES_DIR, '.locales-meta.json');

/* ============== UTILITIES ================= */

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadMeta() {
  try {
    if (!fs.existsSync(META_FILE)) return {};
    return JSON.parse(fs.readFileSync(META_FILE, 'utf8')) || {};
  } catch (e) {
    return {};
  }
}

function saveMeta(meta) {
  try {
    fs.writeFileSync(META_FILE, JSON.stringify(meta, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write meta file:', e.message);
  }
}

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Remove ambiguous / invisible Unicode characters from strings
const AMBIGUOUS_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u00AD\u200B\uFEFF\u200E\u200F\u202A-\u202E\u2066-\u2069]/g;

function sanitizeValue(v) {
  if (typeof v === 'string') {
    return v.replace(AMBIGUOUS_RE, '');
  }
  if (Array.isArray(v)) return v.map(sanitizeValue);
  if (v && typeof v === 'object') return sanitizeObject(v);
  return v;
}

function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeValue);
  for (const k of Object.keys(obj)) {
    const val = obj[k];
    if (typeof val === 'string') obj[k] = val.replace(AMBIGUOUS_RE, '');
    else if (Array.isArray(val)) obj[k] = val.map(sanitizeValue);
    else if (val && typeof val === 'object') obj[k] = sanitizeObject(val);
  }
  return obj;
}

async function sanitizeAllLocales() {
  if (!fs.existsSync(LOCAL_LOCALES_DIR)) return;
  const locales = fs.readdirSync(LOCAL_LOCALES_DIR).filter((d) => {
    const p = path.join(LOCAL_LOCALES_DIR, d);
    return fs.statSync(p).isDirectory();
  });

  for (const locale of locales) {
    const idx = path.join(LOCAL_LOCALES_DIR, locale, 'index.json');
    if (!fs.existsSync(idx)) continue;
    try {
      const raw = fs.readFileSync(idx, 'utf8');
      const json = JSON.parse(raw);
      const before = JSON.stringify(json);
      sanitizeObject(json);
      const after = JSON.stringify(json);
      if (before !== after) {
        fs.writeFileSync(idx, JSON.stringify(json, null, 2), 'utf8');
        console.log(`Sanitized ${locale}/index.json`);
      }
    } catch (e) {
      console.error(`Failed to sanitize ${locale}/index.json:`, e.message);
    }
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
  const meta = loadMeta();
  const locales = await listLocales();

  for (const locale of locales) {
    console.log(`→ ${locale}`);
    const localeDir = path.join(LOCAL_LOCALES_DIR, locale);
    ensureDir(localeDir);

    const files = await listLocaleFiles(locale);

    for (const file of files) {
      const outputPath = path.join(localeDir, file.name);
      const metaKey = `${locale}/${file.name}`;

      // Skip download when remote SHA equals stored meta (already merged or up-to-date)
      if (!force && meta[metaKey] === file.sha) {
        continue;
      }

      try {
        const content = await downloadRaw(file.download_url);
        fs.writeFileSync(outputPath, content, 'utf8');
        meta[metaKey] = file.sha;
        console.log(`✓ ${locale}/${file.name}`);
      } catch (e) {
        console.error(`Failed to download ${locale}/${file.name}:`, e.message);
      }
    }

    // Merge namespace JSONs into index.json and remove others
    try {
      const items = fs.readdirSync(localeDir).filter((n) => n.endsWith('.json'));
      const namespaces = items.filter((n) => n !== 'index.json');

      if (namespaces.length > 0) {
        let merged = {};
        for (const ns of namespaces) {
          const p = path.join(localeDir, ns);
          try {
            const raw = fs.readFileSync(p, 'utf8');
            const json = JSON.parse(raw);
            merged = deepMerge(merged, json);
          } catch (e) {
            console.error(`Failed to parse ${locale}/${ns}:`, e.message);
          }
        }

        const indexPath = path.join(localeDir, 'index.json');
        fs.writeFileSync(indexPath, JSON.stringify(merged, null, 2), 'utf8');
        console.log(`→ merged ${locale} → index.json`);

        // remove namespace files (keep meta entries so unchanged remote files aren't re-downloaded)
        for (const ns of namespaces) {
          const p = path.join(localeDir, ns);
          try {
            fs.unlinkSync(p);
          } catch (e) {
            console.error(`Failed to remove ${locale}/${ns}:`, e.message);
          }
        }
      }
    } catch (e) {
      console.error(`Failed to merge locale ${locale}:`, e.message);
    }
  }

  saveMeta(meta);
  console.log('✓ Locale download and merge completed\n');

  // Deployment verification: ensure index.json exists for each locale and report
  try {
    const dirs = fs.readdirSync(LOCAL_LOCALES_DIR).filter((n) => {
      try {
        return fs.statSync(path.join(LOCAL_LOCALES_DIR, n)).isDirectory();
      } catch (_) {
        return false;
      }
    });

    const ok = [];
    const missing = [];

    for (const d of dirs) {
      const idx = path.join(LOCAL_LOCALES_DIR, d, 'index.json');
      if (fs.existsSync(idx)) {
        try {
          const st = fs.statSync(idx);
          if (st.size > 10) ok.push(d);
          else missing.push(d);
        } catch (_) {
          missing.push(d);
        }
      } else {
        missing.push(d);
      }
    }

    console.log('Locale deployment verification:');
    for (const l of ok) console.log(`  ✓ ${l} -> public/locales/${l}/index.json`);
    for (const l of missing) console.warn(`  ✗ ${l} -> MISSING index.json in public/locales/${l}`);

    if (missing.length > 0) {
      console.warn('\nWarning: Some locales are missing `index.json`. Ensure `download-locales.js` ran during build and `public/locales` is packaged in the deploy artifact.');
    } else {
      console.log('\nAll locales present in public/locales.');
    }
  } catch (e) {
    console.error('Failed to verify deployed locales:', e.message);
  }
}

/* ============== CLI ================= */

if (require.main === module) {
  const force = process.argv.includes('--force') || process.env.FORCE_LOCALE_DOWNLOAD === '1' || process.env.DOWNLOAD_LOCALES === '1';
  const skipIfMeta = process.argv.includes('--skip-if-meta') || process.argv.includes('--skip');
  const skipLocaleDownload = process.env.SKIP_LOCALE_DOWNLOAD === '1';

  if (skipLocaleDownload) {
    console.log('SKIP_LOCALE_DOWNLOAD=1 — skipping locale download');
    process.exit(0);
  }

  if (skipIfMeta && fs.existsSync(META_FILE)) {
    console.log('Meta present — skipping locale download (use --force to override)');
    process.exit(0);
  }

  downloadLocales({ force }).catch((err) => {
    console.error('Locale download failed:', err.message);
    process.exit(1);
  });
}

module.exports = { downloadLocales };