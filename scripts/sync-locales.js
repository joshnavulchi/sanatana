#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const LOCALES_ROOT = path.join(ROOT, 'public', 'data', 'locales');
const SOURCE_LOCALE = 'en';
// Generate indexes for the source locale by default. Use `--exclude-source` or
// set EXCLUDE_SOURCE=1 to skip the source locale when needed.
const EXCLUDE_SOURCE = process.env.EXCLUDE_SOURCE === '1' || process.argv.includes('--exclude-source');

// ------------------------
// Helpers
// ------------------------
function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

// ------------------------
// Sync missing files from source locale
// ------------------------
function copyMissingFromSource(srcDir, tgtDir) {
  ensureDir(tgtDir);

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const ent of entries) {
    const srcPath = path.join(srcDir, ent.name);
    const tgtPath = path.join(tgtDir, ent.name);

    if (ent.isDirectory()) {
      copyMissingFromSource(srcPath, tgtPath);
    } else if (ent.isFile()) {
      if (!fs.existsSync(tgtPath)) {
        fs.copyFileSync(srcPath, tgtPath);
        console.log('copied:', path.relative(ROOT, tgtPath));
      }
    }
  }
}

// ------------------------
// Remove extra files not in source
// ------------------------
function removeExtrasNotInSource(srcDir, tgtDir) {
  if (!fs.existsSync(tgtDir)) return;

  const entries = fs.readdirSync(tgtDir, { withFileTypes: true });

  for (const ent of entries) {
    const srcPath = path.join(srcDir, ent.name);
    const tgtPath = path.join(tgtDir, ent.name);

    if (!fs.existsSync(srcPath)) {
      if (ent.isDirectory()) {
        fs.rmSync(tgtPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(tgtPath);
      }
      console.log('deleted extra:', path.relative(ROOT, tgtPath));
    } else if (ent.isDirectory()) {
      removeExtrasNotInSource(srcPath, tgtPath);
    }
  }
}

// ------------------------
// Generate index.ts (JSON ONLY)
// ------------------------
function writeIndexTs(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const jsonFiles = entries
    .filter((e) => e.isFile() && e.name.endsWith('.json'))
    .map((e) => e.name);

  const indexPath = path.join(dir, 'index.ts');

  // Remove index if no JSON files
  if (jsonFiles.length === 0) {
    if (fs.existsSync(indexPath)) {
      fs.unlinkSync(indexPath);
      console.log('removed empty index:', path.relative(ROOT, indexPath));
    }
    return;
  }

  const header = `// @ts-nocheck
// Auto-generated index (JSON-only)
// Folder: '${path.relative(LOCALES_ROOT, dir)}'
// DO NOT EDIT MANUALLY`;

  const imports = jsonFiles
    .map((name, i) => `import _j${i} from './${name}';`)
    .join('\n');

  // Flat merge (memory safe)
  const merge = `const merged = Object.assign({}, ${jsonFiles
    .map((_, i) => `_j${i}`)
    .join(', ')});

export default merged;`;

  const content = [header, imports, '', merge].join('\n\n');

  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('wrote index:', path.relative(ROOT, indexPath));
}

// ------------------------
// Walk directories and generate indexes
// ------------------------
function regenerateIndexes(localeRoot) {
  const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const ent of entries) {
      if (ent.isDirectory()) {
        walk(path.join(dir, ent.name));
      }
    }

    writeIndexTs(dir);
  };

  walk(localeRoot);
}

// ------------------------
// Main
// ------------------------
function main() {
  if (!fs.existsSync(LOCALES_ROOT)) {
    console.error('Locales root not found:', LOCALES_ROOT);
    process.exit(1);
  }

  const locales = fs
    .readdirSync(LOCALES_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  if (!locales.includes(SOURCE_LOCALE)) {
    console.error('Source locale not found:', SOURCE_LOCALE);
    process.exit(1);
  }

  const targets = EXCLUDE_SOURCE ? locales.filter((l) => l !== SOURCE_LOCALE) : locales;

  if (targets.length === 0) {
    console.log('No target locales found. Nothing to do.');
    return;
  }

  for (const tgt of targets) {
    const tgtRoot = path.join(LOCALES_ROOT, tgt);

    console.log('\n=== Regenerating indexes for locale:', tgt, '===');
    regenerateIndexes(tgtRoot);
  }

  console.log('\n✅ Sync complete.');
}

// ------------------------
if (require.main === module) {
  main();
}