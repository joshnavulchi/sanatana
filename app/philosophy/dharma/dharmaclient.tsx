"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@/app/components/common/PageLayout';
import { useLocale } from '@/app/context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import { parseSections, parseMaybeObject } from 'lib/parseContent';
import SimilarCategories from '@/app/components/similar-categories/SimilarCategories';
import LazyImage from '@/app/components/lazy-image/LazyImage';
import TextToSpeech from '@/app/components/text-to-speech/TextToSpeech';


export default function DharmaClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('philosophy_dharma');
  const [dharma, setDharma] = useState<any>({});

  useEffect(() => {
    if (ns && typeof ns === 'object') {
      setDharma(ns);
    }
  }, [ns]);

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
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Dharma' }]}
      className="layout-md"
    >
      <TextToSpeech sectionId="philosophy-dharma-content" className="floating" />
      <div id="philosophy-dharma-content" className="rounded-xl shadow-xl border-2 border-indigo-200/60 bg-white/80 dark:bg-gray-900/60 p-6 md:p-10 lg:p-14 space-y-8">
        <div className="mb-6">
          <LazyImage src="/images/philosophy-dharma.png" alt="philosophy dharma" width={1000} height={100} className="w-full h-auto rounded-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-indigo-800 mb-4">{title}</h1>
        <p className="mb-6"><strong>Definition:</strong> {definition.length ? definition.join(', ') : 'No definition found.'}</p>
        <h2 className="h4">Categories of Dharma:</h2>
        <ul className="list-disc ml-6 mb-6">
          {Object.entries(categories).map(([key, val]: any, idx: number) => (
            <li key={idx}><strong>{val.meaning}</strong>{val.examples ? <> - {Array.isArray(val.examples) ? val.examples.join(', ') : val.examples}</> : null}</li>
          ))}
        </ul>
        <h2 className="h4">Philosophical Dimensions / Goals of Dharma:</h2>
        <ul className="list-disc ml-6 mb-6">
          {Object.entries(philosophicalDimensions).map(([key, val]: any, idx: number) => (
            <li key={idx}>{val}</li>
          ))}
        </ul>
        <h2 className="h4">Core Principles of Dharma:</h2>
        <ul className="list-disc ml-6 mb-6">
          {Object.entries(corePrinciples).map(([key, val]: any, idx: number) => (
            <li key={idx}>{val}</li>
          ))}
        </ul>
        <h2 className="h4">Dharma in Ramayana:</h2>
        <ul className="list-disc ml-6 mb-6">
          {Object.entries(dharmaInRamayana).map(([key, val]: any, idx: number) => (
            <li key={idx}>{val}</li>
          ))}
        </ul>
        <SimilarCategories currentCategory="philosophy" title="Similar Philosophy" maxItems={3} excludeCurrent={false} />
      </div>
    </PageLayout>
  );
}