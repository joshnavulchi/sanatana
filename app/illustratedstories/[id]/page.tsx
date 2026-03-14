/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

const ns: Record<string, unknown> = {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'illustrated_stories' ? parts.shift() : 'illustrated_stories';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { t, getMeta, detectLocale, DEFAULT_LOCALE, detectServerLocaleFromHeaders } from '@lib/i18n';
import { loadLocaleNamespace } from '@lib/i18n.server';
import { headers } from 'next/headers';
import PageLayout from '@components/common/PageLayout';
import LazyImage from '@components/lazyimage';
import Link from 'next/link';
import storiesEn from '../../../public/locales/en/kidszone_illustratedstories.json';

function resolveLocaleFromHeaders() {
  try {
    const h: any = headers();
    return detectServerLocaleFromHeaders(h);
  } catch (e) {
    return DEFAULT_LOCALE;
  }
}

export async function generateMetadata({ params, searchParams }: { params: any, searchParams?: any }) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  // load chapters from locale translations; if the locale doesn't include
  // structured chapters, fall back to English translations (no combined file)
  let chaptersRaw: any = __getLoc('illustrated_stories.kids_indian_stories');
  if (!Array.isArray(chaptersRaw)) {
    chaptersRaw = __getLoc('illustrated_stories.kids_indian_stories');
  }
  const chapters: any[] = Array.isArray(chaptersRaw) ? chaptersRaw : [];
  const resolvedParams = params && typeof params.then === 'function' ? await params : params;
  const num = Number(resolvedParams?.kids_indian_stories || 0);
  const ch = Array.isArray(chapters) ? chapters.find((c: any) => Number(c.chapter) === num) : null;
  const title = ch ? `${S('illustrated_stories.kids_indian_stories.title')} — Chapter ${ch.chapter}: ${ch.title}` : `${S('illustrated_stories.kids_indian_stories.title')} — kids_indian_stories ${num}`;
  const meta = getMeta('illustrated_slug', { title: title, excerpt: ch && ch.summary ? ch.summary : '' }, locale);
  const description = ch && ch.summary ? ch.summary : meta.description;
  const keywords = (meta.keywords && String(meta.keywords).trim()) ? meta.keywords : `${S('illustrated_stories.kids_indian_stories.title')}, chapter ${num}`;
  const ogImages = meta.ogImage ? [meta.ogImage] : undefined;
  return {
    title,
    description,
    keywords,
    openGraph: { title, description, images: ogImages },
  };
}

// Analyzer-friendly stub: ensure Next static-export builds recognise a
// top-level `generateStaticParams` during static analysis. Returns an
// empty array so the route can be exported without enumerating items.
export async function generateStaticParams() {
  const stories = (storiesEn as any)?.kidszone_illustratedstories?.kids_indian_stories;
  if (!Array.isArray(stories) || stories.length === 0) return [{ id: 'placeholder' }];
  return stories
    .filter((story: any) => story && story.id !== undefined && story.id !== null)
    .map((story: any) => ({ id: String(story.id) }));
}

async function loadStories(locale: string) {
  const localized = await loadLocaleNamespace(locale, 'kidszone_illustratedstories');
  const stories = (localized as any)?.kidszone_illustratedstories?.kids_indian_stories;
  if (Array.isArray(stories)) return stories;
  if (locale !== 'en') return loadStories('en');
  return [];
}

export default async function Page({ params, searchParams }: any) {
  const localeFromParams = await detectLocale(searchParams);
  const locale = localeFromParams || resolveLocaleFromHeaders();
  const stories = await loadStories(locale);
  const S = (k: string, l?: any) => String(t(k, l));
  const id = String(params.id);
  const idx = stories.findIndex((s: any) => String(s.id) === id);
  const item = idx >= 0 ? stories[idx] : null;

  if (!item) {
    return (
      <PageLayout
        metaKey=""
        title={S('illustrated_stories.comicNotFoundTitle')}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: String(__getLoc('illustrated_stories.comicNotFoundTitle')) }]}
      >
        <p>{S('illustrated_stories.comicNotFoundDesc')}</p>
      </PageLayout>
    );
  }

  const prev = idx > 0 ? stories[idx - 1] : null;
  const next = idx < stories.length - 1 ? stories[idx + 1] : null;

  return (
    <>
      <PageLayout metaKey="" title={item.title} breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: item.title }, { label: item.title }]}>
        <div>{item.origin}</div>
        <div>
          <div>
            <LazyImage src={item.imgSrc || `/images/stories/${item.id}.webp`} alt={item.imgAlt || item.title} fill style={{ objectFit: 'cover' }} />
          </div>
        </div>
        <p>{item.summary}</p>
        {item.moral ? <p><strong>{S('illustrated_stories.moralLabel')}</strong> {item.moral}</p> : null}
        {item.characters?.length ? <div><strong>{S('illustrated_stories.kids_indian_stories.title')}</strong> {item.characters.join(', ')}</div> : null}
        {item.themes?.length ? <div><strong>{S('illustrated_stories.themesLabel')}</strong> {item.themes.join(', ')}</div> : null}

        <div>
          {prev ? (
            <Link href={`/kidszone/illustratedstories/${prev.id}`}>&larr; {prev.title}</Link>
          ) : <div />}
          {next ? (
            <Link href={`/kidszone/illustratedstories/${next.id}`}>{next.title} &rarr;</Link>
          ) : <div />}
        </div>
      </PageLayout>
    </>
  );
}

/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
