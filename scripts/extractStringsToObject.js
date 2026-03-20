// extractStringsToObject.js

const fs = require('fs');
const path = require('path');

const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const generate = require('@babel/generator').default;

// Very light stopwords to keep keys short and meaningful
const STOPWORDS = new Set([
  'the', 'a', 'an', 'to', 'of', 'and', 'for', 'in', 'on', 'at', 'by', 'with',
  'is', 'are', 'be', 'this', 'that', 'it', 'our', 'your', 'we', 'you'
]);

function getTsxFiles(dir) {
  const files = [];
  function scan(d) {
    const items = fs.readdirSync(d);
    for (const item of items) {
      const full = path.join(d, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        scan(full);
      } else if (item.endsWith('.tsx')) {
        files.push(full);
      }
    }
  }
  scan(dir);
  return files;
}

function makeShortKey(value) {
  // Normalize and split to words
  const words = value
    .toLowerCase()
    .normalize('NFKD')                  // handle diacritics
    .replace(/[^\x00-\x7F]/g, '')       // strip non-ascii (optional)
    .replace(/[^a-z0-9\s]/g, ' ')       // drop punctuation
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

  // Prefer non-stopwords to keep keys short & relevant
  const sig = words.filter(w => !STOPWORDS.has(w));
  const pick = (sig.length ? sig : words).slice(0, 2); // pick up to 2 words

  // Truncate each segment to max 8 chars to keep it compact
  const segments = pick.map(w => w.slice(0, 8));

  let base = segments.join('_');
  if (!base) base = 'label';

  // Ensure valid identifier start
  if (!/^[a-z_]/.test(base)) base = `k_${base}`;

  // Limit total length (safety)
  base = base.slice(0, 18).replace(/^_+|_+$/g, '');

  // Deduplicate by suffixing a number as needed
  let key = base;
  while (Object.prototype.hasOwnProperty.call(stringMap, key)) {
    key = `${base}_${uniqueCounter++}`;
  }
  return key;
}

function getOrCreateKey(value) {
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (valueToKey.has(normalized)) return valueToKey.get(normalized);

  const key = makeShortKey(normalized);
  stringMap[key] = value; // store original (un-normalized) for fidelity
  valueToKey.set(normalized, key);
  return key;
}

// Utility: is this string only punctuation/whitespace?
function isOnlyPunctOrWs(str) {
  const noWs = str.replace(/\s+/g, '');
  return noWs.length > 0 && /^[^a-zA-Z0-9]+$/.test(noWs);
}

