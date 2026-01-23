/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
/**
 * Script to update i18n.ts with the latest locales from the GitHub repository
 * Usage: node scripts/update-i18n-locales.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const GITHUB_REPO = 'vulchivijay/first-contributes';
const GITHUB_BRANCH = 'main';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/locales?ref=${GITHUB_BRANCH}`;
const I18N_FILE_PATH = path.join(__dirname, '../lib/i18n.ts');

/**
 * Fetch directory contents from GitHub API
 */
function fetchGitHubDirectory(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Node.js Script',
        'Accept': 'application/vnd.github.v3+json'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`GitHub API returned status ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Extract available locales from GitHub repository
 */
async function getAvailableLocales() {
  try {
    console.log('Fetching locales from GitHub repository...');
    const contents = await fetchGitHubDirectory(GITHUB_API_URL);
    
    // Filter for directories only (each directory is a locale)
    const locales = contents
      .filter(item => item.type === 'dir')
      .map(item => item.name)
      .sort();
    
    console.log(`Found ${locales.length} locales: ${locales.join(', ')}`);
    return locales;
  } catch (error) {
    console.error('Error fetching locales from GitHub:', error.message);
    throw error;
  }
}

/**
 * Update the SUPPORTED_LOCALES array in i18n.ts
 */
function updateI18nFile(locales) {
  try {
    console.log('Reading i18n.ts file...');
    let content = fs.readFileSync(I18N_FILE_PATH, 'utf8');
    
    // Create the new SUPPORTED_LOCALES array string
    const localesArrayString = locales.map(l => `  '${l}',`).join('\n');
    const newLocalesBlock = `export const SUPPORTED_LOCALES = [\n${localesArrayString}\n];`;
    
    // Replace the existing SUPPORTED_LOCALES array
    const regex = /export const SUPPORTED_LOCALES = \[[^\]]*\];/s;
    
    if (regex.test(content)) {
      const oldContent = content;
      content = content.replace(regex, newLocalesBlock);
      
      if (oldContent === content) {
        console.log('✓ No changes needed - locales are already up to date');
        return false;
      }
      
      // Write back to file
      fs.writeFileSync(I18N_FILE_PATH, content, 'utf8');
      console.log('✓ Successfully updated i18n.ts with new locales');
      return true;
    } else {
      console.error('✗ Could not find SUPPORTED_LOCALES in i18n.ts');
      return false;
    }
  } catch (error) {
    console.error('Error updating i18n.ts:', error.message);
    throw error;
  }
}

/**
 * Validate that locales are accessible
 */
async function validateLocales(locales) {
  console.log('\nValidating locale files...');
  const baseUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/locales`;
  
  const results = await Promise.all(
    locales.map(async (locale) => {
      const url = `${baseUrl}/${locale}/index.ts`;
      return new Promise((resolve) => {
        https.get(url, (res) => {
          if (res.statusCode === 200) {
            console.log(`  ✓ ${locale}: OK`);
            resolve({ locale, valid: true });
          } else {
            console.log(`  ✗ ${locale}: Not found (${res.statusCode})`);
            resolve({ locale, valid: false });
          }
        }).on('error', () => {
          console.log(`  ✗ ${locale}: Error`);
          resolve({ locale, valid: false });
        });
      });
    })
  );
  
  const invalidLocales = results.filter(r => !r.valid);
  if (invalidLocales.length > 0) {
    console.warn(`\nWarning: ${invalidLocales.length} locale(s) could not be validated`);
  } else {
    console.log('\n✓ All locales validated successfully');
  }
  
  return results;
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Updating i18n.ts with latest locales from GitHub');
  console.log('='.repeat(60));
  console.log(`Repository: ${GITHUB_REPO}`);
  console.log(`Branch: ${GITHUB_BRANCH}\n`);
  
  try {
    // Step 1: Fetch available locales
    const locales = await getAvailableLocales();
    
    if (locales.length === 0) {
      console.error('✗ No locales found in repository');
      process.exit(1);
    }
    
    // Step 2: Update i18n.ts file
    const updated = updateI18nFile(locales);
    
    // Step 3: Validate locales (optional)
    if (process.argv.includes('--validate')) {
      await validateLocales(locales);
    }
    
    console.log('\n' + '='.repeat(60));
    if (updated) {
      console.log('✓ Update completed successfully!');
    } else {
      console.log('✓ Already up to date!');
    }
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n✗ Update failed:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { getAvailableLocales, updateI18nFile, validateLocales };
