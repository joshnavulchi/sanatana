import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import ItihasaPartClient from '../../../itihasapartclient';
import { parseNumericSuffix } from '../../../itihasa-utils';

type Params = { chapter: string; parts: string[] };

function readBhagavadGitaStructure() {
  const filePath = path.join(process.cwd(), 'locales', 'en', 'itihasa_bhagavad_gita_structure.json');
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
}

export function generateStaticParams() {
  const structure = readBhagavadGitaStructure();
  const chapters = Array.isArray(structure?.chapters) ? (structure?.chapters as unknown[]) : [];
  const params: Params[] = [];

  for (const chapter of chapters) {
    if (!chapter || typeof chapter !== 'object') continue;
    const chapterNumber = Number((chapter as Record<string, unknown>).chapter);
    if (!Number.isFinite(chapterNumber)) continue;

    const verses = Array.isArray((chapter as Record<string, unknown>).verses)
      ? ((chapter as Record<string, unknown>).verses as unknown[])
      : [];

    for (const verse of verses) {
      if (!verse || typeof verse !== 'object') continue;
      const verseNumber = Number((verse as Record<string, unknown>).verse_number);
      if (!Number.isFinite(verseNumber)) continue;

      params.push({
        chapter: `chapter-${chapterNumber}`,
        parts: [`verse-${verseNumber}`],
      });
    }
  }

  return params;
}

export async function generateMetadata(props: { params: Promise<Params> }) {
  const { chapter, parts } = await props.params;
  const chapterNumber = parseNumericSuffix(chapter);
  const verseNumber = parseNumericSuffix(parts[0] || 'verse-1');
  const namespace = `itihasa_bhagavad_gita_chapter${chapterNumber}_verse${verseNumber}`;
  const generate = createGenerateMetadata(namespace);
  return generate({});
}

export default async function Page(props: { params: Promise<Params> }) {
  const { chapter, parts } = await props.params;
  if (!chapter.startsWith('chapter-')) notFound();
  if (!parts[0]?.startsWith('verse-')) notFound();

  const chapterNumber = parseNumericSuffix(chapter);
  const verseNumber = parseNumericSuffix(parts[0]);

  return (
    <ItihasaPartClient
      namespace={`itihasa_bhagavad_gita_chapter${chapterNumber}_verse${verseNumber}`}
      titleFallback={`Bhagavad Gita Chapter ${chapterNumber} Verse ${verseNumber}`}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Itihasa', href: '/itihasa' },
        { label: 'Bhagavad Gita', href: '/itihasa/bhagavad-gita' },
        { label: `Chapter ${chapterNumber}`, href: `/itihasa/bhagavad-gita/chapter-${chapterNumber}` },
        { label: `Verse ${verseNumber}` },
      ]}
    />
  );
}
