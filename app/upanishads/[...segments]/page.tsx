/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { notFound } from 'next/navigation';
import { DEFAULT_LOCALE } from '@lib/i18n';
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
  return [
    { segments: ['aitareya-upanishad'] },
    { segments: ['brihadaranyaka-upanishad'] },
    { segments: ['chandogya-upanishad'] },
    { segments: ['isha-upanishad'] },
    { segments: ['katha-upanishad'] },
    { segments: ['kaushitaki-upanishad'] },
    { segments: ['kena-upanishad'] },
    { segments: ['maitri-upanishad'] },
    { segments: ['mandukya-upanishad'] },
    { segments: ['mundaka-upanishad'] },
    { segments: ['prashna-upanishad'] },
    { segments: ['shvetashvatara-upanishad'] },
    { segments: ['taittiriya-upanishad'] } // ✅ ONLY include paths that actually exist
  ];
}

export async function generateMetadata({ params }: any) {
  const segments = params?.segments || [];

  const key = segments.length
    ? `upanishads/${segments.join('/')}/index`
    : 'upanishads';

  return createGenerateMetadata(key)({ params });
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