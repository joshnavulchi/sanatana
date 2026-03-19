#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Small deterministic lists mirrored from app utilities (keep in sync)
// New: scan locale JSONs for full param lists
const GENERATED_PARAMS_DIR = path.join(__dirname, '../app/generated-params');
if (!fs.existsSync(GENERATED_PARAMS_DIR)) fs.mkdirSync(GENERATED_PARAMS_DIR);

function extractIdsFromJson(file, keyPath) {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    let arr = keyPath.reduce((obj, k) => (obj && obj[k] ? obj[k] : null), data);
    if (!Array.isArray(arr)) return [];
    return arr.map(item => item.id ? String(item.id) : null).filter(Boolean);
  } catch { return []; }
}

function writeParamsModule(name, arr, mapFn) {
  const outPath = path.join(GENERATED_PARAMS_DIR, `${name}.ts`);
  let outArr = arr || [];
  if (typeof mapFn === 'function') outArr = outArr.map(mapFn);
  const code = `export const params = ${JSON.stringify(outArr, null, 2)};\n`;
  fs.writeFileSync(outPath, code, 'utf8');
}

// Example: illustratedstories
const illustratedStoriesFile = path.join(__dirname, '../public/data/locales/en/explore/kidszone/illustratedstories.json');
const illustratedIds = extractIdsFromJson(illustratedStoriesFile, ['kidszone_illustratedstories', 'kids_indian_stories']);
writeParamsModule('illustratedstories', illustratedIds, id => ({ id }));

// If post-deploy-audit exists, use it to enumerate all generated routes.
const auditFile = path.join(__dirname, '../public/data/post-deploy-audit.json');
let auditRoutes = [];
if (fs.existsSync(auditFile)) {
  try {
    const audit = JSON.parse(fs.readFileSync(auditFile, 'utf8'));
    if (Array.isArray(audit)) auditRoutes = audit.map((e) => e.route).filter(Boolean);
    else if (Array.isArray(audit.routes)) auditRoutes = audit.routes.map((e) => e.route).filter(Boolean);
    else if (Array.isArray(audit.pages)) auditRoutes = audit.pages.map((e) => e.route).filter(Boolean);
  } catch (e) {
    // ignore
  }
}

const modules = Object.create(null);

function addModuleParam(moduleName, paramObj) {
  modules[moduleName] = modules[moduleName] || new Map();
  const key = JSON.stringify(paramObj);
  modules[moduleName].set(key, paramObj);
}

// Helper: collect from route list using regex patterns
for (const r of auditRoutes) {
  if (!r || typeof r !== 'string') continue;
  // illustratedstories
  let m = r.match(/^\/explore\/illustratedstories\/([^/]+)\/?$/);
  if (m) { addModuleParam('illustratedstories', { id: String(m[1]) }); continue; }

  // bhagavadgita
  m = r.match(/^\/itihasa\/bhagavadgita\/([^/]+)\/?$/);
  if (m) { addModuleParam('itihasa-bhagavadgita', { slug: m[1] }); continue; }

  // mahabharata parva and nested parts
  m = r.match(/^\/itihasa\/mahabharata\/([^/]+)\/?$/);
  if (m) { addModuleParam('mahabharata-parvas', { parva: m[1] }); continue; }
  m = r.match(/^\/itihasa\/mahabharata\/([^/]+)\/(.+)$/);
  if (m) { addModuleParam('mahabharata-parva-parts', { parva: m[1], parts: m[2].split('/') }); continue; }

  // ramayana
  m = r.match(/^\/itihasa\/ramayana\/([^/]+)\/?$/);
  if (m) { addModuleParam('itihasa-ramayana', { slug: m[1] }); continue; }
  m = r.match(/^\/itihasa\/ramayana\/([^/]+)\/(.+)$/);
  if (m) { addModuleParam('itihasa-ramayana-parts', { slug: m[1], parts: m[2].split('/') }); continue; }

  // puranas
  m = r.match(/^\/puranas\/([^/]+)\/?$/);
  if (m) { addModuleParam('puranas-slugs', { slug: m[1] }); continue; }
  m = r.match(/^\/puranas\/([^/]+)\/(.+)$/);
  if (m) { addModuleParam('puranas-slugs-parts', { slug: m[1], parts: m[2].split('/') }); continue; }

  // upanishads
  m = r.match(/^\/upanishads\/([^/]+)\/?$/);
  if (m) { addModuleParam('upanishads', { slug: m[1] }); continue; }

  // vedas - slug, chapter, item
  m = r.match(/^\/vedas\/([^/]+)\/?$/);
  if (m) { addModuleParam('vedas-slugs', { slug: m[1] }); continue; }
  m = r.match(/^\/vedas\/([^/]+)\/([^/]+)\/?$/);
  if (m) { addModuleParam('vedas-chapters', { slug: m[1], chapter: m[2] }); continue; }
  m = r.match(/^\/vedas\/([^/]+)\/([^/]+)\/([^/]+)\/?$/);
  if (m) { addModuleParam('vedas-items', { slug: m[1], chapter: m[2], item: m[3] }); continue; }

  // vedic-philosophy
  m = r.match(/^\/vedic-philosophy\/([^/]+)\/?$/);
  if (m) { addModuleParam('vedic-philosophy-slugs', { slug: m[1] }); continue; }
  m = r.match(/^\/vedic-philosophy\/([^/]+)\/(.+)$/);
  if (m) { addModuleParam('vedic-philosophy-parts', { slug: m[1], parts: m[2].split('/') }); continue; }
}

