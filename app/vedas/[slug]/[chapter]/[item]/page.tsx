import { createGenerateMetadata } from '@lib/pageUtils';
import ItemClient from './itemclient';
import fs from 'fs';
import path from 'path';
import { resolveLocaleFromHeaders } from '@lib/pageUtils.server';

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

function parseNum(value: string): number {
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

export function generateStaticParams() {
  const params: { slug: string; chapter: string; item: string }[] = [];

  for (let mandala = 1; mandala <= 10; mandala += 1) {
    const raw = readLocaleJson('en', `vedas_rigveda_madala${mandala}`);
    const root = unwrapSingleKey(raw);
    const hymns = Array.isArray(root.hymns) ? root.hymns : [];
    for (const hymn of hymns) {
      if (!isPlainObject(hymn)) continue;
      const num = Number(hymn.hymn_number);
      if (!Number.isFinite(num)) continue;
      params.push({ slug: 'rigveda', chapter: `mandala-${mandala}`, item: `hymn-${num}` });
    }
  }

  const yajurRaw = readLocaleJson('en', 'vedas_yajurveda_structure');
  const yajurRoot = unwrapSingleKey(yajurRaw);
  const yajurChapters = Array.isArray(yajurRoot.chapters) ? yajurRoot.chapters : [];
  for (const chapter of yajurChapters) {
    if (!isPlainObject(chapter)) continue;
    const chapterNum = Number(chapter.chapter);
    const mantras = Array.isArray(chapter.mantras) ? chapter.mantras : [];
    for (const mantra of mantras) {
      if (!isPlainObject(mantra)) continue;
      const itemNum = Number(mantra.mantra_number);
      if (!Number.isFinite(chapterNum) || !Number.isFinite(itemNum)) continue;
      params.push({ slug: 'yajurveda', chapter: `chapter-${chapterNum}`, item: `mantra-${itemNum}` });
    }
  }

  const atharvaRaw = readLocaleJson('en', 'vedas_atharvaveda_structure');
  const atharvaRoot = unwrapSingleKey(atharvaRaw);
  const books = Array.isArray(atharvaRoot.books) ? atharvaRoot.books : [];
  for (const book of books) {
    if (!isPlainObject(book)) continue;
    const bookNum = Number(book.book);
    const hymns = Array.isArray(book.hymns) ? book.hymns : [];
    for (const hymn of hymns) {
      if (!isPlainObject(hymn)) continue;
      const itemNum = Number(hymn.hymn_number);
      if (!Number.isFinite(bookNum) || !Number.isFinite(itemNum)) continue;
      params.push({ slug: 'atharvaveda', chapter: `book-${bookNum}`, item: `hymn-${itemNum}` });
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
