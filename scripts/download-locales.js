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
    const sourceValue = source[key];
    const targetValue = target[key];

    // Handle arrays specially to avoid duplicates
    if (Array.isArray(sourceValue)) {
      if (!Array.isArray(targetValue)) {
        // Target doesn't have this array, use source array
        target[key] = sourceValue;
      } else {
        // Both are arrays - merge intelligently
        if (sourceValue.length === 0) {
          // Empty source array, keep target
          continue;
        }
        
        // Check if array contains objects with identifiers
        const hasObjects = sourceValue.some(item => item && typeof item === 'object');
        
        if (hasObjects) {
          // Array of objects - merge by unique identifier
          const merged = [...targetValue];
          const identifierKeys = ['id', 'key', 'name', 'chapter', 'parva', 'title', 'href'];
          
          for (const sourceItem of sourceValue) {
            if (!sourceItem || typeof sourceItem !== 'object') {
              // Primitive in array of objects, add if not exists
              if (!merged.includes(sourceItem)) {
                merged.push(sourceItem);
              }
              continue;
            }
            
            // Find identifier key for this object
            const idKey = identifierKeys.find(k => sourceItem[k] !== undefined);
            
            if (idKey) {
              // Find existing item with same identifier
              const existingIndex = merged.findIndex(item => 
                item && typeof item === 'object' && item[idKey] === sourceItem[idKey]
              );
              
              if (existingIndex >= 0) {
                // Merge with existing object
                merged[existingIndex] = deepMerge(merged[existingIndex], sourceItem);
              } else {
                // New item, add it
                merged.push(sourceItem);
              }
            } else {
              // No identifier found, check for deep equality to avoid duplicates
              const isDuplicate = merged.some(item => 
                JSON.stringify(item) === JSON.stringify(sourceItem)
              );
              if (!isDuplicate) {
                merged.push(sourceItem);
              }
            }
          }
          target[key] = merged;
        } else {
          // Array of primitives - merge and deduplicate
          target[key] = [...new Set([...targetValue, ...sourceValue])];
        }
      }
    } else if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue)
    ) {
      // Handle nested objects
      if (!targetValue || typeof targetValue !== 'object' || Array.isArray(targetValue)) {
        target[key] = {};
      }
      // Recursively merge nested objects
      deepMerge(target[key], sourceValue);
    } else {
      // For primitives and null values, replace directly
      target[key] = sourceValue;
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
      const indexPath = path.join(localeDir, 'index.json');
      const items = fs.readdirSync(localeDir).filter((n) => n.endsWith('.json'));
      const namespaces = items.filter((n) => n !== 'index.json');

      if (namespaces.length > 0) {
        // Load existing index.json to preserve local-only keys
        let existingData = {};
        if (fs.existsSync(indexPath)) {
          try {
            const existingRaw = fs.readFileSync(indexPath, 'utf8');
            existingData = JSON.parse(existingRaw);
            console.log(`→ loaded existing ${locale}/index.json (${Object.keys(existingData).length} keys)`);
          } catch (e) {
            console.warn(`Failed to load existing ${locale}/index.json:`, e.message);
            existingData = {};
          }
        } else {
          console.log(`→ creating new ${locale}/index.json`);
        }

        // Start with downloaded namespace files as the BASE (source of truth)
        let merged = {};
        for (const ns of namespaces) {
          const p = path.join(localeDir, ns);
          try {
            const raw = fs.readFileSync(p, 'utf8');
            const json = JSON.parse(raw);
            const beforeKeys = Object.keys(merged).length;
            // Downloaded file is the source - merge it as base
            merged = deepMerge(merged, json);
            const afterKeys = Object.keys(merged).length;
            console.log(`→ merged ${locale}/${ns} (${beforeKeys} → ${afterKeys} keys)`);
          } catch (e) {
            console.error(`Failed to parse ${locale}/${ns}:`, e.message);
          }
        }

        // Now merge any local-only keys that don't exist in downloaded files
        for (const key of Object.keys(existingData)) {
          if (!(key in merged)) {
            merged[key] = existingData[key];
            console.log(`→ preserved local-only key: ${key}`);
          }
        }

        fs.writeFileSync(indexPath, JSON.stringify(merged, null, 2), 'utf8');
        console.log(`✓ updated ${locale}/index.json with ${Object.keys(merged).length} total keys`);

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
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL || process.env.RENDER;

  if (skipLocaleDownload) {
    console.log('SKIP_LOCALE_DOWNLOAD=1 — skipping locale download');
    process.exit(0);
  }

  if (skipIfMeta && fs.existsSync(META_FILE)) {
    console.log('Meta present — skipping locale download (use --force to override)');
    process.exit(0);
  }

  // Check if locales already exist with metadata - if so, only download changed files
  const existingLocales = fs.existsSync(LOCAL_LOCALES_DIR) && 
    fs.readdirSync(LOCAL_LOCALES_DIR).filter(d => {
      const indexPath = path.join(LOCAL_LOCALES_DIR, d, 'index.json');
      return fs.existsSync(indexPath);
    });

  const hasValidMeta = fs.existsSync(META_FILE);

  // In production with existing locales and metadata, only download modified files
  if (!force && isProduction && existingLocales && existingLocales.length > 0 && hasValidMeta) {
    console.log(`Production build detected with ${existingLocales.length} existing locale(s) and metadata.`);
    console.log('Only downloading modified files based on SHA comparison...');
    // Continue to downloadLocales but with force=false, which will use SHA comparison
  } else if (!force && existingLocales && existingLocales.length > 0 && !hasValidMeta) {
    console.log(`Found ${existingLocales.length} existing locale(s) but no metadata — skipping download (use --force to re-download)`);
    process.exit(0);
  }

  downloadLocales({ force }).catch((err) => {
    console.error('Locale download failed:', err.message);
    // Don't fail the build if locales already exist
    if (existingLocales && existingLocales.length > 0) {
      console.log('Using existing locales - continuing build...');
      process.exit(0);
    } else {
      process.exit(1);
    }
  });
}

module.exports = { downloadLocales };