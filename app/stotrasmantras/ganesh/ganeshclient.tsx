"use client";
import { useEffect, useState } from 'react';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { parseSections, parseMaybeObject } from '@lib/parseContent';
import Loader from '@components/loader';
import PageLayout from '@components/common/PageLayout';
import SimilarCategories from '@components/similar-categories/SimilarCategories';


export default function GaneshClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('stotrasmantras_ganesh');

  // Initialize with empty state to avoid hydration mismatch
  // useLocaleSection will populate the data properly
  const [ganesh, setGanesh] = useState({ title: '', intro: '', ganesh_stotras: [] as any[] });

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      const title = String(ns?.title || '');
      const intro = String(ns?.intro || '');
      const sectionsRaw = parseMaybeObject(ns ? ns.ganesh_stotras : '');
      const ganesh_stotras = parseSections(sectionsRaw);
      setGanesh({ title, intro, ganesh_stotras });
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  if (isLoading && !ganesh.title) {
    return (
      <PageLayout metaKey="stotrasmantras_ganesh" title="" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Ganesh' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="stotrasmantras_ganesh"
      title={ganesh.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: ganesh.title }]}
      className="layout-md">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/4">
          <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-50 rounded-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-400/8 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-600" />
                <span className="text-3xl animate-pulse">🛕</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-600" />
              </div>
              <p className="text-lg md:text-xl leading-relaxed">{ganesh?.intro}</p>
            </div>
          </div>
          {Array.isArray(ganesh.ganesh_stotras) && ganesh.ganesh_stotras.map((section: any, index: number) => {
            const level = Math.min(index + 2, 6);
            const Tag = `h${level}` as unknown as React.ElementType;
            const icons = ['📖', '🎯', '💡', '🌟', '🔮', '✨'];
            const icon = icons[index % icons.length];
            return (
              <div
                key={section.id || index}
                className="relative bg-white border-2 border-emerald-100 rounded-2xl p-6 md:p-8 mt-12 shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-400/10 to-transparent rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-400/8 to-transparent rounded-bl-2xl" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                      {icon}
                    </div>
                    <Tag className="flex-1 text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                      {section.name}
                    </Tag>
                  </div>
                  {section?.description && (
                    <p className="text-base md:text-lg leading-relaxed pl-16">
                      {section.description}
                    </p>
                  )}
                  {Array.isArray(section?.benefits) && section.benefits.length > 0 && (
                    <ul className="space-y-3 pl-16">
                      {section.benefits.map((text: string, idx: number) => (
                        <li key={idx} className="relative flex items-start gap-3 leading-relaxed">
                          <span className="flex-shrink-0 w-2 h-2 mt-2 bg-gradient-to-br from-emerald-500 to-green-400 rounded-full" />
                          <span className="flex-1">{text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-full lg:w-1/4">
          <SimilarCategories />
        </div>
      </div>
    </PageLayout>
  );
}