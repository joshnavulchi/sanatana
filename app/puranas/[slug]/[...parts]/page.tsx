import fs from 'fs';
import path from 'path';
import { createGenerateMetadata } from '@lib/pageUtils';
import PartsClient from './partsclient';
import { MAHAPURANA_SLUGS, normalizePuranaSlug, parseNumericSuffix } from '../../purana-utils';

type Params = { slug: string; parts: string[] };

function readJson(filePath: string): Record<string, unknown> | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
  } catch (_) {
    return null;
  }
}

function getStructure(slug: string): Record<string, unknown> | null {
  const file = path.join(process.cwd(), 'locales', 'en', `puranas_${slug}_structure.json`);
  return readJson(file);
}

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

export function generateStaticParams() {
  const params: Params[] = [];

  for (const slug of MAHAPURANA_SLUGS) {
    const structure = getStructure(slug);
    if (!structure) continue;

    if (slug === 'bhagavata') {
      const skandas = Array.isArray(structure.skandas) ? structure.skandas : [];
      for (const skanda of skandas) {
        if (!skanda || typeof skanda !== 'object') continue;
        const skandaNumber = Number((skanda as Record<string, unknown>).skanda);
        if (!Number.isFinite(skandaNumber)) continue;
        params.push({ slug, parts: [`skanda-${skandaNumber}`] });

        const chapters = Array.isArray((skanda as Record<string, unknown>).chapters)
          ? ((skanda as Record<string, unknown>).chapters as unknown[])
          : [];
        for (const chapter of chapters) {
          if (!chapter || typeof chapter !== 'object') continue;
          const chapterNumber = Number((chapter as Record<string, unknown>).chapter);
          if (!Number.isFinite(chapterNumber)) continue;
          params.push({ slug, parts: [`skanda-${skandaNumber}`, `chapter-${chapterNumber}`] });

          const verses = Array.isArray((chapter as Record<string, unknown>).verses)
            ? ((chapter as Record<string, unknown>).verses as unknown[])
            : [];
          for (const verse of verses) {
            if (!verse || typeof verse !== 'object') continue;
            const verseNumber = Number((verse as Record<string, unknown>).verse_number);
            if (!Number.isFinite(verseNumber)) continue;
            params.push({
              slug,
              parts: [`skanda-${skandaNumber}`, `chapter-${chapterNumber}`, `verse-${verseNumber}`],
            });
          }
        }
      }
      continue;
    }

    const chapters = Array.isArray(structure.chapters) ? structure.chapters : [];
    for (const chapter of chapters) {
      if (!chapter || typeof chapter !== 'object') continue;
      const chapterNumber = Number((chapter as Record<string, unknown>).chapter);
      if (!Number.isFinite(chapterNumber)) continue;
      params.push({ slug, parts: [`chapter-${chapterNumber}`] });

      const verses = Array.isArray((chapter as Record<string, unknown>).verses)
        ? ((chapter as Record<string, unknown>).verses as unknown[])
        : [];

      for (const verse of verses) {
        if (!verse || typeof verse !== 'object') continue;
        const verseNumber = Number((verse as Record<string, unknown>).verse_number);
        if (!Number.isFinite(verseNumber)) continue;
        params.push({ slug, parts: [`chapter-${chapterNumber}`, `verse-${verseNumber}`] });
      }
    }
  }

  return params;
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
