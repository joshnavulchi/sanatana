/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
/**
 * Script to download locales from GitHub repository for production build
 * Usage: node scripts/download-locales.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const GITHUB_REPO = 'vulchivijay/first-contributes';
const GITHUB_BRANCH = 'main';
const LOCALES_DIR = path.join(__dirname, '../public/locales');
const METADATA_FILE = path.join(LOCALES_DIR, '.locale-metadata.json');

/**
 * Load local metadata about downloaded locales
 */
function loadMetadata() {
  try {
    if (fs.existsSync(METADATA_FILE)) {
      return JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));
    }
  } catch (err) {
    console.warn('Could not load metadata:', err.message);
  }
  return { locales: {}, lastUpdate: null };
}

/**
 * Save metadata about downloaded locales
 */
function saveMetadata(metadata) {
  try {
    fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2), 'utf8');
  } catch (err) {
    console.error('Could not save metadata:', err.message);
  }
}

/**
 * Fetch content from URL
 */
function fetchUrl(url) {
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
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Get list of locales from GitHub
 */
async function getLocalesList() {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/locales?ref=${GITHUB_BRANCH}`;
  const data = await fetchUrl(url);
  const contents = JSON.parse(data);
  
  return contents
    .filter(item => item.type === 'dir')
    .map(item => item.name);
}

/**
 * Get files in a locale directory with metadata
 */
async function getLocaleFiles(locale) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/locales/${locale}?ref=${GITHUB_BRANCH}`;
  try {
    const data = await fetchUrl(url);
    const contents = JSON.parse(data);
    return contents.filter(item => item.type === 'file').map(item => ({
      name: item.name,
      sha: item.sha,
      size: item.size,
      url: item.download_url
    }));
  } catch (err) {
    console.warn(`  Warning: Could not fetch files for ${locale}:`, err.message);
    return [];
  }
}

/**
 * Check if locale needs update
 */
function needsUpdate(locale, remoteFiles, metadata) {
  const localMetadata = metadata.locales[locale];
  
  if (!localMetadata) {
    return { needsUpdate: true, reason: 'not downloaded yet' };
  }
  
  // Check if number of files changed
  if (!localMetadata.files || Object.keys(localMetadata.files).length !== remoteFiles.length) {
    return { needsUpdate: true, reason: 'file count changed' };
  }
  
  // Check if any file SHA changed
  for (const file of remoteFiles) {
    if (!localMetadata.files[file.name] || localMetadata.files[file.name].sha !== file.sha) {
      return { needsUpdate: true, reason: `file ${file.name} changed` };
    }
  }
  
  return { needsUpdate: false };
}

/**
 * Download a file from GitHub
 */
async function downloadFile(locale, fileName) {
  const url = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/locales/${locale}/${fileName}`;
  try {
    const content = await fetchUrl(url);
    return content;
  } catch (err) {
    console.warn(`  Warning: Could not download ${locale}/${fileName}:`, err.message);
    return null;
  }
}

/**
 * Convert TypeScript index file to merged JSON
 */
async function downloadAndMergeLocale(locale) {
  try {
    // Get all JSON files in the locale directory
    const files = await getLocaleFiles(locale);
    const jsonFiles = files.filter(f => f.name.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
      console.warn(`  No JSON files found for ${locale}`);
      return null;
    }
    
    console.log(`  Found ${jsonFiles.length} JSON files to merge`);
    
    // Download and merge all JSON files
    const merged = {};
    let successCount = 0;
    
    for (const file of jsonFiles) {
      const content = await downloadFile(locale, file.name);
      if (content) {
        try {
          const json = JSON.parse(content);
          deepMerge(merged, json);
          successCount++;
        } catch (err) {
          console.warn(`  Warning: Could not parse ${file.name}:`, err.message);
        }
      }
    }
    
    console.log(`  ✓ Merged ${successCount}/${jsonFiles.length} files`);
    return merged;
    
  } catch (err) {
    console.error(`  Error processing ${locale}:`, err.message);
    return null;
  }
}

/**
 * Deep merge two objects
 */
function deepMerge(target, source) {
  if (source === undefined) return target;
  
  if (Array.isArray(target) && Array.isArray(source)) {
    for (let i = 0; i < source.length; i++) {
      target[i] = deepMerge(target[i] || {}, source[i]);
    }
    return target;
  }
  
  if (target && typeof target === 'object' && source && typeof source === 'object') {
    for (const key of Object.keys(source)) {
      if (target[key] && typeof target[key] === 'object' && typeof source[key] === 'object') {
        target[key] = deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }
  
  return source;
}

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Download all locales (with smart update detection)
 */
async function downloadAllLocales(forceDownload = false) {
  console.log('='.repeat(60));
  console.log('Downloading locales from GitHub');
  console.log('='.repeat(60));
  console.log(`Repository: ${GITHUB_REPO}`);
  console.log(`Branch: ${GITHUB_BRANCH}`);
  console.log(`Output: ${LOCALES_DIR}\n`);
  
  try {
    // Load existing metadata
    const metadata = loadMetadata();
    
    // Create locales directory if it doesn't exist
    ensureDir(LOCALES_DIR);
    
    // Get list of locales
    console.log('Fetching locales list...');
    const locales = await getLocalesList();
    console.log(`Found ${locales.length} locales: ${locales.join(', ')}\n`);
    
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    let updatedCount = 0;
    
    const newMetadata = {
      locales: {},
      lastUpdate: new Date().toISOString()
    };
    
    // Download each locale
    for (const locale of locales) {
      console.log(`Processing ${locale}...`);
      const localeDir = path.join(LOCALES_DIR, locale);
      
      // Get remote files
      const files = await getLocaleFiles(locale);
      const jsonFiles = files.filter(f => f.name.endsWith('.json'));
      
      if (jsonFiles.length === 0) {
        console.warn(`  No JSON files found for ${locale}`);
        errorCount++;
        continue;
      }
      
      // Check if update needed
      const updateCheck = needsUpdate(locale, jsonFiles, metadata);
      
      if (!forceDownload && !updateCheck.needsUpdate) {
        console.log(`  ✓ Up to date - skipping (${jsonFiles.length} files)`);
        // Copy old metadata
        newMetadata.locales[locale] = metadata.locales[locale];
        skippedCount++;
        console.log('');
        continue;
      }
      
      if (updateCheck.needsUpdate) {
        console.log(`  Update needed: ${updateCheck.reason}`);
        updatedCount++;
      }
      
      ensureDir(localeDir);
      
      console.log(`  Found ${jsonFiles.length} JSON files to download`);
      
      // Download all JSON files individually
      const merged = {};
      let downloadedCount = 0;
      const fileMetadata = {};
      
      for (const file of jsonFiles) {
        const content = await downloadFile(locale, file.name);
        if (content) {
          try {
            const json = JSON.parse(content);
            
            // Save individual file
            const outputPath = path.join(localeDir, file.name);
            fs.writeFileSync(outputPath, content, 'utf8');
            console.log(`  ✓ Downloaded ${file.name}`);
            
            // Store file metadata
            fileMetadata[file.name] = {
              sha: file.sha,
              size: file.size,
              downloadedAt: new Date().toISOString()
            };
            
            // Also merge for index.json
            deepMerge(merged, json);
            downloadedCount++;
          } catch (err) {
            console.warn(`  ✗ Could not parse ${file.name}:`, err.message);
            errorCount++;
          }
        } else {
          errorCount++;
        }
      }
      
      // Save the merged data as index.json
      if (downloadedCount > 0) {
        const indexPath = path.join(localeDir, 'index.json');
        fs.writeFileSync(indexPath, JSON.stringify(merged, null, 2), 'utf8');
        console.log(`  ✓ Created index.json (merged ${downloadedCount} files)`);
        
        // Store locale metadata
        newMetadata.locales[locale] = {
          fileCount: downloadedCount,
          files: fileMetadata,
          lastUpdate: new Date().toISOString()
        };
        
        successCount++;
      } else {
        console.warn(`  ✗ Failed to process ${locale}`);
        errorCount++;
      }
      
      console.log('');
    }
    
    // Save metadata
    saveMetadata(newMetadata);
    
    console.log('='.repeat(60));
    console.log(`✓ Download completed!`);
    console.log(`  Downloaded: ${successCount} locales`);
    if (updatedCount > 0) {
      console.log(`  Updated: ${updatedCount} locales`);
    }
    if (skippedCount > 0) {
      console.log(`  Skipped (up to date): ${skippedCount} locales`);
    }
    if (errorCount > 0) {
      console.log(`  Errors: ${errorCount} locales`);
    }
    console.log('='.repeat(60));
    
  } catch (err) {
    console.error('\n✗ Download failed:', err.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  const forceDownload = process.argv.includes('--force');
  if (forceDownload) {
    console.log('🔄 Force download mode enabled\n');
  }
  downloadAllLocales(forceDownload);
}

module.exports = { downloadAllLocales };
