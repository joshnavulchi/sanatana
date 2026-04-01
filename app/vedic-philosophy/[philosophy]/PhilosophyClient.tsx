"use client";

import { useEffect, useState } from 'react';
import { DEFAULT_LOCALE } from '@lib/i18n';
import Loader from '@components/loader';
import { fetchContentByRoute } from '@lib/siteUtils';
import { useLocale } from '@app/context/locale-context';

import PageLayout from '@components/common/PageLayout';

type vedaData = {
  title?: string;
  description?: string;
  content?: string | Record<string, any>;
  children?: string[];
  meta?: Record<string, any>;
  [key: string]: any;
};

type Props = {
  initialData?: vedaData | null;
  initialLocale?: string;
  slug?: string;
};

export default function VedaClient({ initialData, initialLocale, slug }: Props) {
  const [data, setData] = useState<vedaData | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);

  const { locale: ctxLocale } = useLocale();
  const locale = initialLocale || ctxLocale || DEFAULT_LOCALE;

  function SectionTitle({ children }: any) {
    return <h2 className="text-2xl font-semibold text-red-800 mt-6 mb-3">{children}</h2>;
  }
  function Paragraph({ children }: any) {
    return <p className="text-md text-gray-800 leading-relaxed mb-4">{children}</p>;
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
      // common shape: { section, content }
      if (content.section || content.title || content.heading) {
        return (
          <div key={key} className="mb-4">
            {content.section && <h3 className="text-lg font-semibold text-gray-900 mb-1">{content.section}</h3>}
            {content.title && <h3 className="text-lg font-semibold text-gray-900 mb-1">{content.title}</h3>}
            {content.heading && <h3 className="text-lg font-semibold text-gray-900 mb-1">{content.heading}</h3>}
            {renderContent(content.content ?? content.introduction ?? content.text ?? content.body)}
          </div>
        );
      }

      // Fallback: stringify small objects or attempt to render nested keys
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

  function Block({ title, content }: any) {
    if (!content && content !== 0) return null;
    return (
      <section>
        {title && <SectionTitle>{title}</SectionTitle>}
        {renderContent(content)}
      </section>
    );
  }

  function ArrayBlock({ title, items }: any) {
    if (!Array.isArray(items) || items.length === 0) return null;

    return (
      <section>
        {title && <SectionTitle>{title}</SectionTitle>}
        <div className="space-y-4">
          {items.map((item: any, idx: number) => (
            <div key={idx}>
              {item.title && <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>}
              {item.introduction && renderContent(item.introduction)}
              {item.scripture_text && renderContent(item.scripture_text)}
              {item.philosophical_explanation && renderContent(item.philosophical_explanation)}
            </div>
          ))}
        </div>
      </section>
    );
  }

  useEffect(() => {
    if (initialData) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const segs = ['vedic-philosophy', ...(slug ? [slug] : [])];
        const res = await fetchContentByRoute(locale, segs);
        let parsed = res.data as any;

        if (!parsed) {
          if (!cancelled) setError('Content not found');
          return;
        }

        if (slug && typeof parsed === 'object') {
          if (parsed[slug] && typeof parsed[slug] === 'object') parsed = parsed[slug];
          else {
            const keys = Object.keys(parsed);
            if (keys.length === 1 && typeof parsed[keys[0]] === 'object') parsed = parsed[keys[0]];
          }
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
  }, [initialData, initialLocale, ctxLocale, locale, slug]);

  const title = String(data?.meta?.title ?? data?.title ?? (slug ? slug : 'Vedic Philosophy'));
  const description = String(data?.meta?.description ?? data?.description ?? '');

  const breadcrumbs = [
    { labelKey: 'Home', href: '/' },
    { label: 'Vedic Philosophy', href: '/vedic-philosophy' },
  ];
  if (slug) breadcrumbs.push({ label: String(data?.title ?? slug), href: `/vedic-philosophy/${slug}` });

  const metaKey = (data?.meta?.key && String(data.meta.key)) || (slug ? `vedic-philosophy/${slug}/index` : 'vedic-philosophy');

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
      {data.introduction && <Paragraph>{data.introduction}</Paragraph>}

      {/* Scripture Text */}
      {data.scripture_text && (
        <Block title="Scripture Text" content={data.scripture_text} />
      )}

      {/* Philosophy */}
      {data.philosophical_explanation && (
        <Block title="Philosophical Insights" content={data.philosophical_explanation} />
      )}

      {/* Rigveda Mandalas */}
      <ArrayBlock title="Mandalas" items={data.mandalas} />

      {/* Yajurveda Chapters */}
      <ArrayBlock title="Chapters" items={data.yajurveda_chapters} />

      {/* Samaveda Sections */}
      <ArrayBlock title="Sections" items={data.samaveda_sections} />

      {/* Atharvaveda Books */}
      <ArrayBlock title="Books" items={data.atharvaveda_books} />

      {/* Major Deities */}
      {Array.isArray(data.major_rigvedic_deities) && (
        <section>
          <SectionTitle>Major Deities</SectionTitle>
          <ul className="list-disc pl-5 space-y-2">
            {data.major_rigvedic_deities.map((d: any, i: number) => (
              <li key={i}>
                <span className="font-semibold">{d.name}</span>
                {d.role && ` — ${d.role}`}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related Concepts */}
      {Array.isArray(data.related_concepts) && (
        <section>
          <SectionTitle>Related Concepts</SectionTitle>
          <ul className="list-disc pl-5 space-y-2">
            {data.related_concepts.map((c: string, i: number) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
      )}

    </PageLayout>
  );
}
