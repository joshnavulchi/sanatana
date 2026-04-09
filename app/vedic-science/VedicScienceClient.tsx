"use client";

import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import TextToSpeech from '@components/text-to-speech/TextToSpeech';
import PageLayout from '@components/common/PageLayout';

export default function VedicScienceClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('vedic-science');

  const page = {
    title: String(ns?.title || ''),
    description: String(ns?.description || ''),
    sections: Array.isArray(ns?.sections) ? ns.sections : [],
  };

  if (isLoading && !page.title) {
    return (
      <PageLayout metaKey="vedic_science" title={page.title} breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Vedic Science' }]}>
        <div className="flex items-center justify-center py-4 text-md sm:text-base leading-relaxed font-normal">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout
        metaKey="vedic_science"
        title={page.title}
        description={page.description}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Vedic Science' }]}
      >
        {page.title && <h1 className="text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-rose-600 to-indigo-700 drop-shadow-xl mb-6">{page.title}</h1>}

        <TextToSpeech sectionId="vedic-science-content" className="floating" />

        <div
          id="vedic-science-content"
          className="space-y-8 text-md sm:text-base leading-relaxed font-normal bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 rounded-3xl border border-blue-200/30 shadow-xl p-6 md:p-10 animate-fadeIn"
        >
          {page.sections.map((section: any, idx: number) => (
            <section
              key={section.id || idx}
              className="space-y-4 bg-gradient-to-r from-cyan-50 via-blue-100 to-blue-200/60 rounded-2xl shadow-md p-4 md:p-6 transition-all duration-500 hover:shadow-xl motion-safe:animate-fadeIn"
            >
              {section.title && (
                <h3 className="section-title text-2xl font-semibold leading-snug mb-3 text-blue-900 drop-shadow">{section.title}</h3>
              )}
              {section.text && (
                <p className="body-text text-md sm:text-base leading-relaxed mb-4 font-normal text-gray-900">{section.text}</p>
              )}
            </section>
          ))}
        </div>
      </PageLayout>
    </>
  );
}

