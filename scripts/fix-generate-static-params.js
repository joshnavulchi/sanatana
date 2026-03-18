#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Small deterministic lists mirrored from app utilities (keep in sync)
const MAHABHARATA_PARVAS = ['adi-parva','sabha-parva','vana-parva','virata-parva','udyoga-parva','bhishma-parva','drona-parva','karna-parva','shalya-parva','sauptika-parva','stri-parva','shanti-parva','anushasana-parva','ashvamedhika-parva','ashramavasika-parva','mousala-parva','mahaprasthanika-parva','svargarohana-parva'];
const RAMAYANA_KANDAS = ['bala-kanda','ayodhya-kanda','aranya-kanda','kishkinda-kanda','sundara-kanda','yuddha-kanda','uttara-kanda'];
const MAHAPURANA_SLUGS = ['brahma','padma','vishnu','shiva','bhagavata','narada','markandeya','agni','bhavishya','brahmavaivarta','linga','varaha','skanda','vamana','kurma','matsya','garuda','brahmanda'];
const PHILOSOPHY_TOPICS = ['advaita','samkhya','yoga','nyaya','vaisheshika','mimamsa'];

function insertBeforeMetadata(content, insertCode) {
  const marker = /export\s+async\s+function\s+generateMetadata\s*\(/;
  const m = content.match(marker);
  if (m && m.index !== undefined) {
    const idx = m.index;
    return content.slice(0, idx) + insertCode + '\n\n' + content.slice(idx);
  }
  // fallback: append at end
  return content + '\n\n' + insertCode;
}

function ensureExportedDynamicParams(content) {
  if (/export\s+const\s+dynamicParams\s*=/.test(content)) return content;
  return 'export const dynamicParams = false;\n\n' + content;
}

function makeParamsForFile(fp) {
  const rel = fp.replace(/\\/g,'/');
  if (rel.includes('/itihasa/mahabharata/') && rel.includes('[parva]') && rel.includes('[...')) {
    return `export function generateStaticParams() { return ${JSON.stringify(MAHABHARATA_PARVAS.map(p=>({parva:p, parts:['chapter-1']})),null,2)} }`;
  }
  if (rel.includes('/itihasa/ramayana/') && rel.includes('[slug]') && rel.includes('[...')) {
    return `export function generateStaticParams() { return ${JSON.stringify(RAMAYANA_KANDAS.map(s=>({slug:s, parts:['sarga-1']})),null,2)} }`;
  }
  if (rel.includes('/puranas/') && rel.includes('[slug]') && rel.includes('[...')) {
    return `export function generateStaticParams() { return ${JSON.stringify(MAHAPURANA_SLUGS.map(s=>({slug:s, parts:['chapter-1']})),null,2)} }`;
  }
  if (rel.includes('/vedas/') && rel.includes('[slug]') && rel.includes('[chapter]') && rel.includes('[item]')) {
    return `export function generateStaticParams() { return [ { slug: 'rigveda', chapter: 'mandala-1', item: 'sukta-1' },{ slug: 'yajurveda', chapter: 'chapter-1', item: 'mantra-1' },{ slug: 'samaveda', chapter: 'hymn-1', item: 'verse-1' },{ slug: 'atharvaveda', chapter: 'book-1', item: 'hymn-1' } ] }`;
  }
  if (rel.includes('/vedic-philosophy/') && rel.includes('[slug]') && rel.includes('[...')) {
    return `export function generateStaticParams() { return ${JSON.stringify(PHILOSOPHY_TOPICS.map(s=>({slug:s, parts:['overview']})),null,2)} }`;
  }
  // default: no insert
  return null;
}

function patchFile(fp) {
  const content = fs.readFileSync(fp, 'utf8');
  if (/export\s+function\s+generateStaticParams\s*\(/.test(content)) return false;
  const code = makeParamsForFile(fp);
  if (!code) return false;
  let next = ensureExportedDynamicParams(content);
  next = insertBeforeMetadata(next, code);
  fs.writeFileSync(fp, next, 'utf8');
  return true;
}

const files = glob.sync('app/**/page.tsx');
let patched = 0;
for (const fp of files) {
  if (!fp.includes('[')) continue; // not a dynamic route
  try {
    const ok = patchFile(fp);
    if (ok) {
      console.log('Patched', fp);
      patched++;
    }
  } catch (e) {
    console.error('Failed to patch', fp, e.message);
  }
}

console.log('Patched files:', patched);
