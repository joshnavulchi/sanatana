import { createGenerateMetadata } from '@lib/pageUtils';
import ItemClient from './itemclient';
import { resolveLocaleFromHeaders } from '@lib/pageUtils.server';
import vedasYajurvedaStructure from '../../../../../public/locales/en/vedas_yajurveda_structure.json';
import vedasAtharvavedaStructure from '../../../../../public/locales/en/vedas_atharvaveda_structure.json';
import vedasRigvedaMadala1 from '../../../../../public/locales/en/vedas_rigveda_madala1.json';
import vedasRigvedaMadala2 from '../../../../../public/locales/en/vedas_rigveda_madala2.json';
import vedasRigvedaMadala3 from '../../../../../public/locales/en/vedas_rigveda_madala3.json';
import vedasRigvedaMadala4 from '../../../../../public/locales/en/vedas_rigveda_madala4.json';
import vedasRigvedaMadala5 from '../../../../../public/locales/en/vedas_rigveda_madala5.json';
import vedasRigvedaMadala6 from '../../../../../public/locales/en/vedas_rigveda_madala6.json';
import vedasRigvedaMadala7 from '../../../../../public/locales/en/vedas_rigveda_madala7.json';
import vedasRigvedaMadala8 from '../../../../../public/locales/en/vedas_rigveda_madala8.json';
import vedasRigvedaMadala9 from '../../../../../public/locales/en/vedas_rigveda_madala9.json';
import vedasRigvedaMadala10 from '../../../../../public/locales/en/vedas_rigveda_madala10.json';

type VedaItemConfig = {
  slug: 'rigveda' | 'yajurveda' | 'atharvaveda';
  chapterPrefix: 'mandala' | 'chapter' | 'book';
  itemPrefix: 'hymn' | 'mantra';
  chapterFileKey: string;
  chapterListKey?: string;
  chapterNumberKey?: string;
  itemListKey: string;
  itemNumberKey: string;
  chapterFilePattern?: string;
};

const ITEM_CONFIG: VedaItemConfig[] = [
  {
    slug: 'rigveda',
    chapterPrefix: 'mandala',
    itemPrefix: 'hymn',
    chapterFileKey: 'vedas_rigveda',
    itemListKey: 'hymns',
    itemNumberKey: 'hymn_number',
    chapterFilePattern: 'vedas_rigveda_madala',
  },
  {
    slug: 'yajurveda',
    chapterPrefix: 'chapter',
    itemPrefix: 'mantra',
    chapterFileKey: 'vedas_yajurveda_structure',
    chapterListKey: 'chapters',
    chapterNumberKey: 'chapter',
    itemListKey: 'mantras',
    itemNumberKey: 'mantra_number',
  },
  {
    slug: 'atharvaveda',
    chapterPrefix: 'book',
    itemPrefix: 'hymn',
    chapterFileKey: 'vedas_atharvaveda_structure',
    chapterListKey: 'books',
    chapterNumberKey: 'book',
    itemListKey: 'hymns',
    itemNumberKey: 'hymn_number',
  },
];

export const dynamicParams = false;
export const dynamic = 'force-static';

const RIGVEDA_MADALAS: Record<number, unknown> = {
  1: vedasRigvedaMadala1,
  2: vedasRigvedaMadala2,
  3: vedasRigvedaMadala3,
  4: vedasRigvedaMadala4,
  5: vedasRigvedaMadala5,
  6: vedasRigvedaMadala6,
  7: vedasRigvedaMadala7,
  8: vedasRigvedaMadala8,
  9: vedasRigvedaMadala9,
  10: vedasRigvedaMadala10,
};

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

function readLocaleJson(_locale: string, fileKey: string): unknown {
  if (fileKey === 'vedas_yajurveda_structure') return vedasYajurvedaStructure as unknown;
  if (fileKey === 'vedas_atharvaveda_structure') return vedasAtharvavedaStructure as unknown;

  const madalaMatch = fileKey.match(/^vedas_rigveda_madala(\d+)$/);
  if (madalaMatch) {
    const madalaNumber = Number(madalaMatch[1]);
    return RIGVEDA_MADALAS[madalaNumber] ?? null;
  }

  return null;
}

function parseNum(value: unknown): number {
  if (typeof value !== 'string') return Number.NaN;
  return Number(value.match(/(\d+)$/)?.[1] || '1');
}

function getConfig(slug: string): VedaItemConfig | undefined {
  return ITEM_CONFIG.find((cfg) => cfg.slug === slug);
}

function getItemTitleAndDesc(locale: string, slug: string, chapter: string, item: string): { title?: string; description?: string } {
  const cfg = getConfig(slug);
  if (!cfg) return {};

  const chapterNum = parseNum(chapter);
  const itemNum = parseNum(item);

  if (cfg.chapterFilePattern) {
    const chapterRaw = readLocaleJson(locale, `${cfg.chapterFilePattern}${chapterNum}`);
    const chapterRoot = unwrapSingleKey(chapterRaw);
    const list = chapterRoot[cfg.itemListKey];
    if (!Array.isArray(list)) return {};
    const entry = list.find((it) => isPlainObject(it) && Number(it[cfg.itemNumberKey]) === itemNum) as Record<string, unknown> | undefined;
    if (!entry) return {};
    return {
      title: typeof entry.title === 'string' ? entry.title : undefined,
      description: typeof entry.introduction === 'string' ? entry.introduction : undefined,
    };
  }

  const raw = readLocaleJson(locale, cfg.chapterFileKey);
  const root = unwrapSingleKey(raw);
  const chapterList = root[cfg.chapterListKey || ''];
  if (!Array.isArray(chapterList) || !cfg.chapterNumberKey) return {};
  const chapterNumberKey = cfg.chapterNumberKey;

  const selected = chapterList.find((it) => isPlainObject(it) && Number(it[chapterNumberKey]) === chapterNum) as Record<string, unknown> | undefined;
  if (!selected) return {};

  const itemList = selected[cfg.itemListKey];
  if (!Array.isArray(itemList)) return {};

  const entry = itemList.find((it) => isPlainObject(it) && Number(it[cfg.itemNumberKey]) === itemNum) as Record<string, unknown> | undefined;
  if (!entry) return {};

  return {
    title: typeof entry.title === 'string' ? entry.title : undefined,
    description: typeof entry.introduction === 'string' ? entry.introduction : undefined,
  };
}

