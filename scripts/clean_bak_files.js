// Script: clean_bak_files.js
// Purpose: Finds and deletes all .bak.* files under the locales directory.
// Usage: node clean_bak_files.js [--apply|-a] (dry-run by default, deletes files if --apply is used)
// Main logic: Recursively searches for .bak.* files and deletes them if --apply is specified.

// !/usr/bin/env node
const fs = require('fs'); // Node.js file system module for file operations
const path = require('path'); // Node.js path module for handling file paths

const argv = process.argv.slice(2); // Command-line arguments
const APPLY = argv.includes('--apply') || argv.includes('-a'); // Whether to actually delete files
const REPO_ROOT = path.resolve(__dirname, '..'); // Project root directory

function getArgValue(prefix) {
  const hit = argv.find((a) => a.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : undefined;
}

function resolveDir(inputPath, fallbackPath) {
  if (!inputPath) return fallbackPath;
  return path.isAbsolute(inputPath) ? inputPath : path.resolve(REPO_ROOT, inputPath);
}

const localesDir = resolveDir(getArgValue('--locales-dir='), path.join(REPO_ROOT, 'locales')); // Path to locales directory

/**
 * Recursively finds all files with .bak. in their name under a directory.
 * @param {string} dir - Directory to search
 * @returns {string[]} - Array of .bak.* file paths
 */
function findBakFiles(dir) {
  const out = [];

  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn('Skipping missing directory:', dir);
      return out;
    }
    throw err;
  }

  for (const entry of entries) {
    const p = path.join(dir, entry.name);

    // If it's a directory, recurse
    if (entry.isDirectory()) {
      out.push(...findBakFiles(p));
      continue;
    }

    // If we don’t know (e.g., on some FS), lstat to check safely
    let isFileLike = entry.isFile?.() || entry.isSymbolicLink?.();
    if (!isFileLike && entry.isDirectory?.() === undefined) {
      // Fallback for Node/FS edge-cases: lstat to decide
      try {
        const lst = fs.lstatSync(p);
        isFileLike = lst.isFile() || lst.isSymbolicLink();
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.warn('Skipping disappeared entry:', p);
          continue;
        }
        throw err;
      }
    }

    if (!isFileLike) continue;

    // Guard against broken symlinks and racey deletes
    try {
      const st = fs.statSync(p); // follows symlinks; may ENOENT if broken/disappeared
      if (st.isFile() && /\.bak(\.|$)/i.test(entry.name)) {
        out.push(p);
      }
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.warn('Skipping missing file:', p);
        continue;
      }
      throw err;
    }
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
