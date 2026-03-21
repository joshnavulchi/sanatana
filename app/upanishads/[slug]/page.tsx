/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import SlugClient from './slugclient';
import { params as generatedParams } from '@app/generated-params/upanishads';
import { loadLocaleData, DEFAULT_LOCALE } from '@lib/i18n';
import { notFound } from 'next/navigation';

const VALID_SLUGS = [
  'isha-upanishad', 'kena-upanishad', 'katha-upanishad', 'prashna-upanishad',
  'mundaka-upanishad', 'mandukya-upanishad', 'taittiriya-upanishad', 'aitareya-upanishad',
  'chandogya-upanishad', 'brihadaranyaka-upanishad', 'shvetashvatara-upanishad',
  'kaushitaki-upanishad', 'maitri-upanishad',
];

export const dynamicParams = false;

export async function generateStaticParams() {
  // Filter build-time generated params to those with locale data.
  try {
    const { filterGeneratedParams, DEFAULT_LOCALE } = await Promise.resolve().then(() => require('@lib/i18n')) as typeof import('@lib/i18n');
    return await filterGeneratedParams(generatedParams, (p: any) => `upanishads_${String(p.slug)}`);
  } catch (e) {
    return generatedParams;
  }
}



export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const generate = createGenerateMetadata(`upanishads_${slug}`);
  return generate({});
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  try {
    const ns = await loadLocaleData(DEFAULT_LOCALE, `upanishads_${slug}`);
    const hasTitle = typeof (ns as any).title === 'string' && (ns as any).title.trim().length > 0;
    if (!hasTitle) notFound();
  } catch (_) {
    // ignore and let client render fallback UI
  }

  return (
    <>
      <StructuredData metaKey={`upanishads_${slug}`} />
      <SlugClient slug={slug} />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
