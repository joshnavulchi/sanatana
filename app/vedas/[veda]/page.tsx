/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { DEFAULT_LOCALE } from '@lib/i18n';
import { fetchContentByRoute } from '@lib/siteUtils';
import { createGenerateMetadata } from '@lib/pageUtils';
import { notFound } from 'next/navigation';

import VedaClient from './VedaClient';

type vedaData = {
  title?: string;
  description?: string;
  content?: string | Record<string, any>;
  children?: string[];
};

export async function generateStaticParams() {
  const topLevel = ['rigveda', 'yajurveda', 'samaveda', 'atharvaveda'];
  return topLevel.map((v) => ({ veda: v }));
}

export async function generateMetadata({ params, searchParams }: { params?: { veda?: string } | Promise<{ veda?: string }>; searchParams?: any }) {
  let resolvedParams: { veda?: string } | undefined = params as any;
  try {
    if (resolvedParams && typeof (resolvedParams as any).then === 'function') {
      resolvedParams = await (resolvedParams as any);
    }
  } catch (e) {
    resolvedParams = undefined;
  }
  const v = resolvedParams?.veda;
  const key = v ? `vedas/${v}/index` : 'vedas';
  console.log("key ::", key);
  return await createGenerateMetadata(key)({ searchParams }); // testing...
}

export default async function Page({ params }: { params: { veda?: string } | Promise<{ veda?: string }> }) {
  let resolvedParams: { veda?: string } | undefined = params as any;
  try {
    if (resolvedParams && typeof (resolvedParams as any).then === 'function') {
      resolvedParams = await (resolvedParams as any);
    }
  } catch (e) {
    resolvedParams = undefined;
  }
  const vedaParam = typeof resolvedParams?.veda === 'string' ? resolvedParams.veda : undefined;
  if (!vedaParam) return notFound();

  const vedas = [vedaParam];
  const locale = DEFAULT_LOCALE;
  const fetched = await fetchContentByRoute(locale, ['vedas', ...vedas]);
  let data: vedaData | null = fetched && fetched.data ? (fetched.data as any) : null;
  if (data && typeof data === 'object' && vedas.length > 0) {
    const rootKey = vedas[0];
    if ((data as any)[rootKey]) {
      data = (data as any)[rootKey] as vedaData;
    }
  }
  if (!data) return notFound();

  return <VedaClient initialData={data} initialLocale={locale} vedas={vedas} />;
}

/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
