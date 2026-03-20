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

import { params as generatedParams } from '@app/generated-params/mahabharata-parva-parts';

export const dynamicParams = false;

export async function generateStaticParams() {
  // Use the full generated params list for Mahabharata parva parts.
  return generatedParams;
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
