import { createGenerateMetadata } from '@lib/pageUtils';
import ItemClient from './itemclient';
import { params as generatedParams } from '@app/generated-params/vedas-items';
import { loadLocaleData, DEFAULT_LOCALE } from '@lib/i18n';
import { notFound } from 'next/navigation';

type ItemPageParams = {
  slug: string;
  chapter: string;
  item: string;
};

export const dynamicParams = false;

// Chapter metadata configuration and helper exposed at module scope
const CHAPTER_META_CONFIG: Record<string, { mode: 'per-file' | 'from-main'; filePattern?: string; fileKey?: string }> = {
  rigveda: { mode: 'per-file', filePattern: 'vedas_rigveda_madala' },
  yajurveda: { mode: 'from-main', fileKey: 'vedas_yajurveda' },
  samaveda: { mode: 'from-main', fileKey: 'vedas_samaveda' },
  atharvaveda: { mode: 'from-main', fileKey: 'vedas_atharvaveda' },
};

function chapterFileKey(slug: string, chapter: string): string {
  const cfg = CHAPTER_META_CONFIG[slug];
  if (!cfg) return slug;
  if (cfg.mode === 'per-file' && cfg.filePattern) {
    const chapterNumber = chapter.match(/(\d+)$/)?.[1] || '1';
    return `${cfg.filePattern}${chapterNumber}`;
  }
  return cfg.fileKey || slug;
}

export async function generateStaticParams() {
  // Return the build-time generated params directly; avoid runtime requires so
  // this function remains static and compatible with `output: 'export'.
  const list: any[] = Array.isArray((generatedParams as any).params) ? (generatedParams as any).params : (generatedParams as any);
  return list
    .map((p) => ({
      slug: String((p && (p.slug ?? (p.params && p.params.slug))) || ''),
      chapter: String((p && (p.chapter ?? (p.params && p.params.chapter))) || ''),
      item: String((p && (p.item ?? (p.params && p.params.item))) || ''),
    }))
    .filter((p) => p.slug && p.chapter && p.item);
}

export async function generateMetadata(props: { params: Promise<ItemPageParams> }) {
  const { slug, chapter } = await props.params;
  const generate = createGenerateMetadata(chapterFileKey(slug, chapter));
  return generate({});
}

export default async function Page(props: { params: Promise<ItemPageParams> }) {
  const { slug, chapter, item } = await props.params;
  try {
    const key = chapterFileKey(slug, chapter);
    const ns = await loadLocaleData(DEFAULT_LOCALE, key);
    const hasTitle = typeof (ns as any).title === 'string' && (ns as any).title.trim().length > 0;
    if (!hasTitle) notFound();
  } catch (_) { }
  return <ItemClient slug={slug} chapter={chapter} item={item} />;
}
