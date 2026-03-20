import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@/app/components/structured-data/StructuredData';
import ItihasaPartClient from '../../../itihasapartclient';
import {
import { params as generatedParams } from '@app/generated-params/itihasa-ramayana-parts';
import { params as generatedParams } from '@app/generated-params/itihasa-ramayana-parts';
  RAMAYANA_KANDAS,
  isRamayanaKandaSlug,
  parseNumericSuffix,
  toTitleFromSlug,
  toUnderscoreSlug,
} from '../../../itihasa-utils';

type Params = { slug: string; parts: string[] };

export const dynamicParams = false;

export async function generateStaticParams() {
  // Use the generated params for Ramayana parts to export all sarga pages.
  return generatedParams;
}



export async function generateMetadata(props: { params: Promise<Params> }) {
  const { slug, parts } = await props.params;
  const sarga = parseNumericSuffix(parts[0] || 'sarga-1');
  const namespace = `itihasa_ramayana_${toUnderscoreSlug(slug)}_sarga${sarga}`;
  const generate = createGenerateMetadata(namespace);
  return generate({});
}

export default async function Page(props: { params: Promise<Params> }) {
  const { slug, parts } = await props.params;
  if (!isRamayanaKandaSlug(slug)) notFound();
  if (!parts[0]?.startsWith('sarga-')) notFound();

  const sarga = parseNumericSuffix(parts[0]);
  const namespace = `itihasa_ramayana_${toUnderscoreSlug(slug)}_sarga${sarga}`;

  return (
    <>
      <StructuredData metaKey={`itihasa_ramayana_${toUnderscoreSlug(slug)}_sarga${sarga}`} />
      <ItihasaPartClient
        namespace={namespace}
        titleFallback={`${toTitleFromSlug(slug)} Sarga ${sarga}`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Itihasa', href: '/itihasa' },
          { label: 'Ramayana', href: '/itihasa/ramayana' },
          { label: toTitleFromSlug(slug), href: `/itihasa/ramayana/${slug}` },
          { label: `Sarga ${sarga}` },
        ]}
      />
    </>
  );
}
