"use client";

import { useLocale } from '@app/context/locale-context';
import Loader from '@components/loader';
import TextToSpeech from '@/app/components/TextToSpeech';
import PageLayout from '@components/common/PageLayout';

type pageData = {
  title?: string;
  description?: string;
  sections?: any[];
  introduction?: string;
  philosophical_explanation?: string;
  scripture_text?: any[];
  [key: string]: any;
};

type Props = {
  initialData?: pageData | null;
  initialLocale?: string;
  slug?: string;
};

export default function ScienceClient({ initialData, initialLocale, slug }: Props) {
  const { locale, isLoading } = useLocale();

  const page = initialData ? {
    title: String(initialData.title || ''),
    description: String(initialData.description || ''),
    sections: Array.isArray(initialData.sections) ? initialData.sections : [],
    introduction: initialData.introduction,
    philosophical_explanation: initialData.philosophical_explanation,
    scripture_text: Array.isArray(initialData.scripture_text) ? initialData.scripture_text : [],
  } : {
    title: '',
    description: '',
    sections: [],
    introduction: '',
    philosophical_explanation: '',
    scripture_text: [],
  };

  if (isLoading && !page.title) {
    return (
      <PageLayout metaKey="vedic_science" title={page.title} breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Vedic Science' }, { label: slug || '' }]} >
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
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Vedic Science' }, { label: slug || '' }]}
      >
        {page.title && <h1 className="text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-rose-600 to-indigo-700 drop-shadow-xl mb-6">{page.title}</h1>}

        <TextToSpeech sectionId="vedic-science-sub-content" className="floating" />

        <div
          id="vedic-science-sub-content"
          className="space-y-8 text-md sm:text-base leading-relaxed font-normal bg-linear-to-br from-blue-50 via-blue-100 to-cyan-50 rounded-3xl border border-blue-200/30 shadow-xl p-6 md:p-10 animate-fadeIn"
        >
          {page.introduction && (
            <section className="space-y-4 bg-linear-to-r from-cyan-50 via-blue-100 to-blue-200/60 rounded-2xl shadow-md p-4 md:p-6 transition-all duration-500 hover:shadow-xl motion-safe:animate-fadeIn">
              <h3 className="section-title text-2xl font-semibold leading-snug mb-3 text-blue-900 drop-shadow">Introduction</h3>
              <p className="body-text text-md sm:text-base leading-relaxed mb-4 font-normal text-gray-900">{page.introduction}</p>
            </section>
          )}

          {page.philosophical_explanation && (
            <section className="space-y-4 bg-linear-to-r from-cyan-50 via-blue-100 to-blue-200/60 rounded-2xl shadow-md p-4 md:p-6 transition-all duration-500 hover:shadow-xl motion-safe:animate-fadeIn">
              <h3 className="section-title text-2xl font-semibold leading-snug mb-3 text-blue-900 drop-shadow">Philosophical Explanation</h3>
              <p className="body-text text-md sm:text-base leading-relaxed mb-4 font-normal text-gray-900">{page.philosophical_explanation}</p>
            </section>
          )}

          {page.scripture_text && page.scripture_text.map((text: any, idx: number) => (
            <section key={idx} className="space-y-4 bg-linear-to-r from-cyan-50 via-blue-100 to-blue-200/60 rounded-2xl shadow-md p-4 md:p-6 transition-all duration-500 hover:shadow-xl motion-safe:animate-fadeIn">
              <h3 className="section-title text-2xl font-semibold leading-snug mb-3 text-blue-900 drop-shadow">{text.section || 'Scripture Text'}</h3>
              <p className="body-text text-md sm:text-base leading-relaxed mb-4 font-normal text-gray-900">{text.content}</p>
            </section>
          ))}

          {page.sections.map((section: any, idx: number) => (
            <section
              key={section.id || idx}
              className="space-y-4 bg-linear-to-r from-cyan-50 via-blue-100 to-blue-200/60 rounded-2xl shadow-md p-4 md:p-6 transition-all duration-500 hover:shadow-xl motion-safe:animate-fadeIn"
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