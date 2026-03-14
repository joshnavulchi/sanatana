import { createGenerateMetadata } from '@lib/pageUtils';
import ItemClient from './itemclient';
import fs from 'fs';
import path from 'path';

type ItemPageParams = {
  slug: string;
  chapter: string;
  item: string;
};

export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string; chapter: string; item: string }> {
  const localesDir = path.join(process.cwd(), 'public', 'locales', 'en');
  let files: string[] = [];
  try {
    files = fs.readdirSync(localesDir);
  } catch (_) {
    return [];
  }

  const out: Array<{ slug: string; chapter: string; item: string }> = [];

  const reRigveda = /^vedas_rigveda_madala(\d+)_hymn(\d+)\.json$/;
  const reYajurveda = /^vedas_yajurveda_chapter(\d+)_mantra(\d+)\.json$/;
  const reAtharvaveda = /^vedas_atharvaveda_book(\d+)_hymn(\d+)\.json$/;

  for (const file of files) {
    let m = file.match(reRigveda);
    if (m) {
      const mandala = Number(m[1]);
      const hymn = Number(m[2]);
      if (mandala > 0 && hymn > 0) out.push({ slug: 'rigveda', chapter: `mandala-${mandala}`, item: `hymn-${hymn}` });
      continue;
    }

    m = file.match(reYajurveda);
    if (m) {
      const chapter = Number(m[1]);
      const mantra = Number(m[2]);
      if (chapter > 0 && mantra > 0) out.push({ slug: 'yajurveda', chapter: `chapter-${chapter}`, item: `mantra-${mantra}` });
      continue;
    }

    m = file.match(reAtharvaveda);
    if (m) {
      const book = Number(m[1]);
      const hymn = Number(m[2]);
      if (book > 0 && hymn > 0) out.push({ slug: 'atharvaveda', chapter: `book-${book}`, item: `hymn-${hymn}` });
      continue;
    }
  }

  out.sort((a, b) => {
    if (a.slug !== b.slug) return a.slug.localeCompare(b.slug);
    const ac = Number(a.chapter.match(/(\d+)$/)?.[1] || '0');
    const bc = Number(b.chapter.match(/(\d+)$/)?.[1] || '0');
    if (ac !== bc) return ac - bc;
    const ai = Number(a.item.match(/(\d+)$/)?.[1] || '0');
    const bi = Number(b.item.match(/(\d+)$/)?.[1] || '0');
    return ai - bi;
  });

  return out;
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
