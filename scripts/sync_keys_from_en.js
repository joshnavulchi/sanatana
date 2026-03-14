const fs = require('fs');
const path = require('path');

/**
 * sync_keys_from_en.js
 *
 * Meaning:
 * This script keeps non-English locale files aligned with the English source (`locales/en`)
 * for non-translatable metadata keys.
 *
 * It copies only selected keys from matching `en` JSON files into other locale JSON files.
 * Translatable text is not overwritten.
 */

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

const LOCALES_DIR = resolveDir(getArgValue('--locales-dir='), path.join(REPO_ROOT, 'locales'));
const EN_LOCALE = 'en';
const KEYS_TO_SYNC = [
  'src', 'href', 'canonical', 'url', 'ogimage', '@context', 'email', 'logo'
];

const KEY_MEANINGS = {
  src: 'Asset source path (image/audio/video/etc.)',
  href: 'Navigation or link destination URL',
  canonical: 'Canonical URL used for SEO',
  url: 'General URL field used in metadata/structured data',
  ogimage: 'Open Graph image URL/path for social sharing',
  '@context': 'Schema.org JSON-LD context value',
  email: 'Contact email field',
  logo: 'Brand/site logo URL/path'
};

function printHelp() {
  console.log('Usage: node scripts/locale-scripts/sync_keys_from_en.js [--locales-dir=path] [--help]');
  console.log('');
  console.log('Sync keys from English locale JSON into non-English locale JSON files.');
  console.log('Only non-translatable metadata keys are updated.');
  console.log('');
  console.log('Synced keys and meanings:');
  for (const key of KEYS_TO_SYNC) {
    console.log(`- ${key}: ${KEY_MEANINGS[key]}`);
  }
}

function stripBom(text) {
  return text.replace(/^\uFEFF/, '');
}

function isWhitespace(char) {
  return char === ' ' || char === '\n' || char === '\r' || char === '\t';
}

function parseConcatenatedRootObjects(raw) {
  const text = stripBom(raw);
  const values = [];
  let index = 0;

  while (index < text.length) {
    while (index < text.length && isWhitespace(text[index])) {
      index += 1;
    }

    if (index >= text.length) break;
    if (text[index] !== '{') return null;

    let depth = 0;
    let inString = false;
    let escaped = false;
    let endIndex = -1;

    for (let i = index; i < text.length; i += 1) {
      const char = text[i];

      if (inString) {
        if (escaped) {
          escaped = false;
          continue;
        }

        if (char === '\\') {
          escaped = true;
          continue;
        }

        if (char === '"') {
          inString = false;
        }

        continue;
      }

      if (char === '"') {
        inString = true;
        continue;
      }

      if (char === '{') {
        depth += 1;
        continue;
      }

      if (char === '}') {
        depth -= 1;
        if (depth === 0) {
          endIndex = i;
          break;
        }
      }
    }

    if (endIndex === -1) return null;

    const chunk = text.slice(index, endIndex + 1);
    let parsed;
    try {
      parsed = JSON.parse(chunk);
    } catch {
      return null;
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null;
    }

    values.push(parsed);
    index = endIndex + 1;
  }

  return values.length > 1 ? values : null;
}

function mergeObjects(objects) {
  const merged = {};
  for (const obj of objects) {
    for (const [key, value] of Object.entries(obj)) {
      merged[key] = value;
    }
  }
  return merged;
}

function loadJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');

  try {
    return JSON.parse(stripBom(raw));
  } catch (error) {
    const pieces = parseConcatenatedRootObjects(raw);
    if (pieces) {
      const merged = mergeObjects(pieces);
      saveJson(filePath, merged);
      console.warn(`Auto-repaired concatenated JSON roots: ${filePath}`);
      return merged;
    }

    const parseError = new Error(`Invalid JSON in ${filePath}: ${error.message}`);
    parseError.cause = error;
    throw parseError;
  }
}

function saveJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function syncKeys(src, dest) {
  if (typeof src === 'object' && src !== null && typeof dest === 'object' && dest !== null) {
    for (const k of Object.keys(src)) {
      if (KEYS_TO_SYNC.includes(k)) {
        dest[k] = src[k];
      } else if (typeof src[k] === 'object' && k in dest) {
        syncKeys(src[k], dest[k]);
      } else if (Array.isArray(src[k]) && Array.isArray(dest[k])) {
        for (let i = 0; i < src[k].length && i < dest[k].length; i++) {
          syncKeys(src[k][i], dest[k][i]);
        }
      }
    }
  }
}

function main() {
  if (argv.includes('--help') || argv.includes('-h')) {
    printHelp();
    return;
  }

  const enPath = path.join(LOCALES_DIR, EN_LOCALE);
  let syncedCount = 0;
  let failedCount = 0;

  function walkLocales(localeDir, relPath = '') {
    fs.readdirSync(localeDir).forEach(entry => {
      const entryPath = path.join(localeDir, entry);
      const entryRelPath = path.join(relPath, entry);
      if (fs.statSync(entryPath).isDirectory()) {
        walkLocales(entryPath, entryRelPath);
      } else if (entry.endsWith('.json')) {
        // Skip en locale
        if (localeDir.includes(path.sep + EN_LOCALE + path.sep) || localeDir.endsWith(path.sep + EN_LOCALE)) return;
        // Find corresponding en file
        const enFilePath = path.join(enPath, relPath, entry);
        if (fs.existsSync(enFilePath)) {
          try {
            const enData = loadJson(enFilePath);
            const targetData = loadJson(entryPath);
            syncKeys(enData, targetData);
            saveJson(entryPath, targetData);
            syncedCount += 1;
            console.log('Synced:', entryPath);
          } catch (err) {
            failedCount += 1;
            console.error(`Failed: ${entryPath}`);
            console.error(`  Reason: ${err.message}`);
          }
        }
      }
    });
  }
  // Walk all locale folders except en
  fs.readdirSync(LOCALES_DIR).forEach(locale => {
    if (locale === EN_LOCALE) return;
    const localePath = path.join(LOCALES_DIR, locale);
    if (fs.statSync(localePath).isDirectory()) {
      walkLocales(localePath);
    }
  });

  console.log(`\nSync summary: synced=${syncedCount}, failed=${failedCount}`);
  if (failedCount > 0) {
    process.exit(1);
  }
}

main();
