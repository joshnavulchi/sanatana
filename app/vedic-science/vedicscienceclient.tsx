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
        <div className="flex items-center justify-center py-4">
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

        <div id="vedic-science-content" className="space-y-8">
          {page.sections.map((section: any, idx: number) => (
            <section key={section.id || idx} className="space-y-4">
              {section.title && <h2 className="section-title">{section.title}</h2>}
              {section.text && <p className="body-text">{section.text}</p>}
            </section>
          ))}
        </div>
      </PageLayout>
    </>
  );
}