// Write modules
for (const [name, map] of Object.entries(modules)) {
  const arr = Array.from(map.values());
  writeParamsModule(name, arr);
  console.log('Wrote params module:', name, arr.length);
}

// Patch dynamic route files to import and use generated param modules
// NOTE: Non-destructive: only add import and generateStaticParams if they're missing.
function patchFileWithImport(fp, paramModuleName) {
  if (!fs.existsSync(fp)) {
    console.warn('File not found to patch:', fp);
    return false;
  }
  let content = fs.readFileSync(fp, 'utf8');
  // If file already imports the generated module and already has a generateStaticParams, skip patching
  const alreadyImports = /from\s+['"]@app\/generated-params\/${paramModuleName}['"]/m.test(content);
  const hasGenerate = /export\s+(?:async\s+)?function\s+generateStaticParams\b/m.test(content) || /export\s+function\s+generateStaticParams\b/m.test(content);
  if (alreadyImports && hasGenerate) return false;
  // Insert import and new generateStaticParams
  const importLine = `import { params as generatedParams } from '@app/generated-params/${paramModuleName}';`;
  const staticParamsLine = 'export function generateStaticParams() { return generatedParams; }';
  // Insert import after the last existing import, or at the top if none
  const importMatches = Array.from(content.matchAll(/^import\s.+$/gm));
  if (!alreadyImports) {
    if (importMatches.length) {
      const last = importMatches[importMatches.length - 1];
      const insertPos = last.index + last[0].length;
      content = content.slice(0, insertPos) + '\n' + importLine + content.slice(insertPos);
    } else {
      content = importLine + '\n' + content;
    }
  }
  // Place generateStaticParams before generateMetadata if present (only if missing)
  if (!hasGenerate) {
    if (/export\s+async\s+function\s+generateMetadata/.test(content)) {
      content = content.replace(/(export\s+async\s+function\s+generateMetadata)/, staticParamsLine + '\n\n$1');
    } else if (/export\s+function\s+generateMetadata/.test(content)) {
      content = content.replace(/(export\s+function\s+generateMetadata)/, staticParamsLine + '\n\n$1');
    } else {
      content = content + '\n\n' + staticParamsLine + '\n';
    }
  }
  fs.writeFileSync(fp, content, 'utf8');
  console.log('Patched', fp, '->', paramModuleName);
  return true;
}

if (!process.env.SKIP_PATCH) {
  // Patch known dynamic routes with generated modules
  const patchTargets = [
    { module: 'illustratedstories', path: path.join(__dirname, '../app/explore/illustratedstories/[id]/page.tsx') },
    { module: 'itihasa-bhagavadgita', path: path.join(__dirname, '../app/itihasa/bhagavadgita/[slug]/page.tsx') },
    { module: 'mahabharata-parvas', path: path.join(__dirname, '../app/itihasa/mahabharata/[parva]/page.tsx') },
    { module: 'mahabharata-parva-parts', path: path.join(__dirname, '../app/itihasa/mahabharata/[parva]/[...parts]/page.tsx') },
    { module: 'itihasa-ramayana', path: path.join(__dirname, '../app/itihasa/ramayana/[slug]/page.tsx') },
    { module: 'itihasa-ramayana-parts', path: path.join(__dirname, '../app/itihasa/ramayana/[slug]/[...parts]/page.tsx') },
    { module: 'puranas-slugs', path: path.join(__dirname, '../app/puranas/[slug]/page.tsx') },
    { module: 'puranas-slugs-parts', path: path.join(__dirname, '../app/puranas/[slug]/[...parts]/page.tsx') },
    { module: 'upanishads', path: path.join(__dirname, '../app/upanishads/[slug]/page.tsx') },
    { module: 'vedas-slugs', path: path.join(__dirname, '../app/vedas/[slug]/page.tsx') },
    { module: 'vedas-chapters', path: path.join(__dirname, '../app/vedas/[slug]/[chapter]/page.tsx') },
    { module: 'vedas-items', path: path.join(__dirname, '../app/vedas/[slug]/[chapter]/[item]/page.tsx') },
    { module: 'vedic-philosophy-slugs', path: path.join(__dirname, '../app/vedic-philosophy/[slug]/page.tsx') },
    { module: 'vedic-philosophy-parts', path: path.join(__dirname, '../app/vedic-philosophy/[slug]/[...parts]/page.tsx') },
  ];

  for (const t of patchTargets) patchFileWithImport(t.path, t.module);
  // Post-process to clean up any leftover orphaned fragments left by earlier replacements
  for (const t of patchTargets) repairPatchedFile(t.path, t.module);
} else {
  console.log('SKIP_PATCH=1 set; skipping file patching (only writing generated modules)');
}
// Post-process to clean up any leftover orphaned fragments left by earlier replacements
function repairPatchedFile(fp, paramModuleName) {
  if (!fs.existsSync(fp)) return;
  let content = fs.readFileSync(fp, 'utf8');
  // Remove orphaned 'return VALID_SLUGS' fragments up to the next export
  content = content.replace(/\n\s*return\s+VALID_SLUGS[\s\S]*?(?=\n\s*export\s+)/m, '\n');
  // Deduplicate the generateStaticParams export (keep one)
  const genExport = `export function generateStaticParams() { return generatedParams; }`;
  const genRegexGlobal = new RegExp(genExport.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1'), 'g');
  const matches = (content.match(genRegexGlobal) || []);
  if (matches.length > 1) {
    // keep first occurrence only
    let seen = false;
    content = content.replace(genRegexGlobal, (m) => { if (!seen) { seen = true; return m; } return ''; });
  }
  // Remove all existing import lines for this module then add a single import
  const importLine = `import { params as generatedParams } from '@app/generated-params/${paramModuleName}';`;
  const importLineRegex = new RegExp("^\\s*" + importLine.replace(/([.*+?^=!:${}()|[\\]\\\/\\\\])/g, '\\$1') + "\\s*$", 'gm');
  content = content.replace(importLineRegex, '');
  // Insert a single import after last import or at top
  const importMatches = Array.from(content.matchAll(/^import\s.+$/gm));
  if (importMatches.length) {
    const last = importMatches[importMatches.length - 1];
    const insertPos = last.index + last[0].length;
    content = content.slice(0, insertPos) + '\n' + importLine + content.slice(insertPos);
  } else {
    content = importLine + '\n' + content;
  }
  // Ensure single import exists (if missing, add it)
  if (!/from\s+['"]@app\/generated-params\/${paramModuleName}['"]/m.test(content)) {
    const importLine = `import { params as generatedParams } from '@app/generated-params/${paramModuleName}';`;
    const importMatches = Array.from(content.matchAll(/^import\s.+$/gm));
    if (importMatches.length) {
      const last = importMatches[importMatches.length - 1];
      const insertPos = last.index + last[0].length;
      content = content.slice(0, insertPos) + '\n' + importLine + content.slice(insertPos);
    } else {
      content = importLine + '\n' + content;
    }
  }
  fs.writeFileSync(fp, content, 'utf8');
}

console.log('Generated full param lists.');
