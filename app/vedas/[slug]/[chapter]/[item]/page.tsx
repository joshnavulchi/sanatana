import { createGenerateMetadata } from '@lib/pageUtils';
import ItemClient from './itemclient';
import { params as generatedParams } from '@app/generated-params/vedas-items';

type ItemPageParams = {
  slug: string;
  chapter: string;
  item: string;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  // Provide the build-time generated params for veda items so static export works.
  return generatedParams;
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
  return <ItemClient slug={slug} chapter={chapter} item={item} />;
}
