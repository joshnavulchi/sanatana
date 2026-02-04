// scripts/check-locales.js
// Verifies that all expected locale files exist in the public/locales directory.

const fs = require('fs');
const path = require('path');

// List your supported locales here (should match your i18n config)
const SUPPORTED_LOCALES = ['en', 'de', 'es', 'hi'];
const LOCALES_DIR = path.join('public', 'locales');
const REQUIRED_FILE = 'index.json';

let missing = [];

SUPPORTED_LOCALES.forEach(locale => {
  const localePath = path.join(LOCALES_DIR, locale, REQUIRED_FILE);
  if (!fs.existsSync(localePath)) {
    missing.push(localePath);
  }
});

if (missing.length) {
  console.error('Missing locale files:');
  missing.forEach(f => console.error('  ' + f));
  process.exitCode = 1;
} else {
  console.log('All locale files are present.');
}
