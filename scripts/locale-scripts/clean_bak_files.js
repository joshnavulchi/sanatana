// Script: clean_bak_files.js
// Purpose: Finds and deletes all .bak.* files under the locales directory.
// Usage: node clean_bak_files.js [--apply|-a] (dry-run by default, deletes files if --apply is used)
// Main logic: Recursively searches for .bak.* files and deletes them if --apply is specified.

// !/usr/bin/env node
const fs = require('fs'); // Node.js file system module for file operations
const path = require('path'); // Node.js path module for handling file paths

const argv = process.argv.slice(2); // Command-line arguments
const APPLY = argv.includes('--apply') || argv.includes('-a'); // Whether to actually delete files
const root = path.resolve(__dirname, '..'); // Project root directory
const localesDir = path.join(root, 'locales'); // Path to locales directory

/**
 * Recursively finds all files with .bak. in their name under a directory.
 * @param {string} dir - Directory to search
 * @returns {string[]} - Array of .bak.* file paths
 */
function findBakFiles(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) out.push(...findBakFiles(p)); // Recurse into subdirectories
    else if (/\.bak(\.|\.[^.]+)$/.test(name)) out.push(p); // Add .bak.* and .bak.xxx files
  }
  return out;
}

// Check if locales directory exists
if (!fs.existsSync(localesDir)) {
  console.error('locales directory not found:', localesDir);
  process.exit(1);
}

// Find all .bak.* files
const bakFiles = findBakFiles(localesDir);
if (bakFiles.length === 0) {
  console.log('No .bak.* files found under locales/.');
  process.exit(0);
}

// Print found files
console.log('Found', bakFiles.length, '.bak.* files:');
for (const f of bakFiles) console.log('  ', f);

// If not applying, exit after dry-run
if (!APPLY) {
  console.log('\nDry-run: no files deleted. Re-run with --apply to delete.');
  process.exit(0);
}

let removed = 0;
for (const f of bakFiles) {
  try {
    fs.unlinkSync(f);
    removed++;
    console.log('Deleted:', f);
  } catch (err) {
    console.error('Failed to delete:', f, err.message);
  }
}
console.log(`\nDeleted ${removed} .bak files.`);
