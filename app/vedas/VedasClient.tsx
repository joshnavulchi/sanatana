"use client";

import { useEffect, useState } from 'react';
import { DEFAULT_LOCALE, loadLocaleData } from '@lib/i18n';
import { useLocale } from '@app/context/locale-context';
import Link from 'next/link';
import PageLayout from '@components/common/PageLayout';

type VedasData = Record<string, any> | null;

export default function VedasClient({ initialVedas }: { initialVedas?: Record<string, unknown>[] } = {}) {
  const { isLoading, locale: ctxLocale } = useLocale();
  const [data, setData] = useState<VedasData>(null);
  const [loading, setLoading] = useState<boolean>(!initialVedas);
  const [error, setError] = useState<string | null>(null);

  const locale = (ctxLocale || DEFAULT_LOCALE) as string;

  useEffect(() => {
    if (initialVedas && initialVedas.length > 0) {
      // map initial list into the same shape as locale data
      setData({ scripture_text: initialVedas });
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const parsedRoot = await loadLocaleData(locale, 'vedas/index') as Record<string, any>;
        let parsed = (parsedRoot && Object.keys(parsedRoot).length > 0) ? parsedRoot : {} as Record<string, any>;
        if (!parsed || Object.keys(parsed).length === 0) {
          if (!cancelled) setError('Vedas content not found');
          return;
        }

        // If namespace returned { vedas: { ... } } unwrap
        if (parsed.vedas && typeof parsed.vedas === 'object') parsed = parsed.vedas;

        if (!cancelled) setData(parsed || null);
      } catch (e) {
        if (!cancelled) setError('Vedas content not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [initialVedas, locale]);

  const title = String(data?.meta?.title ?? data?.title ?? 'Vedas');
  const description = String(data?.meta?.description ?? data?.description ?? '');

  if (loading || (isLoading && !data)) {
    return (
      <PageLayout metaKey="vedas/index" title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Vedas' }]} className="layout-md">
        <div className="py-12 text-center">Loading…</div>
      </PageLayout>
    );
  }

  if (error || !data) {
    return (
      <PageLayout metaKey="vedas/index" title={title} description={description} breadcrumbs={[{ label: 'Home', href: '/' }, { label: title }]} className="layout-md">
        <div className="py-12 text-center text-gray-600">{error || 'Content not available.'}</div>
      </PageLayout>
    );
  }

  const scriptureList = Array.isArray(data.scripture_text) ? data.scripture_text.map((s: any) => ({ id: (s.veda || '').toLowerCase().replace(/\s+/g, ''), label: s.veda || s.title || 'Veda' })) : [
    { id: 'rigveda', label: 'Rigveda' },
    { id: 'yajurveda', label: 'Yajurveda' },
    { id: 'samaveda', label: 'Samaveda' },
    { id: 'atharvaveda', label: 'Atharvaveda' },
  ];

  return (
    <PageLayout metaKey="vedas/index" title={title} description={description} breadcrumbs={[{ label: 'Home', href: '/' }, { label: title }]} className="layout-md">
      <div className="space-y-6">
        {data.definition && <p className="text-md">{data.definition}</p>}
        {data.introduction && <div className="prose max-w-none"><p>{data.introduction}</p></div>}

        {Array.isArray(data.scripture_text) && (
          <section className="mt-8">
            <h4 className="text-2xl font-semibold mb-4">Overview</h4>
            <div className="space-y-4">
              {data.scripture_text.map((s: any, idx: number) => (
                <div key={idx} className="p-4 rounded-lg bg-white/60 shadow-sm">
                  <h5 className="font-semibold text-lg">{s.veda}</h5>
                  {s.description && <p className="text-md text-gray-700 mt-2">{s.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-6">
          <h4 className="text-2xl font-semibold mb-3">Vedas</h4>
          <ul className="space-y-3">
            {scriptureList.map((v) => (
              <li key={v.id}>
                <Link href={`/vedas/${v.id}`} className="text-amber-800 hover:underline">{v.label}</Link>
              </li>
            ))}
          </ul>
        </section>

        {data.meaning_of_word_veda && (
          <section className="mt-6">
            <h4 className="text-xl font-semibold mb-2">Meaning of the word Veda</h4>
            <p className="text-md">{data.meaning_of_word_veda}</p>
          </section>
        )}

        {data.philosophical_explanation && (
          <section className="mt-6">
            <h4 className="text-xl font-semibold mb-2">Philosophical explanation</h4>
            <div className="prose max-w-none"><p>{data.philosophical_explanation}</p></div>
          </section>
        )}

        {data.estimated_composition_period && (
          <section className="mt-6">
            <h4 className="text-xl font-semibold mb-2">Estimated composition period</h4>
            <dl className="grid grid-cols-1 gap-2">
              {Object.entries(data.estimated_composition_period).map(([k, v]) => (
                <div key={k} className="text-md">
                  <strong className="mr-2">{k.replace(/_/g, ' ')}:</strong>{' '}{String(v)}
                </div>
              ))}
            </dl>
          </section>
        )}

        {data.vedic_society && (
          <section className="mt-6">
            <h4 className="text-xl font-semibold mb-2">Vedic society</h4>
            {data.vedic_society.social_structure && (
              <div>
                <h5 className="font-medium">Social structure</h5>
                <ul className="list-disc ml-5 text-md">
                  {Array.isArray(data.vedic_society.social_structure) && data.vedic_society.social_structure.map((s: any, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {data.influence_of_vedas && (
          <section className="mt-6">
            <h4 className="text-xl font-semibold mb-2">Influence of the Vedas</h4>
            {Object.entries(data.influence_of_vedas).map(([k, arr]) => (
              Array.isArray(arr) ? (
                <div key={k} className="mb-3">
                  <h5 className="font-medium">{k.replace(/_/g, ' ')}</h5>
                  <ul className="list-disc ml-5 text-md">
                    {(arr as any[]).map((it: any, idx: number) => <li key={idx}>{String(it)}</li>)}
                  </ul>
                </div>
              ) : null
            ))}
          </section>
        )}

        {data.vedic_timeline && (
          <section className="mt-6">
            <h4 className="text-xl font-semibold mb-2">Vedic timeline</h4>
            <ul className="list-disc ml-5 text-md">
              {Object.entries(data.vedic_timeline).map(([k, v]) => (
                <li key={k}><strong className="mr-2">{k.replace(/_/g, ' ')}:</strong>{String(v)}</li>
              ))}
            </ul>
          </section>
        )}

        {data.vedic_philosophical_concepts && (
          <section className="mt-6">
            <h4 className="text-xl font-semibold mb-2">Vedic philosophical concepts</h4>
            <dl className="grid grid-cols-1 gap-2 text-md">
              {Object.entries(data.vedic_philosophical_concepts).map(([k, v]) => (
                <div key={k}><strong className="mr-2">{k}:</strong>{String(v)}</div>
              ))}
            </dl>
          </section>
        )}

        {Array.isArray(data.related_concepts) && (
          <section className="mt-6">
            <h4 className="text-xl font-semibold mb-2">Related concepts</h4>
            <div className="flex flex-wrap gap-2">
              {data.related_concepts.map((r: any, i: number) => (
                <span key={i} className="text-md px-2 py-1 bg-gray-100 rounded">{r}</span>
              ))}
            </div>
          </section>
        )}

        {data.structure && (
          <section className="mt-6">
            <h4 className="text-xl font-semibold mb-2">Structure summary</h4>
            {Object.entries(data.structure).map(([k, v]) => (
              <div key={k} className="mb-3">
                <h5 className="font-medium">{k}</h5>
                <pre className="text-xs bg-white/60 p-2 rounded overflow-x-auto">{JSON.stringify(v, null, 2)}</pre>
              </div>
            ))}
          </section>
        )}
      </div>
    </PageLayout>
  );
}