export async function generateStaticParams(): Promise<Array<{ slug: string; chapter: string; item: string }>> {
  const params: Array<{ slug: string; chapter: string; item: string }> = [];

  for (let mandala = 1; mandala <= 10; mandala += 1) {
    const raw = readLocaleJson('en', `vedas_rigveda_madala${mandala}`);
    const root = unwrapSingleKey(raw);
    const hymns = Array.isArray(root.hymns) ? root.hymns : [];
    for (const hymn of hymns) {
      if (!isPlainObject(hymn)) continue;
      const num = Number(hymn.hymn_number);
      if (!Number.isFinite(num)) continue;
      params.push({
        slug: 'rigveda',
        chapter: `mandala-${mandala}`,
        item: `hymn-${num}`,
      });
    }
  }

  const yajurRaw = readLocaleJson('en', 'vedas_yajurveda_structure');
  const yajurRoot = unwrapSingleKey(yajurRaw);
  const yajurChapters = Array.isArray(yajurRoot.chapters) ? yajurRoot.chapters : [];
  for (const chapter of yajurChapters) {
    if (!isPlainObject(chapter)) continue;
    const chapterNum = Number(chapter.chapter);
    if (!Number.isFinite(chapterNum)) continue;
    const mantras = Array.isArray(chapter.mantras) ? chapter.mantras : [];
    for (const mantra of mantras) {
      if (!isPlainObject(mantra)) continue;
      const itemNum = Number(mantra.mantra_number);
      if (!Number.isFinite(itemNum)) continue;
      params.push({
        slug: 'yajurveda',
        chapter: `chapter-${chapterNum}`,
        item: `mantra-${itemNum}`,
      });
    }
  }

  const atharvaRaw = readLocaleJson('en', 'vedas_atharvaveda_structure');
  const atharvaRoot = unwrapSingleKey(atharvaRaw);
  const books = Array.isArray(atharvaRoot.books) ? atharvaRoot.books : [];
  for (const book of books) {
    if (!isPlainObject(book)) continue;
    const bookNum = Number(book.book);
    if (!Number.isFinite(bookNum)) continue;
    const hymns = Array.isArray(book.hymns) ? book.hymns : [];
    for (const hymn of hymns) {
      if (!isPlainObject(hymn)) continue;
      const itemNum = Number(hymn.hymn_number);
      if (!Number.isFinite(itemNum)) continue;
      params.push({
        slug: 'atharvaveda',
        chapter: `book-${bookNum}`,
        item: `hymn-${itemNum}`,
      });
    }
  }

  return params;
}

function chapterFileKey(slug: string, chapter: string): string {
  const chapterNum = parseNum(chapter);
  if (slug === 'rigveda') return `vedas_rigveda_madala${chapterNum}`;
  if (slug === 'yajurveda') return 'vedas_yajurveda';
  if (slug === 'atharvaveda') return 'vedas_atharvaveda';
  return slug;
}

export async function generateMetadata(props: { params: Promise<{ slug: string; chapter: string; item: string }> }) {
  const { slug, chapter, item } = await props.params;
  const generate = createGenerateMetadata(chapterFileKey(slug, chapter));
  const meta = await generate({});

  const metaObj = (meta ?? {}) as Record<string, unknown>;
  const metaAlternates = isPlainObject(metaObj.alternates) ? (metaObj.alternates as Record<string, unknown>) : {};
  const metaOpenGraph = isPlainObject(metaObj.openGraph) ? (metaObj.openGraph as Record<string, unknown>) : {};

  const locale = resolveLocaleFromHeaders();
  const itemMeta = getItemTitleAndDesc(locale, slug, chapter, item);
  const baseUrl = String(process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in').replace(/\/$/, '');
  const canonical = `${baseUrl}/vedas/${slug}/${chapter}/${item}`;

  const itemLabel = item.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const chapterLabel = chapter.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const fallbackTitle = `${chapterLabel} ${itemLabel} – ${slug.replace(/\b\w/g, (c) => c.toUpperCase())}`;

  const title = itemMeta.title || meta?.title || fallbackTitle;
  const description = itemMeta.description || meta?.description;

  return {
    ...metaObj,
    title,
    description,
    alternates: { ...metaAlternates, canonical },
    openGraph: {
      ...metaOpenGraph,
      title: itemMeta.title || (metaOpenGraph.title as string | undefined) || title,
      description: itemMeta.description || (metaOpenGraph.description as string | undefined) || description,
      url: canonical,
    },
  };
}

export default async function Page(props: { params: Promise<{ slug: string; chapter: string; item: string }> }) {
  const { slug, chapter, item } = await props.params;
  return <ItemClient slug={slug} chapter={chapter} item={item} />;
}
