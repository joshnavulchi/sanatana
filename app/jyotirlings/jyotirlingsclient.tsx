"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import SimilarCategories from '@components/similar-categories/SimilarCategories';
import TextToSpeech from '@components/text-to-speech/TextToSpeech';

export default function JyotirlingsClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('jyotirlings');

  const [data, setData] = useState({ title: '', intro: '', meta: {} as any, items: [] as any[], overall_timeline: [] as any[], disclaimer: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      // locale JSON sometimes nests under `jyotirlingas` (different spelling/namespace),
      // so normalize to a container object that definitely holds the expected keys.
      const container = ns?.jyotirlings ?? ns?.jyotirlings ?? ns ?? {};
      const meta = container?.meta || {};
      const title = String(container?.title || meta?.title || '');
      const intro = String(container?.intro || meta?.description || '');
      const items = Array.isArray(container?.lingas)
        ? container.lingas
        : Array.isArray(container?.items)
          ? container.items
          : [];
      const overall_timeline = Array.isArray(container?.overall_timeline) ? container.overall_timeline : [];
      const disclaimer = String(container?.disclaimer || '');
      setData({ title, intro, meta, items, overall_timeline, disclaimer });
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  if (isLoading && !data.title) {
    return (
      <PageLayout metaKey="jyotirlings" title="" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Jyotirlings' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="jyotirlings"
      title={data.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: data.title }]}
      className="layout-md"
    >
      <TextToSpeech sectionId="jyotirlings" className="floating" />
      <div id="jyotirlings-content" className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-yellow-50 via-amber-100 to-yellow-50 rounded-2xl border-l-4 border-amber-400 shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-400/8 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-600" />
            <span className="text-3xl animate-pulse">🛕</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-600" />
          </div>
          <p className="text-md leading-relaxed  text-amber-900 drop-shadow animate-fade-in-up">{data.intro}</p>
        </div>
      </div>

      {data.items.map((section: any, index: number) => {
        const level = Math.min(index + 2, 6);
        const Tag = `h${level}` as unknown as React.ElementType;
        const icons = ['📖', '🎯', '💡', '🌟', '🔮', '✨'];
        const icon = icons[index % icons.length];

        return (
          <div key={section.id || index} className="relative bg-white border-l-4 border-amber-300 rounded-2xl p-6 md:p-8 mt-12 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/10 to-transparent rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-400/8 to-transparent rounded-bl-2xl" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">{icon}</div>
                <Tag className="flex-1 text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors duration-300">{section.name || section.title}</Tag>
              </div>
              {section?.timeline?.early_mentions && <p className="text-md md:text-md md:text-md leading-relaxed ">{section.timeline.early_mentions}</p>}
              {section?.timeline?.ancient_mentions && <p className="text-md md:text-md md:text-md leading-relaxed ">{section.timeline.ancient_mentions}</p>}
              {section?.unique_features && <p className="text-md md:text-md md:text-md leading-relaxed ">{Array.isArray(section.unique_features) ? section.unique_features.join(', ') : section.unique_features}</p>}
              {section?.dynasties && <p className="text-md md:text-md md:text-md leading-relaxed ">{Array.isArray(section.dynasties) ? section.dynasties.join(', ') : section.dynasties}</p>}
            </div>
          </div>
        );
      })}

      {data.disclaimer && (
        <div className="relative bg-gradient-to-br from-yellow-50 to-amber-50 border-l-4 border-amber-600 rounded-lg p-6 md:p-8 mt-12 ring-1 ring-yellow-100/30 bg-white/70 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <span className="text-3xl">⚠️</span>
            <div className="flex-1">
              <h4 className="text-md md:text-md font-bold text-gray-900 mb-2">Disclaimer</h4>
              <p className="leading-relaxed">{data.disclaimer}</p>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
