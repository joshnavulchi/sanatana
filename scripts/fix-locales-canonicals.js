#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const child = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const APP_DIR = path.join(ROOT, 'app');
const LOCALES_DIR = path.join(ROOT, 'locales', 'en');
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in';
// When true, for locale files we cannot map to a route, force-add site root canonical
const FORCE_ADD = true;

function findPageFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...findPageFiles(p));
    else if (e.isFile() && /page\.(tsx?|jsx?)$/.test(e.name)) files.push(p);
  }
  return files;
}

function extractMetaKey(fileContent) {
  const m = fileContent.match(/createGenerateMetadata\(['"`]([^'"`]+)['"`]\)/);
  return m ? m[1] : null;
}

function routeFromFile(filePath) {
  const rel = path.relative(APP_DIR, path.dirname(filePath)).replace(/\\/g, '/');
  if (!rel || rel === '.') return '/';
  // remove dynamic segments like [id]
  const cleaned = rel.split('/').filter(Boolean).map(p => p.replace(/\[[^\]]+\]/g, '')).filter(Boolean).join('/');
  return '/' + cleaned;
}

function ensureNoTrailing(url) {
  return String(url).replace(/\/$/, '');
}

function main() {
  const pageFiles = findPageFiles(APP_DIR);
  const mapping = {};
  for (const f of pageFiles) {
    const content = fs.readFileSync(f, 'utf8');
    const key = extractMetaKey(content);
    if (!key) continue;
    const route = routeFromFile(f);
    mapping[key] = route;
  }

  const localeFiles = fs.readdirSync(LOCALES_DIR).filter(n => n.endsWith('.json'));
  const changed = [];
  for (const lf of localeFiles) {
    const full = path.join(LOCALES_DIR, lf);
    let json;
    try {
      json = JSON.parse(fs.readFileSync(full, 'utf8'));
    } catch (e) {
      console.error('Skipping invalid JSON', lf);
      continue;
    }
    const rootKeys = Object.keys(json);
    if (rootKeys.length === 0) continue;
    const rootKey = rootKeys[0];
    const meta = (json[rootKey] && json[rootKey].meta) ? json[rootKey].meta : null;
    if (!meta) continue;
    let canonicalNoSlash = null;
    if (mapping[rootKey]) {
      const route = mapping[rootKey];
      canonicalNoSlash = ensureNoTrailing(SITE) + (route === '/' ? '' : route);
    } else {
      // Fallback: try to match filename/rootKey against sitemap paths
      try {
        const sitemap = fs.readFileSync(path.join(ROOT, 'public', 'sitemap.xml'), 'utf8');
        const paths = Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g)).map(m => m[1]);
        const needle = lf.replace(/\.json$/i, '').replace(/[_\-]/g, '').toLowerCase();
        const rootKeyNorm = String(rootKey).replace(/[_\-]/g, '').toLowerCase();
        const found = paths.find(p => {
          const pNorm = p.replace(/^https?:\/\/[^^/]+/i, '').replace(/\//g, '').toLowerCase();
          return pNorm.includes(needle) || pNorm.includes(rootKeyNorm);
        });
        if (found) canonicalNoSlash = ensureNoTrailing(found);
      } catch (e) {
        // ignore sitemap fallback
      }
    }

    if (!canonicalNoSlash) {
      if (FORCE_ADD) canonicalNoSlash = ensureNoTrailing(SITE);
      else continue;
    }
    const existingUrl = meta.url ? String(meta.url) : '';
    const existingCanonical = meta.canonical ? String(meta.canonical) : '';
    if (ensureNoTrailing(existingUrl) !== canonicalNoSlash || ensureNoTrailing(existingCanonical) !== canonicalNoSlash) {
      meta.url = canonicalNoSlash;
      meta.canonical = canonicalNoSlash;
      fs.writeFileSync(full, JSON.stringify(json, null, 2) + '\n', 'utf8');
      changed.push(lf);
    }
  }

  console.log('Updated', changed.length, 'locale files');
  if (changed.length) console.log(changed.join('\n'));

  // Regenerate sitemap if generator exists
  const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
  if (fs.existsSync(sitemapScript)) {
    try {
      console.log('Regenerating sitemap...');
      child.execSync('node scripts/generate-sitemap.js', { cwd: ROOT, stdio: 'inherit' });
      console.log('Sitemap regenerated.');
    } catch (e) {
      console.error('Failed to regenerate sitemap:', e.message);
    }
  }
}

main();
