const fs = require('fs');
const path = require('path');

// Usage: node delete_json_across_locales.js <filename.json> [--locales-dir=./locales]

const argv = process.argv.slice(2);
const REPO_ROOT = path.resolve(__dirname, '..');

function getArgValue(prefix) {
  const hit = argv.find((a) => a.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : undefined;
}

function resolveDir(inputPath, fallbackPath) {
  if (!inputPath) return fallbackPath;
  return path.isAbsolute(inputPath) ? inputPath : path.resolve(REPO_ROOT, inputPath);
}

function getNonFlagArgs(args) {
  return args.filter((a) => !(a.startsWith('--') || a.startsWith('-')));
}

// Set the filename to delete (can be passed as first arg)
const targetFilename = getNonFlagArgs(argv)[0] || '';

// Path to the locales directory
const localesDir = resolveDir(getArgValue('--locales-dir='), path.join(REPO_ROOT, 'locales'));

if (!targetFilename) {
  console.error('Missing filename. Usage: node delete_json_across_locales.js <filename.json> [--locales-dir=./locales]');
  process.exit(1);
}

// Read all locale subdirectories
fs.readdirSync(localesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .forEach(dirent => {
    const localePath = path.join(localesDir, dirent.name, targetFilename);
    if (fs.existsSync(localePath)) {
      fs.unlinkSync(localePath);
      console.log(`Deleted: ${localePath}`);
    } else {
      console.log(`Not found: ${localePath}`);
    }
  });
