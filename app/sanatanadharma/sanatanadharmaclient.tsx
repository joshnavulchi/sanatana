'use client';
import { useEffect, useState } from 'react';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { parseSections, parseMaybeObject } from '@lib/parseContent';
import Loader from '@components/loader';
import PageLayout from '@components/common/PageLayout';

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
      {/* Sections as cards */}
      <div className="flex flex-col gap-8">
        {content.sections.map((section: any, index: number) => {
          const level = Math.min(index + 2, 6);
          const Tag = `h${level}` as unknown as React.ElementType;
          const icons = ['📖', '🎯', '💡', '🌟', '🔮', '✨'];
          const icon = icons[index % icons.length];
          return (
            <div
              key={section.id || index}
              className="relative bg-gradient-to-br from-white via-orange-50/30 to-white border-4 border-orange-200 rounded-lg p-8 md:p-10 shadow-md hover:shadow-2xl hover:border-orange-400 transition-all duration-300 group"
            >
              <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-orange-400 rounded-tl-lg" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-orange-400 rounded-br-lg" />
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-orange-300/20 via-yellow-200/10 to-transparent" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-orange-300/20 via-yellow-200/10 to-transparent" />
              <div className="relative z-10 space-y-5">
                <div className="flex items-start gap-5 pb-4 border-b-2 border-orange-200">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 border-white group-hover:scale-110 transition-transform duration-300">
                    {icon}
                  </div>
                  <Tag className="flex-1 text-2xl md:text-4xl font-extrabold text-orange-700 group-hover:text-orange-900 transition-colors duration-300 leading-tight pt-2">
                    {section.title}
                  </Tag>
                </div>
                {section?.para1 && (
                  <p className="text-xl md:text-lg md:text-lg leading-loose text-gray-700 pl-0 first-letter:text-5xl first-letter:font-bold first-letter:text-orange-600 first-letter:mr-1 first-letter:float-left">{section.para1}</p>
                )}
                {section?.para2 && (
                  <p className="text-xl md:text-lg md:text-lg leading-loose text-gray-700 pl-0">{section.para2}</p>
                )}
                {section?.para3 && (
                  <p className="text-xl md:text-lg md:text-lg leading-loose text-gray-700 pl-0">{section.para3}</p>
                )}
                {/* Keypoints as sub-bullets */}
                {section?.keypoints && Array.isArray(section.keypoints) && section.keypoints.length > 0 && (
                  <ul className="space-y-4 mt-6 pl-0">
                    {section.keypoints.map((point: any, idx: number) => (
                      <li key={idx} className="bg-orange-50 border-l-8 border-orange-400 p-5 rounded-r-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="font-bold text-orange-800 mb-2 text-lg flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-600 rounded-full" />
                          {point.title}
                        </div>
                        {point.para1 && <div className="text-gray-700 text-xl md:text-lg md:text-lg pl-4 leading-relaxed mb-2">{point.para1}</div>}
                        {point.para2 && <div className="text-gray-700 text-xl md:text-lg md:text-lg pl-4 leading-relaxed mb-2">{point.para2}</div>}
                        {point.para3 && <div className="text-gray-700 text-xl md:text-lg md:text-lg pl-4 leading-relaxed">{point.para3}</div>}
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
