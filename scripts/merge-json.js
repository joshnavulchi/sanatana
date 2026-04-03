#!/usr/bin/env node
// Merge all JSON files in a folder into a single index.json
// Usage: node scripts/merge-json.js [folder]
// Default folder: app/vedas/yajurveda/chapter1
// Recursively merge JSON files in each folder into that folder's index.json
// Usage:
//   node scripts/merge-json.js <root-folder> [--delete|-d]
// Example:
//   node scripts/merge-json.js public/data/locales/en --delete

const fs = require('fs').promises;
const path = require('path');

async function mergeJsonFilesInDir(absDir, removeOriginals = false) {
  const entries = await fs.readdir(absDir, { withFileTypes: true });
  const jsonFiles = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.json') && e.name !== 'index.json')
    .map((e) => e.name)
    .sort();

  if (jsonFiles.length === 0) return 0;

  const result = {};
  const errors = [];
  let parsedCount = 0;
  for (const file of jsonFiles) {
    const full = path.join(absDir, file);
    const content = await fs.readFile(full, 'utf8');
    try {
      const parsed = JSON.parse(content);
      const key = path.basename(file, '.json');
      result[key] = parsed;
      parsedCount++;
    } catch (err) {
      console.error(`Failed to parse ${full}: ${err.message}`);
      errors.push({ file: full, error: err.message });
      // Save original invalid file for inspection
      try {
        const destRoot = path.join(process.cwd(), '.merge-json-errors');
        const rel = path.relative(process.cwd(), full);
        const dest = path.join(destRoot, rel);
        await fs.mkdir(path.dirname(dest), { recursive: true });
        await fs.writeFile(dest, content, 'utf8');
        console.log(`Saved invalid JSON to ${dest}`);
      } catch (copyErr) {
        console.error(`Failed to save invalid file copy for ${full}: ${copyErr.message}`);
      }
      // continue with other files
    }
  }

  if (parsedCount === 0) {
    console.log(`No valid JSON files parsed in ${absDir}; skipping index.json write.`);
  } else {
    const outPath = path.join(absDir, 'index.json');
    await fs.writeFile(outPath, JSON.stringify(result, null, 2) + '\n', 'utf8');
    console.log(`Merged ${parsedCount} files into ${outPath}`);
  }

  if (removeOriginals) {
    for (const file of jsonFiles) {
      try {
        await fs.unlink(path.join(absDir, file));
        console.log(`Deleted: ${path.join(absDir, file)}`);
      } catch (err) {
        console.error(`Failed to delete ${file} in ${absDir}: ${err.message}`);
      }
    }
  }

  return jsonFiles.length;
}

async function processDirectoryRecursive(dirPath, removeOriginals = false) {
  const absDir = path.resolve(process.cwd(), dirPath);
  let stat;
  try {
    stat = await fs.stat(absDir);
  } catch (err) {
    throw new Error(`Directory not found: ${absDir}`);
  }
  if (!stat.isDirectory()) throw new Error(`Not a directory: ${absDir}`);

  const dirents = await fs.readdir(absDir, { withFileTypes: true });
  // First, process current directory
  await mergeJsonFilesInDir(absDir, removeOriginals);

  // Then recurse into subdirectories
  for (const d of dirents) {
    if (d.isDirectory()) {
      // Skip any directory named 'explore'
      if (d.name.toLowerCase() === 'explore') {
        console.log(`Skipping directory: ${path.join(dirPath, d.name)}`);
        continue;
      }
      await processDirectoryRecursive(path.join(dirPath, d.name), removeOriginals);
    }
  }
}

// CLI parsing
const rawArgs = process.argv.slice(2);
const deleteFlag = rawArgs.includes('--delete') || rawArgs.includes('-d');
const positional = rawArgs.find((a) => !a.startsWith('-')) || 'public/data/locales/en';

(async () => {
  try {
    await processDirectoryRecursive(positional, deleteFlag);
    console.log('Done.');
    console.log('If any invalid JSON files were found they were copied to .merge-json-errors/');
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
})();
