/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import ChapterClient from './chapterclient';

/* ── Static params for all veda + chapter combos ── */
const VEDA_CHAPTERS: { slug: string; prefix: string; count: number; filePattern: string }[] = [
  { slug: 'rigveda', prefix: 'mandala', count: 10, filePattern: 'vedas_rigveda_madala' },
  /*
   * Other vedas can be added here when their chapter-level JSONs become available:
   * { slug: 'yajurveda', prefix: 'chapter', count: 10, filePattern: 'vedas_yajurveda_chapter' },
   * { slug: 'samaveda',  prefix: 'section', count: 10, filePattern: 'vedas_samaveda_section' },
   * { slug: 'atharvaveda', prefix: 'book', count: 10, filePattern: 'vedas_atharvaveda_book' },
   */
];

export function generateStaticParams() {
  const params: { slug: string; chapter: string }[] = [];
  for (const cfg of VEDA_CHAPTERS) {
    for (let i = 1; i <= cfg.count; i++) {
      params.push({ slug: cfg.slug, chapter: `${cfg.prefix}-${i}` });
    }
  }
  return params;
}

/* Helper: derive the locale file key from slug + chapter, e.g. vedas_rigveda_madala1 */
function chapterFileKey(slug: string, chapter: string): string {
  const cfg = VEDA_CHAPTERS.find((v) => v.slug === slug);
  if (!cfg) return slug;
  const num = chapter.match(/(\d+)$/)?.[1] || '1';
  return `${cfg.filePattern}${num}`;
}

export async function generateMetadata(props: { params: Promise<{ slug: string; chapter: string }> }) {
  const { slug, chapter } = await props.params;
  const fileKey = chapterFileKey(slug, chapter);
  const generate = createGenerateMetadata(fileKey);
  const meta = await generate({});
  // Prepend chapter label to title
  const chapterTitle = chapter.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    ...meta,
    title: meta?.title || `${chapterTitle} – ${slug.replace(/\b\w/g, (c) => c.toUpperCase())}`,
    description: meta?.description,
  };
}

export default async function Page(props: { params: Promise<{ slug: string; chapter: string }> }) {
  const { slug, chapter } = await props.params;
  return <ChapterClient slug={slug} chapter={chapter} />;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
