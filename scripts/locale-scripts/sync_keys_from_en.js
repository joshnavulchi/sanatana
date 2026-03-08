const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'locales');
const EN_LOCALE = 'en';
const KEYS_TO_SYNC = [
  'src', 'href', 'canonical', 'url', 'ogimage', '@context', 'email', 'logo'
];

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
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
  const enPath = path.join(LOCALES_DIR, EN_LOCALE);
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
          const enData = loadJson(enFilePath);
          const targetData = loadJson(entryPath);
          syncKeys(enData, targetData);
          saveJson(entryPath, targetData);
          console.log('Synced:', entryPath);
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
}

main();
