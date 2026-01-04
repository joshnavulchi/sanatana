#!/usr/bin/env node
/**
 * generate-sitemap.js
 * Purpose: Build a sitemap.xml for the site using `lib/sitemapPaths.ts`.
 * Usage: node scripts/generate-sitemap.js  (expects to be run from repo root)
 */
const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in';
// Derive locales from lib/localesList.json when present; fall back to English-only.
function loadLocales() {
  try {
    const listPath = path.join(process.cwd(), 'lib', 'localesList.json');
    if (fs.existsSync(listPath)) {
      const raw = fs.readFileSync(listPath, 'utf8');
      const parsed = JSON.parse(raw);
      return (Array.isArray(parsed) ? parsed.map((o) => o.code).filter(Boolean) : ['en']);
    }
  } catch (err) {
    // ignore and fall back
  }
  return ['en'];
}

const LOCALES = loadLocales();

// Optional: allow excluding unwanted paths via lib/sitemapExclude.json
function loadExcludes() {
  try {
    const p = path.join(process.cwd(), 'lib', 'sitemapExclude.json');
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf8');
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch (err) {
    // ignore
  }
  return new Set();
}

const EXCLUDES = loadExcludes();

function readPaths() {
  // Prefer Next's prerender manifest (routes actually built) when available.
  try {
    const manifestPath = path.join(process.cwd(), '.next', 'prerender-manifest.json');
    if (fs.existsSync(manifestPath)) {
      const raw = fs.readFileSync(manifestPath, 'utf8');
      const manifest = JSON.parse(raw);
      const routes = manifest && manifest.routes ? Object.keys(manifest.routes) : [];
      // Filter out API routes, route handlers, sitemap route, and special internal routes
      const filtered = routes.filter((r) => {
        if (!r || typeof r !== 'string') return false;
        if (r.startsWith('/api')) return false;
        if (r === '/sitemap.xml' || r === '/sitemap') return false;
        if (r === '/favicon.ico') return false;
        if (r.startsWith('/_')) return false;
        return true;
      });
      return Array.from(new Set(filtered)).sort();
    }
  } catch (err) {
    // ignore and fall back to previous behavior
  }

  // Fallback: read lib/sitemapPaths.ts and locales nav (legacy behavior)
  const p = path.join(process.cwd(), 'lib', 'sitemapPaths.ts');
  if (fs.existsSync(p)) {
    const src = fs.readFileSync(p, 'utf8');
    const m = src.match(/export const PATHS\s*=\s*\[(([\s\S]*?)\];)/m);
    if (m) {
      const arrSrc = m[0].replace(/export const PATHS\s*=\s*/m, '');
      const items = [];
      const re = /'([^']+)'/g;
      let it;
      while ((it = re.exec(arrSrc)) !== null) items.push(it[1]);
      return items;
    }
  }

  try {
    const navPath = path.join(process.cwd(), 'locales', 'en', 'nav.json');
    const navRaw = fs.readFileSync(navPath, 'utf8');
    const nav = JSON.parse(navRaw);
    const navRoot = nav && nav.nav ? nav.nav : (nav && nav.default && nav.default.nav) || {};
    const set = new Set(['/']);
    const staticExtras = ['/privacy-policy', '/terms-of-service'];
    for (const s of staticExtras) set.add(s);
    for (const key of Object.keys(navRoot)) {
      if (key === 'home') continue;
      const topPath = `/${key}`;
      set.add(topPath);
      const item = navRoot[key];
      if (item && typeof item === 'object') {
        const children = item.nav || item['nav'];
        if (children && typeof children === 'object') {
          for (const childKey of Object.keys(children)) set.add(`${topPath}/${childKey}`);
        }
      }
    }
    return Array.from(set).sort();
  } catch (err) {
    throw new Error('PATHS not found in lib/sitemapPaths.ts and fallback failed');
  }
}

function buildSitemap(paths) {
  const hostname = SITE_URL.replace(/\/$/, '');
  const lastmod = new Date().toISOString();
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  for (const p of paths) {
    if (EXCLUDES.has(p)) continue;
    xml += '  <url>\n';
    const loc = `${hostname}${p === '/' ? '' : p}`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    for (const l of LOCALES) {
      const href = l === 'en' ? `${hostname}${p === '/' ? '' : p}` : `${hostname}${p === '/' ? '' : p}?lang=${l}`;
      xml += `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>\n`;
    }
    xml += '  </url>\n';
  }
  xml += '</urlset>\n';
  return xml;
}

function writeSitemap(xml) {
  const out = path.join(process.cwd(), 'out', 'sitemap.xml');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, xml, 'utf8');
  console.log('Wrote', out);
}

try {
  const paths = readPaths();
  const xml = buildSitemap(paths);
  writeSitemap(xml);
} catch (err) {
  console.error(err);
  process.exit(1);
}
