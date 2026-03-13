#!/usr/bin/env node
/**
 * Fixes locale JSON meta.url and (for festivals) canonical domain.
 *
 * verify_all_canonicals.js expects: meta.canonical === meta.url
 * Many locale JSON files have meta.canonical but are missing meta.url.
 *
 * This script:
 * - For festivals.json: sets meta.canonical and meta.url to https://sanatanadharmam.in/festivals
 * - For vedas_*.json: ensures meta.url exists (defaults to meta.canonical)
 * - Optionally aligns openGraph.url and schema.url to the same URL when present.
 */

const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
const REPO_ROOT = path.resolve(__dirname, '..');

function getArgValue(prefix) {
  const hit = argv.find((a) => a.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : undefined;
}

function resolveDir(inputPath, fallbackPath) {
  if (!inputPath) return fallbackPath;
  return path.isAbsolute(inputPath) ? inputPath : path.resolve(REPO_ROOT, inputPath);
}

const LOCALES_DIR = resolveDir(getArgValue('--locales-dir='), path.join(REPO_ROOT, 'locales'));

const SITE_URL = 'https://sanatanadharmam.in';

const TARGET_FILES = new Set([
  'festivals.json',
  'vedas_atharvaveda.json',
  'vedas_rigveda.json',
  'vedas_samaveda.json',
  'vedas_yajurveda.json',
]);

const VEDAS_URL_BY_FILE = {
  'vedas_atharvaveda.json': `${SITE_URL}/vedas/atharvaveda`,
  'vedas_rigveda.json': `${SITE_URL}/vedas/rigveda`,
  'vedas_samaveda.json': `${SITE_URL}/vedas/samaveda`,
  'vedas_yajurveda.json': `${SITE_URL}/vedas/yajurveda`,
};

function isPlainObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

function readJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeJson(filePath, obj) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function pickRootKey(jsonObj) {
  if (!isPlainObject(jsonObj)) return null;
  const keys = Object.keys(jsonObj);
  return keys.length > 0 ? keys[0] : null;
}

function ensureMetaUrl(pageObj, url) {
  if (!isPlainObject(pageObj)) return false;

  const meta = isPlainObject(pageObj.meta) ? pageObj.meta : {};
  const beforeCanonical = meta.canonical;
  const beforeUrl = meta.url;

  if (typeof meta.canonical !== 'string' || meta.canonical.trim() === '') {
    meta.canonical = url;
  }

  if (typeof meta.url !== 'string' || meta.url.trim() === '') {
    meta.url = meta.canonical;
  }

  // If canonical is set but differs from the expected URL (only for festivals), caller decides.

  pageObj.meta = meta;

  if (isPlainObject(pageObj.openGraph)) {
    if (typeof pageObj.openGraph.url !== 'string' || pageObj.openGraph.url.trim() === '') {
      pageObj.openGraph.url = meta.url;
    }
  }

  if (isPlainObject(pageObj.schema)) {
    if (typeof pageObj.schema.url !== 'string' || pageObj.schema.url.trim() === '') {
      pageObj.schema.url = meta.url;
    }

    if (isPlainObject(pageObj.schema.publisher)) {
      if (typeof pageObj.schema.publisher.url !== 'string' || pageObj.schema.publisher.url.trim() === '') {
        pageObj.schema.publisher.url = SITE_URL;
      }
    }
  }

  return beforeCanonical !== meta.canonical || beforeUrl !== meta.url;
}

function processFile(localeDir, fileName) {
  const filePath = path.join(localeDir, fileName);
  if (!fs.existsSync(filePath)) return { changed: false, reason: 'missing' };

  const jsonObj = readJson(filePath);
  if (!jsonObj) return { changed: false, reason: 'invalid_json' };

  const rootKey = pickRootKey(jsonObj);
  if (!rootKey) return { changed: false, reason: 'no_root_key' };

  const pageObj = jsonObj[rootKey];
  if (!isPlainObject(pageObj)) return { changed: false, reason: 'invalid_page_obj' };

  let expectedUrl;

  if (fileName === 'festivals.json') {
    expectedUrl = `${SITE_URL}/festivals`;
    if (!isPlainObject(pageObj.meta)) pageObj.meta = {};
    pageObj.meta.canonical = expectedUrl;
    pageObj.meta.url = expectedUrl;

    if (isPlainObject(pageObj.openGraph)) pageObj.openGraph.url = expectedUrl;
    if (isPlainObject(pageObj.schema)) pageObj.schema.url = expectedUrl;

    jsonObj[rootKey] = pageObj;
    writeJson(filePath, jsonObj);
    return { changed: true, reason: 'updated_festivals' };
  }

  expectedUrl = VEDAS_URL_BY_FILE[fileName];
  const changed = ensureMetaUrl(pageObj, expectedUrl || SITE_URL);
  if (!changed) return { changed: false, reason: 'no_change' };

  jsonObj[rootKey] = pageObj;
  writeJson(filePath, jsonObj);
  return { changed: true, reason: 'updated' };
}

function main() {
  if (!fs.existsSync(LOCALES_DIR)) {
    console.error('Locales directory not found:', LOCALES_DIR);
    process.exit(1);
  }

  const localeFolders = fs
    .readdirSync(LOCALES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  let touched = 0;
  let changedFiles = 0;

  for (const locale of localeFolders) {
    const localeDir = path.join(LOCALES_DIR, locale);

    for (const fileName of TARGET_FILES) {
      const res = processFile(localeDir, fileName);
      if (res.reason === 'missing') continue;
      touched++;
      if (res.changed) changedFiles++;
    }
  }

  console.log(`Checked ${touched} file(s) across ${localeFolders.length} locale(s).`);
  console.log(`Updated ${changedFiles} file(s).`);
}

main();
