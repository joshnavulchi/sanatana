import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import ItihasaPartClient from '../../itihasapartclient';
import { parseNumericSuffix } from '../../itihasa-utils';
import { getBhagavadGitaChapters } from '../static-params';

type Params = { chapter: string };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ chapter: string }[]> {
  const chapters = getBhagavadGitaChapters();
  return chapters.map((chapter) => ({ chapter: `chapter-${chapter}` }));
}

export async function generateMetadata(props: { params: Promise<Params> }) {
  const { chapter } = await props.params;
  const chapterNumber = parseNumericSuffix(chapter);
  const namespace = `itihasa_bhagavad_gita_chapter${chapterNumber}`;
  const generate = createGenerateMetadata(namespace);
  return generate({});
}

export default async function Page(props: { params: Promise<Params> }) {
  const { chapter } = await props.params;
  if (!chapter.startsWith('chapter-')) notFound();

  const chapterNumber = parseNumericSuffix(chapter);

  return (
    <ItihasaPartClient
      namespace={`itihasa_bhagavad_gita_chapter${chapterNumber}`}
      titleFallback={`Bhagavad Gita Chapter ${chapterNumber}`}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Itihasa', href: '/itihasa' },
        { label: 'Bhagavad Gita', href: '/itihasa/bhagavad-gita' },
        { label: `Chapter ${chapterNumber}` },
      ]}
      nextHref={`/itihasa/bhagavad-gita/chapter-${chapterNumber}/verse-1`}
      nextLabel="Open Verse 1"
    />
  );
}
