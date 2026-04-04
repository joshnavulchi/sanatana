/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { DEFAULT_LOCALE } from '@lib/i18n';
import { fetchContentByRoute } from '@lib/siteUtils';
import { createGenerateMetadata } from '@lib/pageUtils';
import { resolveParams } from '@lib/resolveParams';
import { notFound } from 'next/navigation';

import ChapterClient from './ChapterClient';

const CHAPTERS = Array.from({ length: 18 }, (_, i) => `chapter${i + 1}`);

export async function generateStaticParams() {
  return CHAPTERS.map((c) => ({ chapter: c }));
}

export async function generateMetadata({ params, searchParams }: { params?: { chapter?: string }; searchParams?: any }) {
  const v = params?.chapter;
  const key = v ? `itihasa/bhagavadgita/${v}/index` : 'itihasa/bhagavadgita';
  return await createGenerateMetadata(key)({ searchParams });
}

export default async function Page({ params }: { params: { chapter?: string } | Promise<{ chapter?: string }> }) {
  const resolvedParams = await resolveParams(params);
  const chapterParam = typeof resolvedParams?.chapter === 'string' ? resolvedParams.chapter : undefined;
  if (!chapterParam) return notFound();

  const chapter = [chapterParam];
  const locale = DEFAULT_LOCALE;
  const fetched = await fetchContentByRoute(locale, ['itihasa', 'bhagavadgita', ...chapter]);
  let data: any = fetched && fetched.data ? (fetched.data as any) : null;
  if (data && typeof data === 'object' && chapter.length > 0) {
    const rootKey = chapter[0];
    if ((data as any)[rootKey]) {
      data = (data as any)[rootKey];
    }
  }
  if (!data) return notFound();

  return <ChapterClient initialData={data} initialLocale={locale} chapter={chapter} />;
}

/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
