"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import SimilarCategories from '@components/similar-categories/SimilarCategories';
import TextToSpeech from '@components/text-to-speech/TextToSpeech';

export default function DiseasesCuringTemplesClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('diseases_curing_temples');

  const [data, setData] = useState({ title: '', intro: '', meta: {} as any, items: [] as any[], disclaimer: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // locale loading handled by useLocaleSection
      } catch (e) { }
      if (!mounted) return;
      const meta = ns?.meta || {};
      const title = String(ns?.title || meta?.title || '');
      const intro = String(ns?.intro || meta?.description || '');
      const items = Array.isArray(ns?.healing_temples_india) ? ns.healing_temples_india : [];
      const disclaimer = String(ns?.disclaimer || '');
      setData({ title, intro, meta, items, disclaimer });
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  if (isLoading && !data.title) {
    return (
      <PageLayout metaKey="diseases_curing_temples" title="" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Temples' }]} className="layout-md">
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="diseases_curing_temples"
      title={data.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: data.title }]}
      className="layout-md"
    >
      <TextToSpeech sectionId="diseases-curing-temples" className="floating" />
      <div id="diseases-curing-temples-content" className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 rounded-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-400/8 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-500" />
            <span className="text-3xl animate-pulse">🩺</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-500" />
          </div>
          <p className="text-md leading-relaxed">{data.intro}</p>
        </div>
      </div>
      {data.items.map((section: any, index: number) => {
        const level = Math.min(index + 2, 6);
        const Tag = `h${level}` as unknown as React.ElementType;
        const icons = ['📖', '🎯', '💡', '🌟', '🔮', '✨'];
        const icon = icons[index % icons.length];
        return (
          <div key={section.id || index} className="relative bg-white border-2 border-emerald-100 rounded-2xl p-6 md:p-8 mt-12 transform-gpu transition-transform duration-300 hover:-translate-y-1 hover:scale-105 ring-1 ring-emerald-100/30 bg-white/80 backdrop-blur-sm group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-400/10 to-transparent rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-400/8 to-transparent rounded-bl-2xl" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center text-2xl ring-1 ring-emerald-50/40 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">{icon}</div>
                <Tag className="flex-1 text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                  {section.temple_name || section.name || section.title}
                </Tag>
              </div>
              {section?.traditional_belief_about_diseases && section.traditional_belief_about_diseases.length > 0 && (
                <ul className="space-y-3 ">
                  {section.traditional_belief_about_diseases.map((text: string, idx: number) => (
                    <li key={idx} className="relative flex items-start gap-3 leading-relaxed">
                      <span className="flex-shrink-0 w-2 h-2 mt-2 bg-gradient-to-br from-emerald-500 to-green-400 rounded-full" />
                      <span className="flex-1">{text}</span>
                    </li>
                  ))}
                </ul>
              )}
              {!section?.traditional_belief_about_diseases && (section.summary || section.text) && (
                <p className="text-base leading-relaxed ">{section.summary || section.text}</p>
              )}
            </div>
          </div>
        );
      })}
      {data.disclaimer && (
        <div className="relative bg-gradient-to-br from-emerald-50 to-green-50 border-l-4 border-emerald-500 rounded-lg p-6 md:p-8 mt-12 ring-1 ring-emerald-100/30 bg-white/70 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <span className="text-3xl">⚠️</span>
            <div className="flex-1">
              <h4 className="text-base font-bold text-gray-900 mb-2">Disclaimer</h4>
              <p className="leading-relaxed">{data.disclaimer}</p>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
