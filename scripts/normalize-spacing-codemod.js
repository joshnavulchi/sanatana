#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find files to process
const ROOT = path.resolve(__dirname, '..');
const PATTERNS = [
  'app/**/*.tsx',
  'app/**/*.jsx',
  'components/**/*.tsx',
  'components/**/*.jsx',
  'pages/**/*.tsx',
  'pages/**/*.jsx',
];

const TEXT_REPLACEMENTS = [
  [/text-\[[0-9]+px\]/g, 'text-base'],
  [/text-15px/g, 'text-base'],
  [/text-14px/g, 'text-base'],
  [/text-lg/g, 'text-base'],
  [/text-5xl/g, 'text-3xl'],
  [/text-4xl/g, 'text-3xl'],
];

const LEADING_REPLACEMENTS = [
  [/leading-6/g, 'leading-relaxed'],
  [/leading-7/g, 'leading-relaxed'],
  [/leading-8/g, 'leading-relaxed'],
];

const FONT_REPLACEMENTS = [
  [/font-bold/g, 'font-semibold'],
];

const REMOVE_PREFIXES = ['dark:'];

function normalizeTokens(tokens) {
  const out = [];
  const seen = new Set();

  // apply replacements per token
  for (let t of tokens) {
    if (!t || seen.has(t)) continue;
    // remove unwanted prefixes
    if (REMOVE_PREFIXES.some(p => t.startsWith(p))) continue;

    // basic replacements
    TEXT_REPLACEMENTS.forEach(([re, r]) => {
      if (re.test(t)) t = t.replace(re, r);
    });
    LEADING_REPLACEMENTS.forEach(([re, r]) => {
      if (re.test(t)) t = t.replace(re, r);
    });
    FONT_REPLACEMENTS.forEach(([re, r]) => {
      if (re.test(t)) t = t.replace(re, r);
    });

    if (!seen.has(t)) {
      out.push(t);
      seen.add(t);
    }
  }

  // post-process: if both p-<n> and px-/py- present, drop px/py
  const hasP = out.find(x => /^p-\d+/.test(x));
  if (hasP) {
    for (const axis of ['px-', 'py-']) {
      for (let i = out.length - 1; i >= 0; i--) {
        if (out[i].startsWith(axis)) out.splice(i, 1);
      }
    }
  }

  return Array.from(new Set(out));
}

function normalizeClassString(classStr) {
  // ignore template expressions
  if (/\$\{/.test(classStr)) return classStr;
  const tokens = classStr.split(/\s+/).filter(Boolean);
  const normalized = normalizeTokens(tokens);
  return normalized.join(' ');
}

function processFile(file) {
  const full = path.join(ROOT, file);
  let src = fs.readFileSync(full, 'utf8');
  let changed = false;

  // patterns to match string literal className usages
  const patterns = [
    /className=(?:\")([^\"]+)(?:\")/g,
    /className=(?:\')([^\']+)(?:\')/g,
    /className=\{\s*\"([^\"]+)\"\s*\}/g,
    /className=\{\s*\'([^\']+)\'\s*\}/g,
    /className=\{\s*`([^`]+)`\s*\}/g,
  ];

  patterns.forEach((pat) => {
    src = src.replace(pat, (match, p1) => {
      const before = p1;
      const after = normalizeClassString(before);
      if (after !== before) {
        changed = true;
        // preserve the original quoting style
        const quote = match.includes('`') ? '`' : match.includes("\'") ? "'" : '"';
        if (/className=\{/.test(match)) return `className={${quote}${after}${quote}}`;
        return `className=${quote}${after}${quote}`;
      }
      return match;
    });
  });

  if (changed) {
    fs.writeFileSync(full, src, 'utf8');
    return true;
  }
  return false;
}

function main() {
  const files = new Set();
  PATTERNS.forEach((p) => {
    const matches = glob.sync(p, { cwd: ROOT, nodir: true });
    matches.forEach((m) => files.add(m));
  });

  const list = Array.from(files);
  let count = 0;
  console.log('Normalize typography/spacing - scanning', list.length, 'files');

  for (const f of list) {
    try {
      if (processFile(f)) count++;
    } catch (err) {
      console.error('Error processing', f, err.message);
    }
  }

  console.log('Files modified:', count);
  if (count === 0) process.exit(0);
}

if (require.main === module) main();
