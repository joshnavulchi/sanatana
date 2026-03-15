#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in').replace(/\/$/, '');

function findHtmlFiles(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findHtmlFiles(fullPath, results);
    } else if (entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

function htmlFileToRoute(htmlPath, outDir) {
  const rel = path.relative(outDir, htmlPath).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.startsWith('_next/')) return null;
  if (rel.endsWith('/index.html')) {
    const route = '/' + rel.slice(0, -'/index.html'.length);
    return route || '/';
  }
  if (rel.endsWith('.html')) {
    return '/' + rel;
  }
  return null;
}

function toPublicUrl(route) {
  if (route === '/') return `${SITE_URL}/`;
  const hasFileExtension = /\.[a-z0-9]+$/i.test(route);
  if (hasFileExtension) return `${SITE_URL}${route}`;
  return `${SITE_URL}${route.endsWith('/') ? route : `${route}/`}`;
}

function readTextSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (_) {
    return '';
  }
}

function extractOne(html, regex) {
  const m = html.match(regex);
  return m ? m[1] : null;
}

function extractSchemaTypes(html) {
  const matches = [...html.matchAll(/"@type"\s*:\s*"([^"]+)"/gi)];
  return Array.from(new Set(matches.map((m) => m[1])));
}

function main() {
  const outDir = path.join(REPO_ROOT, 'out');
  if (!fs.existsSync(outDir)) {
    throw new Error('Missing out/ directory. Run npm run build before generating post-deploy audit.');
  }

  const htmlFiles = findHtmlFiles(outDir);
  if (htmlFiles.length === 0) {
    throw new Error('No built HTML files found under out/.');
  }

  const pageAudits = [];

  for (const htmlFile of htmlFiles) {
    const route = htmlFileToRoute(htmlFile, outDir);
    if (!route) continue;

    const html = readTextSafe(htmlFile);
    const canonical = extractOne(html, /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
    const robotsMeta = extractOne(html, /<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i);
    const googlebotMeta = extractOne(html, /<meta[^>]*name=["']googlebot["'][^>]*content=["']([^"']+)["']/i);
    const jsonLdScriptCount = (html.match(/application\/ld\+json/gi) || []).length;
    const schemaTypesFound = extractSchemaTypes(html);
    const richResultEligibleTypes = new Set([
      'Article', 'BlogPosting', 'NewsArticle', 'BreadcrumbList',
      'FAQPage', 'HowTo', 'Product', 'Recipe', 'Event', 'VideoObject'
    ]);
    const richResultTypesFound = schemaTypesFound.filter((t) => richResultEligibleTypes.has(t));

    const robotsTokens = `${robotsMeta || ''} ${googlebotMeta || ''}`.toLowerCase();
    const hasNoindex = robotsTokens.includes('noindex');

    pageAudits.push({
      route,
      url: toPublicUrl(route),
      sourceHtml: path.relative(REPO_ROOT, htmlFile).replace(/\\/g, '/'),
      statusCode: 200,
      canonical,
      expectedCanonical: toPublicUrl(route),
      canonicalMatchesExpected: canonical === toPublicUrl(route),
      robotsMeta,
      googlebotMeta,
      hasNoindex,
      jsonLdScriptCount,
      schemaTypesFound,
      richResultTypesFound,
      hasGoogleRichResultCandidate: richResultTypesFound.length > 0
    });
  }

  const robotsTxtPath = path.join(outDir, 'robots.txt');
  const robotsTxtContent = readTextSafe(robotsTxtPath);
  const sitemapPath = path.join(outDir, 'sitemap.xml');
  const sitemapContent = readTextSafe(sitemapPath);

  const report = {
    auditedAtUtc: new Date().toISOString(),
    source: 'build-artifacts',
    baseUrl: SITE_URL,
    buildSourceFolder: fs.existsSync(outDir) ? 'out' : 'unknown',
    totals: {
      pagesAudited: pageAudits.length,
      noindexPages: pageAudits.filter((p) => p.hasNoindex).length,
      pagesMissingCanonical: pageAudits.filter((p) => !p.canonical).length,
      pagesWithJsonLd: pageAudits.filter((p) => p.jsonLdScriptCount > 0).length,
      pagesWithRichResultCandidates: pageAudits.filter((p) => p.hasGoogleRichResultCandidate).length,
    },
    pages: pageAudits,
    robotsTxt: {
      exists: fs.existsSync(robotsTxtPath),
      hasSitemapDirective: /Sitemap:\s*https?:\/\//i.test(robotsTxtContent),
      preview: robotsTxtContent.split(/\r?\n/).slice(0, 10)
    },
    sitemap: {
      exists: fs.existsSync(sitemapPath),
      urlCountApprox: (sitemapContent.match(/<url>/g) || []).length,
      has404Html: /<loc>.*\/404\.html<\/loc>/i.test(sitemapContent),
      hasNotFoundRoute: /<loc>.*\/_not-found\/?<\/loc>/i.test(sitemapContent)
    },
    recrawlTriggerPlan: {
      enabled: true,
      actions: [
        'Submit sitemap.xml in Google Search Console after deploy.',
        'Request indexing for homepage and top changed URLs via URL Inspection.',
        'Link changed pages from at least one high-authority internal page.',
        'Re-check pages that remain in Crawled - currently not indexed after 48-72h.'
      ]
    },
    dailyCoverageMonitoring: {
      enabled: true,
      checks: [
        'Page indexing: Indexed vs Crawled - currently not indexed vs Discovered - currently not indexed.',
        'Enhancements: monitor structured data and rich result issue trends.',
        'Sitemaps: verify discovered URLs count and last read status.',
        'Sample 10 pages/day: validate canonical, robots, and JSON-LD presence.'
      ]
    }
  };

  const json = `${JSON.stringify(report, null, 2)}\n`;
  const outReportPath = path.join(outDir, 'post-deploy-audit.json');
  const publicReportPath = path.join(REPO_ROOT, 'public', 'post-deploy-audit.json');

  fs.writeFileSync(outReportPath, json, 'utf8');
  fs.mkdirSync(path.dirname(publicReportPath), { recursive: true });
  fs.writeFileSync(publicReportPath, json, 'utf8');

  console.log(`Wrote ${outReportPath}`);
  console.log(`Wrote ${publicReportPath}`);
  console.log(`Audited ${report.totals.pagesAudited} pages from build artifacts.`);
}

try {
  main();
} catch (error) {
  console.error('generate-post-deploy-audit error:', error instanceof Error ? error.message : error);
  process.exit(1);
}
