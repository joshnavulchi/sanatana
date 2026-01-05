#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LOCALES_DIR = path.join(ROOT, 'locales');
const SITE_ROOT = process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in';

function walk(dir) {
  const res = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) res.push(...walk(p));
    else if (stat.isFile() && name.endsWith('.json')) res.push(p);
  }
  return res;
}

function loadJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return null;
  }
}

function findCanonical(obj) {
  if (!obj || typeof obj !== 'object') return undefined;
  if (Object.prototype.hasOwnProperty.call(obj, 'canonical')) return obj.canonical;
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (typeof v === 'object') {
      const found = findCanonical(v);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

if (!fs.existsSync(LOCALES_DIR)) {
  console.error('No locales directory found at', LOCALES_DIR);
  process.exit(1);
}

const files = walk(LOCALES_DIR);
const missing = [];
const rootCanon = [];
const others = [];

for (const f of files) {
  const j = loadJson(f);
  if (!j) continue;
  const c = findCanonical(j);
  if (c === undefined || c === null || String(c).trim() === '') {
    missing.push(f);
  } else {
    const cs = String(c);
    if (cs.replace(/\/$/, '') === SITE_ROOT.replace(/\/$/, '')) rootCanon.push({ file: f, canonical: cs });
    else others.push({ file: f, canonical: cs });
  }
}

console.log('Checked', files.length, 'locale JSON files.');
console.log('Files with missing `canonical`:', missing.length);
if (missing.length) missing.forEach(f => console.log('  -', f.replace(process.cwd() + path.sep, '')));
console.log('Files with canonical equal to site root:', rootCanon.length);
if (rootCanon.length) rootCanon.forEach(o => console.log(`  - ${o.file.replace(process.cwd() + path.sep, '')} -> ${o.canonical}`));
console.log('Files with other canonical values (sample up to 20):', Math.min(20, others.length));
others.slice(0, 20).forEach(o => console.log(`  - ${o.file.replace(process.cwd() + path.sep, '')} -> ${o.canonical}`));

if (missing.length || rootCanon.length) process.exitCode = 2;
