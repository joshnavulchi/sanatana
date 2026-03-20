export const revalidate = 60;
import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@/app/components/structured-data/StructuredData';
import ItihasaPartClient from '../../itihasapartclient';
import {
import { params as generatedParams } from '@app/generated-params/mahabharata-parvas';
import { params as generatedParams } from '@app/generated-params/mahabharata-parvas';
  MAHABHARATA_PARVAS,
  isMahabharataParvaSlug,
  toTitleFromSlug,
  toUnderscoreSlug,
} from '../../itihasa-utils';

type Params = { parva: string };

export const dynamicParams = false;

export async function generateStaticParams() {
  // Use the build-time generated params for full static export support.
  return generatedParams;
}



export async function generateMetadata(props: { params: Promise<Params> }) {
  const { parva } = await props.params;
  const namespace = `itihasa_mahabharata_${toUnderscoreSlug(parva)}`;
  const generate = createGenerateMetadata(namespace);
  return generate({});
}

export default async function Page(props: { params: Promise<Params> }) {
  const { parva } = await props.params;
  if (!isMahabharataParvaSlug(parva)) notFound();

  return (
    <>
      <StructuredData metaKey={`itihasa_mahabharata_${toUnderscoreSlug(parva)}`} />
      <ItihasaPartClient
        namespace={`itihasa_mahabharata_${toUnderscoreSlug(parva)}`}
        titleFallback={toTitleFromSlug(parva)}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Itihasa', href: '/itihasa' },
          { label: 'Mahabharata', href: '/itihasa/mahabharata' },
          { label: toTitleFromSlug(parva) },
        ]}
        nextHref={`/itihasa/mahabharata/${parva}/chapter-1`}
        nextLabel="Open Chapter 1"
      />
    </>
  );
}
