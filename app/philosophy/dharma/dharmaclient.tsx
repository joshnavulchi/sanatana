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
  const dharma = useLocaleSection('philosophy_dharma');

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
      className="layout-md bg-gradient-to-br from-yellow-50 via-amber-100 to-orange-50    min-h-screen py-12 px-4 md:px-12 lg:px-24 border-l-8 border-amber-400 shadow-2xl"
    >
      <TextToSpeech sectionId="philosophy-dharma-content" className="floating" />
      <div id="philosophy-dharma-content" className="rounded-xl shadow-xl border-2 border-amber-200/60 bg-white/80  p-6 md:p-10 lg:p-14 space-y-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-3/4 space-y-6">
            {/* Hero Image with enhanced styling */}
            <div className="relative group overflow-hidden rounded-2xl shadow-2xl border-4 border-amber-300/30 bg-gradient-to-br from-amber-50/40 to-orange-100/20">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              <LazyImage
                src="/images/philosophy-dharma.png"
                alt="philosophy dharma"
                width={1000}
                height={100}
                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
              />
              {/* Decorative border */}
              <div className="absolute inset-0 border-4 border-amber-400/0 group-hover:border-amber-400/30 rounded-2xl transition-all duration-500" />
              {/* Floating accent icon */}
              <div className="absolute top-4 left-4 w-10 h-10 bg-amber-400/80 rounded-full flex items-center justify-center shadow-lg animate-bounce text-white text-2xl z-20">🕉️</div>
            </div>
            {/* Content paragraphs */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-amber-800 mb-4">{title}</h1>
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
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="sticky top-24">
              <SimilarCategories
                currentCategory="philosophy"
                title="Similar Philosophy"
                maxItems={3}
                excludeCurrent={false}
              />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}