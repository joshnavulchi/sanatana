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

export async function generateStaticParams() {
  // Provide the build-time generated params for veda items but filter out missing locale files.
  try {
    const { filterGeneratedParams } = await Promise.resolve().then(() => require('@lib/i18n')) as typeof import('@lib/i18n');
    return await filterGeneratedParams(generatedParams, (p: any) => chapterFileKey(String(p.slug), String(p.chapter)));
  } catch (_) {
    return generatedParams;
  }
}

export async function generateMetadata(props: { params: Promise<ItemPageParams> }) {
  const { slug, chapter } = await props.params;
  // local helper: determine metadata key for chapter-level files
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
