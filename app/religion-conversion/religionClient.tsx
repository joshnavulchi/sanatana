"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';

export default function ReligionClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('religion_conversion');

  // Initialize with empty state to avoid hydration mismatch
  // useLocaleSection will populate the data properly
  const [religion, setReligion] = useState({ title: '', intro: '', sections: [] as any[], disclaimer: '', country_conversion_details: [] as any[] });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Locale loading is now handled by context/useLocaleSection
      } catch (e) { }

      if (!mounted) return;
      const title = String(ns?.title || '');
      const intro = String(ns?.intro || '');
      // Sections can be array or object
      let sections: any[] = [];
      if (Array.isArray(ns?.sections)) {
        sections = ns.sections;
      } else if (typeof ns?.sections === 'object' && ns?.sections !== null) {
        sections = Object.values(ns.sections);
      }
      const disclaimer = String(ns?.disclaimer || '');
      const country_conversion_details = Array.isArray(ns?.country_conversion_details) ? ns.country_conversion_details : [];
      setReligion({ title, intro, sections, disclaimer, country_conversion_details });
    })();
    return () => { mounted = false; };
  }, [locale, ns]);
  
  // Show loading state if locale is still loading and we have no content
  if (isLoading && !religion.title) {
    return (
      <PageLayout
        metaKey="religion_conversion"
        title={religion.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Religion Conversion' }]}
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
      metaKey="religion_conversion"
      title={religion.title}
      description={religion.intro}
      titleColor='from-amber-600 via-rose-600 to-indigo-700'
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: religion.title }]}
      className="layout-md"
    >
      {religion.sections.map((section: any, idx: number) => (
        <div key={idx} className="mb-10">
          <h4 className="text-2xl font-bold text-blue-800 mb-3 border-l-4 border-blue-400 pl-3">{section.title}</h4>
          {/* Section content: string */}
          {typeof section.content === 'string' && (
            <p className="text-gray-700 mb-2 text-base md:text-lg leading-relaxed">{section.content}</p>
          )}
          {/* Section content: array of strings */}
          {Array.isArray(section.content) && section.content.length > 0 && typeof section.content[0] === 'string' && (
            <ul className="list-disc pl-8 text-gray-700 space-y-2">
              {section.content.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
          {/* Section content: array of objects (country details) */}
          {Array.isArray(section.content) && section.content.length > 0 && typeof section.content[0] === 'object' && (
            <div className="grid grid-cols-1 gap-4 mt-4">
              {section.content.map((item: any, i: number) => (
                <div key={i} className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-400 rounded-lg p-4 shadow">
                  <div className="font-semibold text-blue-700 text-lg mb-1 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                    {item.country}
                  </div>
                  <div className="text-gray-700 text-base">{item.details}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Unique country-wise conversion section */}
      {religion.country_conversion_details && religion.country_conversion_details.length > 0 && (
        <div className="mt-12">
          <h6 className="text-2xl font-bold text-green-800 mb-4 border-l-4 border-green-400 pl-3">Country-wise Conversion Details</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {religion.country_conversion_details.map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-400 rounded-lg p-4 shadow hover:scale-105 transition-transform duration-200">
                <div className="font-semibold text-green-700 text-lg mb-1 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                  {item.country}
                </div>
                <div className="text-gray-700 text-base">{item.details}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer section */}
      {religion.disclaimer && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6 mt-12">
          <div className="flex items-start gap-4">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h6 className="text-lg font-bold text-yellow-800 mb-2">Disclaimer</h6>
              <p className="text-gray-700">{religion.disclaimer}</p>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}