function processFile(filename) {
  let stringMap = {};         // key -> original string
  let valueToKey = new Map(); // normalized value -> key (dedupe)
  let uniqueCounter = 1;

  // Local helper to generate or reuse a key for a given string value
  function getOrCreateKey(value) {
    const normalized = value.trim().replace(/\s+/g, ' ');
    if (valueToKey.has(normalized)) return valueToKey.get(normalized);

    // Build a short human-readable key (self-contained, does not rely on outer globals)
    const words = normalized
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^\x00-\x7F]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean);

    const sig = words.filter(w => !STOPWORDS.has(w));
    const pick = (sig.length ? sig : words).slice(0, 2);
    const segments = pick.map(w => w.slice(0, 8));

    let base = segments.join('_');
    if (!base) base = 'label';
    if (!/^[a-z_]/.test(base)) base = `k_${base}`;
    base = base.slice(0, 18).replace(/^_+|_+$/g, '');

    let key = base;
    while (Object.prototype.hasOwnProperty.call(stringMap, key)) {
      key = `${base}_${uniqueCounter++}`;
    }

    stringMap[key] = value; // store original for fidelity
    valueToKey.set(normalized, key);
    return key;
  }

  const code = fs.readFileSync(filename, 'utf8');

  // ---- Parse TSX with Babel
  const ast = babelParser.parse(code, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'typescript',
      'classProperties',
      'objectRestSpread',
      'optionalChaining',
      'nullishCoalescingOperator',
      ['decorators', { decoratorsBeforeExport: true }],
    ],
    errorRecovery: true,
    allowReturnOutsideFunction: true,
    allowAwaitOutsideFunction: true,
  });

  // ---- Read metaKey (for object name prefix), but do NOT modify any attributes
  let metaKeyValue = null;
  traverse(ast, {
    JSXAttribute(path) {
      const { node } = path;
      if (
        node.name &&
        node.name.name === 'metaKey' &&
        node.value &&
        node.value.type === 'StringLiteral'
      ) {
        metaKeyValue = node.value.value;
      }
    },
  });

  let objectName = 'page';
  if (metaKeyValue) {
    objectName = `${metaKeyValue}_page`.replace(/[^a-zA-Z0-9_]/g, '_');
    if (!/^[A-Za-z_]/.test(objectName)) objectName = `page_${objectName}`;
  }

  // ---- Extract & replace ONLY JSX text nodes (strings between > and <)
  traverse(ast, {
    JSXText(path) {
      const raw = path.node.value;
      const value = raw.trim();

      // Skip whitespace-only or punctuation-only nodes
      if (!value || isOnlyPunctOrWs(value)) return;

      const key = getOrCreateKey(value);

      // Preserve a single leading/trailing space if originally present to avoid layout shifts
      const leadingSpace = /^\s/.test(raw) ? ' ' : '';
      const trailingSpace = /\s$/.test(raw) ? ' ' : '';

      const expr = t.jsxExpressionContainer(
        t.memberExpression(t.identifier(objectName), t.identifier(key))
      );

      if (leadingSpace || trailingSpace) {
        const nodes = [];
        if (leadingSpace) nodes.push(t.jsxText(leadingSpace));
        nodes.push(expr);
        if (trailingSpace) nodes.push(t.jsxText(trailingSpace));
        path.replaceWithMultiple(nodes);
      } else {
        path.replaceWith(expr);
      }
    },

    // IMPORTANT: Do not modify any attributes at all.
    // (Intentionally no JSXAttribute handler for replacement.)
  });

  // If no strings were collected, do not add an object or modify the file
  if (Object.keys(stringMap).length === 0) {
    return null;
  }

  // ---- Build: const <objectName> = { k: "v", ... }
  const properties = Object.entries(stringMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => t.objectProperty(t.identifier(k), t.stringLiteral(v)));

  const pageObjDecl = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier(objectName), t.objectExpression(properties)),
  ]);

  // ---- Insert object after last import
  const body = ast.program.body;
  let lastImport = -1;
  for (let i = 0; i < body.length; i++) {
    if (t.isImportDeclaration(body[i])) lastImport = i;
  }
  body.splice(lastImport + 1, 0, pageObjDecl);

  // ---- Generate output (pretty-print), then post-fix blank line after the object
  let { code: output } = generate(ast, {
    retainLines: false,           // allow reformatting
    compact: false,               // pretty-print
    concise: false,
    minified: false,
    decoratorsBeforeExport: true,
    jsescOption: { minimal: true },
  });

  // Ensure exactly one blank line after the object declaration we just inserted
  {
    const declStartRe = new RegExp(`const\\s+${objectName}\\s*=\\s*\\{`);
    const openIdx = output.search(declStartRe);
    if (openIdx !== -1) {
      const closeIdx = output.indexOf('};', openIdx);
      if (closeIdx !== -1) {
        const before = output.slice(0, closeIdx + 2);
        const after = output.slice(closeIdx + 2);
        // Trim any leading whitespace/newlines after '};'
        const afterTrimmed = after.replace(/^\s*/, '');
        // Insert exactly one blank line
        output = `${before}\n\n${afterTrimmed}`;
      }
    }
  }

  return output;
}

// Main
const DIR = process.argv[2] || 'app';
const dirPath = path.join(__dirname, '..', DIR);

if (!fs.existsSync(dirPath)) {
  console.error('Directory not found:', dirPath);
  process.exit(1);
}

const tsxFiles = getTsxFiles(dirPath);

if (tsxFiles.length === 0) {
  console.log('No .tsx files found in', DIR);
  process.exit(0);
}

for (const file of tsxFiles) {
  try {
    const output = processFile(file);
    if (!output) {
      console.log('Skipped (no hardcoded strings):', path.relative(process.cwd(), file));
      continue;
    }

    const outPath = path.join(
      path.dirname(file),
      path.basename(file).replace(/\.tsx$/, '.extracted.tsx')
    );

    fs.writeFileSync(outPath, output, 'utf8');
    console.log('Processed:', path.relative(process.cwd(), file), '->', path.basename(outPath));
  } catch (error) {
    console.error('Error processing', file, ':', error.message);
  }
}

console.log('Done processing all .tsx files in', DIR);