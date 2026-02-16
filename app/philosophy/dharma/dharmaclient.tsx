"use client";

import PageLayout from '@/app/components/common/PageLayout';
import { useLocale } from '@/app/context/locale-context';
import useLocaleSection from '@/app/hooks/useLocaleSection';
import Loader from '@/app/components/loader/loader';
import SimilarCategories from '@/app/components/similar-categories/SimilarCategories';


export default function DharmaClient() {
  const { locale, isLoading } = useLocale();
  const dharma = useLocaleSection('philosophy_dharma');

  if (isLoading || !dharma) {
    return (
      <PageLayout metaKey="philosophy_dharma" title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Philosophy', href: '/philosophy' }, { label: 'Dharma' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  const title = dharma.title || 'Dharma Philosophy';
  const definition: string[] = Array.isArray(dharma.definition) ? dharma.definition : (dharma.definition ? [String(dharma.definition)] : []);
  const categories = dharma.categories_of_dharma || {};
  const philosophicalDimensions = dharma.philosophical_dimensions || {};
  const corePrinciples = dharma.core_principles || {};
  const dharmaInRamayana = dharma.dharma_in_ramayana || {};

  return (
    <PageLayout
      metaKey="philosophy_dharma"
      title={title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Philosophy', href: '/philosophy' }, { label: 'Dharma' }]}
      className="layout-md"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/4">
          <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 rounded-2xl border-l-12 border-emerald-200 shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-400/8 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-emerald-800 mb-4">{title}</h1>
              <p className="mb-6"><strong>Definition:</strong> {definition.length ? definition.join(', ') : 'No definition found.'}</p>
              <h2 className="text-2xl md:text-3xl">Categories of Dharma:</h2>
              <ul className="list-disc ml-6 mb-6">
                {Object.entries(categories).map(([key, val]: any, idx: number) => (
                  <li key={idx}><strong>{val.meaning}</strong>{val.examples ? <> - {Array.isArray(val.examples) ? val.examples.join(', ') : val.examples}</> : null}</li>
                ))}
              </ul>
              <h2 className="text-2xl md:text-3xl">Philosophical Dimensions / Goals of Dharma:</h2>
              <ul className="list-disc ml-6 mb-6">
                {Object.entries(philosophicalDimensions).map(([key, val]: any, idx: number) => (
                  <li key={idx}>{val}</li>
                ))}
              </ul>
              <h2 className="text-2xl md:text-3xl">Core Principles of Dharma:</h2>
              <ul className="list-disc ml-6 mb-6">
                {Object.entries(corePrinciples).map(([key, val]: any, idx: number) => (
                  <li key={idx}>{val}</li>
                ))}
              </ul>
              <h2 className="text-2xl md:text-3xl">Dharma in Ramayana:</h2>
              <ul className="list-disc ml-6 mb-6">
                {Object.entries(dharmaInRamayana).map(([key, val]: any, idx: number) => (
                  <li key={idx}>{val}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/4">
          <SimilarCategories />
        </div>
      </div>
    </PageLayout>
  );
}