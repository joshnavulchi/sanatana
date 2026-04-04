#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

function isObject(v) { return v && typeof v === 'object' && !Array.isArray(v); }

function sortKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (isObject(value)) {
    const keys = Object.keys(value).sort();
    const out = {};
    for (const k of keys) out[k] = sortKeysDeep(value[k]);
    return out;
  }
  return value;
}

function normalizeString(s) {
  if (typeof s !== 'string') return s;
  // Collapse repeated whitespace, trim
  return s.replace(/\s+/g, ' ').trim();
}

function dedupeArray(arr) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const key = typeof item === 'object' ? JSON.stringify(item) : String(item);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

function transform(value, opts, keyPath = '', report = { changes: [] }) {
  if (Array.isArray(value)) {
    // normalize array elements
    const orig = JSON.stringify(value);
    const newArr = value.map(v => transform(v, opts, keyPath, report));
    const deduped = dedupeArray(newArr);
    if (JSON.stringify(deduped) !== orig) report.changes.push({ type: 'array-dedup', key: keyPath });
    return deduped;
  }
  if (isObject(value)) {
    const out = {};
    const keys = Object.keys(value).sort();
    for (const k of keys) {
      const childPath = keyPath ? `${keyPath}.${k}` : k;
      const v = value[k];
      if ((v === null || v === '') && opts.removeEmpty === true) {
        report.changes.push({ type: 'remove-empty', key: childPath });
        continue;
      }
      out[k] = transform(v, opts, childPath, report);
    }
    return out;
  }
  if (typeof value === 'string') return normalizeString(value);
  return value;
}

async function walkDir(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const res = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...await walkDir(res));
    else if (e.isFile() && res.endsWith('.json')) files.push(res);
  }
  return files;
}

function flatten(obj, prefix = '') {
  const map = new Map();
  if (isObject(obj)) {
    for (const k of Object.keys(obj)) {
      const p = prefix ? `${prefix}.${k}` : k;
      const child = obj[k];
      if (isObject(child) || Array.isArray(child)) {
        for (const [ck, cv] of flatten(child, p)) map.set(ck, cv);
      } else {
        map.set(p, child);
      }
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => {
      const p = `${prefix}[${i}]`;
      if (isObject(v) || Array.isArray(v)) {
        for (const [ck, cv] of flatten(v, p)) map.set(ck, cv);
      } else map.set(p, v);
    });
  }
  return map;
}

async function processPath(targetPath, opts) {
  const stats = await fs.stat(targetPath);
  const files = stats.isDirectory() ? await walkDir(targetPath) : [targetPath];
  const report = { files: [], duplicates: {} };
  for (const file of files) {
    try {
      const raw = await fs.readFile(file, 'utf8');
      let parsed;
      try { parsed = JSON.parse(raw); } catch (e) {
        report.files.push({ path: file, error: 'parse-error', message: e.message });
        continue;
      }
      const fileReport = { path: file, changes: [], duplicateValues: [] };
      const transformed = transform(parsed, opts, '', fileReport);
      // detect identical values across keys
      const flat = flatten(parsed);
      const valueToKeys = new Map();
      for (const [k, v] of flat) {
        const key = typeof v === 'object' ? JSON.stringify(v) : String(v);
        if (!valueToKeys.has(key)) valueToKeys.set(key, []);
        valueToKeys.get(key).push(k);
      }
      for (const [val, keys] of valueToKeys.entries()) {
        if (keys.length > 1) fileReport.duplicateValues.push({ value: val, keys });
      }
      report.files.push(fileReport);
      // prepare suggested content
      const sorted = sortKeysDeep(transformed);
      const suggested = JSON.stringify(sorted, null, 2) + '\n';
      fileReport.suggested = suggested;
      if (opts.apply) {
        // backup
        const backupDir = path.join(process.cwd(), '.locales-backups');
        await fs.mkdir(backupDir, { recursive: true });
        const base = path.basename(file);
        const bakPath = path.join(backupDir, `${base}.${Date.now()}.bak`);
        await fs.writeFile(bakPath, raw, 'utf8');
        await fs.writeFile(file, suggested, 'utf8');
        fileReport.applied = true;
      }
    } catch (e) {
      report.files.push({ path: file, error: 'unexpected', message: e.message });
    }
  }
  return report;
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0) {
    console.log('Usage: node optimize-locales.js [--report] [--apply] <path>');
    process.exit(1);
  }
  const opts = { report: false, apply: false, removeEmpty: false };
  const paths = [];
  for (const a of argv) {
    if (a === '--report') opts.report = true;
    else if (a === '--apply') opts.apply = true;
    else if (a === '--remove-empty') opts.removeEmpty = true;
    else paths.push(a);
  }
  if (paths.length === 0) {
    console.error('No target path provided');
    process.exit(1);
  }
  const target = paths[0];
  const report = await processPath(target, opts);
  const outPath = path.join(process.cwd(), 'optimize-locales-report.json');
  await fs.writeFile(outPath, JSON.stringify(report, null, 2), 'utf8');
  console.log('Report written to', outPath);
}

main().catch(e => { console.error(e); process.exit(2); });
