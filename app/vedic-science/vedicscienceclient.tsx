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
        <div className="flex items-center justify-center py-4 text-base leading-relaxed font-normal">
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
        <TextToSpeech sectionId="vedic-science-content" className="floating" />

        <div id="vedic-science-content" className="space-y-8 text-base leading-relaxed font-normal">
          {page.sections.map((section: any, idx: number) => (
            <section key={section.id || idx} className="space-y-4">
              {section.title && <h3 className="section-title text-2xl font-semibold leading-snug mb-3">{section.title}</h3>}
              {section.text && <p className="body-text text-base leading-relaxed mb-4 font-normal">{section.text}</p>}
            </section>
          ))}
        </div>
      </PageLayout>
    </>
  );
}
