"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@/app/components/common/PageLayout';
import { useLocale } from '../context/locale-context';
import { loadLocale, getLocaleObject } from 'lib/i18n';
import { useT } from '../hooks/useT';
import { parseSections, parseMaybeObject } from 'lib/parseContent';
import Loader from '@/app/components/loader/loader';
import TextToSpeech from '@/app/components/text-to-speech/TextToSpeech';

export default function AboutClient() {
  const { locale, isLoading } = useLocale();
  const t = useT();
  
  // Initialize with current data to prevent empty renders on refresh
  const getInitialAbout = () => {
    try {
      // Use getLocaleObject directly to read from cache synchronously
      const localeObj = getLocaleObject(locale) as any;
      if (!localeObj || Object.keys(localeObj).length === 0) {
        return { title: '', intro: '', sections: [] as any[], disclaimer: '' };
      }
      const title = String(localeObj?.about?.title || '');
      const intro = String(localeObj?.about?.intro || '');
      const sectionsRaw = parseMaybeObject(localeObj?.about?.sections);
      const sections = parseSections(sectionsRaw);
      const disclaimer = String(localeObj?.about?.disclaimer || '');
      return { title, intro, sections, disclaimer };
    } catch (e) {
      return { title: '', intro: '', sections: [] as any[], disclaimer: '' };
    }
  };
  
  const [about, setAbout] = useState(getInitialAbout);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadLocale(locale).catch(() => {});
      } catch (e) {}

      if (!mounted) return;
      const title = String(t('about.title') || '');
      const intro = String(t('about.intro') || '');
      const sectionsRaw = parseMaybeObject(t('about.sections'));
      const sections = parseSections(sectionsRaw);
      const disclaimer = String(t('about.disclaimer') || '');
      setAbout({ title, intro, sections, disclaimer });
    })();
    return () => { mounted = false; };
  }, [locale]);

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