"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@/app/components/common/PageLayout';
import { useLocale } from '@/app/context/locale-context';
import LazyImage from '@/app/components/lazy-image/LazyImage';
import SimilarCategories from '@/app/components/similar-categories/SimilarCategories';

const Paragraphs = ({ lines }: { lines?: any[] }) => {
  if (!Array.isArray(lines) || !lines.length) return null;
  return (
    <div className="space-y-6">
      {lines.map((line: any, idx: number) => (
        <div key={idx} className="bg-gradient-to-br from-white to-indigo-50/30 border-l-4 border-indigo-500 rounded-lg p-6 shadow-lg animate-fade-in-up">
          <p className=" text-base md:text-lg leading-relaxed font-serif">{line}</p>
        </div>
      ))}
    </div>
  );
};

export default function AdvaitaClient() {
  const { locale } = useLocale();
  const [advaita, setAdvaita] = useState<any>({});
  useEffect(() => {
    fetch(`/locales/${locale}/philosophy_advaita.json`)
      .then(res => res.ok ? res.json() : {})
      .then(data => {
        if (data && typeof data === 'object') {
          setAdvaita((data as any)?.philosophy_advaita ?? data);
        } else {
          setAdvaita({});
        }
      });
  }, [locale]);
  const title = advaita?.title || 'Advaita Philosophy';
  const corePrinciples = Array.isArray(advaita.core_principles) ? advaita.core_principles : [];
  const paragraphs = Array.isArray(advaita.definition) ? advaita.definition : [advaita.definition].filter(Boolean);

  return (
    <PageLayout
      metaKey="philosophy_advaita"
      title={title}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Philosophy', href: '/philosophy' }, { label: 'Advaita' }]}
      className="layout-md bg-gradient-to-br from-indigo-50 via-white to-indigo-100 min-h-screen py-12 px-4 md:px-12 lg:px-24 border-l-8 border-indigo-400 shadow-2xl"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="w-full lg:w-3/4 space-y-8">
          {/* Hero Image */}
          <div className="relative group overflow-hidden rounded-2xl shadow-2xl border-4 border-indigo-300/30 bg-gradient-to-br from-indigo-50/40 to-indigo-100/20">
            <LazyImage
              src="/images/philosophy-advaita.png"
              alt="philosophy advaita"
              width={1000}
              height={100}
              className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 w-10 h-10 bg-indigo-400/80 rounded-full flex items-center justify-center shadow-lg text-white text-2xl z-20">🕉️</div>
          </div>
          {/* Definition Paragraphs */}
          <Paragraphs lines={paragraphs} />
          {/* Core Principles */}
          {corePrinciples.length > 0 && (
            <div>
              <p className="font-bold text-lg text-indigo-700 mb-2">Core Principles of Advaita:</p>
              <ul className="list-disc pl-6">
                {corePrinciples.map((s: string, idx: number) => (
                  <li key={idx} className="text-gray-800 text-base mb-1">{s}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Origin */}
          {advaita.origin && (
            <div>
              <p className="font-bold text-lg text-indigo-700 mb-2">Origin:</p>
              <ul className="list-disc pl-6">
                {Object.entries(advaita.origin).map(([k, v]: any, idx: number) => (
                  <li key={idx} className="text-gray-800 text-base mb-1"><strong>{k}:</strong> {v}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Paths to Realization */}
          {advaita.paths_to_realization && (
            <div>
              <p className="font-bold text-lg text-indigo-700 mb-2">Paths to Realization:</p>
              <ul className="list-disc pl-6">
                {Object.entries(advaita.paths_to_realization).map(([k, v]: any, idx: number) => (
                  <li key={idx} className="text-gray-800 text-base mb-1"><strong>{k}:</strong> {v}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Goals */}
          {advaita.goals && (
            <div>
              <p className="font-bold text-lg text-indigo-700 mb-2">Goals:</p>
              <ul className="list-disc pl-6">
                {Object.entries(advaita.goals).map(([k, v]: any, idx: number) => (
                  <li key={idx} className="text-gray-800 text-base mb-1"><strong>{k}:</strong> {v}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Relation to Other Concepts */}
          {advaita.relation_to_other_concepts && (
            <div>
              <p className="font-bold text-lg text-indigo-700 mb-2">Relation to Other Concepts:</p>
              <ul className="list-disc pl-6">
                {Object.entries(advaita.relation_to_other_concepts).map(([k, v]: any, idx: number) => (
                  <li key={idx} className="text-gray-800 text-base mb-1"><strong>{k}:</strong> {v}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Modern Relevance */}
          {advaita.modern_relevance && (
            <div>
              <p className="font-bold text-lg text-indigo-700 mb-2">Modern Relevance:</p>
              <ul className="list-disc pl-6">
                {Object.entries(advaita.modern_relevance).map(([k, v]: any, idx: number) => (
                  <li key={idx} className="text-gray-800 text-base mb-1"><strong>{k}:</strong> {v}</li>
                ))}
              </ul>
            </div>
          )}
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
    </PageLayout>
  );
}
