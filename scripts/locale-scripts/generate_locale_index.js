// Script: generate_locale_index.js
// Purpose: Auto-generates index.ts for each locale folder, deep-merging all JSON files into a single export.
// Usage: node generate_locale_index.js
// Main logic: Reads all JSON files in a locale, generates TypeScript imports, and deep-merges them for export.

const fs = require('fs'); // Node.js file system module for file operations
const path = require('path'); // Node.js path module for handling file paths

const root = path.resolve(__dirname, '..', '..'); // Project root directory
const localesDir = path.join(root, 'locales'); // Path to locales directory

/**
 * Generates index.ts for a locale folder by deep-merging all JSON files.
 * @param {string} localeDir - Path to locale directory
 * @param {string} localeName - Locale name
 */
function makeIndexForLocale(localeDir, localeName) {
  const files = fs.readdirSync(localeDir).filter(f => f.endsWith('.json')).sort();
  const imports = files.map((f, i) => `import _${i} from './${f}';`).join('\n');

  // Deep merge function for merging JSON objects
  const deepMerge = `function deepMerge(target: any, source: any) {
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
}`;

  const vars = files.map((_, i) => `_${i}`).join(', ');

  // Content for index.ts
  const content = `// Auto-generated index for locale '${localeName}'\n// Imports JSON files in this folder and deep-merges them into one export.\n${imports}\n\n${deepMerge}\n\nconst base = {};\nconst merged = [${vars}].reduce((acc, cur) => deepMerge(acc, cur || {}), base);\n\nexport default merged;\n`;

  fs.writeFileSync(path.join(localeDir, 'index.ts'), content, 'utf8');
  console.log(`Wrote index.ts for locale: ${localeName} (${files.length} JSON files)`);
}

/**
 * Main function: generates index.ts for each locale directory.
 */
function main() {
  if (!fs.existsSync(localesDir)) {
    console.error('locales directory not found:', localesDir);
    process.exit(1);
  }

  const entries = fs.readdirSync(localesDir, { withFileTypes: true });
  const dirs = entries.filter(e => e.isDirectory()).map(d => d.name);

  for (const dir of dirs) {
    const localePath = path.join(localesDir, dir);
    try {
      makeIndexForLocale(localePath, dir);
    } catch (err) {
      console.error('Failed to generate index for', dir, err);
    }
  }
}

if (require.main === module) main();
