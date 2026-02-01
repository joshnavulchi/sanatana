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

// Sync locale keys with reference locale (en)
function syncKeysWithReference(targetData, referenceData, locale) {
  const changes = { added: 0, removed: 0 };

  // Deep sync function that handles nested objects
  function syncObject(target, reference, path = '') {
    // Get all keys from reference
    const refKeys = new Set(Object.keys(reference));
    const targetKeys = Object.keys(target);

    // Remove keys not in reference
    for (const key of targetKeys) {
      if (!refKeys.has(key)) {
        delete target[key];
        changes.removed++;
        console.log(`  - Removed extra key: ${path}${key}`);
      }
    }

    // Add/update keys from reference
    for (const key of refKeys) {
      const refValue = reference[key];
      const targetValue = target[key];
      const currentPath = path ? `${path}.${key}` : key;

      if (!(key in target)) {
        // Key missing in target, add it
        target[key] = refValue;
        changes.added++;
        console.log(`  + Added missing key: ${currentPath}`);
      } else if (
        refValue &&
        typeof refValue === 'object' &&
        !Array.isArray(refValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        // Both are objects, recurse
        syncObject(targetValue, refValue, currentPath);
      } else if (Array.isArray(refValue) && Array.isArray(targetValue)) {
        // Arrays - check if they have the same structure
        if (targetValue.length === 0 && refValue.length > 0) {
          // Empty target array, copy reference structure
          target[key] = JSON.parse(JSON.stringify(refValue));
          changes.added++;
          console.log(`  + Synced array structure: ${currentPath}`);
        } else if (refValue.length > 0 && targetValue.length > 0) {
          // Both have items - if they're objects, ensure same keys
          const refItem = refValue[0];
          const targetItem = targetValue[0];

          if (refItem && typeof refItem === 'object' && !Array.isArray(refItem) &&
            targetItem && typeof targetItem === 'object' && !Array.isArray(targetItem)) {
            // Array of objects - sync each object's keys
            for (let i = 0; i < targetValue.length; i++) {
              if (targetValue[i] && typeof targetValue[i] === 'object') {
                syncObject(targetValue[i], refItem, `${currentPath}[${i}]`);
              }
            }
          }
        }
      }
    }
  }

  syncObject(targetData, referenceData);

  if (changes.added > 0 || changes.removed > 0) {
    console.log(`→ ${locale}: synced keys (${changes.added} added, ${changes.removed} removed)`);
  }

  return changes;
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
        // If we're downloading a new or modified file for this locale,
        // remove any existing locale-level index.json so page-specific
        // namespace files are used instead.
        try {
          const localeIndex = path.join(localeDir, 'index.json');
          if (fs.existsSync(localeIndex)) {
            fs.unlinkSync(localeIndex);
            console.log(`Removed existing ${locale}/index.json because ${file.name} was downloaded`);
          }
        } catch (e) {
          console.error(`Failed to remove ${locale}/index.json: ${e.message}`);
        }
      } catch (e) {
        console.error(`Failed to download ${locale}/${file.name}:`, e.message);
      }
    }

    // Merge logic removed — keep downloaded per-namespace JSON files
    // (e.g. historical_timeline.json, world_transformation.json) as-is.
    console.log(`→ preserved per-namespace JSON files for ${locale}`);
  }

  saveMeta(meta);
  console.log('✓ Locale download and merge completed\n');

  // Remove any existing locale-level index.json files under public/locales
  function removeIndexJsonFiles() {
    if (!fs.existsSync(LOCAL_LOCALES_DIR)) return 0;
    const dirs = fs.readdirSync(LOCAL_LOCALES_DIR).filter((d) => {
      try {
        return fs.statSync(path.join(LOCAL_LOCALES_DIR, d)).isDirectory();
      } catch (_) {
        return false;
      }
    });

    const removed = [];
    for (const d of dirs) {
      const idx = path.join(LOCAL_LOCALES_DIR, d, 'index.json');
      if (fs.existsSync(idx)) {
        try {
          fs.unlinkSync(idx);
          removed.push(idx);
          console.log(`Removed index.json: ${d}/index.json`);
        } catch (e) {
          console.error(`Failed to remove ${d}/index.json: ${e.message}`);
        }
      }
    }

    if (removed.length === 0) console.log('No index.json files found in public/locales to remove.');
    return removed.length;
  }

  const removedCount = removeIndexJsonFiles();
  if (removedCount > 0) console.log(`\nRemoved ${removedCount} index.json file(s) from public/locales.\n`);

  // Sync all locales with en locale (reference)
  try {
    console.log('→ Syncing all locale keys with en locale...');
    const enPath = path.join(LOCAL_LOCALES_DIR, 'en', 'index.json');

    if (fs.existsSync(enPath)) {
      const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
      const dirs = fs.readdirSync(LOCAL_LOCALES_DIR).filter((n) => {
        try {
          return fs.statSync(path.join(LOCAL_LOCALES_DIR, n)).isDirectory() && n !== 'en';
        } catch (_) {
          return false;
        }
      });

      for (const locale of dirs) {
        const localePath = path.join(LOCAL_LOCALES_DIR, locale, 'index.json');
        if (fs.existsSync(localePath)) {
          try {
            const localeData = JSON.parse(fs.readFileSync(localePath, 'utf8'));
            const changes = syncKeysWithReference(localeData, enData, locale);

            if (changes.added > 0 || changes.removed > 0) {
              fs.writeFileSync(localePath, JSON.stringify(localeData, null, 2), 'utf8');
              console.log(`✓ Updated ${locale}/index.json`);
            }
          } catch (e) {
            console.error(`Failed to sync ${locale}:`, e.message);
          }
        }
      }
      console.log('✓ All locales synced with en reference\n');
    } else {
      console.warn('⚠️ en/index.json not found - skipping key sync\n');
    }
  } catch (e) {
    console.error('Failed to sync locale keys:', e.message);
  }

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
      try {
        const localeDir = path.join(LOCAL_LOCALES_DIR, d);
        const jsonFiles = fs.readdirSync(localeDir).filter(f => f.endsWith('.json') && f !== path.basename(META_FILE));
        if (jsonFiles.length === 0) {
          missing.push(d);
          continue;
        }
        const anyLarge = jsonFiles.some((fn) => {
          try {
            const st = fs.statSync(path.join(localeDir, fn));
            return st.size > 10;
          } catch (_) {
            return false;
          }
        });
        if (anyLarge) ok.push(d);
        else missing.push(d);
      } catch (_) {
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
      try {
        const p = path.join(LOCAL_LOCALES_DIR, d);
        if (!fs.statSync(p).isDirectory()) return false;
        const files = fs.readdirSync(p).filter(f => f.endsWith('.json') && f !== path.basename(META_FILE));
        return files.length > 0;
      } catch (_) {
        return false;
      }
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