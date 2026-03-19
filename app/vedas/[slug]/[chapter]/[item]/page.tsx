import { createGenerateMetadata } from '@lib/pageUtils';
import ItemClient from './itemclient';

type ItemPageParams = {
  slug: string;
  chapter: string;
  item: string;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  // Provide a minimal deterministic list so Next's static analysis detects the export.
  const out = [
    { slug: 'rigveda', chapter: 'mandala-1', item: 'sukta-1' },
    { slug: 'yajurveda', chapter: 'chapter-1', item: 'mantra-1' },
    { slug: 'samaveda', chapter: 'hymn-1', item: 'verse-1' },
    { slug: 'atharvaveda', chapter: 'book-1', item: 'hymn-1' },
  ];
  return out.filter((p) => p && p.slug && p.chapter && p.item);
}


function parseNum(value: string): number {
  return Number(value.match(/(\d+)$/)?.[1] || '1');
}

function chapterFileKey(slug: string, chapter: string): string {
  const chapterNum = parseNum(chapter);
  if (slug === 'rigveda') return `vedas_rigveda_madala${chapterNum}`;
  if (slug === 'yajurveda') return 'vedas_yajurveda';
  if (slug === 'atharvaveda') return 'vedas_atharvaveda';
  return slug;
}

export async function generateMetadata(props: { params: Promise<ItemPageParams> }) {
  const { slug, chapter } = await props.params;
  const generate = createGenerateMetadata(chapterFileKey(slug, chapter));
  return generate({});
}

export default async function Page(props: { params: Promise<ItemPageParams> }) {
  const { slug, chapter, item } = await props.params;
  return <ItemClient slug={slug} chapter={chapter} item={item} />;
}
