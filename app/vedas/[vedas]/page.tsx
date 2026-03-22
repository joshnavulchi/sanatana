/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { DEFAULT_LOCALE } from '@lib/i18n';
import { fetchContentByRoute } from '@lib/siteUtils';
import { createGenerateMetadata } from '@lib/pageUtils';
import { notFound } from 'next/navigation';

import VedasClient from './VedasClient';

type VedasData = {
  title?: string;
  description?: string;
  content?: string | Record<string, any>;
  children?: string[];
};

export async function generateStaticParams() {
  const topLevel = ['rigveda', 'yajurveda', 'samaveda', 'atharvaveda'];
  return topLevel.map((v) => ({ vedas: v }));
}

export async function generateMetadata({ params, searchParams }: { params?: { vedas?: string }; searchParams?: any }) {
  const v = params?.vedas;
  const key = v ? `vedas/${v}/index` : 'vedas';
  return await createGenerateMetadata(key)({ searchParams });
}

export default async function Page({ params }: { params: { vedas?: string } | Promise<{ vedas?: string }> }) {
  let resolvedParams: { vedas?: string } | undefined = params as any;
  try {
    if (resolvedParams && typeof (resolvedParams as any).then === 'function') {
      resolvedParams = await (resolvedParams as any);
    }
  } catch (e) {
    resolvedParams = undefined;
  }

  const vedasParam = typeof resolvedParams?.vedas === 'string' ? resolvedParams.vedas : undefined;
  if (!vedasParam) return notFound();

  const vedas = [vedasParam];
  const locale = DEFAULT_LOCALE;
  const fetched = await fetchContentByRoute(locale, ['vedas', ...vedas]);
  let data: VedasData | null = fetched && fetched.data ? (fetched.data as any) : null;
  if (data && typeof data === 'object' && vedas.length > 0) {
    const rootKey = vedas[0];
    if ((data as any)[rootKey]) {
      data = (data as any)[rootKey] as VedasData;
    }
  }
  if (!data) return notFound();

  return <VedasClient initialData={data} initialLocale={locale} vedas={vedas} />;
}

/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
