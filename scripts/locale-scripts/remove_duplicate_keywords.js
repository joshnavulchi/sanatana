// remove_duplicate_keywords.js
// Removes duplicate entries in meta.keywords array and sorts the array for each locale JSON file

const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../locales');
const targetLocales = [
  'zh-CN', 'ru', 'ur', 'te', 'ne', 'hi', 'pt', 'fr', 'ja', 'ta', 'nl', 'es', 'ar', 'de', 'en'
];

function processFile(locale, filename) {
  const filePath = path.join(localesDir, locale, filename);
  if (!fs.existsSync(filePath)) {
    // Only warn if file exists in en, otherwise skip silently
    if (locale === 'en') console.warn(`File not found: ${filePath}`);
    return;
  }
  try {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const mainKey = Object.keys(json)[0];
    const keywordsArr = json[mainKey]?.meta?.keywords;
    if (Array.isArray(keywordsArr)) {
      // Remove duplicates and sort
      const uniqueSorted = Array.from(new Set(keywordsArr)).sort();
      json[mainKey].meta.keywords = uniqueSorted;
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
      console.log(`Processed keywords for ${locale}: ${filePath}`);
    }
  } catch (e) {
    console.warn(`Error processing ${filePath}: ${e.message}`);
  }
}

const enFiles = fs.readdirSync(path.join(localesDir, 'en')).filter(f => f.endsWith('.json'));
enFiles.forEach(filename => {
  targetLocales.forEach(locale => {
    processFile(locale, filename);
  });
});
console.log('Done processing keywords.');
