import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import { RAMAYANA_SARGA_PARAMS } from '@lib/generated/scriptureStaticParams';
import ItihasaPartClient from '../../../itihasapartclient';
import {
  isRamayanaKandaSlug,
  parseNumericSuffix,
  toTitleFromSlug,
  toUnderscoreSlug,
} from '../../../itihasa-utils';

type Params = { slug: string; parts: string[] };

export const dynamicParams = false;

export function generateStaticParams() {
  return RAMAYANA_SARGA_PARAMS as Params[];
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
  );
}
