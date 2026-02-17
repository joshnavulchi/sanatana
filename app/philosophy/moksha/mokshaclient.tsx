"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import Loader from '@components/loader';
import SimilarCategories from '@components/similar-categories/SimilarCategories';

export default function MokshaClient() {
  const { locale, isLoading } = useLocale();
  const [page, setPage] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      const res = await fetch(`/locales/${locale}/philosophy_moksha.json`);
      const data = await res.json();
      const nsObj = data?.philosophy_moksha || {};
      if (!mounted) return;
      setPage({
        title: nsObj.title || 'Moksha Philosophy',
        definition: nsObj.definition,
        core_principles: Array.isArray(nsObj.core_principles) ? nsObj.core_principles : [],
        origin: nsObj.origin || {},
        paths_to_moksha: nsObj.paths_to_moksha || {},
        goals: Array.isArray(nsObj.goals) ? nsObj.goals : [],
        relation_to_other_concepts: nsObj.relation_to_other_concepts || {},
        modern_relevance: nsObj.modern_relevance || {},
        key_scriptural_references: Array.isArray(nsObj.key_scriptural_references) ? nsObj.key_scriptural_references : []
      });
    }
    fetchData();
    return () => { mounted = false; };
  }, [locale]);

  if (isLoading && !page) {
    return (
      <PageLayout metaKey="philosophy_moksha" title="" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Moksha' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <PageLayout
      metaKey="philosophy_moksha"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title }]}
      className="layout-md"
    >
      <div id="moksha-content">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/4">
            <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-green-50 via-green-100 to-green-50 border-l-12 border-green-200 rounded-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-400/8 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-600" />
                  <span className="text-3xl animate-pulse">🕉️</span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-600" />
                </div>
                <h3 className="text-4xl font-extrabold text-emerald-700 mb-4">{page.title}</h3>
                <p className="text-lg md:text-xl text-emerald-900 mb-6 italic">{page.definition}</p>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-emerald-700 mb-2">Core Principles</h2>
                  <ul className="list-disc ml-6 text-emerald-900 space-y-1">
                    {page.core_principles.map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-emerald-700 mb-2">Origin</h2>
                  <ul className="list-disc ml-6 text-emerald-900 space-y-1">
                    {Object.entries(page.origin).map(([k, v]: any, idx: number) => (
                      <li key={idx}><span className="font-semibold">{k}:</span> {Array.isArray(v) ? v.join(', ') : v}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-emerald-700 mb-2">Paths to Moksha</h2>
                  <ul className="list-disc ml-6 text-emerald-900 space-y-1">
                    {Object.entries(page.paths_to_moksha).map(([k, v]: any, idx: number) => (
                      <li key={idx}><span className="font-semibold">{k.replace(/_/g, ' ')}:</span> {v}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-green-700 mb-2">Goals of Moksha</h2>
                  <ul className="list-disc ml-6 text-green-900 space-y-1">
                    {page.goals.map((g: string, idx: number) => (
                      <li key={idx}>{g}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-blue-700 mb-2">Relation to Other Concepts</h2>
                  <ul className="list-disc ml-6 text-blue-900 space-y-1">
                    {Object.entries(page.relation_to_other_concepts).map(([k, v]: any, idx: number) => (
                      <li key={idx}><span className="font-semibold">{k}:</span> {v}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-orange-700 mb-2">Modern Relevance</h2>
                  <ul className="list-disc ml-6 text-orange-900 space-y-1">
                    {Object.entries(page.modern_relevance).map(([k, v]: any, idx: number) => (
                      <li key={idx}><span className="font-semibold">{k.replace(/_/g, ' ')}:</span> {v}</li>
                    ))}
                  </ul>
                </div>
                {page.key_scriptural_references.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-indigo-700 mb-2">Key Scriptural References</h2>
                    <ul className="list-disc ml-6 text-indigo-900 space-y-1">
                      {page.key_scriptural_references.map((ref: any, idx: number) => (
                        <li key={idx}><span className="font-semibold">{ref.text}:</span> {ref.quote_summary}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/4">
            <SimilarCategories />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}