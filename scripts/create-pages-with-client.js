#!/usr/bin/env node
/*
  create-pages-with-client.js
  Purpose: Read each JSON file in `locales/en/` and for files that
  export a top-level page object (e.g. `{ "donate": { ... } }`),
  create a corresponding `app/<slug>/page.tsx` and
  `app/<slug>/<slug>client.tsx` if they do not already exist.

  The generated client component renders the English JSON keys
  dynamically (strings, arrays as lists, nested objects as sections).

  Usage: node scripts/create-pages-with-client.js
*/

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOCALES_EN = path.join(ROOT, 'locales');
const APP_DIR = path.join(ROOT, 'app');

function readJSON(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return null; }
}

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

function pascalCase(s) {
  return s.replace(/[-_ ]+/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function formatKey(k) {
  return k.replace(/[-_]/g, ' ');
}

function writeIfMissing(filePath, content) {
  if (fs.existsSync(filePath)) return false;
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

function clientTemplate(pageKey, compName, folderName) {
  return `"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import { useT } from '@app/hooks/useT';
import { parseMaybeObject } from '@lib/parseContent';
import { parseList } from '@lib/parseList';
import { getLocaleObject } from 'lib/i18n';
import FaqAccordion from '@components/faqaccordion/faqaccordion';
import Loader from '@components/loader';

function RenderNode({ node, nodeKey, showHeading }: { node: any; nodeKey?: string; showHeading?: boolean }) {
  if (node === null || node === undefined) return null;
  if (typeof node === 'string') return <p>{node}</p>;
  if (typeof node === 'number' || typeof node === 'boolean') return <p>{String(node)}</p>;
  if (Array.isArray(node)) return (
    <ul className="list-disc">
      {node.map((it, i) => <li key={i}><RenderNode node={it} /></li>)}
    </ul>
  );
  if (typeof node === 'object') {
    const heading = node.heading || node.title || ((showHeading || false) && nodeKey ? nodeKey : null);
    return (
      <div>
        {heading ? <div className="font-semibold mb-2">{heading}</div> : null}
        {Object.keys(node).map(k => {
          if (k === 'heading' || k === 'title' || k === 'id' || k === 'type') return null;
          const child = node[k];
          if (child === null || child === undefined) return null;
          // Always render the child's value only (no key labels)
          return (
            <div key={k} className="mb-4">
              <RenderNode node={child} />
            </div>
          );
        })}
      </div>
    );
  }
  return <div>{String(node)}</div>;
}

export default function ${compName}() {
  const { locale, isLoading } = useLocale();
  const t = useT();
  
  // Initialize state with current translation data to prevent empty renders on refresh
  const getInitialPage = () => {
    try {
      // Use getLocaleObject directly to read from cache synchronously
      const localeObj = getLocaleObject(locale) as any;
      if (!localeObj || Object.keys(localeObj).length === 0) return {};
      
      const keyPath = '${pageKey}'.split('.');
      let raw = localeObj;
      for (const k of keyPath) {
        raw = raw?.[k];
        if (!raw) break;
      }
      
      const obj = (raw && typeof raw === 'object') ? raw : (typeof raw === 'string' ? parseMaybeObject(raw) : {});
      const transform = (o) => {
        if (!o || typeof o !== 'object') return o;
        const out = { ...o };
        for (const k of Object.keys(out)) {
          if (['sections','list','items','columns'].includes(k)) {
            out[k] = parseList(out[k]);
          }
        }
        return out;
      };
      return transform(obj) || {};
    } catch (e) {
      return {};
    }
  };
  
  const [page, setPage] = useState<any>(getInitialPage);

  useEffect(() => {
    let mounted = true;
    (() => {
      if (!mounted) return;
      const raw = parseMaybeObject(t('${pageKey}'));
      const obj = (raw && typeof raw === 'object') ? raw : (typeof raw === 'string' ? parseMaybeObject(raw) : {});
      // Normalize common list-like fields so client renders like server
      try {
        const transform = (o) => {
          if (!o || typeof o !== 'object') return o;
          const out = { ...o };
          for (const k of Object.keys(out)) {
            if (['sections','list','items','columns'].includes(k)) {
              out[k] = parseList(out[k]);
            }
          }
          return out;
        };
        setPage(transform(obj) || {});
      } catch (e) {
        setPage(obj || {});
      }
    })();
    return () => { mounted = false; };
  }, [locale]);

  if (isLoading && !page.title) {
    return (
      <PageLayout metaKey="${pageKey}" title="" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: '${formatKey(folderName)}' }]} className="layout-md">
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey="${pageKey}" title={page.title} breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title || '${formatKey(folderName)}' }]} className="layout-md">
      {page.subtitle ? <p>{page.subtitle}</p> : null}
      {Object.keys(page).filter(k => !['title','subtitle','meta','schema','id','type', 'required', 'faq'].includes(k)).map((k) => (
        <div key={k} className="mb-6">
          <RenderNode nodeKey={k} node={page[k]} showHeading={false} />
        </div>
      ))}
      {page.faq && (
        <div className="mt-8">
          <FaqAccordion items={(Array.isArray(page.faq?.items) ? page.faq.items : (Array.isArray(page.faq) ? page.faq : []))} heading={(page.faq && page.faq.heading) ? page.faq.heading : ''} />
        </div>
      )}
    </PageLayout>
  );
}
`;
}

function pageTemplate(pageKey, clientFileName) {
  const clientImport = clientFileName.replace(/\.tsx$/, '');
  return `import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('${pageKey}');

import Client from './${clientImport}';

export default function Page() {
  return <Client />;
}
`;
}

const files = fs.readdirSync(LOCALES_EN);
const candidates = [];

for (const f of files) {
  if (!f.endsWith('.json')) continue;
  if (f === 'nav.json') continue;
  const full = path.join(LOCALES_EN, f);
  const json = readJSON(full);
  if (!json) continue;
  const topKeys = Object.keys(json || {});
  let pageKey = null;
  if (topKeys.length === 1) pageKey = topKeys[0];
  else {
    const base = path.basename(f, '.json');
    if (json[base]) pageKey = base;
    else {
      const norm = base.replace(/[_\- ]/g, '').toLowerCase();
      for (const k of topKeys) {
        if (k.replace(/[_\- ]/g, '').toLowerCase() === norm) { pageKey = k; break; }
      }
    }
  }
  if (!pageKey) continue;
  candidates.push({ pageKey, file: f });
}

if (candidates.length === 0) {
  console.log('No page-like locale entries found.');
  process.exit(0);
}

const readline = require('readline');
function ask(question) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, ans => { rl.close(); resolve(ans); });
  });
}

