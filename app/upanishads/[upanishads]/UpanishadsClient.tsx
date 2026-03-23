"use client";

import { useEffect, useState } from 'react';
import { DEFAULT_LOCALE } from '@lib/i18n';
import Loader from '@components/loader';
import { fetchContentByRoute } from '@lib/siteUtils';
import { useLocale } from '@app/context/locale-context';
import PageLayout from '@components/common/PageLayout';

type UpanishadsData = {
  title?: string;
  description?: string;
  content?: string | Record<string, any>;
  children?: string[];
  [key: string]: any;
};

type Props = {
  initialData?: UpanishadsData | null;
  initialLocale?: string;
  segments: string[];
};

export default function UpanishadsClient({ initialData, initialLocale, segments }: Props) {
  const [data, setData] = useState<UpanishadsData | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);

  const { locale: ctxLocale } = useLocale();
  const locale = initialLocale || ctxLocale || DEFAULT_LOCALE;

  useEffect(() => {
    if (initialData) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchContentByRoute(locale, ['upanishads', ...(segments || [])]);
        let parsed = res.data as any;

        if (!parsed) {
          // try fallback to english handled by fetchUpanishadsContent
          if (!cancelled) setError('Upanishads content not found');
          return;
        }

        // Unwrap top-level upanishad key if present (e.g., { "isha": { ... } })
        if (segments && segments.length > 0 && typeof parsed === 'object') {
          const key = segments[0];
          if (parsed[key] && typeof parsed[key] === 'object') parsed = parsed[key];
          else {
            // If JSON is wrapped under a single top-level key like
            // { "upanishads_isha": { ... } }, unwrap it.
            const pkeys = Object.keys(parsed || {});
            if (pkeys.length === 1 && typeof parsed[pkeys[0]] === 'object') {
              parsed = parsed[pkeys[0]];
            } else {
              const altKey = `upanishads_${key}`;
              if (parsed[altKey] && typeof parsed[altKey] === 'object') parsed = parsed[altKey];
            }
          }
        }

        // Keep parsed as-is (we will use meta.title/description for header
        // but explicitly exclude metadata keys when rendering UI below).
        if (!cancelled) setData(parsed || null);
      } catch (e) {
        if (!cancelled) setError('Upanishads content not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [initialData, initialLocale, ctxLocale, locale, segments]);

  const title = String(data?.meta?.title ?? data?.title ?? segments.join(' / ') ?? 'Upanishads');
  const description = String(data?.meta?.description ?? data?.description ?? '');

  const breadcrumbs = [
    { labelKey: 'Home', href: '/' },
    { label: 'Upanishads', href: '/upanishads' },
  ];
  if (segments && segments.length > 0) breadcrumbs.push({ label: segments[0], href: `/upanishads/${segments[0]}` });

  const metaKey = (data?.meta?.key && String(data.meta.key)) || `upanishads/${segments.join('/')}/index`;

  if (loading) {
    return (
      <PageLayout metaKey={metaKey} title={title} description={description} breadcrumbs={breadcrumbs} className="layout-md">
        <div className="flex items-center justify-center py-8"><Loader /></div>
      </PageLayout>
    );
  }

  if (error || !data) {
    return (
      <PageLayout metaKey={metaKey} title={title} description={description} breadcrumbs={breadcrumbs} className="layout-md">
        <div className="py-12 text-center text-gray-600">{error || 'Content not available.'}</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey={metaKey} title={title} description={description} breadcrumbs={breadcrumbs} className="layout-md">
      {/* Introduction */}
      {typeof data?.introduction === 'string' && (
        <section>
          <p className="text-base text-gray-800 leading-relaxed mb-4">{data.introduction}</p>
        </section>
      )}
      {/* Sections array */}
      {Array.isArray(data?.section) && data.section.length > 0 && (
        <>
          {data.section.map((item: any, idx: number) => {
            const secTitle = typeof item?.section === 'string' ? item.section : null;
            const secContent = typeof item?.content === 'string' ? item.content : null;
            return (
              <section key={idx}>
                {secTitle ? (
                  <h2 className="text-2xl font-semibold text-red-800 mb-3 mt-6">{secTitle}</h2>
                ) : null}
                {secContent ? (
                  <p className="text-base text-gray-800 leading-relaxed mb-4">{secContent}</p>
                ) : null}
              </section>
            );
          })}
        </>
      )}

      {/* Scripture text (detailed sections) */}
      {Array.isArray(data?.scripture_text) && data.scripture_text.length > 0 && (
        <div className="mt-6">
          {data.scripture_text.map((item: any, i: number) => {
            const sTitle = typeof item?.section === 'string' ? item.section : null;
            const sContent = typeof item?.content === 'string' ? item.content : null;
            return (
              <section key={`scripture-${i}`}>
                {sTitle ? (
                  <h2 className="text-2xl font-semibold text-red-800 mb-3 mt-6">{sTitle}</h2>
                ) : null}
                {sContent ? (
                  <p className="text-base text-gray-800 leading-relaxed mb-4">{sContent}</p>
                ) : null}
              </section>
            );
          })}
        </div>
      )}

      {/* Chapters list */}
      {Array.isArray(data?.chapters) && data.chapters.length > 0 && (
        <section className="mt-6">
          <h2 className="text-2xl font-semibold text-red-800 mb-3">Chapters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.chapters.map((c: any, i: number) => (
              <a key={`chapter-${i}`} href={c?.path || '#'} className="block rounded-lg border border-amber-100 p-4 bg-white hover:shadow-md">
                <div className="text-base font-semibold text-gray-900">{String(c?.title ?? `Chapter ${c?.chapter ?? i + 1}`)}</div>
                {c?.chapter && <div className="text-sm text-gray-600 mt-1">Chapter {String(c.chapter)}</div>}
                {c?.verses && Array.isArray(c.verses) && (
                  <div className="text-sm text-gray-600 mt-1">{String(c.verses.length)} verses</div>
                )}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Major deities */}
      {Array.isArray(data?.major_rigvedic_deities) && data.major_rigvedic_deities.length > 0 && (
        <section className="mt-6">
          <h2 className="text-2xl font-semibold text-red-800 mb-3">Major Deities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.major_rigvedic_deities.map((d: any, i: number) => (
              <div key={`deity-${i}`} className="rounded-lg border border-amber-100 p-4 bg-white">
                <h3 className="text-base font-semibold text-gray-900">{String(d?.name || '')}</h3>
                {d?.role && <div className="text-sm text-gray-700 mt-1">{d.role}</div>}
                {d?.importance && <p className="text-base text-gray-800 mt-2">{d.importance}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mandalas overview */}
      {Array.isArray(data?.mandalas) && data.mandalas.length > 0 && (
        <section className="mt-6">
          <h2 className="text-2xl font-semibold text-red-800 mb-3">Mandalas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.mandalas.map((m: any, i: number) => (
              <a key={`mandala-${i}`} href={m?.path || '#'} className="block rounded-lg border border-amber-100 p-4 bg-white hover:shadow-md">
                <div className="flex items-baseline justify-between">
                  <div className="text-xl font-semibold text-amber-800">Mandala {String(m?.mandala ?? m?.number ?? i + 1)}</div>
                  <div className="text-sm text-gray-600">{String(m?.hymn_count ?? '')} hymns</div>
                </div>
                {m?.hymns && Array.isArray(m.hymns) && m.hymns.length > 0 && (
                  <p className="text-sm text-gray-700 mt-2">Example: {String(m.hymns[0]?.title || '')}</p>
                )}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Related concepts tags */}
      {Array.isArray(data?.related_concepts) && data.related_concepts.length > 0 && (
        <section className="mt-6">
          <h2 className="text-2xl font-semibold text-red-800 mb-3">Related Concepts</h2>
          <div className="flex flex-wrap gap-2">
            {data.related_concepts.map((c: any, i: number) => (
              <span key={`concept-${i}`} className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-sm text-amber-800 border border-amber-100">{String(c)}</span>
            ))}
          </div>
        </section>
      )}

      {/* Philosophical explanation (try several common keys) */}
      {(() => {
        const keys = [
          'philosophical explanation',
          'philosophicalExplanation',
          'philosophical_explanation',
          'philosophy',
          'philosophical',
        ];
        let val: string | null = null;
        for (const k of keys) {
          if (typeof data?.[k] === 'string') { val = data[k]; break; }
        }
        if (val) {
          return (
            <section>
              <h2 className="text-2xl font-semibold text-red-800 mb-3 mt-6">Philosophical Insights</h2>
              <p className="text-base text-gray-800 leading-relaxed mb-4">{val}</p>
            </section>
          );
        }
        return null;
      })()}

      {/* Generic safe rendering: render remaining top-level string values only (no keys), skip metadata */}
      {(() => {
        const EXCLUDED = new Set<string>([
          'meta', 'openGraph', 'opengraph', 'schema', 'canonical', 'url', 'keywords', 'images', 'publisher', 'author', 'section', 'introduction', 'title', 'description'
        ]);
        const rendered = new Set<string>();
        // avoid duplicating title/description/philosophy
        if (title) rendered.add(title);
        if (description) rendered.add(description);

        const nodes: React.ReactNode[] = [];
        for (const key of Object.keys(data)) {
          if (EXCLUDED.has(key)) continue;
          const val = data[key];
          if (typeof val !== 'string') continue;
          if (!val || rendered.has(val)) continue;
          rendered.add(val);
          nodes.push(
            <section key={key}>
              <p className="text-base text-gray-800 leading-relaxed mb-4">{val}</p>
            </section>
          );
        }
        return nodes.length > 0 ? nodes : null;
      })()}
    </PageLayout>
  );
}
