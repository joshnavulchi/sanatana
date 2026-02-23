"use client";
import { useEffect, useState } from 'react';
import { useLocale } from '@app/context/locale-context';
import PageLayout from '@components/common/PageLayout';
import Loader from '@components/loader';
import SimilarCategories from '@components/similar-categories/SimilarCategories';

export default function AhimsaClient() {
  const { locale, isLoading } = useLocale();
  const [page, setPage] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      const res = await fetch(`/locales/${locale}/philosophy_ahimsa.json`);
      const data = await res.json();
      const nsObj = data?.philosophy_ahimsa || {};
      if (!mounted) return;
      setPage({
        title: nsObj.title || 'Ahimsa Philosophy',
        definition: Array.isArray(nsObj.definition) ? nsObj.definition : (nsObj.definition ? [String(nsObj.definition)] : []),
        categories: nsObj.categories_of_ahimsa || {},
        philosophicalDimensions: nsObj.philosophical_dimensions || {},
        corePrinciples: nsObj.core_principles || {},
        ahimsaInRamayana: nsObj.ahimsa_in_ramayana || {},
      });
    }
    fetchData();
    return () => { mounted = false; };
  }, [locale]);

  if (isLoading && !page) {
    return (
      <PageLayout metaKey="philosophy_ahimsa" title="" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Ahimsa' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <PageLayout
      metaKey="philosophy_ahimsa"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Ahimsa' }]}
      className="layout-md"
    >
      <div id="ahimsa-content">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/4">
            <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 rounded-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-400/8 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-600" />
                  <span className="text-3xl animate-pulse">🕉️</span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-600" />
                </div>
                <h3 className="text-4xl font-extrabold text-emerald-700 mb-4">{page.title}</h3>
                <p className="text-lg md:text-xl md:text-lg text-emerald-900 mb-6 italic">
                  <strong>Definition: </strong>
                  {page.definition.length ? page.definition.map((s: string, i: number) => (
                    <span key={i}>{s}{i < page.definition.length - 1 ? ', ' : ''}</span>
                  )) : <span>No definition available.</span>}
                </p>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-emerald-700 mb-2">Categories of Ahimsa</h2>
                  <ul className="list-disc ml-6 text-emerald-900 space-y-1">
                    {Object.entries(page.categories).map((cKey: any, idx: number) => {
                      const { meaning, examples } = cKey[1] || {};
                      return <li key={idx}>
                        <span className="font-semibold">{meaning}</span>{' '}-{' '}{Array.isArray(examples) ? <span>{examples.join(', ')}</span> : (examples ? <span>{String(examples)}</span> : null)}
                      </li>;
                    })}
                  </ul>
                </div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-green-700 mb-2">Philosophical Dimensions / Goals</h2>
                  <ul className="list-disc ml-6 text-green-900 space-y-1">
                    {Object.entries(page.philosophicalDimensions).map((cKey: any, idx: number) => (
                      <li key={idx}>{cKey[1]}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-blue-700 mb-2">Core Principles of Ahimsa</h2>
                  <ul className="list-disc ml-6 text-blue-900 space-y-1">
                    {Object.entries(page.corePrinciples).map((cKey: any, idx: number) => (
                      <li key={idx}>{cKey[1]}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-orange-700 mb-2">Ahimsa in Ramayana</h2>
                  <ul className="list-disc ml-6 text-orange-900 space-y-1">
                    {Object.entries(page.ahimsaInRamayana).map((cKey: any, idx: number) => (
                      <li key={idx}>{cKey[1]}</li>
                    ))}
                  </ul>
                </div>
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