function normalizeChoice(s) {
  return s.trim();
}

function splitSegments(p) {
  return p.split('/').filter(Boolean);
}

function makeCompNameFromSegment(seg) {
  const clean = seg.replace(/[[\]]/g, '').replace(/[^a-zA-Z0-9]+/g, ' ');
  return pascalCase(clean) + 'Page';
}

function computeDepth(segments) {
  // depth relative to app/ (segments length)
  return segments.length;
}

function clientTemplateWithDepth(pageKey, compName, folderName, depth) {
  const ctxPrefix = '@/app/'.repeat(depth);
  const hooksPrefix = '@/app/'.repeat(depth);
  return clientTemplate(pageKey, compName, folderName)
    .replace("import { useLocale } from '@app/context/locale-context';", `import { useLocale } from '${ctxPrefix}context/locale-context';`)
    .replace("import { useT } from '@app/hooks/useT';", `import { useT } from '${hooksPrefix}hooks/useT';`)
    .replace("import FaqAccordion from '@components/faqaccordion/faqaccordion';", `import FaqAccordion from '${ctxPrefix}components/faqaccordion/faqaccordion';`);
}

function pageTemplateWithDepth(pageKey, clientFileName, depth) {
  const prefix = '@/app/'.repeat(depth + 1);
  return `import { createGenerateMetadata } from '${prefix}lib/pageUtils';\nexport const generateMetadata = createGenerateMetadata('${pageKey}');\n\nimport Client from './${clientFileName}';\n\nexport default function Page() {\n  return <Client />;\n}\n`;
}

const created = [];

console.log('Discovered pages:');
candidates.forEach((c, i) => console.log(`  ${i + 1}) ${c.pageKey}  (${c.file})`));

const RAW_ARGS = process.argv.slice(2);
const FORCE = RAW_ARGS.includes('--force') || RAW_ARGS.includes('-f');

function parseCliPicks() {
  if (RAW_ARGS.length === 0) return null;
  const flags = RAW_ARGS.filter(a => a.startsWith('-'));
  const picksArgs = RAW_ARGS.filter(a => !a.startsWith('-'));
  if (flags.includes('--help') || flags.includes('-h')) {
    console.log('\nUsage: node scripts/create-pages-with-client.js [picks|all] [--force|-f]');
    console.log("Examples:\n  node scripts/create-pages-with-client.js all\n  node scripts/create-pages-with-client.js 1,2,about --force\n  node scripts/create-pages-with-client.js parent/[slug] -f\n");
    process.exit(0);
  }
  if (picksArgs.length === 0) return null;
  const joined = picksArgs.length === 1 ? picksArgs[0] : picksArgs.join(',');
  return joined.split(',').map(normalizeChoice).filter(Boolean);
}

