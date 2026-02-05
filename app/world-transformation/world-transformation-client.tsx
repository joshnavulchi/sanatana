import styles from '@app/styles.module.scss';
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '../context/locale-context';
import useLocaleSection from '../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';
import Loader from '@/app/components/loader/loader';
import EarthTimeline from '../components/earth-timeline/EarthTimeline';

export default function WorldTransformationContent() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('world_transformation');
  const [pageContent, setPageContent] = useState<any>(null);
  const [selectedDecade, setSelectedDecade] = useState<number | null>(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;

      // Access nested data from world_transformation namespace
      const data = (ns as any)?.world_transformation || ns;
      setPageContent(data);
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  if (isLoading || !pageContent) {
    return (
      <PageLayout
        metaKey="world_transformation.meta"
        title=""
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'World Transformation' }]}
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
      metaKey="world_transformation.meta"
      title={pageContent.meta?.title || 'World Transformation'}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'World Transformation' }]}
      className="layout-sm"
    >
      <div className="space-y-12">
        {/* Hero section */}
        <div className="relative md:-mx-8 px-6 md:px-8 py-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-blue-950/30 rounded-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-500" />
              <span className="text-3xl animate-pulse">🌍</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-500" />
            </div>

            {pageContent.meta?.description && (
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {pageContent.meta.description}
              </p>
            )}
            {pageContent.intro && (
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{pageContent.intro}</p>
            )}
            {pageContent.description && (
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{pageContent.description}</p>
            )}
          </div>
        </div>

        {/* Why Borders Became Stable */}
        {pageContent.whyBordersBecameStable && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-xl flex items-center justify-center text-2xl shadow-md">
                🔒
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Why Borders Became Stable</h3>
            </div>

            {pageContent.whyBordersBecameStable.summary && (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-15">{pageContent.whyBordersBecameStable.summary}</p>
            )}

            {pageContent.whyBordersBecameStable.factors && Array.isArray(pageContent.whyBordersBecameStable.factors) && (
              <div className="flex flex-wrap gap-6">
                {pageContent.whyBordersBecameStable.factors.map((factor: any, i: number) => (
                  <div key={i} className="
                    bg-white dark:bg-gray-800
                    border-2 border-blue-100 dark:border-blue-900/30
                    hover:border-blue-300 dark:hover:border-blue-700
                    rounded-xl p-6
                    shadow-lg hover:shadow-xl
                    transition-all duration-300
                    transform hover:-translate-y-1
                  ">
                    <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="text-xl">📍</span>
                      {factor.title}
                    </h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{factor.explanation}</p>
                  </div>
                ))}
              </div>
            )}

            {pageContent.whyBordersBecameStable.keyTakeaway && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-l-4 border-blue-500 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <p className="flex-1 text-gray-700 dark:text-gray-300 leading-relaxed font-semibold">{pageContent.whyBordersBecameStable.keyTakeaway}</p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Legend */}
        {pageContent.legend && pageContent.legend.changeTypes && Array.isArray(pageContent.legend.changeTypes) && (
          <section className="bg-white dark:bg-gray-800 border-2 border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 md:p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              Legend
            </h3>
            <div className="flex gap-4 flex-wrap">
              {pageContent.legend.changeTypes.map((ct: any) => (
                <div key={ct.key} className="
                  flex items-center gap-3
                  bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800
                  px-4 py-3 rounded-lg
                  border border-gray-200 dark:border-gray-600
                  shadow-sm hover:shadow-md
                  transition-all duration-300
                ">
                  <span
                    className="w-8 h-6 inline-block rounded-md border-2 border-white dark:border-gray-900 shadow-md"
                    style={{ background: ct.color || '#999' }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{ct.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Decades */}
        {pageContent.decades && Array.isArray(pageContent.decades) && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-xl flex items-center justify-center text-2xl shadow-md">
                  📆
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Historical Decades</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{pageContent.decades.length} periods of transformation</p>
                </div>
              </div>
            </div>

            <div className="relative space-y-6">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-indigo-500 to-blue-400" />

              {pageContent.decades.map((d: any, idx: number) => (
                <div key={d.key ?? d.decade ?? d.label ?? idx} className="relative">
                  {/* Timeline dot */}
                  <div className="hidden md:block absolute left-6 top-6 w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full border-4 border-white dark:border-gray-900 shadow-lg z-10" />

                  {/* Decade card */}
                  <div className="md:ml-20 bg-white dark:bg-gray-800 border-2 border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {d.decade ?? d.label ?? d.title ?? `Decade ${idx + 1}`}
                      </h4>
                      <span className="flex-shrink-0 px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full">
                        #{idx + 1}
                      </span>
                    </div>

                    {d.theme && (
                      <p className="text-gray-600 dark:text-gray-400 italic mb-3 flex items-start gap-2">
                        <span className="text-lg">💭</span>
                        <span className="flex-1">{d.theme}</span>
                      </p>
                    )}

                    {d.summary && (
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{d.summary}</p>
                    )}

                    {d.whatChanged && Array.isArray(d.whatChanged) && d.whatChanged.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <span>🔄</span>
                          What Changed:
                        </h5>
                        <ul className="space-y-2">
                          {d.whatChanged.map((w: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <span className="text-blue-500 mt-1">•</span>
                              <span className="flex-1">{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {d.why && Array.isArray(d.why) && d.why.length > 0 && (
                      <div className="mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <span>❓</span>
                          Why:
                        </h5>
                        <ul className="space-y-2">
                          {d.why.map((w: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <span className="text-indigo-500 mt-1">•</span>
                              <span className="flex-1">{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {d.svgOverlay && (
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <label className="inline-flex items-center gap-3 cursor-pointer group/checkbox">
                          <input
                            type="checkbox"
                            checked={selectedDecade === idx}
                            onChange={() => setSelectedDecade(selectedDecade === idx ? null : idx)}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover/checkbox:text-blue-600 dark:group-hover/checkbox:text-blue-400 transition-colors">
                            {selectedDecade === idx ? '✓ Shown on map' : '🗺️ Show on map'}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
}