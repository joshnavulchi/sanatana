import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import ItihasaPartClient from '../../../itihasapartclient';
import {
  isMahabharataParvaSlug,
  MAHABHARATA_PARVAS,
  parseNumericSuffix,
  toTitleFromSlug,
  toUnderscoreSlug,
} from '../../../itihasa-utils';
import { getMahabharataChapters } from '../../static-params';

type Params = { parva: string; parts: string[] };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const params: Params[] = [];

  for (const parva of MAHABHARATA_PARVAS) {
    const chapters = getMahabharataChapters(parva);
    for (const chapter of chapters) {
      params.push({
        parva,
        parts: [`chapter-${chapter}`],
      });
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
