'use client';
import { useEffect, useState } from 'react';
import { useLocale } from '../context/locale-context';
import useLocaleSection from '../hooks/useLocaleSection';
import { parseSections, parseMaybeObject } from 'lib/parseContent';
import Loader from '@/app/components/loader/loader';
import PageLayout from '../components/common/PageLayout';

export default function SanatanadharmaClientPage() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('sanatanadharma');
  const [content, setContent] = useState({ title: '', subtitle: '', sections: [] as any[] });

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      const title = String(ns?.title || '');
      const subtitle = String(ns?.subtitle || '');
      const sectionsRaw = parseMaybeObject(ns ? ns.sections : '');
      const sections = parseSections(sectionsRaw);
      setContent({ title, subtitle, sections });
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  if (isLoading && !content.title) {
    return (
      <PageLayout
        metaKey="sanatanadharma"
        title=""
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Sanatanadharma' }]}
        className="layout-md"
      >
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="sanatanadharma"
      title={content.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: content.title }]}
      className="layout-md"
    >
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[10vh] py-6 px-4 bg-gradient-to-br from-yellow-100 via-orange-50 to-amber-200 rounded-3xl border-l-4 border-amber-400 shadow-2xl overflow-hidden mb-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -left-16 w-72 h-72 bg-amber-100 rounded-full blur-3xl opacity-60 animate-pulse" />
          <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-50 animate-pulse" />
        </div>
        <h3 className="relative z-10 text-2xl md:text-3xl font-extrabold text-amber-800 drop-shadow-xl tracking-tight animate-fade-in">
          {content.title}
        </h3>
        <p className="relative z-10 text-xl md:text-2xl text-amber-700 font-medium animate-fade-in-slow max-w-2xl text-center">
          {content.subtitle}
        </p>
      </section>

      {/* Sections as cards */}
      <div className="flex flex-col gap-12">
        {content.sections.map((section: any, index: number) => {
          const level = Math.min(index + 2, 6);
          const Tag = `h${level}` as unknown as React.ElementType;
          const icons = ['📖', '🎯', '💡', '🌟', '🔮', '✨'];
          const icon = icons[index % icons.length];
          return (
            <div
              key={section.id || index}
              className="relative bg-white border-l-4 border-amber-300 rounded-2xl p-6 md:p-8 mt-4 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/10 to-transparent rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-400/10 to-transparent rounded-bl-2xl" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    {icon}
                  </div>
                  <Tag className="flex-1 text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                    {section.title}
                  </Tag>
                </div>
                {section?.para1 && (
                  <p className="text-base md:text-lg leading-relaxed pl-16">{section.para1}</p>
                )}
                {section?.para2 && (
                  <p className="text-base md:text-lg leading-relaxed pl-16">{section.para2}</p>
                )}
                {section?.para3 && (
                  <p className="text-base md:text-lg leading-relaxed pl-16">{section.para3}</p>
                )}
                {/* Keypoints as sub-bullets */}
                {section?.keypoints && Array.isArray(section.keypoints) && section.keypoints.length > 0 && (
                  <ul className="space-y-3 pl-16">
                    {section.keypoints.map((point: any, idx: number) => (
                      <li key={idx} className="mb-2">
                        <div className="font-semibold text-amber-700 mb-1">{point.title}</div>
                        {point.para1 && <div className="text-amber-800/90 text-base md:text-lg indent-8">{point.para1}</div>}
                        {point.para2 && <div className="text-amber-800/90 text-base md:text-lg indent-8">{point.para2}</div>}
                        {point.para3 && <div className="text-amber-800/90 text-base md:text-lg indent-8">{point.para3}</div>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
