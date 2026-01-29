/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getMeta, detectLocale, DEFAULT_LOCALE, detectServerLocaleFromHeaders } from '@/lib/i18n';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import PageLayout from '@components/common/PageLayout';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import LazyImage from '@components/lazy-image/LazyImage';
import Link from 'next/link';

function resolveLocaleFromHeaders() {
  try {
    const h: any = headers();
    return detectServerLocaleFromHeaders(h);
  } catch (e) {
    return DEFAULT_LOCALE;
  }
}

export async function createGenerateMetadata({ params, searchParams }: { params: any, searchParams?: any }) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  // load chapters from locale translations; if the locale doesn't include
  // structured chapters, fall back to English translations (no combined file)
  let chaptersRaw: any = t('illustrated_stories.kids_indian_stories', locale); 
  if (!Array.isArray(chaptersRaw)) {
    chaptersRaw = t('illustrated_stories.kids_indian_stories');
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
  try {
    const localesDir = path.join(process.cwd(), 'public', 'locales');
    if (!fsSync.existsSync(localesDir)) return [{ id: 'placeholder' }];
    const localeDirs = fsSync.readdirSync(localesDir).filter((d: string) => {
      try { return fsSync.statSync(path.join(localesDir, d)).isDirectory(); } catch (e) { return false; }
    });

    const ids = new Set<string>();
    for (const loc of localeDirs) {
      try {
        const file = path.join(localesDir, loc, 'illustrated_stories.json');
        if (!fsSync.existsSync(file)) continue;
        const raw = fsSync.readFileSync(file, 'utf8');
        const doc = JSON.parse(raw);
        const stories = doc && (doc.illustrated_stories || doc.illustratedstories) && (doc.illustrated_stories.kids_indian_stories || doc.illustratedstories.kids_indian_stories) ? (doc.illustrated_stories?.kids_indian_stories || doc.illustratedstories?.kids_indian_stories) : [];
        if (Array.isArray(stories)) {
          for (const s of stories) {
            if (s && (s.id !== undefined && s.id !== null)) ids.add(String(s.id));
          }
        }
      } catch (e) {
        // ignore per-locale failures
      }
    }
    const result = Array.from(ids).map((id) => ({ id }));
    return result.length > 0 ? result : [{ id: 'placeholder' }];
  } catch (err) {
    return [{ id: 'placeholder' }];
  }
}

async function loadStories(locale: string) {
  const file = path.join(process.cwd(), 'public', 'locales', locale, 'illustrated_stories.json');
  try {
    const raw = await fs.readFile(file, 'utf8');
    const doc = JSON.parse(raw);
    return doc?.illustratedstories?.kids_indian_stories ?? [];
  } catch (err) {
    if (locale !== 'en') return loadStories('en');
    return [];
  }
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
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: String(t('illustrated_stories.comicNotFoundTitle')) }]}
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
