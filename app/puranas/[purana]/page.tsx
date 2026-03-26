/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { notFound } from 'next/navigation';
import { DEFAULT_LOCALE } from '@lib/i18n';
import { fetchContentByRoute } from '@lib/siteUtils';
import { createGenerateMetadata } from '@lib/pageUtils';

import PuranaClient from './PuranaClient';

type puranasData = {
  title?: string;
  description?: string;
  content?: string | Record<string, any>;
  children?: string[];
};

export async function generateStaticParams() {
  const top = [
    'agni', 'bhagavata', 'bhavishya', 'brahma', 'brahmanda', 'brahmavaivarta',
    'garuda', 'kurma', 'linga', 'markandeya', 'matsya', 'narada', 'padma', 'shiva',
    'skanda', 'vamana', 'varaha', 'vishnu'
  ];
  return top.map((s) => ({ puranas: s }));
}

export async function generateMetadata({ params, searchParams }: { params?: { puranas?: string }; searchParams?: any }) {
  const s = params?.puranas;
  const key = s ? `puranas/${s}/index` : 'puranas';
  return await createGenerateMetadata(key)({ searchParams });
}

export default async function Page({ params }: { params: { puranas?: string } | Promise<{ puranas?: string }> }) {
  let resolvedParams: { puranas?: string } | undefined = params as any;
  try {
    if (resolvedParams && typeof (resolvedParams as any).then === 'function') {
      resolvedParams = await (resolvedParams as any);
    }
  } catch (e) {
    resolvedParams = undefined;
  }

  const up = typeof resolvedParams?.puranas === 'string' ? resolvedParams.puranas : undefined;
  if (!up) return notFound();

  const segments = [up];
  const locale = DEFAULT_LOCALE;

  const fetched = await fetchContentByRoute(locale, ['puranas', ...segments]);
  let data: puranasData | null = fetched && fetched.data ? (fetched.data as any) : null;
  if (data && typeof data === 'object' && segments.length > 0) {
    const rootKey = segments[0];
    if ((data as any)[rootKey]) {
      data = (data as any)[rootKey] as puranasData;
    } else {
      const keys = Object.keys(data);
      if (keys.length === 1 && typeof (data as any)[keys[0]] === 'object') {
        data = (data as any)[keys[0]] as puranasData;
      }
    }
  }
  if (!data) return notFound();

  return <PuranaClient initialData={data} initialLocale={locale} segments={segments} />;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */