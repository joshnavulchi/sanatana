export const revalidate = 60;
import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@/app/components/structured-data/StructuredData';
import ItihasaPartClient from '../../itihasapartclient';
import { params as generatedParams } from '@app/generated-params/mahabharata-parvas';
import {
  MAHABHARATA_PARVAS,
  isMahabharataParvaSlug,
  toTitleFromSlug,
  toUnderscoreSlug,
} from '../../itihasa-utils';
import { loadLocaleData, DEFAULT_LOCALE } from '@lib/i18n';

type Params = { parva: string };

export const dynamicParams = false;

export async function generateStaticParams() {
  // Use generated params but filter by available locale namespace.
  try {
    const { filterGeneratedParams } = await Promise.resolve().then(() => require('@lib/i18n')) as typeof import('@lib/i18n');
    return await filterGeneratedParams(generatedParams, (p: any) => `itihasa_mahabharata_${toUnderscoreSlug(String(p.parva))}`);
  } catch (_) {
    return generatedParams;
  }
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
  try {
    const namespace = `itihasa_mahabharata_${toUnderscoreSlug(parva)}`;
    const ns = await loadLocaleData(DEFAULT_LOCALE, namespace);
    const hasTitle = typeof (ns as any).title === 'string' && (ns as any).title.trim().length > 0;
    if (!hasTitle) notFound();
  } catch (_) { }

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
