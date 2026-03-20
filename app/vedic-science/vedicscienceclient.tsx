"use client";
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import TextToSpeech from '@components/text-to-speech/TextToSpeech';

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
          <div className="flex items-center justify-center py-6">
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
            <section key={section.id || idx} className="prose max-w-none">
              {section.title && <h2 className="text-2xl font-bold">{section.title}</h2>}
              {section.text && <p>{section.text}</p>}
            </section>
          ))}
        </div>
      </PageLayout>
    </>
  );
}
