#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

async function findTsx(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      out.push(...await findTsx(p));
    } else if (e.isFile() && p.endsWith('.tsx')) {
      out.push(p);
    }
  }
  return out;
}

function splitImportBlock(content) {
  const lines = content.split(/\r?\n/);
  let i = 0;
  // preserve leading comments/blank lines
  while (i < lines.length && (lines[i].trim() === '' || lines[i].trim().startsWith('//') || lines[i].trim().startsWith('/*'))) i++;
  const leading = lines.slice(0, i).join('\n');

  const imports = [];
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim().startsWith('import')) break;
    // accumulate multi-line import until we hit a semicolon
    let imp = line;
    while (!imp.trim().endsWith(';') && i + 1 < lines.length) {
      i++;
      imp += '\n' + lines[i];
    }
    imports.push(imp);
    i++;
  }

  const rest = lines.slice(i).join('\n');
  return { leading, imports, rest };
}

function getModuleSpecifier(imp) {
  const m = imp.match(/from\s+['"]([^'"]+)['"]/) || imp.match(/import\s+['"]([^'"]+)['"]/);
  return m ? m[1] : '';
}

function groupFor(spec) {
  if (!spec) return 9;
  if (spec === 'react' || spec.startsWith('next')) return 0;
  if (spec.startsWith('.')) {
    if (spec.startsWith('@/app/')) return 3;
    return 4; // ./ sibling
  }
  if (spec.match(/\.(css|scss|less|module.css|module.scss)$/)) return 5;
  // treat absolute non-relative imports (app/, lib/, components/) as internal
  if (!spec.startsWith('.') && (spec.startsWith('/') || /^[A-Za-z0-9@]/.test(spec))) return 2;
  return 1;
}

function sortImports(imports) {
  return imports.slice().sort((a, b) => {
    const sa = getModuleSpecifier(a);
    const sb = getModuleSpecifier(b);
    const ga = groupFor(sa);
    const gb = groupFor(sb);
    if (ga !== gb) return ga - gb;
    // fallback: alphabetical by specifier
    return sa.localeCompare(sb);
  });
}

async function processFile(file) {
  try {
    const content = await fs.readFile(file, 'utf8');
    if (!content.includes('import')) return;
    const { leading, imports, rest } = splitImportBlock(content);
    if (!imports.length) return;
    const sorted = sortImports(imports);
    const newContent = [leading, sorted.join('\n'), '', rest].filter(Boolean).join('\n');
    if (newContent !== content) {
      await fs.writeFile(file, newContent, 'utf8');
      console.log('Reordered imports:', path.relative(process.cwd(), file));
    }
  } catch (e) {
    console.error('Failed processing', file, e.message);
  }
}

async function main() {
  const root = process.cwd();
  console.log('Scanning for .tsx files under', root);
  const files = await findTsx(root);
  for (const f of files) await processFile(f);
  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
