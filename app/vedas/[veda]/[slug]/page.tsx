/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { DEFAULT_LOCALE } from '@lib/i18n';
import { fetchContentByRoute } from '@lib/siteUtils';
import { createGenerateMetadata, resolveParams } from '@lib/pageUtils';
import { notFound } from 'next/navigation';

import PageLayout from '@components/common/PageLayout';

// For static export we must provide all params at build time.
export async function generateStaticParams() {
  const locale = DEFAULT_LOCALE;
  const vedas = ['rigveda', 'yajurveda', 'samaveda', 'atharvaveda'];
  const params: Array<{ veda: string; slug: string }> = [];

  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      for (const v of vedas) {
        const vPath = path.join(process.cwd(), 'public', 'data', 'locales', String(locale), 'vedas', v);
        if (!fs.existsSync(vPath)) continue;
        const children = fs.readdirSync(vPath, { withFileTypes: true })
          .filter((d: any) => d.isDirectory())
          .map((d: any) => String(d.name))
          .filter(Boolean);

        for (const c of children) {
          // Consider any child folder that contains JSON files or an index file
          try {
            const childPath = path.join(vPath, c);
            if (!fs.existsSync(childPath)) continue;
            const entries = fs.readdirSync(childPath, { withFileTypes: true }).map((e: any) => String(e.name));
            const hasJson = entries.some((n: string) => n.toLowerCase().endsWith('.json'));
            const hasIndexFile = entries.some((n: string) => n === 'index.json' || n === 'index.ts' || n === 'index.js');
            if (hasJson || hasIndexFile) {
              params.push({ veda: v, slug: c });
            }
          } catch (e) {
            // ignore and skip this child
          }
        }
      }
    } catch (e) {
      // If filesystem access fails, return a small default set so build doesn't break
      return vedas.flatMap((v) => [{ veda: v, slug: 'index' }]);
    }
  }

  return params;
}

export async function generateMetadata({ params, searchParams }: { params?: { veda?: string; slug?: string } | Promise<any>; searchParams?: any }) {
  const resolvedParams = await resolveParams(params);

  const v = resolvedParams?.veda;
  const s = resolvedParams?.slug;
  const fallbackKey = v && s ? `vedas/${v}/${s}/index` : (v ? `vedas/${v}/index` : 'vedas');

  if (v && s) {
    const locale = DEFAULT_LOCALE;
    const fetched = await fetchContentByRoute(locale, ['vedas', v, s]);
    const data = fetched && fetched.data ? (fetched.data as any) : null;
    function unwrapPageData(source: any) {
      let result = source;
      while (result && typeof result === 'object' && !result.meta && !result.title && !result.description) {
        const entries = Object.entries(result || {}).filter(([_k, v]) => v && typeof v === 'object' && !Array.isArray(v));
        if (entries.length !== 1) break;
        result = entries[0][1];
      }
      return result;
    }
    const pageData = unwrapPageData(data);
    const metaKey = pageData?.meta?.key ? String(pageData.meta.key) : fallbackKey;
    return await createGenerateMetadata(metaKey)({ searchParams });
  }

  return await createGenerateMetadata(fallbackKey)({ searchParams });
}

