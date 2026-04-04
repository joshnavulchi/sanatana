/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@/lib/pageUtils';
import { loadLocaleData, DEFAULT_LOCALE } from '@lib/i18n';

import VedicClient from './VedicClient';

export const generateMetadata = createGenerateMetadata('vedic-philosophy');

export default async function Page() {
  const ns = await loadLocaleData(DEFAULT_LOCALE, 'vedic-philosophy');
  const structure = (ns && typeof ns === 'object' && (ns as any).vedic_philosophy)
    ? (ns as any).vedic_philosophy
    : ns;

  // Discover files in public/data/locales/<locale>/vedic-philosophy and extract titles
  let folderLinks: { href: string; label: string; description?: string }[] = [];
  try {
    const fs = await Promise.resolve().then(() => require('fs').promises) as typeof import('fs').promises;
    const path = await Promise.resolve().then(() => require('path')) as typeof import('path');
    const dir = path.join(process.cwd(), 'public', 'data', 'locales', DEFAULT_LOCALE, 'vedic-philosophy');
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const ent of entries) {
      try {
        if (ent.isDirectory()) {
          const idxPath = path.join(dir, ent.name, 'index.json');
          try {
            const txt = await fs.readFile(idxPath, 'utf8');
            const parsed = JSON.parse(txt);
            const key = Object.keys(parsed)[0] || '';
            const obj = parsed[key] || parsed;
            const slug = ent.name;
            const title = typeof obj.title === 'string' ? obj.title : slug;
            const description = typeof obj.description === 'string' ? obj.description : undefined;
            folderLinks.push({ href: `/vedic-philosophy/${slug}`, label: title, description });
            continue;
          } catch (_) {
            // no index.json or parse failed — fallthrough to check for file with same slug
          }
        }

        // If not a directory or no index.json found, check for top-level JSON files
        if (ent.isFile() && ent.name.endsWith('.json')) {
          const txt = await fs.readFile(path.join(dir, ent.name), 'utf8');
          const parsed = JSON.parse(txt);
          const key = Object.keys(parsed)[0] || '';
          const obj = parsed[key] || parsed;
          const slug = ent.name.replace(/\.json$/, '');
          const title = typeof obj.title === 'string' ? obj.title : slug;
          const description = typeof obj.description === 'string' ? obj.description : undefined;
          folderLinks.push({ href: `/vedic-philosophy/${slug}`, label: title, description });
        }
      } catch (_) {
        // ignore per-entry errors
      }
    }
  } catch (_) {
    // ignore FS errors
  }

  return <VedicClient initialStructure={structure} initialFolderLinks={folderLinks} />;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
