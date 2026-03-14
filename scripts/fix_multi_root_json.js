#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const TARGET_DIR = path.join(REPO_ROOT, 'locales');

function isWhitespace(char) {
  return char === ' ' || char === '\n' || char === '\r' || char === '\t';
}

function stripBom(text) {
  return text.replace(/^\uFEFF/, '');
}

function collectJsonFiles(dirPath) {
  const out = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.json')) {
      out.push(fullPath);
    }
  }

  return out;
}

function parseConcatenatedRootObjects(raw) {
  const text = stripBom(raw);
  const values = [];
  let index = 0;

  while (index < text.length) {
    while (index < text.length && isWhitespace(text[index])) {
      index += 1;
    }

    if (index >= text.length) break;
    if (text[index] !== '{') return null;

    let depth = 0;
    let inString = false;
    let escaped = false;
    let endIndex = -1;

    for (let i = index; i < text.length; i += 1) {
      const char = text[i];

      if (inString) {
        if (escaped) {
          escaped = false;
          continue;
        }

        if (char === '\\') {
          escaped = true;
          continue;
        }

        if (char === '"') {
          inString = false;
        }

        continue;
      }

      if (char === '"') {
        inString = true;
        continue;
      }

      if (char === '{') {
        depth += 1;
        continue;
      }

      if (char === '}') {
        depth -= 1;
        if (depth === 0) {
          endIndex = i;
          break;
        }
        continue;
      }
    }

    if (endIndex === -1) return null;

    const chunk = text.slice(index, endIndex + 1);
    let parsed;
    try {
      parsed = JSON.parse(chunk);
    } catch {
      return null;
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null;
    }

    values.push(parsed);
    index = endIndex + 1;
  }

  return values.length > 1 ? values : null;
}

function mergeObjects(objects) {
  const merged = {};
  let collisionCount = 0;

  for (const obj of objects) {
    for (const [key, value] of Object.entries(obj)) {
      if (Object.prototype.hasOwnProperty.call(merged, key)) {
        collisionCount += 1;
      }
      merged[key] = value;
    }
  }

  return { merged, collisionCount };
}

function main() {
  if (!fs.existsSync(TARGET_DIR)) {
    console.error(`Locales directory not found: ${TARGET_DIR}`);
    process.exit(1);
  }

  const files = collectJsonFiles(TARGET_DIR);
  let fixedFiles = 0;
  let invalidFiles = 0;
  let totalCollisions = 0;

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const normalized = stripBom(raw);

    try {
      JSON.parse(normalized);
      continue;
    } catch {
      const pieces = parseConcatenatedRootObjects(raw);

      if (!pieces) {
        invalidFiles += 1;
        const rel = path.relative(REPO_ROOT, filePath).replace(/\\/g, '/');
        console.error(`Unfixable invalid JSON: ${rel}`);
        continue;
      }

      const { merged, collisionCount } = mergeObjects(pieces);
      totalCollisions += collisionCount;

      const content = JSON.stringify(merged, null, 2) + '\n';
      fs.writeFileSync(filePath, content, 'utf8');

      fixedFiles += 1;
      const rel = path.relative(REPO_ROOT, filePath).replace(/\\/g, '/');
      console.log(`Fixed multi-root JSON: ${rel}${collisionCount ? ` (key collisions: ${collisionCount})` : ''}`);
    }
  }

  console.log(`\nMulti-root fix summary:`);
  console.log(`- Files scanned: ${files.length}`);
  console.log(`- Files fixed: ${fixedFiles}`);
  console.log(`- Key collisions while merging: ${totalCollisions}`);
  console.log(`- Remaining invalid files: ${invalidFiles}`);

  if (invalidFiles > 0) {
    process.exit(1);
  }
}

main();
