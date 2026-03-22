"use client";

import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import Loader from '@components/loader';
import { fetchVedasContent, buildVedasIndexPath } from '@lib/siteUtils';

type VedasData = {
  title?: string;
  description?: string;
  content?: string | Record<string, any>;
  children?: string[];
  [key: string]: any;
};

type Props = {
  initialData?: VedasData | null;
  initialLocale?: string;
  segments: string[];
};

export default function VedasClientRenderer({ initialData, initialLocale, segments }: Props) {
  const [data, setData] = useState<VedasData | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);

  const locale = initialLocale || 'en';

  useEffect(() => {
    if (initialData) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchVedasContent(locale, segments);
        let parsed = res.data as any;

        if (!parsed) {
          // try fallback to english handled by fetchVedasContent
          if (!cancelled) setError('Vedas content not found');
          return;
        }

        // Unwrap top-level veda key if present (e.g., { "rigveda": { ... } })
        if (segments && segments.length > 0 && typeof parsed === 'object') {
          const key = segments[0];
          if (parsed[key] && typeof parsed[key] === 'object') parsed = parsed[key];
        }

        // Remove meta/opengraph/schema from displayed content
        if (parsed && typeof parsed === 'object') {
          const { meta, opengraph, schema, ...rest } = parsed as any;
          parsed = rest;
        }

        if (!cancelled) setData(parsed || null);
      } catch (e) {
        if (!cancelled) setError('Vedas content not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [initialData, initialLocale, locale, segments]);

  const title = String(data?.title || segments.join(' / ') || 'Vedas');
  const description = String(data?.description || '');

  const breadcrumbs = [
    { labelKey: 'Home', href: '/' },
    { label: 'Vedas', href: '/vedas' },
  ];
  if (segments && segments.length > 0) breadcrumbs.push({ label: segments[0], href: `/vedas/${segments[0]}` });

  const metaKey = (buildVedasIndexPath(locale, segments) || `vedas/${segments.join('/')}/index`).replace(/^\//, '');

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
      <div className="prose max-w-none">
        {data?.title && <h1 className="text-3xl font-bold mb-4">{data.title}</h1>}
        {data?.description && <p className="mb-6 text-lg text-gray-700">{data.description}</p>}

        {typeof data?.content === 'string' && (
          <div dangerouslySetInnerHTML={{ __html: data.content as string }} />
        )}

        {data && typeof data?.content === 'object' && (
          <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md overflow-auto">{JSON.stringify(data.content, null, 2)}</pre>
        )}

        {Array.isArray(data?.children) && data.children.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Sections</h2>
            <ul className="list-disc pl-6 space-y-2">
              {data.children.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
