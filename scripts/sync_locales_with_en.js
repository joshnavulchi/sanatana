#!/usr/bin/env node
/**
 * Sync locale JSON files with `en` locale keys.
 * - Ensures each locale has exactly the same keys as `locales/en/*.json`.
 * - If a key exists in other locale, it is NOT modified.
 * - If a key is missing in other locale, the English key+value is copied.
 * - If extra keys exist in other locale that are not present in English, they are removed.
 *
 * Usage:
 *   node scripts/locale-scripts/sync_locales_with_en.js
 *   node scripts/locale-scripts/sync_locales_with_en.js --locales-dir=./locales --dry-run
 */

const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);

const REPO_ROOT = path.resolve(__dirname, '..');

function getArgValue(prefix) {
  const hit = argv.find((a) => a.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : undefined;
}

function resolveDir(inputPath, fallbackPath) {
  if (!inputPath) return fallbackPath;
  return path.isAbsolute(inputPath) ? inputPath : path.resolve(REPO_ROOT, inputPath);
}

const CONFIG = {
  localesDir: resolveDir(getArgValue('--locales-dir='), path.join(REPO_ROOT, 'locales')),
  enLocale: 'en',
  dryRun: argv.includes('--dry-run'),
};

function isPlainObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

function deepClone(v) {
  return JSON.parse(JSON.stringify(v));
}

function syncObjects(enObj, otherObj) {
  // Mutates otherObj in-place to match enObj keys; returns {added, removed}
  let added = 0;
  let removed = 0;

  // Ensure otherObj is an object
  if (!isPlainObject(otherObj)) {
    otherObj = {};
  }

  // Helper to count keys in an object recursively
  function countNestedKeys(obj) {
    if (!isPlainObject(obj)) return 0;
    let n = 0;
    for (const k of Object.keys(obj)) {
      n += 1;
      n += countNestedKeys(obj[k]);
    }
    return n;
  }

  // Add missing keys from enObj (or recurse)
  for (const key of Object.keys(enObj)) {
    const enVal = enObj[key];

    if (Object.prototype.hasOwnProperty.call(otherObj, key)) {
      const otherVal = otherObj[key];
      if (isPlainObject(enVal) && isPlainObject(otherVal)) {
        // Both objects: recurse deeply
        const res = syncObjects(enVal, otherVal);
        added += res.added;
        removed += res.removed;
        otherObj[key] = otherVal;
      } else if (isPlainObject(enVal) && !isPlainObject(otherVal)) {
        // English expects an object, but other has non-object: replace so nested keys exist
        const cloned = deepClone(enVal);
        otherObj[key] = cloned;
        const addedCount = countNestedKeys(cloned) || 1;
        added += addedCount;
      } else {
        // Key exists in other locale and is non-object: do not modify
      }
    } else {
      // Missing key: copy English value
      otherObj[key] = deepClone(enVal);
      // Count nested additions
      added += isPlainObject(enVal) ? (countNestedKeys(enVal) || 1) : 1;
    }
  }

  // Remove extra keys in otherObj that are not in enObj
  for (const key of Object.keys(otherObj)) {
    if (!Object.prototype.hasOwnProperty.call(enObj, key)) {
      delete otherObj[key];
      removed++;
    }
  }

  return { added, removed, obj: otherObj };
}

async function readJson(filePath) {
  try {
    const raw = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

async function writeJson(filePath, jsonObj, dryRun) {
  const content = JSON.stringify(jsonObj, null, 2) + '\n';
  if (dryRun) return;
  await fs.promises.writeFile(filePath, content, 'utf8');
}

async function syncFileAcrossLocales(enFilePath, localesDirs) {
  const fileName = path.basename(enFilePath);
  const basename = path.basename(enFilePath, '.json');

  const enJson = await readJson(enFilePath);
  if (!enJson) {
    console.warn(`Skipping invalid JSON: ${enFilePath}`);
    return { file: fileName, skipped: true };
  }

  // Sync the entire English JSON structure (root), not just the basename wrapper.
  // This ensures any sibling top-level keys (e.g., "cosmic") are also synced.
  const enSource = enJson;

  const results = [];

  for (const localeDir of localesDirs) {
    const targetPath = path.join(localeDir, fileName);
    let otherJson = await readJson(targetPath);
    let otherSource = otherJson && typeof otherJson === 'object' ? otherJson : {};

    const { added, removed, obj } = syncObjects(enSource, otherSource);

    // outJson is the synced root object matching English structure
    const outJson = obj;

    if (!CONFIG.dryRun) {
      await writeJson(targetPath, outJson, CONFIG.dryRun);
    }

    results.push({ localeDir: path.basename(localeDir), file: fileName, added, removed });
  }

  return { file: fileName, results };
}

async function main() {
  console.log(`Locales dir: ${CONFIG.localesDir}`);
  console.log(`English locale: ${CONFIG.enLocale}`);
  console.log(`Dry run: ${CONFIG.dryRun}`);

  // Ensure locales dir exists
  if (!fs.existsSync(CONFIG.localesDir)) {
    console.error('Locales directory not found:', CONFIG.localesDir);
    process.exit(1);
  }

  const entries = await fs.promises.readdir(CONFIG.localesDir, { withFileTypes: true });
  const locales = entries.filter(e => e.isDirectory()).map(e => e.name);
  if (!locales.includes(CONFIG.enLocale)) {
    console.error(`English locale '${CONFIG.enLocale}' not found in ${CONFIG.localesDir}`);
    process.exit(1);
  }

  const enDir = path.join(CONFIG.localesDir, CONFIG.enLocale);
  const otherLocaleDirs = locales.filter(l => l !== CONFIG.enLocale).map(l => path.join(CONFIG.localesDir, l));

  const enFiles = (await fs.promises.readdir(enDir)).filter(f => f.toLowerCase().endsWith('.json'));

  const summary = [];

  for (const f of enFiles) {
    const enFilePath = path.join(enDir, f);
    process.stdout.write(`Processing ${f}... `);
    const res = await syncFileAcrossLocales(enFilePath, otherLocaleDirs);
    let totalAdded = 0;
    let totalRemoved = 0;
    for (const r of res.results) {
      totalAdded += r.added;
      totalRemoved += r.removed;
    }
    summary.push({ file: f, added: totalAdded, removed: totalRemoved });
    console.log(`done (added: ${totalAdded}, removed: ${totalRemoved})`);
  }

  console.log('\nSummary:');
  for (const s of summary) {
    console.log(` ${s.file}: added ${s.added}, removed ${s.removed}`);
  }

  if (CONFIG.dryRun) console.log('\nDry run complete — no files were modified.');
  else console.log('\nSync complete.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
