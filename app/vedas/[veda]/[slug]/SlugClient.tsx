"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DEFAULT_LOCALE } from '@lib/i18n';
import Loader from '@components/loader';
import { fetchContentByRoute } from '@lib/siteUtils';
import { useLocale } from '@app/context/locale-context';
import PageLayout from '@components/common/PageLayout';

type SlugData = Record<string, any> | null;

export default function SlugClient({ initialData, initialLocale, veda, slug, siblings }: { initialData?: SlugData; initialLocale?: string; veda: string; slug: string; siblings?: string[] | null }) {
  const [data, setData] = useState<SlugData>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);

  const { locale: ctxLocale } = useLocale();
  const locale = ctxLocale || initialLocale || DEFAULT_LOCALE;

  function SectionTitle({ children }: any) {
    return <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white mt-6 mb-4">{children}</h2>;
  }
  function Paragraph({ children }: any) {
    return <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-5">{children}</p>;
  }

  function isVerseRecord(value: any): value is Record<string, any> {
    return value && typeof value === 'object' && (
      'verse_number' in value || 'sanskrit' in value || 'transliteration' in value || 'meaning' in value
    );
  }

  function renderVerse(verse: Record<string, any>) {
    return (
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 p-5 shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          {verse.verse_number !== undefined && (
            <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300 px-3 py-1 text-sm font-medium">
              Verse {String(verse.verse_number)}
            </span>
          )}
          {verse.title && <span className="text-sm uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">{verse.title}</span>}
        </div>
        {verse.sanskrit && (
          <p className="font-serif text-xl leading-relaxed text-gray-900 dark:text-gray-100 mb-3">{verse.sanskrit}</p>
        )}
        {verse.transliteration && (
          <p className="text-base text-gray-700 dark:text-gray-300 italic mb-4">{verse.transliteration}</p>
        )}
        {verse.meaning && (
          <div className="space-y-3 mb-4">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">Meaning</div>
            {typeof verse.meaning === 'string' ? (
              <Paragraph>{verse.meaning}</Paragraph>
            ) : (
              Object.entries(verse.meaning).map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-3">
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">{k.replace(/[-_]/g, ' ')}</div>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{String(v)}</p>
                </div>
              ))
            )}
          </div>
        )}
        {verse.entities && (
          <div className="space-y-2 mb-3">
            {Object.entries(verse.entities).map(([key, value]) => (
              <div key={key}>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">{key.replace(/[-_]/g, ' ')}</div>
                <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-300">
                  {Array.isArray(value) ? value.map((item: any, idx: number) => (
                    <span key={idx} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-900 px-2.5 py-1">{String(item)}</span>
                  )) : <span>{String(value)}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function RenderValue({ value }: { value: any }) {
    if (value === null || value === undefined) return null;

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return <Paragraph>{String(value)}</Paragraph>;
    }

    if (Array.isArray(value)) {
      if (value.every((v) => typeof v === 'string' || typeof v === 'number')) {
        return (
          <div className="flex flex-wrap gap-2">
            {value.map((v, i) => (
              <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">{String(v)}</span>
            ))}
          </div>
        );
      }

      if (value.every(isVerseRecord)) {
        return (
          <div className="space-y-5">
            {value.map((item, i) => (
              <div key={i}>{renderVerse(item)}</div>
            ))}
          </div>
        );
      }

      return (
        <div className="space-y-3">
          {value.map((item, i) => (
            <div key={i} className="p-4 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 shadow-sm hover:shadow-xl transition-all duration-300">
              {typeof item === 'object' ? <RenderValue value={item} /> : <Paragraph>{String(item)}</Paragraph>}
            </div>
          ))}
        </div>
      );
    }

    if (typeof value === 'object') {
      if (isVerseRecord(value)) {
        return renderVerse(value);
      }

      const excluded = new Set(['meta', 'openGraph', 'schema', 'title', 'description']);
      const entries = Object.entries(value).filter(([k]) => !excluded.has(k));
      if (entries.length === 0) return null;

      const headerKeys = ['section', 'title', 'heading', 'name', 'hymn_number'];
      const headers: any = {};
      const rest: any = {};
      for (const [k, v] of entries) {
        if (headerKeys.includes(k)) headers[k] = v; else rest[k] = v;
      }

      return (
        <div className="mb-4">
          {Object.keys(headers).length > 0 && (
            <div className="mb-3">
              {headers.hymn_number && <h3 className="text-sm font-medium text-indigo-700 mb-1">Hymn {headers.hymn_number}</h3>}
              {headers.title && <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{headers.title}</h4>}
              {headers.section && <h5 className="text-sm text-gray-500 dark:text-gray-400">{headers.section}</h5>}
            </div>
          )}
          {Object.entries(rest).map(([k, v]) => (
            <div key={k} className="mt-4">
              <strong className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">{k.replace(/[-_]/g, ' ')}:</strong>
              <RenderValue value={v} />
            </div>
          ))}
        </div>
      );
    }

    return null;
  }

  useEffect(() => {
    const shouldLoad = !initialData || locale !== initialLocale;
    if (!shouldLoad) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchContentByRoute(locale, ['vedas', veda, slug]);
        const parsed = res.data as any;
        if (!parsed) {
          if (!cancelled) setError('Content not found');
          return;
        }
        if (!cancelled) setData(parsed);
      } catch (e) {
        if (!cancelled) setError('Content load failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [initialData, initialLocale, ctxLocale, locale, veda, slug]);

  let mainData: any = data;
  if (data && !data.meta && !data.title) {
    const entries = Object.entries(data || {});
    if (entries.length === 1 && typeof entries[0][1] === 'object') {
      mainData = entries[0][1];
    }
  }

  const title = String(mainData?.meta?.title ?? mainData?.title ?? slug ?? `${veda}`);
  const description = String(mainData?.meta?.description ?? mainData?.description ?? '');
  const metaKey = (mainData?.meta?.key && String(mainData.meta.key)) || `vedas/${veda}/${slug}/index`;

  const breadcrumbs = [
    { labelKey: 'Home', href: '/' },
    { label: 'Vedas', href: '/vedas' },
    { label: veda, href: `/vedas/${veda}` },
    { label: slug, href: `/vedas/${veda}/${slug}` },
  ];

  const displayEntries = Object.entries(mainData || {}).filter(([k]) => !['meta', 'openGraph', 'schema', 'title', 'description', 'introduction'].includes(k));

  if (loading) return (
    <PageLayout metaKey={metaKey} title={title} description={description} breadcrumbs={breadcrumbs} className="layout-md">
      <div className="flex items-center justify-center py-12"><Loader /></div>
    </PageLayout>
  );

  if (error || !data) return (
    <PageLayout metaKey={metaKey} title={title} description={description} breadcrumbs={breadcrumbs} className="layout-md">
      <div className="py-14 px-6 text-center rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 shadow-sm">
        {error || 'Content not available.'}
      </div>
    </PageLayout>
  );

  return (
    <PageLayout metaKey={metaKey} title={title} description={description} breadcrumbs={breadcrumbs} className="layout-md">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10 py-6">
        <main className="lg:col-span-3 space-y-8">
          {mainData.introduction && <Paragraph>{mainData.introduction}</Paragraph>}

          {displayEntries.map(([k, v]) => (
            <section key={k} className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 p-6 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <SectionTitle>{k.replace(/_/g, ' ')}</SectionTitle>
              <RenderValue value={v} />
            </section>
          ))}
        </main>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contents</h4>
            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              {Array.isArray(siblings) && siblings.length > 0 ? (
                siblings.map((s) => (
                  <li key={s}>
                    <Link
                      href={`/vedas/${veda}/${s}`}
                      className={s === slug ? 'font-semibold text-indigo-700' : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition-colors duration-200'}
                    >
                      {s.replace(/[-_]/g, ' ')}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 dark:text-gray-400">No other items</li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}
