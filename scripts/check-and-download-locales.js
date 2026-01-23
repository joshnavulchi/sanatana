/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
/**
 * Script to check if locales exist and download them if needed
 * Used before dev mode to ensure locales are available
 */

const fs = require('fs');
const path = require('path');
const { downloadAllLocales } = require('./download-locales');

const LOCALES_DIR = path.join(__dirname, '../public/locales');
const REQUIRED_LOCALES = ['en', 'hi', 'ta', 'te'];

async function checkAndDownload() {
  // Check if locales directory exists
  if (!fs.existsSync(LOCALES_DIR)) {
    console.log('📥 Locales not found. Downloading from GitHub...\n');
    await downloadAllLocales();
    return;
  }

  // Check if all required locales exist
  let missingLocales = [];
  for (const locale of REQUIRED_LOCALES) {
    const localeFile = path.join(LOCALES_DIR, locale, 'index.json');
    if (!fs.existsSync(localeFile)) {
      missingLocales.push(locale);
    }
  }

  if (missingLocales.length > 0) {
    console.log(`📥 Missing locales: ${missingLocales.join(', ')}. Downloading...\n`);
    await downloadAllLocales();
    return;
  }

  console.log('✓ Locales are ready');
}

if (require.main === module) {
  checkAndDownload().catch(err => {
    console.error('Error checking locales:', err);
    process.exit(1);
  });
}

module.exports = { checkAndDownload };
