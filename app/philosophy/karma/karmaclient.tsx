"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { parseSections, parseMaybeObject } from '@lib/parseContent';
import Loader from '@components/loader';
import SimilarCategories from '@components/similar-categories/SimilarCategories';

import LazyImage from '@components/lazyimage';
import TextToSpeech from '@components/text-to-speech/TextToSpeech';

// Helper components declared at module scope to avoid creating components during render
const Paragraphs = ({ lines }: { lines?: any[] }) => {
  if (!Array.isArray(lines) || !lines.length) return null;
  return (
    <div className="space-y-8">
      {/* Large intro header */}
      <div className="rounded-xl p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100">
        <h2 className="text-2xl md:text-3xl font-extrabold text-amber-800">Essence & Insights</h2>
        <p className="mt-2 text-md text-amber-700">A concise retelling and practical reflections on karma.</p>
      </div>

      <div className="grid gap-6">
        {lines.map((line: any, idx: number) => (
          <article
            key={idx}
            className="relative bg-white rounded-lg border border-gray-100 shadow-sm px-3 py-6 hover:shadow-md transition-shadow duration-200"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <div className="absolute left-0 top-4 h-12 w-1 bg-amber-300 rounded-r-md" />
            <div>
              <p className="text-md text-gray-800 leading-relaxed ">{line}</p>
            </div>
            <div className="mt-4 flex items-center justify-between text-md text-gray-500">
              <span>Reflection</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded">Karma</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

const Conversation = ({ convo }: { convo?: any[] }) => {
  if (!Array.isArray(convo) || !convo.length) return null;
  return (
    <section className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-md text-amber-700 font-semibold">💬 Dialogue</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      <div className="space-y-4">
        {convo.map((item: any, idx: number) => {
          const isLeft = idx % 2 === 0;
          return (
            <div key={idx} className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[86%] md:max-w-[70%]`}>
                <div className={`flex items-center gap-3 ${isLeft ? '' : 'flex-row-reverse'}`}>
                  <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-medium">{isLeft ? '🧘' : '🕉️'}</div>
                  <div className="text-md text-gray-600 font-medium">{item.speaker || (isLeft ? 'Seeker' : 'Teacher')}</div>
                </div>
                <div className={`mt-2 p-4 rounded-xl border border-gray-100 bg-white shadow-sm ${isLeft ? '' : 'text-right'}`}>
                  <p className="text-gray-800 leading-relaxed ">{item.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default function KrishnaExplainsFiveKarmasClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('philosophy_karma');
  // Initialize with empty state to avoid hydration mismatch
  const [karma, setKarma] = useState({ title: '', story: [] as string[] });
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Locale loading is now handled by context/useLocaleSection
      } catch (e) { }
      if (!mounted) return;
      const title = String(ns?.title || '');
      const rawStory = ns?.story;
      const story = Array.isArray(rawStory)
        ? (rawStory as string[])
        : (rawStory ? String(rawStory).split(/\r?\n/).filter(Boolean) : []);
      setKarma({ title, story });
    })();
    return () => { mounted = false; };
  }, [locale, ns]);
  // Compute render-time title/story from translations first, falling back to state
  const renderTitle = String(ns?.title || karma.title || '');
  const rawStoryFromT = ns?.story;
  const renderStory = Array.isArray(rawStoryFromT)
    ? (rawStoryFromT as string[])
    : rawStoryFromT
      ? String(rawStoryFromT).split(/\r?\n/).filter(Boolean)
      : (Array.isArray(karma.story) ? karma.story : (karma.story ? [String(karma.story)] : []));

  if (isLoading && !renderTitle) {
    return (
      <PageLayout metaKey="philosophy_karma" title="" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Karma' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="philosophy_karma"
      title={renderTitle}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: renderTitle }]}
      className="layout-md"
    >
      <TextToSpeech sectionId="philosophy-karma-content" className="floating" />
      <div id="philosophy-karma-content" className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-blue-50 via-green-100 to-blue-50  border-l-2 border-blue-200 rounded-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-400/8 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-600" />
            <span className="text-3xl animate-pulse">🧘</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-600" />
          </div>
          {/* Render script paragraphs (para1, para2, ...) then conversation (alternating chat bubbles). */}
          {(() => {
            const script = parseMaybeObject(ns ? ns.script : '') || {};
            if (renderStory && renderStory.length > 0) {
              return <Paragraphs lines={renderStory} />;
            }
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
            if ((Array.isArray(paras) && paras.length) || (Array.isArray(convo) && convo.length)) {
              return (
                <>
                  {paras.length > 0 && <Paragraphs lines={paras} />}
                  <Conversation convo={convo} />
                </>
              );
            }
            return null;
          })()}
        </div>
      </div>
    </PageLayout>
  );
}
// Content of AboutClient.tsx can be added here, depending on the actual code. This is just a placeholder.