#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '..');
const localesDir = path.join(workspaceRoot, 'locales');

function deepMergeFn() {
  return `function deepMerge(target: any, source: any) {
  if (source === undefined) return target;
  if (Array.isArray(target) && Array.isArray(source)) {
    const out = target.slice();
    for (let i = 0; i < source.length; i++) out[i] = deepMerge(out[i], source[i]);
    return out;
  }
  if (target && typeof target === 'object' && source && typeof source === 'object') {
    const out = { ...target };
    for (const k of Object.keys(source)) out[k] = deepMerge(target[k], source[k]);
    return out;
  }
  return source;
}
`;
}

function generateIndexForLocale(localePath, localeName) {
  const entries = fs.readdirSync(localePath, { withFileTypes: true });
  const jsonFiles = entries
    .filter((e) => e.isFile() && e.name.endsWith('.json'))
    .map((e) => e.name)
    .sort();

  const header = `// Auto-generated index for locale '${localeName}'\n// Imports JSON files in this folder and deep-merges them into one export.\n`;

  if (jsonFiles.length === 0) {
    const content = `${header}\n${deepMergeFn()}\nconst base = {};\nconst merged = base;\n\nexport default merged;\n`;
    fs.writeFileSync(path.join(localePath, 'index.ts'), content, 'utf8');
    return;
  }

  let imports = '';
  const importVars = [];
  jsonFiles.forEach((fname, idx) => {
    const varName = `_${idx}`;
    imports += `import ${varName} from './${fname}';\n`;
    importVars.push(varName);
  });

  const mergedArray = `[${importVars.join(', ')}]`;

  const content = `${header}${imports}\n${deepMergeFn()}\nconst base = {};\nconst merged = ${mergedArray}.reduce((acc, cur) => deepMerge(acc, cur || {}), base);\n\nexport default merged;\n`;

  fs.writeFileSync(path.join(localePath, 'index.ts'), content, 'utf8');
  console.log(`Wrote index.ts for locale: ${localeName} (${jsonFiles.length} JSON files)`);
}

function main() {
  if (!fs.existsSync(localesDir)) {
    console.error('locales directory not found:', localesDir);
    process.exit(1);
  }

  const items = fs.readdirSync(localesDir, { withFileTypes: true });
  items.forEach((it) => {
    if (it.isDirectory()) {
      const localePath = path.join(localesDir, it.name);
      generateIndexForLocale(localePath, it.name);
    }
  });
}

main();
