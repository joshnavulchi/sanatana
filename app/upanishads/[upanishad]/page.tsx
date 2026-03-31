/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { notFound } from 'next/navigation';
import { DEFAULT_LOCALE } from '@lib/i18n';
import { fetchContentByRoute } from '@lib/siteUtils';
import { createGenerateMetadata } from '@lib/pageUtils';

import UpanishadsClient from './UpanishadClient';

type UpanishadsData = {
  title?: string;
  description?: string;
  content?: string | Record<string, any>;
  children?: string[];
};

export async function generateStaticParams() {
  const top = [
    'aitareya', 'brihadaranyaka', 'chandogya', 'isha', 'katha', 'kaushitaki', 'kena', 'maitri', 'mandukya', 'mundaka', 'prashna', 'shvetashvatara', 'taittiriya'
  ];
  return top.map((s) => ({ upanishad: s }));
}

export async function generateMetadata({ params, searchParams }: { params?: { upanishad?: string }; searchParams?: any }) {
  const s = params?.upanishad;
  const key = s ? `upanishads/${s}/index` : 'upanishads/index';
  return await createGenerateMetadata(key)({ searchParams });
}

export default async function Page({ params }: { params: { upanishad?: string } | Promise<{ upanishad?: string }> }) {
  let resolvedParams: { upanishad?: string } | undefined = params as any;
  try {
    if (resolvedParams && typeof (resolvedParams as any).then === 'function') {
      resolvedParams = await (resolvedParams as any);
    }
  } catch (e) {
    resolvedParams = undefined;
  }

  const up = typeof resolvedParams?.upanishad === 'string' ? resolvedParams.upanishad : undefined;
  if (!up) return notFound();

  const segments = [up];
  const locale = DEFAULT_LOCALE;

  const fetched = await fetchContentByRoute(locale, ['upanishads', ...segments]);
  let data: UpanishadsData | null = fetched && fetched.data ? (fetched.data as any) : null;
  if (data && typeof data === 'object' && segments.length > 0) {
    const rootKey = segments[0];
    if ((data as any)[rootKey]) {
      data = (data as any)[rootKey] as UpanishadsData;
    } else {
      const keys = Object.keys(data);
      if (keys.length === 1 && typeof (data as any)[keys[0]] === 'object') {
        data = (data as any)[keys[0]] as UpanishadsData;
      }
    }
  }
  if (!data) return notFound();

  return <UpanishadsClient initialData={data} initialLocale={locale} segments={segments} />;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */