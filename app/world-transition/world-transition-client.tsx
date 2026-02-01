/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '../context/locale-context';
import useLocaleSection from '../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';
import Loader from '@/app/components/loader/loader';

export default function WorldTransitionContent() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('world_transition');
  const [pageContent, setPageContent] = useState<any>(null);
  const [selectedDecade, setSelectedDecade] = useState<number | null>(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      
      // Access nested data from world_transition namespace
      const data = (ns as any)?.world_transition || ns;
      setPageContent(data);
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  if (isLoading || !pageContent) {
    return (
      <PageLayout
        metaKey="world_transition.meta"
        title=""
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'World Transition' }]}
        className="layout-sm"
      >
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="world_transition.meta"
      title={pageContent.meta?.title || 'World Transition'}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'World Transition' }]}
      className="layout-sm"
    >
      <div className="space-y-6">
        {/* Description */}
        {pageContent.meta?.description && (
          <p className="lead">{pageContent.meta.description}</p>
        )}

        {pageContent.intro && <p>{pageContent.intro}</p>}
        {pageContent.description && <p>{pageContent.description}</p>}

        {/* Why Borders Became Stable */}
        {pageContent.whyBordersBecameStable && (
          <section className="mb-8">
            <h3>Why Borders Became Stable</h3>
            {pageContent.whyBordersBecameStable.summary && (
              <p>{pageContent.whyBordersBecameStable.summary}</p>
            )}
            {pageContent.whyBordersBecameStable.factors && Array.isArray(pageContent.whyBordersBecameStable.factors) && (
              <div className="space-y-4 mt-4">
                {pageContent.whyBordersBecameStable.factors.map((factor: any, i: number) => (
                  <div key={i} className="p-4 border rounded">
                    <h5>{factor.title}</h5>
                    <p className="text-sm">{factor.explanation}</p>
                  </div>
                ))}
              </div>
            )}
            {pageContent.whyBordersBecameStable.keyTakeaway && (
              <p className="mt-4 italic font-semibold">{pageContent.whyBordersBecameStable.keyTakeaway}</p>
            )}
          </section>
        )}

        {/* Legend */}
        {pageContent.legend && pageContent.legend.changeTypes && Array.isArray(pageContent.legend.changeTypes) && (
          <section className="mb-8">
            <h3>Legend</h3>
            <div className="flex gap-3 flex-wrap mt-4">
              {pageContent.legend.changeTypes.map((ct: any) => (
                <div key={ct.key} className="flex items-center gap-2 bg-white/60 p-2 rounded">
                  <span 
                    className="w-5 h-3 inline-block rounded border border-black/10"
                    style={{ background: ct.color || '#999' }}
                  />
                  <span className="text-sm">{ct.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Decades */}
        {pageContent.decades && Array.isArray(pageContent.decades) && (
          <section className="mb-8">
            <h3>Decades</h3>
            <div className="text-sm text-gray-600 mb-4">
              Found {pageContent.decades.length} decades
            </div>
            <div className="space-y-4">
              {pageContent.decades.map((d: any, idx: number) => (
                <div key={d.key ?? d.decade ?? d.label ?? idx} className="p-4 bg-white/90 rounded shadow-sm">
                  <h4 className="font-semibold">{d.decade ?? d.label ?? d.title ?? `Decade ${idx + 1}`}</h4>
                  {d.theme && <p className="mt-2 italic">{d.theme}</p>}
                  {d.summary && <p className="mt-2">{d.summary}</p>}
                  {d.whatChanged && Array.isArray(d.whatChanged) && (
                    <ul className="mt-3 list-disc list-inside space-y-1">
                      {d.whatChanged.map((w: string, i: number) => <li key={i}>{w}</li>)}
                    </ul>
                  )}
                  {d.why && Array.isArray(d.why) && (
                    <div className="mt-3">
                      <strong>Why:</strong>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        {d.why.map((w: string, i: number) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>
                  )}
                  {d.svgOverlay && (
                    <div className="mt-3">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedDecade === idx} 
                          onChange={() => setSelectedDecade(selectedDecade === idx ? null : idx)}
                          className="form-checkbox"
                        />
                        <span className="text-sm">{selectedDecade === idx ? 'Shown on map' : 'Show on map'}</span>
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
}