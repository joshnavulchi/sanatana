/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import ChapterClient from './chapterclient';
import fs from 'fs';
import path from 'path';
import { resolveLocaleFromHeaders } from '@lib/pageUtils.server';

type VedaChaptersConfig =
  | {
    slug: 'rigveda';
    prefix: 'mandala';
    mode: 'per-file';
    count: number;
    filePattern: string;
  }
  | {
    slug: 'yajurveda' | 'samaveda' | 'atharvaveda';
    prefix: 'chapter' | 'section' | 'book';
    mode: 'from-main';
    fileKey: string;
    listKey: string;
    numberKey: string;
  };

/* ── Static params for all veda + chapter combos ── */
const VEDA_CHAPTERS: VedaChaptersConfig[] = [
  { slug: 'rigveda', prefix: 'mandala', mode: 'per-file', count: 10, filePattern: 'vedas_rigveda_madala' },
  { slug: 'yajurveda', prefix: 'chapter', mode: 'from-main', fileKey: 'vedas_yajurveda', listKey: 'yajurveda_chapters', numberKey: 'chapter' },
  { slug: 'samaveda', prefix: 'section', mode: 'from-main', fileKey: 'vedas_samaveda', listKey: 'samaveda_sections', numberKey: 'section' },
  { slug: 'atharvaveda', prefix: 'book', mode: 'from-main', fileKey: 'vedas_atharvaveda', listKey: 'atharvaveda_books', numberKey: 'book' },
];

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

function unwrapSingleKey(ns: unknown): Record<string, unknown> {
  if (!isPlainObject(ns)) return {};
  const keys = Object.keys(ns);
  if (keys.length === 1 && isPlainObject((ns as Record<string, unknown>)[keys[0]])) {
    return (ns as Record<string, unknown>)[keys[0]] as Record<string, unknown>;
  }
  return ns as Record<string, unknown>;
}

function readLocaleJson(locale: string, fileKey: string): unknown {
  const candidates = [locale, 'en'];
  for (const loc of candidates) {
    try {
      const filePath = path.join(process.cwd(), 'locales', loc, `${fileKey}.json`);
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8')) as unknown;
      }
    } catch (_) {
      // ignore
    }
  }
  return null;
}

function getChapterNumbersFromMain(locale: string, cfg: Extract<VedaChaptersConfig, { mode: 'from-main' }>): number[] {
  const raw = readLocaleJson(locale, cfg.fileKey);
  const root = unwrapSingleKey(raw);
  const list = root[cfg.listKey];
  if (!Array.isArray(list)) return [];
  const nums: number[] = [];
  for (const item of list) {
    if (!isPlainObject(item)) continue;
    const n = item[cfg.numberKey];
    if (typeof n === 'number' && Number.isFinite(n)) nums.push(n);
  }
  nums.sort((a, b) => a - b);
  return nums;
}

export function generateStaticParams() {
  const locale = 'en';
  const params: { slug: string; chapter: string }[] = [];
  for (const cfg of VEDA_CHAPTERS) {
    if (cfg.mode === 'per-file') {
      for (let i = 1; i <= cfg.count; i++) {
        params.push({ slug: cfg.slug, chapter: `${cfg.prefix}-${i}` });
      }
      continue;
    }

    const nums = getChapterNumbersFromMain(locale, cfg);
    for (const n of nums) {
      params.push({ slug: cfg.slug, chapter: `${cfg.prefix}-${n}` });
    }
  }
  return params;
}

/* Helper: derive the locale file key from slug + chapter, e.g. vedas_rigveda_madala1 */
function chapterFileKey(slug: string, chapter: string): string {
  const cfg = VEDA_CHAPTERS.find((v) => v.slug === slug);
  if (!cfg) return slug;
  const num = chapter.match(/(\d+)$/)?.[1] || '1';
  if (cfg.mode === 'per-file') return `${cfg.filePattern}${num}`;
  return cfg.fileKey;
}

function readChapterEntry(locale: string, slug: string, chapter: string): { title?: string; description?: string } {
  const cfg = VEDA_CHAPTERS.find((v) => v.slug === slug);
  if (!cfg || cfg.mode !== 'from-main') return {};

  const chapterNum = Number(chapter.match(/(\d+)$/)?.[1] || '1');
  const raw = readLocaleJson(locale, cfg.fileKey);
  const root = unwrapSingleKey(raw);
  const list = root[cfg.listKey];
  if (!Array.isArray(list)) return {};

  const entry = list.find((item) => isPlainObject(item) && item[cfg.numberKey] === chapterNum) as Record<string, unknown> | undefined;
  if (!entry) return {};

  const title = typeof entry.title === 'string' ? entry.title : undefined;
  // Use introduction as a reasonable meta description when no dedicated description exists.
  const description = typeof entry.introduction === 'string' ? entry.introduction : undefined;
  return { title, description };
}

export async function generateMetadata(props: { params: Promise<{ slug: string; chapter: string }> }) {
  const { slug, chapter } = await props.params;
  const fileKey = chapterFileKey(slug, chapter);
  const generate = createGenerateMetadata(fileKey);
  const meta = await generate({});

  const metaObj = (meta ?? {}) as Record<string, unknown>;
  const metaAlternates = isPlainObject(metaObj.alternates) ? (metaObj.alternates as Record<string, unknown>) : {};
  const metaOpenGraph = isPlainObject(metaObj.openGraph) ? (metaObj.openGraph as Record<string, unknown>) : {};

  const locale = resolveLocaleFromHeaders();
  const fromMain = readChapterEntry(locale, slug, chapter);
  const baseUrl = String(process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in').replace(/\/$/, '');
  const canonical = `${baseUrl}/vedas/${slug}/${chapter}`;

  // Prepend chapter label to title when we don't have a better one.
  const chapterTitle = chapter.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const fallbackTitle = `${chapterTitle} – ${slug.replace(/\b\w/g, (c) => c.toUpperCase())}`;

  const title = fromMain.title || meta?.title || fallbackTitle;
  const description = fromMain.description || meta?.description;

  return {
    ...metaObj,
    title,
    description,
    alternates: { ...metaAlternates, canonical },
    openGraph: {
      ...metaOpenGraph,
      title: fromMain.title || (metaOpenGraph.title as string | undefined) || title,
      description: fromMain.description || (metaOpenGraph.description as string | undefined) || description,
      url: canonical,
    },
  };
}

export default async function Page(props: { params: Promise<{ slug: string; chapter: string }> }) {
  const { slug, chapter } = await props.params;
  return <ChapterClient slug={slug} chapter={chapter} />;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
