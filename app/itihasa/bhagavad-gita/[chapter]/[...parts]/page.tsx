import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import ItihasaPartClient from '../../../itihasapartclient';
import { parseNumericSuffix } from '../../../itihasa-utils';
import {
  getBhagavadGitaChapters,
  getBhagavadGitaVersesForChapter,
} from '../../static-params';

type Params = { chapter: string; parts: string[] };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const params: Params[] = [];

  for (const chapter of getBhagavadGitaChapters()) {
    const verses = getBhagavadGitaVersesForChapter(chapter);
    for (const verse of verses) {
      params.push({
        chapter: `chapter-${chapter}`,
        parts: [`verse-${verse}`],
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
