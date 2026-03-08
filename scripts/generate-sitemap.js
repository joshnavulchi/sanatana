#!/usr/bin/env node
/**
 * generate-sitemap.js
 *
 * Build-time sitemap.xml generator that discovers routes directly from the
 * `app/` directory tree.  Static pages produce a single URL; dynamic `[slug]`
 * / `[chapter]` segments are expanded by reading `VALID_SLUGS`,
 * `VEDA_CHAPTERS` or `generateStaticParams` from the page source.
 *
 * No external config (sitemapInclude.json, nav.json) is needed – the app/
 * directory is the single source of truth.
 *
 * Usage:  node scripts/generate-sitemap.js          (run from repo root)
 *
 * The script writes sitemap.xml to both `out/` and `public/`.
 */
const fs = require('fs');
const path = require('path');

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in').replace(/\/$/, '');

// ── Locales ────────────────────────────────────────────────────────
function loadLocales() {
  try {
    const listPath = path.join(process.cwd(), 'lib', 'localesList.json');
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
    const p = path.join(process.cwd(), 'lib', 'sitemapExclude.json');
    if (fs.existsSync(p)) {
      const arr = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch (_) { /* ignore */ }
  return new Set();
}
const EXCLUDES = loadExcludes();

// ── Helpers ────────────────────────────────────────────────────────

/**
 * Extract a JS array literal from page source code.
 * Handles `const VALID_SLUGS = ['a','b'];` and `VEDA_CHAPTERS` object arrays.
 * Correctly skips type annotations like `: { ... }[] =` before the value.
 */
function extractArrayLiteral(source, varName) {
  // Match the variable declaration up to and including the `= [`
  const re = new RegExp(`(?:const|let|var)\\s+${varName}\\b[^=]*=\\s*\\[`, 'm');
  const m = re.exec(source);
  if (!m) return null;

  // The `[` we care about is the LAST `[` in the match (after the `=`)
  const matchEnd = m.index + m[0].length;
  let start = matchEnd - 1; // points to the `[` at the end of the match

  let depth = 1; // we already consumed the opening `[`
  let end = start;
  for (let i = matchEnd; i < source.length; i++) {
    if (source[i] === '[') depth++;
    if (source[i] === ']') depth--;
    if (depth === 0) { end = i; break; }
  }
  return source.substring(start, end + 1);
}

/**
 * Parse simple string arrays like `['a','b','c']`.
 */
function parseStringArray(raw) {
  const items = [];
  const re = /['"`]([^'"`]+)['"`]/g;
  let m;
  while ((m = re.exec(raw)) !== null) items.push(m[1]);
  return items;
}

/**
 * Parse VEDA_CHAPTERS-style object arrays and return static params.
 * Each entry like { slug:'rigveda', prefix:'mandala', count:10 }
 * produces params [{slug:'rigveda', chapter:'mandala-1'}, …].
 */
function parseVedaChapters(raw) {
  const params = [];
  const objRe = /\{([^}]+)\}/g;
  let om;
  while ((om = objRe.exec(raw)) !== null) {
    const body = om[1];
    // Skip commented-out entries
    const before = raw.substring(0, om.index);
    const lastNewline = before.lastIndexOf('\n');
    const lineStart = before.substring(lastNewline + 1).trim();
    if (lineStart.startsWith('*') || lineStart.startsWith('//') || lineStart.startsWith('/*')) continue;

    const slugM = body.match(/slug\s*:\s*['"`]([^'"`]+)['"`]/);
    const prefixM = body.match(/prefix\s*:\s*['"`]([^'"`]+)['"`]/);
    const countM = body.match(/count\s*:\s*(\d+)/);
    if (slugM && prefixM && countM) {
      const slug = slugM[1];
      const prefix = prefixM[1];
      const count = parseInt(countM[1], 10);
      for (let i = 1; i <= count; i++) {
        params.push({ slug, chapter: `${prefix}-${i}` });
      }
    }
  }
  return params;
}

// ── Route Discovery ────────────────────────────────────────────────

/**
 * Recursively walk the `app/` directory and collect every `page.tsx` / `page.ts`.
 */
function findPages(dir, results) {
  results = results || [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      // Skip private/internal folders
      if (/^[_.]|^api$|^components$|^context$|^hooks$/.test(ent.name)) continue;
      findPages(full, results);
    } else if (ent.name === 'page.tsx' || ent.name === 'page.ts') {
      results.push(full);
    }
  }
  return results;
}

/**
 * Convert an `app/`-relative page path to a URL route pattern.
 * e.g. `app/philosophy/karma/page.tsx` → `/philosophy/karma`
 *      `app/vedas/[slug]/page.tsx`      → `/vedas/[slug]`
 */
function pageToRoute(pagePath, appDir) {
  let rel = path.relative(appDir, path.dirname(pagePath)).replace(/\\/g, '/');
  if (rel === '.' || rel === '') return '/';
  return '/' + rel;
}

/**
 * Expand a route pattern into concrete URLs.
 * Static routes (no `[` segments) map 1:1.
 * Dynamic segments are resolved by reading the page source.
 */
function expandRoute(routePattern, pagePath) {
  if (!routePattern.includes('[')) {
    return [routePattern];
  }

  const source = fs.readFileSync(pagePath, 'utf8');
  const segments = routePattern.split('/').filter(Boolean);
  const dynamicNames = segments
    .filter((s) => s.startsWith('[') && s.endsWith(']'))
    .map((s) => s.slice(1, -1));

  // ── Two-level dynamic: e.g. /vedas/[slug]/[chapter] ──
  if (dynamicNames.length === 2) {
    const vedaRaw = extractArrayLiteral(source, 'VEDA_CHAPTERS');
    if (vedaRaw) {
      const params = parseVedaChapters(vedaRaw);
      return params.map((p) => {
        let r = routePattern;
        r = r.replace(`[${dynamicNames[0]}]`, p[dynamicNames[0]] || p.slug);
        r = r.replace(`[${dynamicNames[1]}]`, p[dynamicNames[1]] || p.chapter);
        return r;
      });
    }
    return resolveFromGenerateStaticParams(source, routePattern, dynamicNames);
  }

  // ── Single-level dynamic: e.g. /puranas/[slug] ──
  const slugVarRaw = extractArrayLiteral(source, 'VALID_SLUGS');
  if (slugVarRaw) {
    const slugs = parseStringArray(slugVarRaw);
    return slugs.map((s) => routePattern.replace(`[${dynamicNames[0]}]`, s));
  }

  return resolveFromGenerateStaticParams(source, routePattern, dynamicNames);
}

/**
 * Last-resort: extract params from `generateStaticParams` body.
 */
function resolveFromGenerateStaticParams(source, routePattern, dynamicNames) {
  const fnMatch = source.match(/generateStaticParams[^{]*\{([\s\S]*?)\n\}/);
  if (!fnMatch) return [];

  const body = fnMatch[1];
  const mapMatch = body.match(/return\s+(\w+)\.map/);
  if (mapMatch) {
    const varName = mapMatch[1];
    const raw = extractArrayLiteral(source, varName);
    if (raw) {
      const items = parseStringArray(raw);
      return items.map((s) => routePattern.replace(`[${dynamicNames[0]}]`, s));
    }
  }
  return [];
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
    if (p !== '/' && !loc.endsWith('/')) loc += '/';

    xml += '  <url>\n';
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;

    for (const l of LOCALES) {
      let href = l === 'en'
        ? `${SITE_URL}${p === '/' ? '' : p}`
        : `${SITE_URL}${p === '/' ? '' : p}?lang=${l}`;
      if (p !== '/' && !href.endsWith('/') && !href.includes('?')) href += '/';
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
  console.log('Wrote', filePath);
}

// ── Main ───────────────────────────────────────────────────────────

try {
  const appDir = path.join(process.cwd(), 'app');
  const pages = findPages(appDir);
  const routeSet = new Set();

  for (const pagePath of pages) {
    const pattern = pageToRoute(pagePath, appDir);
    const expanded = expandRoute(pattern, pagePath);
    for (const r of expanded) routeSet.add(r);
  }

  const paths = Array.from(routeSet).sort();
  console.log(`Discovered ${paths.length} routes from app/ pages:`);
  for (const p of paths) console.log('  ', p);

  const xml = buildSitemap(paths);
  writeTo(path.join(process.cwd(), 'out', 'sitemap.xml'), xml);
  // Also update public/ so next dev and deployments serve the latest
  try {
    writeTo(path.join(process.cwd(), 'public', 'sitemap.xml'), xml);
  } catch (_) { /* non-fatal */ }
} catch (err) {
  console.error('generate-sitemap error:', err);
  process.exit(1);
}
