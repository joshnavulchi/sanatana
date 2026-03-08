// copy_en_keywords_to_locales.js
// Copies meta.keywords from a selected en JSON file to other locale JSON files

const fs = require('fs');
const path = require('path');
const localesDir = path.join(__dirname, '../locales');
const targetLocales = [
  'zh-CN', 'ru', 'ur', 'te', 'ne', 'hi', 'pt', 'fr', 'ja', 'ta', 'nl', 'es', 'ar', 'de'
];

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Enter the English JSON filename (e.g., usa_strategies.json): ', (filename) => {
  const enJsonPath = path.join(localesDir, 'en', filename);
  if (!fs.existsSync(enJsonPath)) {
    console.error(`File not found: ${enJsonPath}`);
    readline.close();
    return;
  }
  const enJson = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
  // Try to find keywords array (assume structure: {<key>: {meta: {keywords: [...]}}})
  const mainKey = Object.keys(enJson)[0];
  const enKeywords = enJson[mainKey]?.meta?.keywords;
  if (!Array.isArray(enKeywords)) {
    console.error('No keywords array found in the selected English JSON file.');
    readline.close();
    return;
  }
  targetLocales.forEach(locale => {
    const localeJsonPath = path.join(localesDir, locale, filename);
    if (!fs.existsSync(localeJsonPath)) {
      console.warn(`File not found: ${localeJsonPath}`);
      return;
    }
    const localeJson = JSON.parse(fs.readFileSync(localeJsonPath, 'utf8'));
    const localeMainKey = Object.keys(localeJson)[0];
    if (
      localeJson[localeMainKey] &&
      localeJson[localeMainKey].meta &&
      Array.isArray(localeJson[localeMainKey].meta.keywords)
    ) {
      localeJson[localeMainKey].meta.keywords = enKeywords;
      fs.writeFileSync(localeJsonPath, JSON.stringify(localeJson, null, 2), 'utf8');
      console.log(`Updated keywords for ${locale}: ${localeJsonPath}`);
    } else {
      console.warn(`No keywords array found in: ${localeJsonPath}`);
    }
  });
  console.log('Done copying keywords.');
  readline.close();
  });