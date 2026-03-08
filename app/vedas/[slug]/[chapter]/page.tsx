/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import ChapterClient from './chapterclient';

/* ── Static params for all veda + chapter combos ── */
const VEDA_CHAPTERS: Record<string, { prefix: string; count: number }> = {
  rigveda: { prefix: 'mandala', count: 10 },
  yajurveda: { prefix: 'chapter', count: 10 },
  samaveda: { prefix: 'section', count: 10 },
  atharvaveda: { prefix: 'book', count: 10 },
};

export function generateStaticParams() {
  const params: { slug: string; chapter: string }[] = [];
  for (const [slug, cfg] of Object.entries(VEDA_CHAPTERS)) {
    for (let i = 1; i <= cfg.count; i++) {
      params.push({ slug, chapter: `${cfg.prefix}-${i}` });
    }
  }
  return params;
}

export async function generateMetadata(props: { params: Promise<{ slug: string; chapter: string }> }) {
  const { slug, chapter } = await props.params;
  // Metadata resolves from the parent veda namespace file
  const generate = createGenerateMetadata(slug);
  const meta = await generate({});
  const chapterTitle = chapter.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    ...meta,
    title: `${chapterTitle} – ${meta?.title || slug}`,
    description: meta?.description,
  };
}

export default async function Page(props: { params: Promise<{ slug: string; chapter: string }> }) {
  const { slug, chapter } = await props.params;
  return <ChapterClient slug={slug} chapter={chapter} />;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
