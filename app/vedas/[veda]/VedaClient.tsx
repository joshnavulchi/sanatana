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
  vedas: string[];
};

export default function VedaClient({ initialData, initialLocale, vedas }: Props) {
  const [data, setData] = useState<vedaData | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);

  const { locale: ctxLocale } = useLocale();
  const locale = initialLocale || ctxLocale || DEFAULT_LOCALE;

  function SectionTitle({ children }: any) {
    return <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7c2d12] via-[#c2410c] to-[#f59e0b] drop-shadow-lg mt-6 mb-3 animate-gradient-x">{children}</h2>;
  }
  function Paragraph({ children }: any) {
    return <p className="text-base sm:text-lg text-[#5b2d12] leading-relaxed mb-4 bg-gradient-to-r from-[#fffaf0] via-[#fde68a]/30 to-[#fbe8c8]/10 rounded-xl px-3 py-2 shadow-sm animate-fadeInUp">{children}</p>;
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
      <section className="mb-8">
        {title && <SectionTitle>{title}</SectionTitle>}
        <div className="motion-safe:animate-fadeInUp duration-500">
          {renderContent(content)}
        </div>
      </section>
    );
  }

  function ArrayBlock({ title, items }: any) {
    if (!Array.isArray(items) || items.length === 0) return null;

    return (
      <section className="mb-8">
        {title && <SectionTitle>{title}</SectionTitle>}
        <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="rounded-2xl bg-gradient-to-br from-[#fffaf0] via-[#fde68a]/30 to-[#fbe8c8]/10 p-4 shadow-lg hover:scale-[1.02] transition-transform duration-300 animate-fadeInUp">
              {item.title && <h3 className="text-xl font-extrabold text-[#7c2d12] mb-2 drop-shadow-sm animate-gradient-x">{item.title}</h3>}
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

      {/* Introduction */}
      {data.introduction && <Paragraph>{data.introduction}</Paragraph>}

      {/* Meaning */}
      {data.meaning_of_word_veda && (
        <section>
          <SectionTitle>Meaning</SectionTitle>
          <Paragraph>{data.meaning_of_word_veda}</Paragraph>
        </section>
      )}

      {/* Scripture Text */}
      {data.scripture_text && (
        <Block title="Scripture Text" content={data.scripture_text} />
      )}

      {/* Philosophy */}
      {data.philosophical_explanation && (
        <Block title="Philosophical Insights" content={data.philosophical_explanation} />
      )}

      {/* Estimated composition period */}
      {data.estimated_composition_period && (
        <section>
          <SectionTitle>Estimated composition period</SectionTitle>
          <div className="text-base sm:text-lg">
            {Object.entries(data.estimated_composition_period).map(([k, v]) => (
              <div key={k}><strong className="mr-2">{k.replace(/_/g, ' ')}:</strong>{String(v)}</div>
            ))}
          </div>
        </section>
      )}

      {/* Vedic society */}
      {data.vedic_society && (
        <section>
          <SectionTitle>Vedic society</SectionTitle>
          {data.vedic_society.social_structure && (
            <ul className="list-disc pl-5">
              {data.vedic_society.social_structure.map((s: any, i: number) => <li key={i}>{s}</li>)}
            </ul>
          )}
        </section>
      )}

      {/* Influence */}
      {data.influence_of_vedas && (
        <section>
          <SectionTitle>Influence of the Vedas</SectionTitle>
          {Object.entries(data.influence_of_vedas).map(([k, arr]) => (
            Array.isArray(arr) ? (
              <div key={k} className="mb-3">
                <h4 className="font-medium">{k.replace(/_/g, ' ')}</h4>
                <ul className="list-disc pl-5">
                  {(arr as any[]).map((it: any, idx: number) => <li key={idx}>{String(it)}</li>)}
                </ul>
              </div>
            ) : null
          ))}
        </section>
      )}

      {/* Timeline and concepts */}
      {data.vedic_timeline && (
        <section>
          <SectionTitle>Vedic timeline</SectionTitle>
          <ul className="list-disc pl-5 text-base sm:text-lg">
            {Object.entries(data.vedic_timeline).map(([k, v]) => <li key={k}><strong className="mr-2">{k.replace(/_/g, ' ')}:</strong>{String(v)}</li>)}
          </ul>
        </section>
      )}

      {data.vedic_philosophical_concepts && (
        <section>
          <SectionTitle>Philosophical concepts</SectionTitle>
          <div className="text-base sm:text-lg">
            {Object.entries(data.vedic_philosophical_concepts).map(([k, v]) => <div key={k}><strong className="mr-2">{k}:</strong>{String(v)}</div>)}
          </div>
        </section>
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

      {/* Structure (raw summary) */}
      {data.structure && (
        <section>
          <SectionTitle>Structure</SectionTitle>
          <div className="prose max-w-none">
            <pre className="text-sm bg-white/60 p-2 rounded overflow-x-auto">{JSON.stringify(data.structure, null, 2)}</pre>
          </div>
        </section>
      )}

    </PageLayout>
  );
}
