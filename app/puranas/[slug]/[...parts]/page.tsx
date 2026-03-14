import { createGenerateMetadata } from '@lib/pageUtils';
import PartsClient from './partsclient';
import { normalizePuranaSlug, parseNumericSuffix } from '../../purana-utils';
import fs from 'fs';
import path from 'path';

type Params = { slug: string; parts: string[] };

export const dynamicParams = false;

function getNamespace(slug: string, parts: string[]): string {
  if (slug === 'bhagavata') {
    const skanda = parseNumericSuffix(parts[0] || 'skanda-1');
    if (parts.length === 1) return `puranas_bhagavata_skanda${skanda}`;
    const chapter = parseNumericSuffix(parts[1] || 'chapter-1');
    if (parts.length === 2) return `puranas_bhagavata_skanda${skanda}_chapter${chapter}`;
    const verse = parseNumericSuffix(parts[2] || 'verse-1');
    return `puranas_bhagavata_skanda${skanda}_chapter${chapter}_verse${verse}`;
  }

  const chapter = parseNumericSuffix(parts[0] || 'chapter-1');
  if (parts.length === 1) return `puranas_${slug}_chapter${chapter}`;
  const verse = parseNumericSuffix(parts[1] || 'verse-1');
  return `puranas_${slug}_chapter${chapter}_verse${verse}`;
}

export function generateStaticParams(): Params[] {
  const localesDir = path.join(process.cwd(), 'public', 'locales', 'en');
  let files: string[] = [];
  try {
    files = fs.readdirSync(localesDir);
  } catch (_) {
    return [];
  }

  const out: Params[] = [];

  const reBhagavataSkanda = /^puranas_bhagavata_skanda(\d+)\.json$/;
  const reBhagavataChapter = /^puranas_bhagavata_skanda(\d+)_chapter(\d+)\.json$/;
  const reBhagavataVerse = /^puranas_bhagavata_skanda(\d+)_chapter(\d+)_verse(\d+)\.json$/;
  const reChapter = /^puranas_([^_]+)_chapter(\d+)\.json$/;
  const reVerse = /^puranas_([^_]+)_chapter(\d+)_verse(\d+)\.json$/;

  for (const file of files) {
    let m = file.match(reBhagavataVerse);
    if (m) {
      const skanda = Number(m[1]);
      const chapter = Number(m[2]);
      const verse = Number(m[3]);
      if (skanda > 0 && chapter > 0 && verse > 0) {
        out.push({ slug: 'bhagavata', parts: [`skanda-${skanda}`, `chapter-${chapter}`, `verse-${verse}`] });
      }
      continue;
    }

    m = file.match(reBhagavataChapter);
    if (m) {
      const skanda = Number(m[1]);
      const chapter = Number(m[2]);
      if (skanda > 0 && chapter > 0) {
        out.push({ slug: 'bhagavata', parts: [`skanda-${skanda}`, `chapter-${chapter}`] });
      }
      continue;
    }

    m = file.match(reBhagavataSkanda);
    if (m) {
      const skanda = Number(m[1]);
      if (skanda > 0) {
        out.push({ slug: 'bhagavata', parts: [`skanda-${skanda}`] });
      }
      continue;
    }

    m = file.match(reVerse);
    if (m) {
      const slug = normalizePuranaSlug(m[1]);
      const chapter = Number(m[2]);
      const verse = Number(m[3]);
      if (slug && chapter > 0 && verse > 0) {
        out.push({ slug, parts: [`chapter-${chapter}`, `verse-${verse}`] });
      }
      continue;
    }

    m = file.match(reChapter);
    if (m) {
      const slug = normalizePuranaSlug(m[1]);
      const chapter = Number(m[2]);
      if (slug && chapter > 0) {
        out.push({ slug, parts: [`chapter-${chapter}`] });
      }
      continue;
    }
  }

  out.sort((a, b) => {
    if (a.slug !== b.slug) return a.slug.localeCompare(b.slug);
    const ap0 = a.parts[0] || '';
    const bp0 = b.parts[0] || '';
    const a0 = Number(ap0.match(/(\d+)$/)?.[1] || '0');
    const b0 = Number(bp0.match(/(\d+)$/)?.[1] || '0');
    if (a0 !== b0) return a0 - b0;
    const ap1 = a.parts[1] || '';
    const bp1 = b.parts[1] || '';
    const a1 = Number(ap1.match(/(\d+)$/)?.[1] || '0');
    const b1 = Number(bp1.match(/(\d+)$/)?.[1] || '0');
    if (a1 !== b1) return a1 - b1;
    const ap2 = a.parts[2] || '';
    const bp2 = b.parts[2] || '';
    const a2 = Number(ap2.match(/(\d+)$/)?.[1] || '0');
    const b2 = Number(bp2.match(/(\d+)$/)?.[1] || '0');
    return a2 - b2;
  });

  return out;
}

export async function generateMetadata(props: { params: Promise<Params> }) {
  const { slug, parts } = await props.params;
  const normalizedSlug = normalizePuranaSlug(slug);
  const namespace = getNamespace(normalizedSlug, parts);
  const generate = createGenerateMetadata(namespace);
  return generate({});
}

export default async function Page(props: { params: Promise<Params> }) {
  const { slug, parts } = await props.params;
  return <PartsClient slug={normalizePuranaSlug(slug)} parts={parts} />;
}
