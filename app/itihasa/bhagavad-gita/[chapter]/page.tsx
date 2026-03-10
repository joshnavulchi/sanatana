import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import ItihasaPartClient from '../../itihasapartclient';
import { parseNumericSuffix } from '../../itihasa-utils';

type Params = { chapter: string };

function readBhagavadGitaStructure() {
  const filePath = path.join(process.cwd(), 'locales', 'en', 'itihasa_bhagavad_gita_structure.json');
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
}

export function generateStaticParams() {
  const structure = readBhagavadGitaStructure();
  const chapters = Array.isArray(structure?.chapters) ? (structure?.chapters as unknown[]) : [];

  return chapters
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const chapter = Number((item as Record<string, unknown>).chapter);
      if (!Number.isFinite(chapter)) return null;
      return { chapter: `chapter-${chapter}` };
    })
    .filter(Boolean) as { chapter: string }[];
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
