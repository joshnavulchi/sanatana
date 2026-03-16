/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import ChapterClient from './chapterclient';
import fs from 'fs';
import path from 'path';

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

export function generateStaticParams(): Array<{ slug: string; chapter: string }> {
  const localesDir = path.join(process.cwd(), 'public', 'locales', 'en');
  let files: string[] = [];
  try {
    files = fs.readdirSync(localesDir);
  } catch (_) {
    return [];
  }

  const rigveda = new Set<number>();
  const yajurveda = new Set<number>();
  const samaveda = new Set<number>();
  const atharvaveda = new Set<number>();

  const reRigveda = /^vedas_rigveda_madala(\d+)\.json$/;
  const reYajurveda = /^vedas_yajurveda_chapter(\d+)_mantra(\d+)\.json$/;
  const reSamaveda = /^vedas_samaveda_hymn(\d+)\.json$/;
  const reAtharvaveda = /^vedas_atharvaveda_book(\d+)_hymn(\d+)\.json$/;

  for (const file of files) {
    let m = file.match(reRigveda);
    if (m) {
      const n = Number(m[1]);
      if (Number.isFinite(n) && n > 0) rigveda.add(n);
      continue;
    }
    m = file.match(reYajurveda);
    if (m) {
      const n = Number(m[1]);
      if (Number.isFinite(n) && n > 0) yajurveda.add(n);
      continue;
    }
    m = file.match(reSamaveda);
    if (m) {
      const n = Number(m[1]);
      if (Number.isFinite(n) && n > 0) samaveda.add(n);
      continue;
    }
    m = file.match(reAtharvaveda);
    if (m) {
      const n = Number(m[1]);
      if (Number.isFinite(n) && n > 0) atharvaveda.add(n);
      continue;
    }
  }

  const out: Array<{ slug: string; chapter: string }> = [];
  for (const n of Array.from(rigveda).sort((a, b) => a - b)) out.push({ slug: 'rigveda', chapter: `mandala-${n}` });
  for (const n of Array.from(yajurveda).sort((a, b) => a - b)) out.push({ slug: 'yajurveda', chapter: `chapter-${n}` });
  for (const n of Array.from(samaveda).sort((a, b) => a - b)) out.push({ slug: 'samaveda', chapter: `hymn-${n}` });
  for (const n of Array.from(atharvaveda).sort((a, b) => a - b)) out.push({ slug: 'atharvaveda', chapter: `book-${n}` });

  return out;
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
