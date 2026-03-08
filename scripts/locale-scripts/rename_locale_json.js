// Script: rename_locale_json_and_update_index.js
// Usage: node rename_locale_json_and_update_index.js oldFileName.json newFileName.json
// Renames a JSON file in all locale folders and updates index.ts references.

const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
const REPO_ROOT = path.resolve(__dirname, '..', '..');

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

const [oldFileName, newFileName] = getNonFlagArgs(argv);
const localesBaseDir = resolveDir(getArgValue('--locales-dir='), path.join(REPO_ROOT, 'locales'));

if (!oldFileName || !newFileName) {
  console.error('Usage: node rename_locale_json.js oldFileName.json newFileName.json [--locales-dir=./locales]');
  process.exit(1);
}

const locales = fs.readdirSync(localesBaseDir).filter(f => {
  const stat = fs.statSync(path.join(localesBaseDir, f));
  return stat.isDirectory();
});

locales.forEach(locale => {
  const localeDir = path.join(localesBaseDir, locale);
  const oldFilePath = path.join(localeDir, oldFileName);
  const newFilePath = path.join(localeDir, newFileName);
  // Rename the JSON file if it exists
  if (fs.existsSync(oldFilePath)) {
    try {
      fs.renameSync(oldFilePath, newFilePath);
      console.log(`✅ Renamed ${locale}/${oldFileName} -> ${newFileName}`);
    } catch (err) {
      console.error(`❌ Failed to rename ${locale}/${oldFileName}: ${err.message}`);
    }
  } else {
    console.warn(`⚠️  ${locale}/${oldFileName} not found, skipping.`);
  }
  // Update index.ts if it exists
  const indexPath = path.join(localeDir, 'index.ts');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    // Escape all dots for regex
    const regex = new RegExp(oldFileName.replace(/\./g, '\\.'), 'g');
    if (regex.test(indexContent)) {
      indexContent = indexContent.replace(regex, newFileName);
      fs.writeFileSync(indexPath, indexContent, 'utf8');
      console.log(`🔄 Updated index.ts in ${locale}`);
    }
  }
});

console.log('Done.');
