/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import ChapterClient from './chapterclient';
import { params as generatedParams } from '@app/generated-params/vedas-chapters';
import { loadLocaleData, DEFAULT_LOCALE } from '@lib/i18n';
import { notFound } from 'next/navigation';

type ChapterPageParams = {
  slug: string;
  chapter: string;
};

type ChapterMetaConfig = {
  mode: 'per-file' | 'from-main';
  filePattern?: string;
  fileKey?: string;
};

const CHAPTER_META_CONFIG: Record<string, ChapterMetaConfig> = {
  rigveda: { mode: 'from-main', fileKey: 'vedas/rigveda/rigveda' },
  yajurveda: { mode: 'from-main', fileKey: 'vedas_yajurveda' },
  samaveda: { mode: 'from-main', fileKey: 'vedas_samaveda' },
  atharvaveda: { mode: 'from-main', fileKey: 'vedas_atharvaveda' },
};

export const dynamicParams = false;

export async function generateStaticParams() {
  // Use the generated chapters list but filter out entries missing locale files.
  try {
    const { filterGeneratedParams } = await Promise.resolve().then(() => require('@lib/i18n')) as typeof import('@lib/i18n');
    const res = await filterGeneratedParams(generatedParams, (p: any) => chapterFileKey(String(p.slug), String(p.chapter)));
    const list: any[] = Array.isArray((res as any).params) ? (res as any).params : (res as any);
    return list.map((p) => ({ slug: String((p && (p.slug ?? (p.params && p.params.slug))) || ''), chapter: String((p && (p.chapter ?? (p.params && p.params.chapter))) || '') })).filter((p) => p.slug && p.chapter);
  } catch (_) {
    const list: any[] = Array.isArray((generatedParams as any).params) ? (generatedParams as any).params : (generatedParams as any);
    return list.map((p) => ({ slug: String((p && (p.slug ?? (p.params && p.params.slug))) || ''), chapter: String((p && (p.chapter ?? (p.params && p.params.chapter))) || '') })).filter((p) => p.slug && p.chapter);
  }
}

function chapterFileKey(slug: string, chapter: string): string {
  const cfg = CHAPTER_META_CONFIG[slug];
  if (!cfg) return slug;

  if (cfg.mode === 'per-file' && cfg.filePattern) {
    const chapterNumber = chapter.match(/(\d+)$/)?.[1] || '1';
    return `${cfg.filePattern}${chapterNumber}`;
  }

  return cfg.fileKey || slug;
}



export async function generateMetadata(props: { params: Promise<ChapterPageParams> }) {
  const { slug, chapter } = await props.params;
  const generate = createGenerateMetadata(chapterFileKey(slug, chapter));
  return generate({});
}

export default async function Page(props: { params: Promise<ChapterPageParams> }) {
  const { slug, chapter } = await props.params;
  try {
    const key = chapterFileKey(slug, chapter);
    const ns = await loadLocaleData(DEFAULT_LOCALE, key);
    const hasTitle = typeof (ns as any).title === 'string' && (ns as any).title.trim().length > 0;
    if (!hasTitle) notFound();
  } catch (_) { }
  return (
    <>
      <StructuredData metaKey={`vedas_${slug}_${chapter}`} />
      <ChapterClient slug={slug} chapter={chapter} />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
