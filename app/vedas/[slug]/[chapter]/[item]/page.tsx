import { createGenerateMetadata } from '@lib/pageUtils';
import { VEDAS_ITEM_PARAMS } from '@lib/generated/scriptureStaticParams';
import ItemClient from './itemclient';

type ItemPageParams = {
  slug: string;
  chapter: string;
  item: string;
};

export const dynamicParams = false;
export const dynamic = 'force-static';

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

export async function generateStaticParams(): Promise<ReadonlyArray<ItemPageParams>> {
  return VEDAS_ITEM_PARAMS;
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
