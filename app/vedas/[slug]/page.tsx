/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import SlugClient from './slugclient';
import StructuredData from '@/app/components/structured-data/StructuredData';
import { params as generatedParams } from '@app/generated-params/vedas-slugs';
import { loadLocaleData, DEFAULT_LOCALE } from '@lib/i18n';
import { notFound } from 'next/navigation';

/* Map URL slug → locale file key (filename without .json) */
const FILE_MAP: Record<string, string> = {
  rigveda: 'rigveda',
  yajurveda: 'yajurveda',
  samaveda: 'samaveda',
  atharvaveda: 'atharvaveda',
};

export const dynamicParams = false;

export async function generateStaticParams() {
  // Return the build-time generated params directly. Avoid runtime requires so
  // this function is purely static and compatible with `output: 'export'.`
  const list: any[] = Array.isArray((generatedParams as any).params) ? (generatedParams as any).params : (generatedParams as any);
  return list
    .map((p) => ({ slug: String((p && (p.slug ?? (p.params && p.params.slug))) || '') }))
    .filter((p) => p.slug);
}



export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const fileKey = FILE_MAP[slug] || slug;
  const generate = createGenerateMetadata(fileKey);
  return generate({});
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const fileKey = FILE_MAP[slug] || slug;
  // Server-side: attempt to load critical locale page data; if missing, treat as notFound
  try {
    const ns = await loadLocaleData(DEFAULT_LOCALE, fileKey);
    const pageObj = (ns && typeof ns === 'object') ? ns : {};
    const hasTitle = typeof (pageObj as any).title === 'string' && (pageObj as any).title.trim().length > 0;
    if (!hasTitle) {
      // If the locale file exists but doesn't contain expected page object, fall back to 404
      notFound();
    }
  } catch (_) {
    // Swallow errors and continue to client; SlugClient will render fallback UI.
  }
  return (
    <>
      <StructuredData metaKey={`${slug}`} />
      <SlugClient slug={slug} />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */