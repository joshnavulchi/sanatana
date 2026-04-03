#!/usr/bin/env node
// Merge all JSON files in a folder into a single index.json
// Usage: node scripts/merge-json.js [folder]
// Default folder: app/vedas/yajurveda/chapter1

#!/usr/bin/env node
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
  for (const file of jsonFiles) {
    const full = path.join(absDir, file);
    const content = await fs.readFile(full, 'utf8');
    try {
      const parsed = JSON.parse(content);
      const key = path.basename(file, '.json');
      result[key] = parsed;
    } catch (err) {
      console.error(`Failed to parse ${full}: ${err.message}`);
      throw err;
    }
  }

  const outPath = path.join(absDir, 'index.json');
  await fs.writeFile(outPath, JSON.stringify(result, null, 2) + '\n', 'utf8');
  console.log(`Merged ${jsonFiles.length} files into ${outPath}`);

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
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
})();
