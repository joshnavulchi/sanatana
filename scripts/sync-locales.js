#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const LOCALES_ROOT = path.join(ROOT, 'public', 'data', 'locales');
const SOURCE_LOCALE = 'en';

function isDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch (e) {
    return false;
  }
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function copyMissingFromSource(srcDir, tgtDir) {
  ensureDir(tgtDir);
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const ent of entries) {
    const srcPath = path.join(srcDir, ent.name);
    const tgtPath = path.join(tgtDir, ent.name);
    if (ent.isDirectory()) {
      // recurse
      copyMissingFromSource(srcPath, tgtPath);
    } else if (ent.isFile()) {
      // copy only if missing in target (do not overwrite existing translations)
      if (!fs.existsSync(tgtPath)) {
        fs.copyFileSync(srcPath, tgtPath);
        console.log('copied:', path.relative(ROOT, tgtPath));
      }
    }
  }
}

function removeExtrasNotInSource(srcDir, tgtDir) {
  if (!fs.existsSync(tgtDir)) return;
  const entries = fs.readdirSync(tgtDir, { withFileTypes: true });
  for (const ent of entries) {
    const srcPath = path.join(srcDir, ent.name);
    const tgtPath = path.join(tgtDir, ent.name);
    if (!fs.existsSync(srcPath)) {
      // Delete extra from target
      if (ent.isDirectory()) {
        fs.rmSync(tgtPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(tgtPath);
      }
      console.log('deleted extra:', path.relative(ROOT, tgtPath));
    } else if (ent.isDirectory()) {
      // recurse
      removeExtrasNotInSource(path.join(srcDir, ent.name), path.join(tgtDir, ent.name));
    }
  }
}

function listJsonAndDirs(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const jsons = [];
  const dirs = [];
  for (const ent of entries) {
    if (ent.isFile() && ent.name.endsWith('.json')) jsons.push(ent.name);
    if (ent.isDirectory()) {
      // consider directory if it contains any files
      dirs.push(ent.name);
    }
  }
  return { jsons, dirs };
}

function writeIndexTs(dir) {
  // Gather jsons and child dirs (with index)
  const { jsons, dirs } = listJsonAndDirs(dir);
  const parts = [];
  let j = 0, d = 0;
  for (const name of jsons) {
    parts.push({ type: 'json', name, var: `_j${j++}` });
  }
  for (const name of dirs) {
    // Only include child index if exists (we'll generate indexes for all dirs afterwards)
    const childIndex = path.join(dir, name, 'index.ts');
    if (fs.existsSync(childIndex)) {
      parts.push({ type: 'dir', name, var: `_d${d++}` });
    }
  }

  const header = `// @ts-nocheck\n// Auto-generated index for folder '${path.relative(LOCALES_ROOT, dir)}'\n// Imports local JSON files and child folder indexes, deep-merging them into one export.`;
  const imports = parts.map((p, idx) => {
    if (p.type === 'json') return `import ${p.var} from './${p.name}';`;
    return `import ${p.var} from './${p.name}/index';`;
  }).join('\n');

  const deepMergeFn = `function deepMerge(target: any, source: any) {\n  if (source === undefined) return target;\n  if (Array.isArray(target) && Array.isArray(source)) {\n    const out = target.slice();\n    for (let i = 0; i < source.length; i++) out[i] = deepMerge(out[i], source[i]);\n    return out;\n  }\n  if (target && typeof target === 'object' && source && typeof source === 'object') {\n    const out: any = { ...target };\n    for (const k of Object.keys(source)) out[k] = deepMerge(target ? target[k] : undefined, source[k]);\n    return out;\n  }\n  return source;\n}`;

  const vars = parts.map(p => p.var).join(', ');
  const body = `const base: any = {};\nconst merged = ([${vars}] as any[]).reduce((acc: any, cur: any) => deepMerge(acc, cur || {}), base as any);\nexport default merged;`;

  const content = [header, imports, '', deepMergeFn, '', body].join('\n\n');
  const outPath = path.join(dir, 'index.ts');
  fs.writeFileSync(outPath, content, { encoding: 'utf8' });
  console.log('wrote index:', path.relative(ROOT, outPath));
}

function regenerateIndexes(localeRoot) {
  // Walk directories bottom-up so child indexes exist before parent includes them
  const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      if (ent.isDirectory()) walk(path.join(dir, ent.name));
    }
    // generate index for this dir
    writeIndexTs(dir);
  };
  walk(localeRoot);
}

function main() {
  if (!fs.existsSync(LOCALES_ROOT)) {
    console.error('Locales root not found:', LOCALES_ROOT);
    process.exit(1);
  }
  const locales = fs.readdirSync(LOCALES_ROOT, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
  if (!locales.includes(SOURCE_LOCALE)) {
    console.error('Source locale not found:', SOURCE_LOCALE);
    process.exit(1);
  }
  const targets = locales.filter(l => l !== SOURCE_LOCALE);
  if (targets.length === 0) {
    console.log('No target locales found. Nothing to do.');
    return;
  }

  const srcRoot = path.join(LOCALES_ROOT, SOURCE_LOCALE);
  for (const tgt of targets) {
    const tgtRoot = path.join(LOCALES_ROOT, tgt);
    console.log('\n=== Syncing locale:', tgt, '===');
    copyMissingFromSource(srcRoot, tgtRoot);
    removeExtrasNotInSource(srcRoot, tgtRoot);
    regenerateIndexes(tgtRoot);
  }

  console.log('\nSync complete.');
}

if (require.main === module) {
  main();
}