(async () => {
  const cliPicks = parseCliPicks();
  let picks = null;
  if (cliPicks && cliPicks.length > 0) {
    picks = cliPicks;
  } else if (process.stdin && process.stdin.isTTY) {
    const answer = await ask("Enter numbers/names to generate (comma-separated), or 'all', or custom slugs like 'parent/child' or 'parent/[slug]': ");
    const raw = answer || '';
    picks = raw.split(',').map(normalizeChoice).filter(Boolean);
  } else {
    console.log('\nNo interactive TTY detected and no CLI arguments provided.');
    console.log("Run with: node scripts/create-pages-with-client.js all");
    console.log("Or: node scripts/create-pages-with-client.js 1,2,about,parent/child");
    process.exit(0);
  }
  let toProcess = [];
  if (!picks || picks.length === 0) {
    console.log('No selection made. Exiting.');
    process.exit(0);
  }
  if (picks.length === 1 && picks[0].toLowerCase() === 'all') {
    toProcess = candidates.map(c => ({ type: 'candidate', key: c.pageKey }));
  } else {
    for (const p of picks) {
      // number
      if (/^\d+$/.test(p)) {
        const idx = parseInt(p, 10) - 1;
        if (candidates[idx]) toProcess.push({ type: 'candidate', key: candidates[idx].pageKey });
        continue;
      }
      // matches candidate key exactly
      const found = candidates.find(c => c.pageKey === p);
      if (found) { toProcess.push({ type: 'candidate', key: found.pageKey }); continue; }
      // treat as custom slug path (may contain / or [slug])
      toProcess.push({ type: 'custom', path: p });
    }
  }

  for (const item of toProcess) {
    if (item.type === 'candidate') {
      const pageKey = item.key;
      const folderSegments = [pageKey.replace(/_/g, '-')];
      const depth = computeDepth(folderSegments);
      const dir = path.join(APP_DIR, ...folderSegments);
      ensureDir(dir);
      const lastSeg = folderSegments[folderSegments.length - 1];
      const clientFileName = `${lastSeg}client.tsx`;
      const clientPath = path.join(dir, clientFileName);
      const pagePath = path.join(dir, 'page.tsx');
      const compName = makeCompNameFromSegment(lastSeg);
      const clientWritten = (FORCE && fs.existsSync(clientPath)) ? (fs.writeFileSync(clientPath, clientTemplateWithDepth(pageKey, compName, lastSeg, depth), 'utf8'), true) : writeIfMissing(clientPath, clientTemplateWithDepth(pageKey, compName, lastSeg, depth));
      const pageWritten = (FORCE && fs.existsSync(pagePath)) ? (fs.writeFileSync(pagePath, pageTemplateWithDepth(pageKey, clientFileName, depth), 'utf8'), true) : writeIfMissing(pagePath, pageTemplateWithDepth(pageKey, clientFileName, depth));
      if (clientWritten || pageWritten) created.push({ folder: path.relative(process.cwd(), dir), page: pageWritten ? path.relative(process.cwd(), pagePath) : null, client: clientWritten ? path.relative(process.cwd(), clientPath) : null });
    } else if (item.type === 'custom') {
      const rawPath = item.path;
      const segments = splitSegments(rawPath).map(s => s);
      if (segments.length === 0) continue;
      const depth = computeDepth(segments);
      const dir = path.join(APP_DIR, ...segments);
      ensureDir(dir);
      const lastSeg = segments[segments.length - 1];
      const clientFileName = `${lastSeg.replace(/\//g, '-') }client.tsx`;
      const clientPath = path.join(dir, clientFileName);
      const pagePath = path.join(dir, 'page.tsx');
      const compName = makeCompNameFromSegment(lastSeg);
      const pageKey = lastSeg.replace(/[[\]]/g, '');
      const clientWritten = (FORCE && fs.existsSync(clientPath)) ? (fs.writeFileSync(clientPath, clientTemplateWithDepth(pageKey, compName, lastSeg, depth), 'utf8'), true) : writeIfMissing(clientPath, clientTemplateWithDepth(pageKey, compName, lastSeg, depth));
      const pageWritten = (FORCE && fs.existsSync(pagePath)) ? (fs.writeFileSync(pagePath, pageTemplateWithDepth(pageKey, clientFileName, depth), 'utf8'), true) : writeIfMissing(pagePath, pageTemplateWithDepth(pageKey, clientFileName, depth));
      if (clientWritten || pageWritten) created.push({ folder: path.relative(process.cwd(), dir), page: pageWritten ? path.relative(process.cwd(), pagePath) : null, client: clientWritten ? path.relative(process.cwd(), clientPath) : null });
    }
  }

  console.log('Created items:', created.length);
  created.forEach(c => console.log(' ', c));
  if (created.length === 0) console.log('No new pages or clients created.');
  process.exit(0);
})();

console.log('Created items:', created.length);
created.forEach(c => console.log(' ', c));

if (created.length === 0) console.log('No new pages or clients created.');

process.exit(0);
