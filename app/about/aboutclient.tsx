"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@/app/components/common/PageLayout';
import { useLocale } from '../context/locale-context';
import { loadLocale } from 'lib/i18n';
import useLocaleSection from '../hooks/useLocaleSection';
import { parseSections, parseMaybeObject } from 'lib/parseContent';
import Loader from '@/app/components/loader/loader';
import TextToSpeech from '@/app/components/text-to-speech/TextToSpeech';

export default function AboutClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('about');

  // Initialize with empty state to avoid hydration mismatch
  // useLocaleSection will populate the data properly
  const [about, setAbout] = useState({ title: '', intro: '', sections: [] as any[], disclaimer: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadLocale(locale).catch(() => { });
      } catch (e) { }

      if (!mounted) return;
      const title = String(ns?.title || '');
      const intro = String(ns?.intro || '');
      const sectionsRaw = parseMaybeObject(ns ? ns.sections : '');
      const sections = parseSections(sectionsRaw);
      const disclaimer = String(ns?.disclaimer || '');
      setAbout({ title, intro, sections, disclaimer });
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  // Show loading state if locale is still loading and we have no content
  if (isLoading && !about.title) {
    return (
      <PageLayout
        metaKey="about"
        title=""
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'About' }]}
        className={`layout-sm`}
      >
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="about"
      title={about.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'About' }]}
      className={`layout-sm`}
    >
      {/* Text-to-Speech Player */}
      <TextToSpeech sectionId="about-content" className="floating" />
      <div id="about-content">
        <p>{about.intro}</p>
        {about.sections.map((section: any, index: number) => {
          const level = Math.min(index + 2, 6);
          const Tag = `h${level}` as unknown as React.ElementType;
          return (
            <div key={section.id || index}>
              <Tag className="h4">{section.title}</Tag>
              {section?.text && <p>{section.text}</p>}
              <ul className="list-disk">
                {section?.bullets && section?.bullets.map((text: string, idx: number) => (
                  <li key={idx}>{text}</li>
                ))}
              </ul>
            </div>
          );
        })}
        {about.disclaimer && <p><strong>Disclaimer : </strong>{about.disclaimer}</p>}
      </div>
    </PageLayout>
  );
}
// Content of AboutClient.tsx can be added here, depending on the actual code. This is just a placeholder.