export const revalidate = 60;
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import SlugClient from './slugclient';
import { params as generatedParams } from '@app/generated-params/itihasa-ramayana';
import { loadLocaleData, DEFAULT_LOCALE } from '@lib/i18n';
import { notFound } from 'next/navigation';

export const dynamicParams = false;

export async function generateStaticParams() {
  // Return the build-time generated params directly. Avoid runtime require so
  // this function remains static and compatible with `output: 'export'.`
  const list: any[] = Array.isArray((generatedParams as any).params) ? (generatedParams as any).params : (generatedParams as any);
  return list
    .map((p) => ({ slug: String((p && (p.slug ?? (p.params && p.params.slug))) || '') }))
    .filter((p) => p.slug);
}



export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const generate = createGenerateMetadata(`itihasa_ramayana_${slug}`);
  return generate({});
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  try {
    const ns = await loadLocaleData(DEFAULT_LOCALE, `itihasa_ramayana_${slug}`);
    const hasTitle = typeof (ns as any).title === 'string' && (ns as any).title.trim().length > 0;
    if (!hasTitle) notFound();
  } catch (_) { }
  return (
    <>
      <StructuredData metaKey={`itihasa_ramayana_${slug}`} />
      <SlugClient slug={slug} />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
