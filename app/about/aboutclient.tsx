"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '../context/locale-context';
import { loadLocale } from 'lib/i18n';
import { useT } from '../hooks/useT';
import { parseSections, parseMaybeObject } from 'lib/parseContent';

export default function AboutClient() {
  const { locale } = useLocale();
  const t = useT();
  const [about, setAbout] = useState({ title: '', intro: '', sections: [] as any[], disclaimer: '' });

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

  return (
    <PageLayout
      metaKey="about"
      title={about.title}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'About' }]}
      className={`layout-sm`}
    >
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
    </PageLayout>
  );
}
// Content of AboutClient.tsx can be added here, depending on the actual code. This is just a placeholder.