import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesPath = path.join(__dirname, '..', 'locales', 'en');

async function readJson(file) {
  const txt = await fs.readFile(file, 'utf8');
  return JSON.parse(txt);
}

// Merge defaults into existing, preferring existing values for conflicts.
function mergeDefaults(defaults, existing) {
  if (typeof defaults !== 'object' || defaults === null) return existing;
  if (typeof existing !== 'object' || existing === null) return defaults;
  const out = {};
  const keys = new Set([...Object.keys(defaults), ...Object.keys(existing)]);
  for (const key of keys) {
    const hasDef = key in defaults;
    const hasExist = key in existing;
    const defVal = defaults[key];
    const existVal = existing[key];
    if (hasExist && hasDef) {
      if (typeof defVal === 'object' && defVal !== null && typeof existVal === 'object' && existVal !== null && !Array.isArray(defVal) && !Array.isArray(existVal)) {
        out[key] = mergeDefaults(defVal, existVal);
      } else {
        out[key] = existVal;
      }
    } else if (hasExist) {
      out[key] = existVal;
    } else {
      out[key] = defVal;
    }
  }
  return out;
}

function absoluteSiteUrl(p) {
  if (!p) return p;
  if (/^https?:\/\//i.test(p)) return p;
  return `https://sanatanadharmam.in${p.startsWith('/') ? '' : '/'}${p}`;
}

async function main() {
  const apply = process.argv.includes('--apply');
  const files = await fs.readdir(localesPath);

  const contactFile = path.join(localesPath, 'contact.json');
  const contactJson = await readJson(contactFile).catch(() => null);
  const template = contactJson?.contact?.schema;
  if (!template) {
    console.error('Contact schema template not found in', contactFile);
    process.exit(1);
  }

  for (const f of files.filter(f => f.endsWith('.json'))) {
    if (f === 'contact.json') continue;
    const filePath = path.join(localesPath, f);
    const data = await readJson(filePath);
    const topKeys = Object.keys(data);
    if (topKeys.length === 0) continue;
    const topKey = topKeys[0];
    const page = data[topKey];
    if (!page || typeof page !== 'object') continue;

    const before = JSON.stringify(data, null, 2);

    // Build a page-specific schema from template
    // Build page-specific defaults from template (do not mutate template)
    const pageDefaults = JSON.parse(JSON.stringify(template));
    if (!pageDefaults.mainEntity) pageDefaults.mainEntity = {};
    if (page.title) pageDefaults.mainEntity.name = page.title;
    if (page.url) pageDefaults.mainEntity.url = page.url;
    const og = page.meta && page.meta.ogimage;
    if (og) pageDefaults.mainEntity.logo = absoluteSiteUrl(og);

    // Set a sensible default @type for the page schema.
    // Contact page should be ContactPage; detect article-like pages and use Article;
    // otherwise default to WebPage.
    const articlePattern = /(stories_|scriptures_|stotras|chapter|mahabharata|ramayana|gita|stories)/i;
    const isArticle = articlePattern.test(topKey) || (page.description && String(page.description).length > 80);
    let defaultType = 'WebPage';
    if (topKey === 'contact') defaultType = 'ContactPage';
    else if (isArticle) defaultType = 'Article';
    if (!pageDefaults['@type']) pageDefaults['@type'] = defaultType;

    // Determine merged schema value (existing page values take precedence)
    const schemaValue = (page.schema && typeof page.schema === 'object')
      ? mergeDefaults(pageDefaults, page.schema)
      : pageDefaults;

    // Rebuild the page object to ensure `schema` is placed immediately after `meta`.
    // If `meta` is present we insert `schema` right after it; otherwise append at end.
    const newPage = {};
    const hasMeta = Object.prototype.hasOwnProperty.call(page, 'meta');
    for (const k of Object.keys(page)) {
      if (k === 'schema') continue;
      newPage[k] = page[k];
      if (k === 'meta') {
        newPage['schema'] = schemaValue;
      }
    }
    if (!hasMeta) {
      newPage['schema'] = schemaValue;
    }
    data[topKey] = newPage;

    const after = JSON.stringify(data, null, 2);
    if (before !== after) {
      console.log(`${f}: would update schema`);
      if (apply) {
        await fs.writeFile(filePath, after + '\n', 'utf8');
        console.log(`  applied to ${f}`);
      }
    } else {
      console.log(`${f}: no changes`);
    }
  }

  console.log('Done. Use --apply to write changes.');
}

main().catch(err => { console.error(err); process.exit(1); });
