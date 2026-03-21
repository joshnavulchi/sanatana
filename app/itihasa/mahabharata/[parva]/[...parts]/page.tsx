import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@/app/components/structured-data/StructuredData';
import ItihasaPartClient from '../../../itihasapartclient';
import { params as generatedParams } from '@app/generated-params/mahabharata-parva-parts';
import {
  MAHABHARATA_PARVAS,
  isMahabharataParvaSlug,
  parseNumericSuffix,
  toTitleFromSlug,
  toUnderscoreSlug,
} from '../../../itihasa-utils';
import { loadLocaleData, DEFAULT_LOCALE } from '@lib/i18n';

type Params = { parva: string; parts: string[] };

export const dynamicParams = false;

export async function generateStaticParams() {
  // Filter Mahabharata parva parts by locale namespace availability.
  try {
    const { filterGeneratedParams } = await Promise.resolve().then(() => require('@lib/i18n')) as typeof import('@lib/i18n');
    return await filterGeneratedParams(generatedParams, (p: any) => `itihasa_mahabharata_${toUnderscoreSlug(String(p.parva))}_chapter${String((p.parts || [])[0] || '').replace(/[^0-9]/g, '') || '1'}`);
  } catch (_) {
    return generatedParams;
  }
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

  try {
    const ns = await loadLocaleData(DEFAULT_LOCALE, namespace);
    const hasTitle = typeof (ns as any).title === 'string' && (ns as any).title.trim().length > 0;
    if (!hasTitle) notFound();
  } catch (_) { }

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
