"use client";

import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import SimilarCategories from '@components/similar-categories/SimilarCategories';
import TextToSpeech from '@components/text-to-speech/TextToSpeech';
const temples_in_india_page = {
  architec: "Architecture:",
  disclaim: "Disclaimer",
  dynasty_associat: "Dynasty association:",
  location: "Location:",
  state: "State:"
};

export default function TemplesInIndiaClient() {
  const {
    locale,
    isLoading
  } = useLocale();
  const ns = useLocaleSection('temples_in_india');
  const [data, setData] = useState({
    title: '',
    intro: '',
    meta: {} as any,
    dynasty_timeline: [] as any[],
    items: [] as any[],
    disclaimer: ''
  });
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
      setData({
        title,
        intro,
        meta,
        dynasty_timeline,
        items,
        disclaimer
      });
    })();
    return () => {
      mounted = false;
    };
  }, [locale, ns]);
  if (isLoading && !data.title) {
    return <PageLayout metaKey="temples_in_india" title="" breadcrumbs={[{
      labelKey: 'Home',
      href: '/'
    }, {
      label: 'Temples in India'
    }]} className="layout-md">
      <div className="flex items-center justify-center py-12"><Loader /></div>
    </PageLayout>;
  }
  return <PageLayout metaKey="temples_in_india" title={data.title} breadcrumbs={[{
    labelKey: 'Home',
    href: '/'
  }, {
    label: data.title
  }]} className="layout-md">
    <TextToSpeech sectionId="temples-in-india" className="floating" />
    <div id="temples-in-india" className="relative px-3 md:px-6 py-4 md:py-16 bg-gradient-to-br from-sky-50 via-indigo-50 to-sky-50 rounded-2xl overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400/8 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-300/6 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-indigo-600" />
          <span className="text-3xl animate-pulse">🗺️</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-indigo-600" />
        </div>
        <p className="text-xl md:text-lg leading-relaxed">{data.intro}</p>
      </div>
    </div>
    {data.items.map((section: any, index: number) => {
      const level = Math.min(index + 2, 6);
      const Tag = `h${level}` as unknown as React.ElementType;
      const icons = ['📖', '🎯', '💡', '🌟', '🔮', '✨'];
      const icon = icons[index % icons.length];
      return <div key={section.id || index} className="relative bg-white border-2 border-sky-100 rounded-2xl p-4 md:p-8 mt-12 transform-gpu transition-transform duration-300 hover:-translate-y-1 hover:scale-104 ring-1 ring-sky-100/30 bg-white/85 backdrop-blur-sm group overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-400/8 to-transparent rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-sky-300/6 to-transparent rounded-bl-2xl" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-sky-100 to-indigo-100 rounded-xl flex items-center justify-center text-2xl ring-1 ring-sky-50/30 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">{icon}</div>
            <Tag className="flex-1 text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">{section.name || section.title || section.name || section.id}</Tag>
          </div>

          {section?.how_it_was_built && <p className="text-base md:text-md leading-relaxed ">{section.how_it_was_built}</p>}
          <ul className="mt-3  space-y-2">
            {section.location && <li><strong>{temples_in_india_page.location}</strong> {section.location}</li>}
            {section.state && <li><strong>{temples_in_india_page.state}</strong> {section.state}</li>}
            {section.architecture_style && <li><strong>{temples_in_india_page.architec}</strong> {section.architecture_style}</li>}
            {section.dynasty_association && <li><strong>{temples_in_india_page.dynasty_associat}</strong> {Array.isArray(section.dynasty_association) ? section.dynasty_association.join(', ') : section.dynasty_association}</li>}
          </ul>
        </div>
      </div>;
    })}

    {data.disclaimer && <div className="relative bg-gradient-to-br from-sky-50 to-indigo-50 border-l-4 border-indigo-400 rounded-lg p-4 md:p-8 mt-12 ring-1 ring-sky-100/30 bg-white/70 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <span className="text-3xl">⚠️</span>
        <div className="flex-1">
          <h4 className="text-base md:text-md font-bold text-gray-900 mb-2">{temples_in_india_page.disclaim}</h4>
          <p className="leading-relaxed">{data.disclaimer}</p>
        </div>
      </div>
    </div>}
  </PageLayout>;
}