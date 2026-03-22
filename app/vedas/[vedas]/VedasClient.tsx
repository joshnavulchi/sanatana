"use client";

import { useEffect, useState } from 'react';
import { DEFAULT_LOCALE } from '@lib/i18n';
import Loader from '@components/loader';
import { fetchContentByRoute } from '@lib/siteUtils';
import { useLocale } from '@app/context/locale-context';

import PageLayout from '@components/common/PageLayout';

type VedasData = {
  title?: string;
  description?: string;
  content?: string | Record<string, any>;
  children?: string[];
  meta?: Record<string, any>;
  [key: string]: any;
};

type Props = {
  initialData?: VedasData | null;
  initialLocale?: string;
  vedas: string[];
};

export default function VedasClient({ initialData, initialLocale, vedas }: Props) {
  const [data, setData] = useState<VedasData | null>(initialData || null);
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
        const res = await fetchContentByRoute(locale, ['vedas', ...(vedas || [])]);
        let parsed = res.data as any;

        if (!parsed) {
          if (!cancelled) setError('Vedas content not found');
          return;
        }

        if (vedas && vedas.length > 0 && typeof parsed === 'object') {
          const key = vedas[0];
          if (parsed[key] && typeof parsed[key] === 'object') parsed = parsed[key];
        }

        if (!cancelled) setData(parsed || null);
      } catch (e) {
        if (!cancelled) setError('Vedas content not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [initialData, initialLocale, ctxLocale, locale, vedas]);

  const title = String(data?.meta?.title ?? data?.title ?? vedas.join(' / ') ?? 'Vedas');
  const description = String(data?.meta?.description ?? data?.description ?? '');

  const breadcrumbs = [
    { labelKey: 'Home', href: '/' },
    { label: 'Vedas', href: '/vedas' },
  ];
  if (vedas && vedas.length > 0) breadcrumbs.push({ label: vedas[0], href: `/vedas/${vedas[0]}` });

  const metaKey = (data?.meta?.key && String(data.meta.key)) || `vedas/${vedas.join('/')}/index`;

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
      {/* Render introduction if present */}
      {typeof data?.introduction === 'string' && (
        <section>
          <p className="text-base text-gray-800 leading-relaxed mb-4">{data.introduction}</p>
        </section>
      )}

      {/* Sections */}
      {Array.isArray(data?.section) && data.section.length > 0 && (
        <>
          {data.section.map((item: any, idx: number) => {
            const secTitle = typeof item?.section === 'string' ? item.section : null;
            const secContent = typeof item?.content === 'string' ? item.content : null;
            return (
              <section key={idx}>
                {secTitle ? <h2 className="text-2xl font-semibold text-red-800 mb-3 mt-6">{secTitle}</h2> : null}
                {secContent ? <p className="text-base text-gray-800 leading-relaxed mb-4">{secContent}</p> : null}
              </section>
            );
          })}
        </>
      )}

      {/* Fallback rendering for simple string keys */}
      {(() => {
        const EXCLUDED = new Set<string>(['meta', 'openGraph', 'schema', 'section', 'introduction', 'title', 'description']);
        const nodes: React.ReactNode[] = [];
        for (const key of Object.keys(data)) {
          if (EXCLUDED.has(key)) continue;
          const val = data[key];
          if (typeof val !== 'string') continue;
          if (!val) continue;
          nodes.push(
            <section key={key}><p className="text-base text-gray-800 leading-relaxed mb-4">{val}</p></section>
          );
        }
        return nodes.length > 0 ? nodes : null;
      })()}
    </PageLayout>
  );
}
