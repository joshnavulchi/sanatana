"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '../context/locale-context';
import { loadLocale } from 'lib/i18n';
import { useT } from '../hooks/useT';
import { parseSections, parseMaybeObject } from 'lib/parseContent';

export default function KrishnaExplainsFiveKarmasClient() {
  const { locale } = useLocale();
  const t = useT();
  const [krishnaexplainsfivekarmas, setKrishnaexplainsfivekarmas] = useState({ title: '', storypoints: [] as any[] });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadLocale(locale).catch(() => {});
      } catch (e) {}

      if (!mounted) return;
      const title = String(t('krishnaexplainsfivekarmas.title') || '');
      const storypointsRaw = parseMaybeObject(t('krishnaexplainsfivekarmas.story_points'));
      const storypoints = parseSections(storypointsRaw);
      setKrishnaexplainsfivekarmas({ title, storypoints });
    })();
    return () => { mounted = false; };
  }, [locale]);

  return (
    <PageLayout
      metaKey="krishnaexplainsfivekarmas"
      title={krishnaexplainsfivekarmas.title}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'About' }]}
      className={`layout-sm`}
    >
      {krishnaexplainsfivekarmas.storypoints.map((point: any, index: number) => {
        const level = Math.min(index + 2, 6);
        const Tag = `h${level}` as unknown as React.ElementType;
        return (
          <div key={index}>
            <Tag className="h6">Story teller point {point.point}</Tag>
            {point?.text && <p>{point.text}</p>}
            <ul className="list-disk">
              {point?.bullets && point?.bullets.map((text: string, idx: number) => (
                <li key={idx}>{text}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </PageLayout>
  );
}
// Content of AboutClient.tsx can be added here, depending on the actual code. This is just a placeholder.