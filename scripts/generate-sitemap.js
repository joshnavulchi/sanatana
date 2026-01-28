#!/usr/bin/env node
/**
 * generate-sitemap.js
 * Purpose: Build a sitemap.xml for the site using `lib/sitemapPaths.ts`.
 * Usage: node scripts/generate-sitemap.js  (expects to be run from repo root)
 */
const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in';
// If invoked with --fresh, skip using .next prerender manifest and always
// compute paths from source (sitemapPaths.ts / nav) or includes.
const FRESH = process.argv.includes('--fresh');
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

// Optional: allow explicitly selecting which paths to include via lib/sitemapInclude.json
function loadIncludes() {
  try {
    const p = path.join(process.cwd(), 'lib', 'sitemapInclude.json');
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf8');
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        // normalize to leading-slash paths
        const items = arr
          .map(s => (typeof s === 'string' ? (s.startsWith('/') ? s : `/${s}`) : null))
          .filter(Boolean);
        if (items.length > 0) {
          console.log('Loaded lib/sitemapInclude.json with', items.length, 'entries');
          return new Set(items);
        }
        return new Set();
      }
    }
  } catch (err) {
    console.error('Failed to parse lib/sitemapInclude.json:', err && err.message ? err.message : err);
  }
  return null;
}

const INCLUDES = loadIncludes();

const EXCLUDES = loadExcludes();

