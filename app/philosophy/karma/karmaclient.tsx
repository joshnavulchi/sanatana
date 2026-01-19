"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@/app/context/locale-context';
import { loadLocale } from 'lib/i18n';
import { useT } from '../../hooks/useT';
import { parseSections, parseMaybeObject } from 'lib/parseContent';

import styles from './page.module.scss';

export default function KrishnaExplainsFiveKarmasClient() {
  const { locale } = useLocale();
  const t = useT();
  const [karma, setKarma] = useState({ title: '', story: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadLocale(locale).catch(() => { });
      } catch (e) { }

      if (!mounted) return;
      const title = String(t('karma_philosophy.title') || '');
      const story = String(t('karma_philosophy.story') || '');
      setKarma({ title, story });
    })();
    return () => { mounted = false; };
  }, [locale]);

  return (
    <PageLayout
      metaKey="karma_philosophy"
      title={karma.title}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Karma' }]}
      className={`layout-sm`}
    >
      {/* Render script paragraphs (para1, para2, ...) then conversation (alternating chat bubbles). */}
      {(() => {
        const script = parseMaybeObject(t('karma_philosophy.script')) || {};

        // collect paraN in order
        const paraKeys = Object.keys(script || {}).filter(k => /^para\d+$/.test(k));
        paraKeys.sort((a, b) => {
          const na = Number(a.replace(/[^0-9]/g, '')) || 0;
          const nb = Number(b.replace(/[^0-9]/g, '')) || 0;
          return na - nb;
        });
        const paras = paraKeys.map(k => script[k]);

        const convo = script && Array.isArray(script.conversation)
          ? script.conversation
          : parseSections(script?.conversation || '');

        // if we have paras or conversation, render them
        if ((Array.isArray(paras) && paras.length) || (Array.isArray(convo) && convo.length)) {
          return (
            <div className="">
              {paras.length > 0 && (
                <div className="">
                  {paras.map((p: any, i: number) => (
                    <p key={`para-${i}`} className="">{p}</p>
                  ))}
                </div>
              )}

              {Array.isArray(convo) && convo.length > 0 && (
                <div className="">
                  {convo.map((item: any, idx: number) => {
                    const isEven = idx % 2 === 0; // even -> left, odd -> right
                    const containerClass = `flex ${isEven ? `${styles.leftalign} justify-start` : `${styles.rightalign} justify-end`}`;
                    const bubbleClass = `${isEven ? 'text-left' : 'text-right'}`;
                    return (
                      <div key={idx} className={containerClass}>
                        <div className={bubbleClass}>
                          {item.speaker ? <div className={`${styles.icon} shadow-sm`}><span>{item.speaker}</span></div> : null}
                          {item.message ? <p className={`${styles.message} shadow-xl`}>{item.message}</p> : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        return <p>{karma.story}</p>;
      })()}
    </PageLayout>
  );
}
// Content of AboutClient.tsx can be added here, depending on the actual code. This is just a placeholder.