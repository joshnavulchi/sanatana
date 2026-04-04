"use client";

import { useEffect, useState } from 'react';
import { DEFAULT_LOCALE } from '@lib/i18n';
import Loader from '@components/loader';
import { fetchContentByRoute } from '@lib/siteUtils';
import { useLocale } from '@app/context/locale-context';
import PageLayout from '@components/common/PageLayout';

type ChapterData = {
  title?: string;
  description?: string;
  content?: any;
  scripture_text?: any;
  philosophical_explanation?: any;
  meta?: Record<string, any>;
  [key: string]: any;
};

type Props = {
  initialData?: ChapterData | null;
  initialLocale?: string;
  chapter: string[];
};

export default function ChapterClient({ initialData, initialLocale, chapter }: Props) {
  const [data, setData] = useState<ChapterData | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);

  const { locale: ctxLocale } = useLocale();
  const locale = initialLocale || ctxLocale || DEFAULT_LOCALE;

  function SectionTitle({ children }: any) {
    return <h2 className="text-2xl font-extrabold mt-6 mb-3">{children}</h2>;
  }

  function Paragraph({ children }: any) {
    return <p className="text-lg sm:text-base leading-relaxed mb-4">{children}</p>;
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
            {content.title && <h4 className="text-lg font-semibold mb-1">{content.title}</h4>}
            {content.heading && <h5 className="text-lg font-semibold mb-1">{content.heading}</h5>}
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
        const res = await fetchContentByRoute(locale, ['itihasa', 'bhagavadgita', ...(chapter || [])]);
        let parsed = res.data as any;

        if (!parsed) {
          if (!cancelled) setError('Content not found');
          return;
        }

        if (chapter && chapter.length > 0 && typeof parsed === 'object') {
          const key = chapter[0];
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
  }, [initialData, initialLocale, ctxLocale, locale, chapter]);

  const title = String(data?.meta?.title ?? data?.title ?? chapter.join(' / ') ?? 'Bhagavad Gita');
  const description = String(data?.meta?.description ?? data?.description ?? '');

  const breadcrumbs = [
    { labelKey: 'Home', href: '/' },
    { label: 'Itihasa', href: '/itihasa' },
    { label: 'Bhagavad Gita', href: '/itihasa/bhagavadgita' },
  ];
  if (chapter && chapter.length > 0) breadcrumbs.push({ label: chapter[0], href: `/itihasa/bhagavadgita/${chapter[0]}` });

  const metaKey = (data?.meta?.key && String(data.meta.key)) || `itihasa/bhagavadgita/${chapter.join('/')}/index`;

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
          {s.title && <h6 className="font-semibold text-lg mb-2">{s.title}</h6>}
          {renderContent(s.content)}
        </section>
      ))}

    </PageLayout>
  );
}