function readPaths() {
  // Compute auto-discovered paths from prerender manifest, sitemapPaths.ts,
  // or nav.json (legacy), and then optionally validate `lib/sitemapInclude.json`.
  let autoPaths = null;

  // Prefer Next's prerender manifest (routes actually built) when available.
  try {
    const manifestPath = path.join(process.cwd(), '.next', 'prerender-manifest.json');
    if (!FRESH && fs.existsSync(manifestPath)) {
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
        // Expand dynamic routes like [id] or [chapter]
        const expanded = [];
        for (const r of Array.from(new Set(filtered)).sort()) {
          if (r.includes('[')) {
            // handle illustrated stories: /kidszone/illustratedstories/[id]
            if (/kidszone\/illustratedstories\/\[id\]/.test(r) || /kidszone\/illustratedstories\/\[id\]\/page/.test(r)) {
              try {
                const file = path.join(process.cwd(), 'locales', 'en', 'illustrated_stories.json');
                if (fs.existsSync(file)) {
                  const raw = fs.readFileSync(file, 'utf8');
                  const doc = JSON.parse(raw);
                  const stories = doc && (doc.illustrated_stories || doc.illustratedstories) && (doc.illustrated_stories.kids_indian_stories || doc.illustratedstories.kids_indian_stories) ? (doc.illustrated_stories?.kids_indian_stories || doc.illustratedstories?.kids_indian_stories) : [];
                  if (Array.isArray(stories) && stories.length > 0) {
                    for (const s of stories) {
                      if (s && (s.id || s.chapter || s.slug)) {
                        const id = s.id || s.chapter || s.slug;
                        expanded.push(`/kidszone/illustratedstories/${id}`);
                      }
                    }
                    continue;
                  }
                }
              } catch (e) { }
              // fallback: skip if no data
              continue;
            }

            // handle scriptures chapter dynamic routes: /scriptures/:book/chapter/[chapter]
            const chapMatch = r.match(/^\/scriptures\/([^\/]+)\/chapter\/\[chapter\]/);
            if (chapMatch) {
              const book = chapMatch[1];
              // attempt to find a matching locale scriptures file in locales/en
              try {
                const localeDir = path.join(process.cwd(), 'locales', 'en');
                const files = fs.readdirSync(localeDir);
                // find file that contains the book name
                const candidate = files.find(f => f.toLowerCase().includes(book.replace(/[^a-z0-9]/gi, '').toLowerCase()));
                if (candidate) {
                  const filePath = path.join(localeDir, candidate);
                  const raw = fs.readFileSync(filePath, 'utf8');
                  const doc = JSON.parse(raw);
                  // find chapters array inside doc
                  const chaptersKey = Object.keys(doc).find(k => k.toLowerCase().includes('chap') || k.toLowerCase().includes('chapter'));
                  let chapters = [];
                  if (chaptersKey && Array.isArray(doc[chaptersKey].chapters)) {
                    chapters = doc[chaptersKey].chapters;
                  } else if (Array.isArray(doc[`${book}_scriptures`]?.chapters)) {
                    chapters = doc[`${book}_scriptures`].chapters;
                  } else if (Array.isArray(doc.chapters)) {
                    chapters = doc.chapters;
                  }
                  if (Array.isArray(chapters) && chapters.length > 0) {
                    for (const c of chapters) {
                      const num = c && (c.chapter || c.chapter_number || c.chapterNo || c.number) ? (c.chapter || c.chapter_number || c.chapterNo || c.number) : (typeof c === 'number' ? c : null);
                      if (num !== null) expanded.push(`/scriptures/${book}/chapter/${num}`);
                    }
                    continue;
                  }
                }
              } catch (e) { }
              // Fallback: add a reasonable default range
              const fallbackCount = /bhagavathgeeta|bhagavadgita/.test(book) ? 18 : 12;
              for (let i = 1; i <= fallbackCount; i++) expanded.push(`/scriptures/${book}/chapter/${i}`);
              continue;
            }

            // unknown dynamic route: skip
            continue;
          }
          expanded.push(r);
        }
        autoPaths = expanded;
    }
  } catch (err) {
    // ignore and fall back to previous behavior
  }

  // Fallback: read lib/sitemapPaths.ts and locales nav (legacy behavior)
  if (!autoPaths) {
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
        autoPaths = items;
      }
    }
  }

  if (!autoPaths) {
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
      autoPaths = Array.from(set).sort();
    } catch (err) {
      throw new Error('PATHS not found in lib/sitemapPaths.ts and fallback failed');
    }
  }

  // If a sitemapInclude.json exists, validate includes against autoPaths and warn
  if (INCLUDES && INCLUDES.size > 0) {
    const autoSet = new Set(autoPaths);
    const includesArr = Array.from(INCLUDES).sort();
    const missing = includesArr.filter(p => !autoSet.has(p));
    if (missing.length > 0) {
      console.warn('Warning: the following paths in lib/sitemapInclude.json were not found in auto-discovered paths:');
      for (const m of missing) console.warn('  -', m);
      console.warn('They will still be included in the sitemap, but double-check these paths are correct.');
    }
    return includesArr;
  }

  return autoPaths;
}

function buildSitemap(paths) {
  const hostname = SITE_URL.replace(/\/$/, '');
  const lastmod = new Date().toISOString();
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  for (const p of paths) {
    if (EXCLUDES.has(p)) continue;
    xml += '  <url>\n';
    let loc = `${hostname}${p === '/' ? '' : p}`;
    // Ensure trailing slash for non-root paths to match exported site routing
    if (p !== '/' && !loc.endsWith('/')) loc = `${loc}/`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    for (const l of LOCALES) {
      let href = l === 'en' ? `${hostname}${p === '/' ? '' : p}` : `${hostname}${p === '/' ? '' : p}?lang=${l}`;
      if (p !== '/' && !href.endsWith('/')) href = `${href}/`;
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

function writePublicSitemap(xml) {
  const pub = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.mkdirSync(path.dirname(pub), { recursive: true });
  fs.writeFileSync(pub, xml, 'utf8');
  console.log('Wrote', pub);
}

try {
  const paths = readPaths();
  const xml = buildSitemap(paths);
  writeSitemap(xml);
  // Also update public sitemap so deployments serve the latest file
  try {
    writePublicSitemap(xml);
  } catch (e) {
    // non-fatal
  }
} catch (err) {
  console.error(err);
  process.exit(1);
}
