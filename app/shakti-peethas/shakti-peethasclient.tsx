"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import SimilarCategories from '@components/similar-categories/SimilarCategories';
import TextToSpeech from '@components/text-to-speech/TextToSpeech';

export default function ShaktiPeethasClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('shakti_peethas');

  const [data, setData] = useState({ title: '', intro: '', meta: {} as any, items: [] as any[], disclaimer: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try { } catch (e) { }
      if (!mounted) return;
      const title = String(ns?.title || ns?.meta?.title || '');
      const meta = ns?.meta || {};
      const intro = String(ns?.intro || meta?.description || '');
      const items = Array.isArray(ns?.peethas) ? ns.peethas : [];
      const disclaimer = String(ns?.disclaimer || '');
      setData({ title, intro, meta, items, disclaimer });
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  if (isLoading && !data.title) {
    return (
      <PageLayout metaKey="shakti_peethas" title="" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Shakti Peethas' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="shakti_peethas"
      title={data.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: data.title }]}
      className="layout-md"
    >
      <TextToSpeech sectionId="shakti-peethas" className="floating" />

      <div id="shaktipeethas-content">
        <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-rose-50 via-pink-50 to-rose-50 rounded-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-400/8 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-rose-500" />
              <span className="text-3xl animate-pulse">🌺</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-rose-500" />
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
            <div key={section.id || index} className="relative bg-white border-2 border-rose-100 rounded-2xl p-6 md:p-8 mt-12 transform-gpu transition-transform duration-300 hover:-translate-y-1 hover:scale-105 ring-1 ring-rose-100/30 bg-white/80 backdrop-blur-sm group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-400/10 to-transparent rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/8 to-transparent rounded-bl-2xl" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center text-2xl ring-1 ring-rose-50/40 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">{icon}</div>
                  <Tag className="flex-1 text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-rose-600 transition-colors duration-300">{section.name || section.title}</Tag>
                </div>
                <p className="text-base md:text-lg leading-relaxed pl-16">{section.location || section.body_part || section.shakti || ''}</p>
                <ul className="mt-3 pl-16 space-y-2">
                  {section.bhairava && <li><strong>Bhairava:</strong> {section.bhairava}</li>}
                  {section.body_part && <li><strong>Body part:</strong> {section.body_part}</li>}
                  {section.location && <li><strong>Location:</strong> {section.location}</li>}
                  {section.shakti && <li><strong>Shakti:</strong> {section.shakti}</li>}
                </ul>
              </div>
            </div>
          );
        })}

        <div className="mt-12">
          <SimilarCategories />
        </div>

        {data.disclaimer && (
          <div className="relative bg-gradient-to-br from-rose-50 to-pink-50 border-l-4 border-rose-500 rounded-lg p-6 md:p-8 mt-12 ring-1 ring-rose-100/30 bg-white/70 backdrop-blur-sm">
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
