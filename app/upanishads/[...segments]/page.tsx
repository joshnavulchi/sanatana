/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { notFound } from 'next/navigation';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@lib/i18n';
import { createGenerateMetadata } from '@lib/pageUtils';
import { fetchContentByRoute } from '@lib/siteUtils';
import StructuredData from '@components/structured-data/StructuredData';
import UpanishadsClientRenderer from './UpanishadsClientRenderer';

type UpanishadsData = {
  title?: string;
  description?: string;
  content?: string | Record<string, any>;
  children?: string[];
};

export async function generateStaticParams() {
  const topLevelUpanishads = [
    'aitareya', 'brihadaranyaka', 'chandogya', 'isha',
    'katha', 'kaushitaki', 'kena', 'maitri',
    'mandukya', 'mundaka', 'prashna', 'shvetashvatara',
    'taittiriya'
  ];
  const out: Array<{ segments: string[] }> = [];
  for (const loc of SUPPORTED_LOCALES) {
    for (const s of topLevelUpanishads) {
      out.push({ segments: [s] });
      out.push({ segments: [`${s}-upanishad`] });
    }
  }
  return out;
}

export async function generateMetadata(props: any) {
  let params = props?.params;
  try {
    if (params && typeof (params as any).then === 'function') params = await params;
  } catch (e) {
    params = undefined;
  }
  const segments = Array.isArray(params?.segments) ? params.segments : [];
  const candidates: string[] = [];
  if (segments.length === 1) candidates.push(`upanishads/${segments[0]}/${segments[0]}`);
  if (segments.length > 0) {
    candidates.push(`upanishads/${segments.join('/')}/index`);
    candidates.push(`upanishads/${segments.join('/')}`);
    candidates.push(`${segments.join('/')}`);
  }
  candidates.push('upanishads');

  for (const key of candidates) {
    try {
      const gen = createGenerateMetadata(key);
      const meta = await gen(props);
      if (meta && meta.title && !String(meta.title).toLowerCase().includes('sanatana')) return meta;
    } catch (_) {
      // ignore
    }
  }

  return createGenerateMetadata('upanishads')(props);
}

export default async function Page({ params }: { params: { segments?: string[] } | Promise<{ segments?: string[] }> }) {
  let resolvedParams: { segments?: string[] } | undefined = params as any;
  try {
    if (resolvedParams && typeof (resolvedParams as any).then === 'function') {
      resolvedParams = await (resolvedParams as any);
    }
  } catch (e) {
    resolvedParams = undefined;
  }
  const segments = Array.isArray(resolvedParams?.segments) ? resolvedParams.segments : [];
  if (!segments || segments.length === 0) return notFound();

  const locale = DEFAULT_LOCALE;

  const fetched = await fetchContentByRoute(locale, ['upanishads', ...(segments || [])]);
  // Normalize JSON shape: many upanishads files wrap content under a top-level key
  let data: UpanishadsData | null = fetched && fetched.data ? (fetched.data as any) : null;
  if (data && typeof data === 'object' && segments.length > 0) {
    const rootKey = segments[0];
    if ((data as any)[rootKey]) {
      data = (data as any)[rootKey] as UpanishadsData;
    }
    else {
      const keys = Object.keys(data);
      if (keys.length === 1 && typeof (data as any)[keys[0]] === 'object') {
        data = (data as any)[keys[0]] as UpanishadsData;
      }
    }
  }
  if (!data) return notFound();

  let metaKey = 'upanishads';
  if (segments.length === 1) metaKey = `upanishads/${segments[0]}/${segments[0]}`;
  else if (segments.length > 0) metaKey = `upanishads/${segments.join('/')}/index`;

  return (
    <>
      <StructuredData metaKey={metaKey} locale={locale} params={{ segments }} />
      <UpanishadsClientRenderer initialData={data} initialLocale={locale} segments={segments} />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */