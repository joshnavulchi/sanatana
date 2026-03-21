/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import SlugClient from './slugclient';
import { loadGeneratedParamsSync } from '@lib/siteUtils';
import { loadLocaleData, DEFAULT_LOCALE } from '@lib/i18n';
import { notFound } from 'next/navigation';

export const dynamicParams = false;

export async function generateStaticParams() {
  // Filter generated params for Bhagavad Gita by locale namespace availability.
  try {
    const { filterGeneratedParams } = await Promise.resolve().then(() => require('@lib/i18n')) as typeof import('@lib/i18n');
    const generatedParams = loadGeneratedParamsSync('@app/generated-params/itihasa-bhagavadgita');
    return await filterGeneratedParams(generatedParams, (p: any) => `bhagavadgita_${String(p.slug)}`);
  } catch (_) {
    return loadGeneratedParamsSync('@app/generated-params/itihasa-bhagavadgita');
  }
}



export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const generate = createGenerateMetadata(`bhagavadgita_${slug}`);
  return generate({});
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  try {
    const ns = await loadLocaleData(DEFAULT_LOCALE, `bhagavadgita_${slug}`);
    const hasTitle = typeof (ns as any).title === 'string' && (ns as any).title.trim().length > 0;
    if (!hasTitle) notFound();
  } catch (_) { }
  return (
    <>
      <StructuredData metaKey={`bhagavadgita_${slug}`} />
      <SlugClient slug={slug} />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
