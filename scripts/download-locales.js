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

const crypto = require('crypto');

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
 * Compute SHA1 for a string
 */
function sha1(str) {
  return crypto.createHash('sha1').update(str, 'utf8').digest('hex');
}

/**
 * Build a local manifest by hashing local JSON files. Used to detect content changes
 */
function computeLocalManifest() {
  const out = { locales: {} };
  try {
    if (!fs.existsSync(LOCALES_DIR)) return out;
    const locales = fs.readdirSync(LOCALES_DIR).filter((d) => {
      try { return fs.statSync(path.join(LOCALES_DIR, d)).isDirectory(); } catch (e) { return false; }
    });

    for (const locale of locales) {
      const localeDir = path.join(LOCALES_DIR, locale);
      const files = fs.readdirSync(localeDir).filter((f) => f.endsWith('.json'));
      const filesMap = {};
      for (const fname of files) {
        try {
          const content = fs.readFileSync(path.join(localeDir, fname), 'utf8');
          filesMap[fname] = { sha: sha1(content), size: Buffer.byteLength(content, 'utf8') };
        } catch (e) {
          // ignore unreadable files
        }
      }
      out.locales[locale] = { fileCount: Object.keys(filesMap).length, files: filesMap };
    }
  } catch (e) {
    // ignore
  }
  return out;
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
    
    // console.log(`  Found ${jsonFiles.length} JSON files to merge`);
    
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
 * Merge missing keys from source into target without overwriting existing values
 */
function mergeMissing(target, source) {
  if (!source || typeof source !== 'object') return target;
  if (!target || typeof target !== 'object') return source;
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key] || typeof target[key] !== 'object') target[key] = {};
      mergeMissing(target[key], source[key]);
    } else {
      if (target[key] === undefined || target[key] === null || target[key] === '') {
        target[key] = source[key];
      }
    }
  }
  return target;
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
    
    // Ensure output dir exists
    ensureDir(LOCALES_DIR);

    // Compute local manifest (sha1 of files) to detect content changes
    const localManifest = computeLocalManifest();

    // If we have recent metadata and not forcing a download, skip network
    // to avoid repeated downloads during active development. This means
    // locales are refreshed at most once per hour unless --force is used.
    try {
      const MAX_AGE_MS = 1000 * 60 * 60; // 1 hour
      if (!forceDownload && metadata && metadata.lastUpdate) {
        const last = new Date(metadata.lastUpdate).getTime();
        if (Date.now() - last < MAX_AGE_MS) {
          console.log('Local locale metadata is recent; skipping remote fetch.');
          return;
        }
      }
    } catch (e) {
      // ignore errors and continue
    }

    // If localManifest shows locales present and not forcing download, we'll try
    // to compare with remote metadata and only download changed files. If the
    // remote API is unavailable (rate limit), we fall back to using local files.
    let locales = [];
    try {
      console.log('Fetching locales list...');
      locales = await getLocalesList();
      // console.log(`Found ${locales.length} locales: ${locales.join(', ')}\n`);
    } catch (err) {
      console.warn('Could not fetch remote locales list:', err.message);
      // If local manifest has content, skip network download and continue
      if (!forceDownload && Object.keys(localManifest.locales || {}).length > 0) {
        console.log('Using existing locales from public/locales (remote unavailable).');
        return;
      }
      throw err;
    }
    
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
      
      // Get remote files metadata (name + sha) to decide what to download
      let files = [];
      try {
        files = await getLocaleFiles(locale);
      } catch (err) {
        console.warn(`  Warning: Could not fetch files for ${locale}:`, err.message);
        errorCount++;
        continue;
      }
      const jsonFiles = files.filter(f => f.name.endsWith('.json'));

      if (jsonFiles.length === 0) {
        console.warn(`  No JSON files found for ${locale}`);
        errorCount++;
        continue;
      }

      // Build local files map for this locale.
      // Prefer previously saved metadata (which stores GitHub blob SHAs).
      // Fall back to a content-based local manifest if metadata is not available.
      const localFiles = (metadata.locales && metadata.locales[locale] && metadata.locales[locale].files) || (localManifest.locales && localManifest.locales[locale] && localManifest.locales[locale].files) || {};

      // Determine which files changed by comparing remote SHA (from GitHub) to local sha
      const toDownload = [];
      for (const file of jsonFiles) {
        const remoteSha = file.sha || '';
        const localEntry = localFiles[file.name];
        if (!localEntry || !localEntry.sha || localEntry.sha !== remoteSha) {
          toDownload.push(file);
        }
      }

      if (!forceDownload && toDownload.length === 0) {
        console.log(`  ✓ Up to date - skipping (${jsonFiles.length} files)`);
        // Preserve existing metadata if present, otherwise synthesize from localManifest
        newMetadata.locales[locale] = metadata.locales[locale] || localManifest.locales[locale] || { fileCount: jsonFiles.length, files: {} };
        skippedCount++;
        console.log('');
        continue;
      }

      if (toDownload.length > 0) {
        console.log(`  Update needed: ${toDownload.length} changed files`);
        updatedCount++;
      }

      ensureDir(localeDir);

      // console.log(`  Found ${jsonFiles.length} JSON files (${toDownload.length} to download)`);

      // Download changed JSON files individually
      const merged = {};
      let downloadedCount = 0;
      const fileMetadata = {};

      for (const file of jsonFiles) {
        // If file not in toDownload, reuse local content
        if (!toDownload.find(f => f.name === file.name)) {
          try {
            const existingContent = fs.readFileSync(path.join(localeDir, file.name), 'utf8');
            const json = JSON.parse(existingContent);
            deepMerge(merged, json);
            fileMetadata[file.name] = { sha: localFiles[file.name]?.sha || '', size: localFiles[file.name]?.size || Buffer.byteLength(existingContent, 'utf8'), downloadedAt: localFiles[file.name]?.downloadedAt || new Date().toISOString() };
            downloadedCount++;
            continue;
          } catch (e) {
            // fallback to downloading if reading fails
          }
        }

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
    // After downloading, apply any generated placeholder files into locale index.json
    try {
      for (const locale of Object.keys(newMetadata.locales || {})) {
        const localeDir = path.join(LOCALES_DIR, locale);
        const placeholderPath = path.join(localeDir, '_placeholders.generated.json');
        const indexPath = path.join(localeDir, 'index.json');
        if (fs.existsSync(placeholderPath)) {
          try {
            const placeholder = JSON.parse(fs.readFileSync(placeholderPath, 'utf8'));
            let index = {};
            if (fs.existsSync(indexPath)) {
              try { index = JSON.parse(fs.readFileSync(indexPath, 'utf8')); } catch (e) { index = {}; }
            } else {
              // Attempt to merge individual json files into index if index.json missing
              const jsonFiles = fs.readdirSync(localeDir).filter(f => f.endsWith('.json') && f !== '_placeholders.generated.json');
              for (const jf of jsonFiles) {
                try {
                  const j = JSON.parse(fs.readFileSync(path.join(localeDir, jf), 'utf8'));
                  deepMerge(index, j);
                } catch (e) { /* ignore */ }
              }
            }
            // Merge missing keys only
            mergeMissing(index, placeholder);
            fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8');
            console.log(`  ✓ Applied placeholders to ${locale}/index.json`);
          } catch (err) {
            console.warn(`  Warning: could not apply placeholders for ${locale}:`, err.message);
          }
        }
      }
    } catch (e) {
      // non-fatal
    }
  } catch (err) {
    console.error('\n✗ Download failed:', err.message);
    // If local locales are present, treat failure as non-fatal and continue.
    try {
      if (fs.existsSync(LOCALES_DIR)) {
        const existing = fs.readdirSync(LOCALES_DIR).filter((f) => {
          try {
            return fs.statSync(path.join(LOCALES_DIR, f)).isDirectory();
          } catch (e) {
            return false;
          }
        });
        if (existing.length > 0) {
          console.log('Using existing locales from public/locales despite download failure.');
          return;
        }
      }
    } catch (e) {
      // ignore
    }
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