export default async function Page({ params }: { params: { veda?: string; slug?: string } | Promise<{ veda?: string; slug?: string }> }) {
  const resolved = await resolveParams(params);

  const veda = typeof resolved?.veda === 'string' ? resolved.veda : undefined;
  const slug = typeof resolved?.slug === 'string' ? resolved.slug : undefined;
  if (!veda || !slug) return notFound();

  const locale = DEFAULT_LOCALE;

  // fetch the slug content
  const fetched = await fetchContentByRoute(locale, ['vedas', veda, slug]);
  const data = fetched && fetched.data ? (fetched.data as any) : null;
  if (!data) return notFound();
  function unwrapPageData(source: any) {
    let result = source;
    while (result && typeof result === 'object' && !result.meta && !result.title && !result.description) {
      const entries = Object.entries(result || {}).filter(([_k, v]) => v && typeof v === 'object' && !Array.isArray(v));
      if (entries.length !== 1) break;
      result = entries[0][1];
    }
    return result;
  }
  const pageData = unwrapPageData(data);
  if (!pageData) return notFound();

  const pageDataArray = (pageData as any).hymns || (pageData as any).suktas || (pageData as any).chants || (pageData as any).mantras || [];

  const metaKey = pageData?.meta?.key ? String(pageData.meta.key) : `vedas/${veda}/${slug}/index`;
  const titleText = pageData?.title ? String(pageData.title) : `${veda} ${slug.replace(/book/i, 'Book ')}`;
  const descriptionText = pageData?.description
    ? String(pageData.description)
    : pageData?.meta?.description
      ? String(pageData.meta.description)
      : '';
  const capitalize = (s: string) => (s && typeof s === 'string' ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Vedas', href: '/vedas' },
    { label: capitalize(veda), href: `/vedas/${veda}` },
    { label: titleText, href: `/vedas/${veda}/${slug}` },
  ];

  return (
    <PageLayout metaKey={metaKey} title={titleText} description={descriptionText} breadcrumbs={breadcrumbs} className="layout-md">
      <div className="prose prose-lg max-w-none">
        {pageDataArray.map((item: any, i: number) => {
          const hasVerses = item && Array.isArray(item.verses) && item.verses.length > 0;
          const numberLabel = item.hymn_number ?? item.chant_number ?? item.mantra_number ?? item.suktas_number ?? item.verse_number ?? null;
          const title = item.title || item.theme || null;

          if (hasVerses) {
            return (
              <div key={i} className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{item.title}</h2>
                {item.verses.map((verse: any, j: number) => (
                  <div key={j} className="bg-white/95 p-4 mb-4 rounded-lg shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      {verse.verse_number !== undefined && (
                        <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-800 px-3 py-1 text-lg sm:text-base font-medium">
                          Verse {String(verse.verse_number)}
                        </span>
                      )}
                      {verse.title && <span className="text-lg sm:text-base uppercase tracking-[0.18em] text-gray-500">{verse.title}</span>}
                    </div>
                    {verse.sanskrit && (
                      <p className="text-xl leading-relaxed text-gray-900 mb-3">{verse.sanskrit}</p>
                    )}
                    {verse.transliteration && (
                      <p className="text-base text-gray-700 italic mb-4">{verse.transliteration}</p>
                    )}
                    {verse.meaning && (
                      <div className="space-y-3 mb-4">
                        <div className="text-lg sm:text-base font-semibold uppercase tracking-[0.18em] text-gray-500">Meaning</div>
                        {typeof verse.meaning === 'string' ? (
                          <p className="text-lg leading-relaxed text-red-600">{verse.meaning}</p>
                        ) : (
                          Object.entries(verse.meaning).map(([k, v]) => (
                            <div key={k} className="rounded-xl bg-gray-50 p-3">
                              <div className="text-lg sm:text-base font-semibold text-gray-700 mb-1">{k.replace(/[-_]/g, ' ')}</div>
                              <p className="text-lg sm:text-base leading-relaxed text-gray-600">{String(v)}</p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          }

          // standalone chants/mantras
          return (
            <div key={i} className="mb-6 bg-white/95 p-4 rounded-lg shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                {numberLabel !== null && (
                  <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-800 px-3 py-1 text-lg sm:text-base font-medium">
                    {item.hymn_number ? `Hymn ${numberLabel}` : item.chant_number ? `Chant ${numberLabel}` : item.mantra_number ? `Mantra ${numberLabel}` : `Item ${numberLabel}`}
                  </span>
                )}
                {title && <span className="text-lg sm:text-base uppercase tracking-[0.18em] text-gray-500">{title}</span>}
              </div>
              {item.sanskrit && <p className="text-xl leading-relaxed text-gray-900 mb-2">{item.sanskrit}</p>}
              {item.transliteration && <p className="text-base text-gray-700 italic mb-2">{item.transliteration}</p>}
              {item.meaning && (
                <div className="space-y-3 mt-3">
                  <div className="text-lg sm:text-base font-semibold uppercase tracking-[0.18em] text-gray-500">Meaning</div>
                  {typeof item.meaning === 'string' ? (
                    <p className="text-lg leading-relaxed text-red-600">{item.meaning}</p>
                  ) : (
                    Object.entries(item.meaning).map(([k, v]) => (
                      <div key={k} className="rounded-xl bg-gray-50 p-3">
                        <div className="text-lg sm:text-base font-semibold text-gray-700 mb-1">{k.replace(/[-_]/g, ' ')}</div>
                        <p className="text-lg sm:text-base leading-relaxed text-gray-600">{String(v)}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */