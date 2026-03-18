import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@/app/components/structured-data/StructuredData';
import ItihasaPartClient from '../../../itihasapartclient';
import {
  MAHABHARATA_PARVAS,
  isMahabharataParvaSlug,
  parseNumericSuffix,
  toTitleFromSlug,
  toUnderscoreSlug,
} from '../../../itihasa-utils';
type Params = { parva: string; parts: string[] };

export const dynamicParams = false;

export function generateStaticParams() {
  // Provide a minimal static params list so Next can detect the export.
  // Map each parva to its first chapter to keep the export small and deterministic.
  return MAHABHARATA_PARVAS.map((parva) => ({ parva, parts: ['chapter-1'] }));
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
    <>
      <StructuredData metaKey={namespace} />
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
    </>
  );
}
