"use client";
import React, { useEffect, useState } from 'react';
import PageLayout from '@/app/components/common/PageLayout';
import { useLocale } from '../context/locale-context';
import useLocaleSection from '../hooks/useLocaleSection';
import { parseSections, parseMaybeObject } from 'lib/parseContent';
import Loader from '@/app/components/loader/loader';
import TextToSpeech from '@/app/components/text-to-speech/TextToSpeech';

export default function TemplesInIndiaClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('temples_in_india');

  const [data, setData] = useState({ title: '', intro: '', meta: {} as any, dynasty_timeline: [] as any[], items: [] as any[], disclaimer: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try { } catch (e) { }
      if (!mounted) return;
      const title = String(ns?.title || ns?.meta?.title || '');
      const meta = ns?.meta || {};
      const intro = String(ns?.intro || meta?.description || '');
      const dynasty_timeline = Array.isArray(ns?.dynasty_timeline) ? ns.dynasty_timeline : [];
      const items = Array.isArray(ns?.temples) ? ns.temples : [];
      const disclaimer = String(ns?.disclaimer || '');
      setData({ title, intro, meta, dynasty_timeline, items, disclaimer });
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  if (isLoading && !data.title) {
    return (
      <PageLayout metaKey="temples_in_india" title="" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Temples in India' }]} className="layout-sm">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="temples_in_india"
      title={data.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: data.title }]}
      className="layout-sm"
    >
      <TextToSpeech sectionId="temples-in-india" className="floating" />

      <div id="temples-india-content">
        <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 rounded-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500" />
              <span className="text-3xl animate-pulse">🗺️</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500" />
            </div>

            <p className="text-lg md:text-xl leading-relaxed">{data.intro}</p>
          </div>
        </div>

        {data.items.map((section: any, index: number) => {
          const level = Math.min(index + 2, 6);
          const Tag = `h${level}` as unknown as React.ElementType;
          const icons = ['📖', '🎯', '💡', '🌟', '🔮', '✨'];
          const icon = icons[index % icons.length];

          return (
            <div key={section.id || index} className="relative bg-white border-2 border-amber-100 rounded-2xl p-6 md:p-8 mt-12 shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/10 to-transparent rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-400/10 to-transparent rounded-bl-2xl" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">{icon}</div>
                  <Tag className="flex-1 text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">{section.name || section.title || section.name || section.id}</Tag>
                </div>

                {section?.how_it_was_built && <p className="text-base md:text-lg leading-relaxed pl-16">{section.how_it_was_built}</p>}
                <ul className="mt-3 pl-16 space-y-2">
                  {section.location && <li><strong>Location:</strong> {section.location}</li>}
                  {section.state && <li><strong>State:</strong> {section.state}</li>}
                  {section.architecture_style && <li><strong>Architecture:</strong> {section.architecture_style}</li>}
                  {section.dynasty_association && <li><strong>Dynasty association:</strong> {Array.isArray(section.dynasty_association) ? section.dynasty_association.join(', ') : section.dynasty_association}</li>}
                </ul>
              </div>
            </div>
          );
        })}

        {data.disclaimer && (
          <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-6 md:p-8 mt-12 shadow-lg">
            <div className="flex items-start gap-4">
              <span className="text-3xl">⚠️</span>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Disclaimer</h4>
                <p className="leading-relaxed">{data.disclaimer}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
