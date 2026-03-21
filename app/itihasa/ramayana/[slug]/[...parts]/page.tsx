import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@/app/components/structured-data/StructuredData';
import ItihasaPartClient from '../../../itihasapartclient';
import { RAMAYANA_KANDAS, isRamayanaKandaSlug, parseNumericSuffix, toTitleFromSlug, toUnderscoreSlug } from '@lib/siteUtils';
import { loadGeneratedParamsSync } from '@lib/safeGeneratedParams';
import { loadLocaleData, DEFAULT_LOCALE } from '@lib/i18n';

type Params = { slug: string; parts: string[] };

export const dynamicParams = false;

export async function generateStaticParams() {
  // Return the build-time generated params directly to remain compatible with
  // `output: 'export'` and avoid runtime requires.
  const list: any[] = loadGeneratedParamsSync('@app/generated-params/itihasa-ramayana-parts');
  return list
    .map((p) => ({ slug: String((p && (p.slug ?? (p.params && p.params.slug))) || ''), parts: (p && (p.parts ?? (p.params && p.params.parts))) || [] }))
    .filter((p) => p.slug && Array.isArray(p.parts) && p.parts.length > 0);
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

  try {
    const ns = await loadLocaleData(DEFAULT_LOCALE, namespace);
    const hasTitle = typeof (ns as any).title === 'string' && (ns as any).title.trim().length > 0;
    if (!hasTitle) notFound();
  } catch (_) { }

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
