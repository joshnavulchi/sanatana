/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { DEFAULT_LOCALE } from '@lib/i18n';
import { fetchContentByRoute, RAMAYANA_KANDAS } from '@lib/siteUtils';
import { createGenerateMetadata } from '@lib/pageUtils';
import { notFound } from 'next/navigation';

import KandaClient from './kandaClient';

export async function generateStaticParams() {
  return RAMAYANA_KANDAS.map((k) => ({ kanda: k }));
}

export async function generateMetadata({ params, searchParams }: { params?: { kanda?: string }; searchParams?: any }) {
  const v = params?.kanda;
  const key = v ? `itihasa/ramayana/${v}/index` : 'itihasa/ramayana';
  return await createGenerateMetadata(key)({ searchParams });
}

export default async function Page({ params }: { params: { kanda?: string } | Promise<{ kanda?: string }> }) {
  let resolvedParams: { kanda?: string } | undefined = params as any;
  try {
    if (resolvedParams && typeof (resolvedParams as any).then === 'function') {
      resolvedParams = await (resolvedParams as any);
    }
  } catch (e) {
    resolvedParams = undefined;
  }

  const kandaParam = typeof resolvedParams?.kanda === 'string' ? resolvedParams.kanda : undefined;
  if (!kandaParam) return notFound();

  const kanda = [kandaParam];
  const locale = DEFAULT_LOCALE;
  const fetched = await fetchContentByRoute(locale, ['itihasa', 'ramayana', ...kanda]);
  let data: any = fetched && fetched.data ? (fetched.data as any) : null;
  if (data && typeof data === 'object' && kanda.length > 0) {
    const rootKey = kanda[0];
    if ((data as any)[rootKey]) {
      data = (data as any)[rootKey];
    }
  }
  if (!data) return notFound();

  return <KandaClient initialData={data} initialLocale={locale} kanda={kanda} />;
}

/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
