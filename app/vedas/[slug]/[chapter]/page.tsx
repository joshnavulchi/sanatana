/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import ChapterClient from './chapterclient';

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
  rigveda: { mode: 'per-file', filePattern: 'vedas_rigveda_madala' },
  yajurveda: { mode: 'from-main', fileKey: 'vedas_yajurveda' },
  samaveda: { mode: 'from-main', fileKey: 'vedas_samaveda' },
  atharvaveda: { mode: 'from-main', fileKey: 'vedas_atharvaveda' },
};

export const dynamicParams = false;

export async function generateStaticParams() {
  // Minimal deterministic params for each veda so Next detects the export
  const out = [
    { slug: 'rigveda', chapter: 'mandala-1' },
    { slug: 'yajurveda', chapter: 'chapter-1' },
    { slug: 'samaveda', chapter: 'hymn-1' },
    { slug: 'atharvaveda', chapter: 'book-1' },
  ];
  return out.filter((p) => p && p.slug && p.chapter);
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
  return (
    <>
      <StructuredData metaKey={`vedas_${slug}_${chapter}`} />
      <ChapterClient slug={slug} chapter={chapter} />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
