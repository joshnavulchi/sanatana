import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import ItihasaPartClient from '../../../itihasapartclient';
import {
  isMahabharataParvaSlug,
  parseNumericSuffix,
  toTitleFromSlug,
  toUnderscoreSlug,
} from '../../../itihasa-utils';

type Params = { parva: string; parts: string[] };

function readMahabharataStructure() {
  const filePath = path.join(process.cwd(), 'locales', 'en', 'itihasa_mahabharata_structure.json');
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
}

export function generateStaticParams() {
  const structure = readMahabharataStructure();
  const parvas = Array.isArray(structure?.parvas) ? (structure?.parvas as unknown[]) : [];
  const params: Params[] = [];

  for (const parva of parvas) {
    if (!parva || typeof parva !== 'object') continue;
    const parvaSlug = String((parva as Record<string, unknown>).slug || '');
    const chapters = Array.isArray((parva as Record<string, unknown>).chapters)
      ? ((parva as Record<string, unknown>).chapters as unknown[])
      : [];
    for (const chapter of chapters) {
      if (!chapter || typeof chapter !== 'object') continue;
      const chapterNumber = Number((chapter as Record<string, unknown>).chapter);
      if (!Number.isFinite(chapterNumber)) continue;
      params.push({ parva: parvaSlug, parts: [`chapter-${chapterNumber}`] });
    }
  }

  return params;
}

export async function generateMetadata(props: { params: Promise<Params> }) {
  const { parva, parts } = await props.params;
  const chapter = parseNumericSuffix(parts[0] || 'chapter-1');
  const namespace = `itihasa_mahabharata_${toUnderscoreSlug(parva)}_chapter${chapter}`;
  const generate = createGenerateMetadata(namespace);
  return generate({});
}

export default async function Page(props: { params: Promise<Params> }) {
  const { parva, parts } = await props.params;
  if (!isMahabharataParvaSlug(parva)) notFound();
  if (!parts[0]?.startsWith('chapter-')) notFound();

  const chapter = parseNumericSuffix(parts[0]);
  const namespace = `itihasa_mahabharata_${toUnderscoreSlug(parva)}_chapter${chapter}`;

  return (
    <ItihasaPartClient
      namespace={namespace}
      titleFallback={`${toTitleFromSlug(parva)} Chapter ${chapter}`}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Itihasa', href: '/itihasa' },
        { label: 'Mahabharata', href: '/itihasa/mahabharata' },
        { label: toTitleFromSlug(parva), href: `/itihasa/mahabharata/${parva}` },
        { label: `Chapter ${chapter}` },
      ]}
    />
  );
}
