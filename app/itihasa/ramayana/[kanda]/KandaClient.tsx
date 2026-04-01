"use client";

import { useEffect, useState } from 'react';
import { DEFAULT_LOCALE } from '@lib/i18n';
import Loader from '@components/loader';
import { fetchContentByRoute } from '@lib/siteUtils';
import { useLocale } from '@app/context/locale-context';
import PageLayout from '@components/common/PageLayout';

type KandaData = {
  title?: string;
  description?: string;
  content?: any;
  scripture_text?: any;
  philosophical_explanation?: any;
  meta?: Record<string, any>;
  [key: string]: any;
};

type Props = {
  initialData?: KandaData | null;
  initialLocale?: string;
  kanda: string[];
};

export default function KandaClient({ initialData, initialLocale, kanda }: Props) {
  const [data, setData] = useState<KandaData | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);

  const { locale: ctxLocale } = useLocale();
  const locale = initialLocale || ctxLocale || DEFAULT_LOCALE;

  function SectionTitle({ children }: any) {
    return <h2 className="text-2xl font-extrabold mt-6 mb-3">{children}</h2>;
  }

  function Paragraph({ children }: any) {
    return <p className="text-base sm:text-lg leading-relaxed mb-4">{children}</p>;
  }

  function renderContent(content: any, key?: number | string) {
    if (content === null || content === undefined) return null;
    if (typeof content === 'string' || typeof content === 'number') {
      return <Paragraph key={key}>{String(content)}</Paragraph>;
    }
    if (Array.isArray(content)) {
      return (
        <div key={key} className="space-y-3">
          {content.map((c, i) => (
            <div key={i}>{renderContent(c, i)}</div>
          ))}
        </div>
      );
    }
    if (typeof content === 'object') {
      if (content.section || content.title || content.heading) {
        return (
          <div key={key} className="mb-4">
            {content.section && <h3 className="text-lg font-semibold mb-1">{content.section}</h3>}
            {content.title && <h3 className="text-lg font-semibold mb-1">{content.title}</h3>}
            {content.heading && <h3 className="text-lg font-semibold mb-1">{content.heading}</h3>}
            {renderContent(content.content ?? content.introduction ?? content.text ?? content.body)}
          </div>
        );
      }

      const entries = Object.entries(content);
      if (entries.length === 0) return null;
      return (
        <div key={key} className="mb-3">
          {entries.map(([k, v], i) => (
            <div key={i}>
              <span className="font-semibold">{k}:</span>
              {renderContent(v, i)}
            </div>
          ))}
        </div>
      );
    }
    return null;
  }

  useEffect(() => {
    if (initialData) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchContentByRoute(locale, ['itihasa', 'ramayana', ...(kanda || [])]);
        let parsed = res.data as any;

        if (!parsed) {
          if (!cancelled) setError('Content not found');
          return;
        }

        if (kanda && kanda.length > 0 && typeof parsed === 'object') {
          const key = kanda[0];
          if (parsed[key] && typeof parsed[key] === 'object') parsed = parsed[key];
        }

        if (!cancelled) setData(parsed || null);
      } catch (e) {
        if (!cancelled) setError('Content not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [initialData, initialLocale, ctxLocale, locale, kanda]);

  const title = String(data?.meta?.title ?? data?.title ?? kanda.join(' / ') ?? 'Ramayana');
  const description = String(data?.meta?.description ?? data?.description ?? '');

  const breadcrumbs = [
    { labelKey: 'Home', href: '/' },
    { label: 'Itihasa', href: '/itihasa' },
    { label: 'Ramayana', href: '/itihasa/ramayana' },
  ];
  if (kanda && kanda.length > 0) breadcrumbs.push({ label: kanda[0], href: `/itihasa/ramayana/${kanda[0]}` });

  const metaKey = (data?.meta?.key && String(data.meta.key)) || `itihasa/ramayana/${kanda.join('/')}/index`;

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
      {data.introduction && <Paragraph>{data.introduction}</Paragraph>}
      {data.scripture_text && (
        <section className="mb-8">
          <SectionTitle>Scripture</SectionTitle>
          {renderContent(data.scripture_text)}
        </section>
      )}

      {data.philosophical_explanation && (
        <section className="mb-8">
          <SectionTitle>Philosophical Explanation</SectionTitle>
          {renderContent(data.philosophical_explanation)}
        </section>
      )}

      {Array.isArray(data.sections) && data.sections.map((s: any, idx: number) => (
        <section key={idx} className="mb-6">
          {s.title && <h3 className="font-semibold text-lg mb-2">{s.title}</h3>}
          {renderContent(s.content)}
        </section>
      ))}

    </PageLayout>
  );
}
