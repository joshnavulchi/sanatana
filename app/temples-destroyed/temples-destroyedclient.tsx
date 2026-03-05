"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import SimilarCategories from '@components/similar-categories/SimilarCategories';
import TextToSpeech from '@components/text-to-speech/TextToSpeech';

export default function TemplesDestroyedClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('temples_destroyed');

  const [data, setData] = useState({ title: '', intro: '', meta: {} as any, items: [] as any[], disclaimer: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try { } catch (e) { }
      if (!mounted) return;
      const title = String(ns?.title || ns?.meta?.title || ns?.canonical || '');
      const meta = ns?.meta || {};
      const intro = String(ns?.intro || meta?.description || '');
      const items = Array.isArray(ns?.incidents) ? ns.incidents : [];
      const disclaimer = String(ns?.disclaimer || '');
      setData({ title, intro, meta, items, disclaimer });
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  if (isLoading && !data.title) {
    return (
      <PageLayout metaKey="temples_destroyed" title="" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Temples' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey="temples_destroyed"
      title={data.title} breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: data.title }]}
      className="layout-md">
      <TextToSpeech sectionId="temples-destroyed" className="floating" />
      <div id="temples-destroyed" className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 rounded-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-400/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gray-300/6 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-500" />
            <span className="text-3xl animate-pulse">🧱</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-500" />
          </div>
          <p className="text-md md:text-lg leading-relaxed">{data.intro}</p>
        </div>
      </div>
      {data.items.map((section: any, index: number) => {
        const level = Math.min(index + 2, 6);
        const Tag = `h${level}` as unknown as React.ElementType;
        const icons = ['📖', '🎯', '💡', '🌟', '🔮', '✨'];
        const icon = icons[index % icons.length];
        return (
          <div key={section.id || index} className="relative bg-white border-2 border-slate-100 rounded-2xl p-6 md:p-8 mt-12 transform-gpu transition-transform duration-300 hover:-translate-y-1 hover:scale-103 ring-1 ring-slate-100/30 bg-white/85 backdrop-blur-sm group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-400/8 to-transparent rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gray-300/6 to-transparent rounded-bl-2xl" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-slate-100 to-gray-200 rounded-xl flex items-center justify-center text-2xl ring-1 ring-slate-50/30 group-hover:scale-105 group-hover:rotate-2 transition-transform duration-300">{icon}</div>
                <Tag className="flex-1 text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-slate-700 transition-colors duration-300">{section.temple_name || section.summary || section.id || section.title}</Tag>
              </div>
              <p className="text-base leading-relaxed ">{section.summary || section.event_type?.join?.(', ') || section.period || section.approx_date}</p>
              <ul className="mt-3  space-y-2">
                {section.location && <li><strong>Location:</strong> {section.location.city_or_district || section.location.state_province || JSON.stringify(section.location)}</li>}
                {section.timeline && <li><strong>Timeline:</strong> {Array.isArray(section.timeline) ? section.timeline.join(', ') : JSON.stringify(section.timeline)}</li>}
                {section.verification_status && <li><strong>Verification:</strong> {section.verification_status}</li>}
              </ul>
            </div>
          </div>
        );
      })}
      {data.disclaimer && (
        <div className="relative bg-gradient-to-br from-slate-50 to-gray-50 border-l-4 border-slate-400 rounded-lg p-6 md:p-8 mt-12 ring-1 ring-slate-100/30 bg-white/70 backdrop-blur-sm">
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
