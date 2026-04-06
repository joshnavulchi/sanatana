#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/* ---------- CONFIG ---------- */

// Keys to remove completely (case-insensitive)
const REMOVE_KEYS = new Set([
  'title',
  'description',
  'meta',
  'opengraph'
]);

/* ---------- HELPERS ---------- */

function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  ) {
    return true;
  }
  return false;
}

function deduplicateArray(array) {
  const seen = new Set();
  return array.filter(item => {
    const key = typeof item === 'object'
      ? JSON.stringify(item)
      : String(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function shouldRemoveKey(key) {
  return REMOVE_KEYS.has(key.toLowerCase());
}

/**
 * Collapse duplicate nested keys:
 * { "x": { "x": {...} } } => { "x": {...} }
 */
function collapseDuplicateKey(parentKey, value) {
  if (
    typeof value === 'object' &&
    !Array.isArray(value) &&
    value !== null
  ) {
    const keys = Object.keys(value);
    if (keys.length === 1 && keys[0] === parentKey) {
      return value[parentKey];
    }
  }
  return value;
}

/* ---------- CORE ---------- */

function optimizeJson(input, parentKey = null) {
  if (typeof input !== 'object' || input === null) {
    return input;
  }

  if (Array.isArray(input)) {
    const cleaned = deduplicateArray(
      input.map(v => optimizeJson(v)).filter(v => !isEmpty(v))
    );
    return cleaned.length ? cleaned : undefined;
  }

  const result = {};

  for (const [key, value] of Object.entries(input)) {
    if (shouldRemoveKey(key)) continue;

    let optimizedValue = optimizeJson(value, key);
    optimizedValue = collapseDuplicateKey(key, optimizedValue);

    if (!isEmpty(optimizedValue)) {
      result[key] = optimizedValue;
    }
  }

  return Object.keys(result).length ? result : undefined;
}

/* ---------- CLI ---------- */

const args = process.argv.slice(2);
const filePath = args.find(a => !a.startsWith('-'));
const writeMode = args.includes('--write');

function readInput() {
  if (filePath) {
    return fs.readFileSync(filePath, 'utf8');
  }
  return fs.readFileSync(0, 'utf8');
}

try {
  const raw = readInput();
  const parsed = JSON.parse(raw);
  const optimized = optimizeJson(parsed) ?? {};
  const output = JSON.stringify(optimized, null, 2);

  if (writeMode) {
    if (!filePath) {
      console.error('❌ --write requires a file path');
      process.exit(1);
    }
    const resolved = path.resolve(filePath);
    fs.writeFileSync(resolved, output);
    console.log(`✅ Optimized JSON written to ${resolved}`);
  } else {
    process.stdout.write(output);
  }
} catch (e) {
  console.error('❌ Invalid JSON or read error');
  process.exit(1);
}