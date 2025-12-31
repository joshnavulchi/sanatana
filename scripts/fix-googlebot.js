const fs = require('fs').promises;
const path = require('path');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  let results = [];
  for (const e of entries) {
    const res = path.join(dir, e.name);
    if (e.isDirectory()) results = results.concat(await walk(res));
    else if (e.isFile() && res.endsWith('.html')) results.push(res);
  }
  return results;
}

// If a page explicitly contains <meta name="robots" content="noindex">, skip it.
function isNoIndex(html) {
  const robotsRe = /<meta\s+name=["']robots["']\s+content=["']([^"']*)["'][^>]*>/i;
  const m = html.match(robotsRe);
  if (!m) return false;
  return /noindex/i.test(m[1]);
}

async function ensureIndexingMeta(file) {
  let s = await fs.readFile(file, 'utf8');
  if (isNoIndex(s)) return false; // don't override explicit noindex

  const ensureMeta = (name) => {
    const metaRe = new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)["'][^>]*>`, 'i');
    if (metaRe.test(s)) {
      s = s.replace(metaRe, (m, g1) => {
        if (g1.toLowerCase().includes('index') && g1.toLowerCase().includes('follow')) return m;
        return `<meta name="${name}" content="index,follow"/>`;
      });
      return;
    }
    // insert after viewport/meta charset or <head>
    const viewportRe = /(<meta[^>]*name=["']viewport["'][^>]*>)/i;
    const charsetRe = /(<meta[^>]*charset[^>]*>)/i;
    if (viewportRe.test(s)) s = s.replace(viewportRe, `$1\n<meta name="${name}" content="index,follow"/>`);
    else if (charsetRe.test(s)) s = s.replace(charsetRe, `$1\n<meta name="${name}" content="index,follow"/>`);
    else s = s.replace(/(<head[^>]*>)/i, `$1\n<meta name="${name}" content="index,follow"/>`);
  };

  ensureMeta('googlebot');
  ensureMeta('bingbot');

  // also ensure generic robots if absent (but don't overwrite existing robots directives)
  const robotsRe = /<meta\s+name=["']robots["']\s+content=["']([^"']*)["'][^>]*>/i;
  if (!robotsRe.test(s)) {
    const insertAfter = /(<meta[^>]*name=["']google["']\s+content=["']notranslate["'][^>]*>)/i;
    if (insertAfter.test(s)) s = s.replace(insertAfter, `$1\n<meta name="robots" content="index,follow"/>`);
    else s = s.replace(/(<head[^>]*>)/i, `$1\n<meta name="robots" content="index,follow"/>`);
  }

  // Safety: ensure we did not remove <script> tags inserted by layout/templates.
  const scriptCountBefore = (await fs.readFile(file, 'utf8')).match(/<script\b/gi) || [];
  const scriptCountAfter = (s.match(/<script\b/gi) || []);
  if (scriptCountAfter.length < scriptCountBefore.length) {
    console.warn(`Skipping write for ${file} — script tag count decreased (${scriptCountBefore.length} -> ${scriptCountAfter.length}).`);
    return false;
  }

  await fs.writeFile(file, s, 'utf8');
  return true;
}

(async function main() {
  try {
    const root = path.resolve(process.cwd(), 'out');
    const files = await walk(root);
    console.log('Found HTML files:', files.length);
    let patched = 0;
    for (const f of files) {
      try {
        const changed = await ensureIndexingMeta(f);
        if (changed) patched++;
      } catch (err) {
        console.error('Error processing', f, err);
      }
    }
    console.log(`Patched ${patched} files (added/updated index/follow meta for Google and Bing).`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
