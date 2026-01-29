"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@/app/context/locale-context';
import { loadLocale, getLocaleObject } from 'lib/i18n';
import { useT } from '../../hooks/useT';
import { parseSections, parseMaybeObject } from 'lib/parseContent';

import styles from './page.module.scss';

// Helper components declared at module scope to avoid creating components during render
const Paragraphs = ({ lines }: { lines?: any[] }) => {
  if (!Array.isArray(lines) || !lines.length) return null;
  return (
    <div>
      {lines.map((line: any, idx: number) => (
        <p key={idx}>{line}</p>
      ))}
    </div>
  );
};

const Conversation = ({ convo }: { convo?: any[] }) => {
  if (!Array.isArray(convo) || !convo.length) return null;
  return (
    <div>
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
  );
};

export default function KrishnaExplainsFiveKarmasClient() {
  const { locale, isLoading } = useLocale();
  const t = useT();
  
  // Initialize with current data to prevent empty renders on refresh
  const getInitialKarma = () => {
    try {
      const localeObj = getLocaleObject(locale) as any;
      if (!localeObj || Object.keys(localeObj).length === 0) {
        return { title: '', story: [] as string[] };
      }
      const title = String(localeObj?.karma_philosophy?.title || '');
      const rawStory = localeObj?.karma_philosophy?.story;
      const story = Array.isArray(rawStory)
        ? (rawStory as string[])
        : (rawStory ? String(rawStory).split(/\r?\n/).filter(Boolean) : []);
      return { title, story };
    } catch (e) {
      return { title: '', story: [] as string[] };
    }
  };
  
  const [karma, setKarma] = useState(getInitialKarma);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadLocale(locale).catch(() => { });
      } catch (e) { }

      if (!mounted) return;
      const title = String(t('philosophy_karma.title') || '');
      const rawStory = t('philosophy_karma.story');
      const story = Array.isArray(rawStory)
        ? (rawStory as string[])
        : (rawStory ? String(rawStory).split(/\r?\n/).filter(Boolean) : []);
      setKarma({ title, story });
    })();
    return () => { mounted = false; };
  }, [locale]);

  // small helpers intentionally declared at module scope above

  // Compute render-time title/story from translations first, falling back to state
  const renderTitle = String(t('philosophy_karma.title') || karma.title || '');
  const rawStoryFromT = t('philosophy_karma.story');
  const renderStory = Array.isArray(rawStoryFromT)
    ? (rawStoryFromT as string[])
    : rawStoryFromT
    ? String(rawStoryFromT).split(/\r?\n/).filter(Boolean)
    : (Array.isArray(karma.story) ? karma.story : (karma.story ? [String(karma.story)] : []));

  return (
    <PageLayout
      metaKey="karma_philosophy"
      title={renderTitle}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Karma' }]}
      className={`layout-sm`}
    >
      {/* Render script paragraphs (para1, para2, ...) then conversation (alternating chat bubbles). */}
      {(() => {
        const script = parseMaybeObject(t('philosophy_karma.script')) || {};
        // If `story` exists from translations or state, render it first.
        if (renderStory && renderStory.length > 0) {
          return <Paragraphs lines={renderStory} />;
        }

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
            <div>
              {paras.length > 0 && <Paragraphs lines={paras} />}
              <Conversation convo={convo} />
            </div>
          );
        }

        return null;
      })()}
    </PageLayout>
  );
}
// Content of AboutClient.tsx can be added here, depending on the actual code. This is just a placeholder.