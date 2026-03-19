import { createGenerateMetadata } from '@lib/pageUtils';
import ItemClient from './itemclient';

type ItemPageParams = {
  slug: string;
  chapter: string;
  item: string;
};

import { params as generatedParams } from '@app/generated-params/vedas-items';

export const dynamicParams = false;




export async function generateMetadata(props: { params: Promise<ItemPageParams> }) {
  const { slug, chapter } = await props.params;
  const generate = createGenerateMetadata(chapterFileKey(slug, chapter));
  return generate({});
}

export default async function Page(props: { params: Promise<ItemPageParams> }) {
  const { slug, chapter, item } = await props.params;
  return <ItemClient slug={slug} chapter={chapter} item={item} />;
}
