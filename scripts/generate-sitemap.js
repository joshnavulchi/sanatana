#!/usr/bin/env node
/**
 * generate-sitemap.js
 *
 * Build-time sitemap.xml generator that discovers routes directly from the
 * static export output (all HTML files under `out`).
 *
 * This guarantees sitemap entries match actual built pages.
 *
 * Usage:  node scripts/generate-sitemap.js          (run from repo root)
 *
 * The script writes sitemap.xml to both `out/` and `public/`.
 */
const fs = require('fs');
const path = require('path');
const REPO_ROOT = path.resolve(__dirname, '..');

// Allow overriding the input folder via CLI arg or env var so the script can
// run against any deployed folder of HTML pages (e.g. exported site).
const rawInput = process.argv[2] || process.env.SITEMAP_INPUT_DIR || 'out';
const outDirDefault = path.join(REPO_ROOT, 'out');
const outDir = path.isAbsolute(rawInput) ? rawInput : path.resolve(REPO_ROOT, rawInput);

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in').replace(/\/$/, '');

// ── Locales ────────────────────────────────────────────────────────
function loadLocales() {
  try {
    const listPath = path.join(REPO_ROOT, 'lib', 'localesList.json');
    if (fs.existsSync(listPath)) {
      const parsed = JSON.parse(fs.readFileSync(listPath, 'utf8'));
      return Array.isArray(parsed) ? parsed.map((o) => o.code).filter(Boolean) : ['en'];
    }
  } catch (_) { /* ignore */ }
  return ['en'];
}
const LOCALES = loadLocales();

// ── Excludes ───────────────────────────────────────────────────────
function loadExcludes() {
  try {
    const p = path.join(REPO_ROOT, 'lib', 'sitemapExclude.json');
    if (fs.existsSync(p)) {
      const arr = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch (_) { /* ignore */ }
  return new Set();
}
const EXCLUDES = loadExcludes();

// ── Route Discovery From Built HTML ────────────────────────────────

function findHtmlFiles(dir, results) {
  results = results || [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      findHtmlFiles(full, results);
    } else if (ent.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

function assertBuildOutputReady(outDir) {
  if (!fs.existsSync(outDir)) {
    throw new Error('Missing out/ directory. Run `npm run build` before `node scripts/generate-sitemap.js`.');
  }

  const indexPath = path.join(outDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('Missing out/index.html. Build output looks incomplete; run `npm run build` first.');
  }

  const htmlFiles = findHtmlFiles(outDir);
  if (htmlFiles.length === 0) {
    throw new Error('No built HTML files found in out/. Run `npm run build` before generate-sitemap.');
  }

  return htmlFiles;
}

function htmlFileToRoute(htmlPath, outDir) {
  const rel = path.relative(outDir, htmlPath).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';

  // Ignore framework/internal pages.
  if (rel.startsWith('_next/')) return null;

  if (rel.endsWith('/index.html')) {
    const route = '/' + rel.slice(0, -'/index.html'.length);
    return route || '/';
  }

  if (rel.endsWith('.html')) {
    // Keep explicit .html routes (e.g. site verification files).
    return '/' + rel;
  }

  return null;
}

function routeBase(route) {
  // normalize: remove leading/trailing slash and optional .html
  if (!route) return '';
  let base = route.replace(/^\//, '').replace(/\/$/, '');
  if (base.endsWith('.html')) base = base.slice(0, -'.html'.length);
  return base;
}

// ── Sitemap XML ────────────────────────────────────────────────────

function buildSitemap(paths) {
  const lastmod = new Date().toISOString();
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  for (const p of paths) {
    if (EXCLUDES.has(p)) continue;
    let loc = `${SITE_URL}${p === '/' ? '' : p}`;
    // trailing slash to match `trailingSlash: true` in next.config
    const hasFileExtension = /\.[a-z0-9]+$/i.test(p);
    if (p !== '/' && !hasFileExtension && !loc.endsWith('/')) loc += '/';

    xml += '  <url>\n';
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;

    for (const l of LOCALES) {
      let href = l === 'en'
        ? `${SITE_URL}${p === '/' ? '' : p}`
        : `${SITE_URL}${p === '/' ? '' : p}?lang=${l}`;
      if (p !== '/' && !hasFileExtension && !href.endsWith('/') && !href.includes('?')) href += '/';
      xml += `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>\n`;
    }
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';
  return xml;
}

// ── Write ──────────────────────────────────────────────────────────

function writeTo(filePath, xml) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, xml, 'utf8');
  // console.log('Wrote', filePath);
}

// ── Main ───────────────────────────────────────────────────────────

try {
  const htmlFiles = assertBuildOutputReady(outDir);

  const routeSet = new Set();

  // Ignore canonical "not found" pages that may be present in exported HTML.
  const IGNORE_BASES = new Set(['404', 'not-found']);

  for (const htmlPath of htmlFiles) {
    const route = htmlFileToRoute(htmlPath, outDir);
    if (!route) continue;
    const base = routeBase(route);
    if (IGNORE_BASES.has(base)) continue;
    routeSet.add(route);
  }

  const paths = Array.from(routeSet).sort();
  // console.log(`Discovered ${paths.length} routes from built HTML:`);
  // for (const p of paths) // console.log('  ', p);

  const xml = buildSitemap(paths);
  // Write sitemap into the input directory so running this against a
  // deployed HTML folder places the sitemap next to the pages.
  writeTo(path.join(outDir, 'sitemap.xml'), xml);

  // If we ran against the repo `out` directory, also update `public/`.
  try {
    if (path.resolve(outDir) === path.resolve(outDirDefault)) {
      writeTo(path.join(REPO_ROOT, 'public', 'sitemap.xml'), xml);
    }
  } catch (_) { /* non-fatal */ }
} catch (err) {
  console.error('generate-sitemap error:', err);
  process.exit(1);
}
