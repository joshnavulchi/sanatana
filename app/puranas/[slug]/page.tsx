export const revalidate = 60;
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@/app/components/structured-data/StructuredData';
import SlugClient from './slugclient';
import { getPuranaOverviewNamespace, MAHAPURANA_SLUGS, normalizePuranaSlug } from '@lib/purana-utils';
import { loadLocaleData, DEFAULT_LOCALE } from '@lib/i18n';
import { notFound } from 'next/navigation';
import { loadGeneratedParamsSync } from '@lib/siteUtils';

const VALID_SLUGS: string[] = [];
for (const slug of MAHAPURANA_SLUGS) {
  VALID_SLUGS.push(slug);
  VALID_SLUGS.push(`${slug}-purana`);
}

export const dynamicParams = false;
export const dynamic = 'force-static';

export async function generateStaticParams() {
  // Use the build-time generated params but filter out entries missing locale files.
  try {
    const { filterGeneratedParams } = await Promise.resolve().then(() => require('@lib/i18n')) as typeof import('@lib/i18n');
    const generatedParams = loadGeneratedParamsSync('@app/generated-params/puranas-slugs');
    return await filterGeneratedParams(generatedParams, (p: any) => getPuranaOverviewNamespace(normalizePuranaSlug(String(p.slug))));
  } catch (_) {
    return loadGeneratedParamsSync('@app/generated-params/puranas-slugs');
  }
}



export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const canonicalSlug = normalizePuranaSlug(slug);
  const generate = createGenerateMetadata(getPuranaOverviewNamespace(canonicalSlug));
  return generate({});
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const canonicalSlug = normalizePuranaSlug(slug);
  try {
    const ns = await loadLocaleData(DEFAULT_LOCALE, getPuranaOverviewNamespace(canonicalSlug));
    const hasTitle = typeof (ns as any).title === 'string' && (ns as any).title.trim().length > 0;
    if (!hasTitle) notFound();
  } catch (_) { }
  return (
    <>
      <StructuredData metaKey={`puranas_${canonicalSlug}`} />
      <SlugClient slug={canonicalSlug} />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
