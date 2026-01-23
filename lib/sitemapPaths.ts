// Centralized sitemap path list used by XML and HTML sitemaps
// Centralized sitemap path list derived from locales/en/nav.json
// Keep in sync with navigation keys. Parent sections are included along
// with their child slugs (e.g. '/scriptures' and '/scriptures/ramayana').
// Build PATHS programmatically from the English navigation so the sitemap
// automatically follows the available pages. Keep a few static fallbacks.
function buildPaths() {
  const paths = new Set<string>();
  paths.add('/');

  // Static additions that may not be present in nav.json
  const staticExtras = ['/privacy-policy', '/terms-of-service'];
  for (const s of staticExtras) paths.add(s);

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    const path = require('path');
    const navPath = path.join(process.cwd(), 'public', 'locales', 'en', 'nav.json');
    const navContent = fs.readFileSync(navPath, 'utf8');
    const nav = JSON.parse(navContent);
    const navRoot = nav && nav.nav ? nav.nav : (nav && nav.default && nav.default.nav) || {};

    // Helper to add top-level and children
    for (const key of Object.keys(navRoot)) {
      if (key === 'home') continue; // home handled as '/'
      const topPath = `/${key}`;
      paths.add(topPath);
      const item = (navRoot as any)[key];
      if (item && typeof item === 'object') {
        const children = item.nav || item['nav'];
        if (children && typeof children === 'object') {
          for (const childKey of Object.keys(children)) {
            paths.add(`${topPath}/${childKey}`);
          }
        }
      }
    }
  } catch (e) {
    // if nav import fails, fall back to a small safe default
    paths.add('/contact');
    paths.add('/about');
    paths.add('/donate');
  }

  return Array.from(paths).sort();
}

export const PATHS = buildPaths();

export default PATHS;
