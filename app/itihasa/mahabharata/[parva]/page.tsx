/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { DEFAULT_LOCALE } from '@lib/i18n';
import { fetchContentByRoute, MAHABHARATA_PARVAS } from '@lib/siteUtils';
import { createGenerateMetadata } from '@lib/pageUtils';
import { resolveParams } from '@lib/resolveParams';
import { notFound } from 'next/navigation';

import ParvaClient from './ParvaClient';

export async function generateStaticParams() {
  return MAHABHARATA_PARVAS.map((p) => ({ parva: p }));
}

export async function generateMetadata({ params, searchParams }: { params?: { parva?: string }; searchParams?: any }) {
  const v = params?.parva;
  const key = v ? `itihasa/mahabharata/${v}/index` : 'itihasa/mahabharata';
  return await createGenerateMetadata(key)({ searchParams });
}

export default async function Page({ params }: { params: { parva?: string } | Promise<{ parva?: string }> }) {
  const resolvedParams = await resolveParams(params);
  const parvaParam = typeof resolvedParams?.parva === 'string' ? resolvedParams.parva : undefined;
  if (!parvaParam) return notFound();

  const parva = [parvaParam];
  const locale = DEFAULT_LOCALE;
  const fetched = await fetchContentByRoute(locale, ['itihasa', 'mahabharata', ...parva]);
  let data: any = fetched && fetched.data ? (fetched.data as any) : null;
  if (data && typeof data === 'object' && parva.length > 0) {
    const rootKey = parva[0];
    if ((data as any)[rootKey]) {
      data = (data as any)[rootKey];
    }
  }
  if (!data) return notFound();

  return <ParvaClient initialData={data} initialLocale={locale} parva={parva} />;
}

/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
