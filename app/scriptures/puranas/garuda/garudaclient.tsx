"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@/app/components/common/PageLayout';
import { useLocale } from '@/app/context/locale-context';
import useLocaleSection from '@/app/hooks/useLocaleSection';
import { parseSections, parseMaybeObject } from 'lib/parseContent';
import SimilarCategories from '@/app/components/similar-categories/SimilarCategories';

import LazyImage from '@/app/components/lazy-image/LazyImage';
import TextToSpeech from '@/app/components/text-to-speech/TextToSpeech';

// Helper components declared at module scope to avoid creating components during render
const Paragraphs = ({ lines }: { lines?: any[] }) => {
  if (!Array.isArray(lines) || !lines.length) return null;
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="w-full lg:w-3/4 space-y-6">
        {/* Hero Image with enhanced styling */}
        <div className="relative group overflow-hidden rounded-2xl shadow-2xl border-4 border-amber-300/30 bg-gradient-to-br from-amber-50/40 to-orange-100/20">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
          <LazyImage
            src="/images/puranas-garuda.png"
            alt="puranas garuda"
            width={1000}
            height={100}
            className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
          />
          {/* Decorative border */}
          <div className="absolute inset-0 border-4 border-amber-400/0 group-hover:border-amber-400/30 rounded-2xl transition-all duration-500" />
          {/* Floating accent icon */}
          <div className="absolute top-4 left-4 w-10 h-10 bg-amber-400/80 rounded-full flex items-center justify-center shadow-lg animate-bounce text-white text-2xl z-20">🕉️</div>
        </div>
        {/* Content paragraphs */}
        <div className="space-y-6">
          {lines.map((line: any, idx: number) => (
            <div
              key={idx}
              className="
                relative
                bg-gradient-to-br from-white to-amber-50/30
                dark:from-gray-800 dark:to-amber-950/20
                rounded-lg
                p-6 md:p-8
                transition-all duration-300
                hover:-translate-y-1
                group/para
                animate-fade-in-up
              "
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-400/10 to-transparent rounded-tr-lg rounded-bl-full" />
              {/* Content */}
              <p className="
                text-gray-700 dark:text-gray-300
                text-base md:text-lg
                leading-relaxed
                relative z-10
                font-serif
              ">
                {line}
              </p>
              {/* Hover indicator */}
              <div className="absolute bottom-2 right-2 w-2 h-2 bg-amber-500 rounded-full opacity-0 group-hover/para:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
      {/* Sidebar */}
      <div className="w-full lg:w-1/4">
        <div className="sticky top-24">
          <SimilarCategories
            currentCategory="puranas"
            title="Similar puranas"
            maxItems={3}
            excludeCurrent={false}
          />
        </div>
      </div>
    </div>
  );
};

const Conversation = ({ convo }: { convo?: any[] }) => {
  if (!Array.isArray(convo) || !convo.length) return null;
  return (
    <div className="space-y-6 mt-12">
      {/* Conversation header */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
        <span className="text-xl text-amber-800 dark:text-amber-200 font-semibold tracking-wide animate-fade-in">💬 Conversation</span>
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
      </div>
      {convo.map((item: any, idx: number) => {
        const isEven = idx % 2 === 0;
        return (
          <div
            key={idx}
            className={`
              flex
              ${isEven ? 'justify-start' : 'justify-end'}
              animate-fade-in-up
            `}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className={`
              max-w-[85%] md:max-w-[70%]
              ${isEven ? 'text-left' : 'text-right'}
            `}>
              {/* Speaker Badge */}
              {item.speaker && (
                <div className={`
                  inline-flex items-center gap-2
                  mb-2
                  px-4 py-2
                  ${isEven
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                  }
                  rounded-full
                  shadow-lg
                  font-semibold text-sm
                  ${isEven ? '' : 'ml-auto'}
                  animate-fade-in
                `}>
                  <span className="text-lg">{isEven ? '🧘' : '🕉️'}</span>
                  <span>{item.speaker}</span>
                </div>
              )}
              {/* Message Bubble */}
              {item.message && (
                <div className={`
                  relative
                  p-5 md:p-6
                  rounded-2xl
                  shadow-xl
                  ${isEven
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-2 border-blue-200 dark:border-blue-700 rounded-tl-none'
                    : 'bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-800/30 border-2 border-amber-200 dark:border-amber-700 rounded-tr-none'
                  }
                  backdrop-blur-sm
                  hover:shadow-2xl
                  transition-all duration-300
                  group
                  animate-fade-in-up
                `}
                  style={{ animationDelay: `${idx * 120}ms` }}
                >
                  {/* Message text */}
                  <p className="
                  text-gray-800 dark:text-gray-200
                  text-base md:text-lg
                  leading-relaxed
                  m-0
                  font-serif
                ">
                    {item.message}
                  </p>
                  {/* Decorative quote mark */}
                  <div className={`
                  absolute
                  ${isEven ? '-left-2 top-0' : '-right-2 top-0'}
                  w-8 h-8
                  ${isEven ? 'bg-blue-500' : 'bg-amber-500'}
                  rounded-full
                  flex items-center justify-center
                  text-white text-xs
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-300
                `}>
                    {`"`}
                  </div>
                </div>)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default function PuranasGarudaClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('puranas_garuda');
  // Initialize with empty state to avoid hydration mismatch
  const [garuda, setGaruda] = useState({ title: '', story: [] as string[] });
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
      setGaruda({ title, story });
    })();
    return () => { mounted = false; };
  }, [locale, ns]);
  // Compute render-time title/story from translations first, falling back to state
  const renderTitle = String(ns?.title || garuda.title || '');
  const rawStoryFromT = ns?.story;
  const renderStory = Array.isArray(rawStoryFromT)
    ? (rawStoryFromT as string[])
    : rawStoryFromT
      ? String(rawStoryFromT).split(/\r?\n/).filter(Boolean)
      : (Array.isArray(garuda.story) ? garuda.story : (garuda.story ? [String(garuda.story)] : []));

  return (
    <PageLayout
      metaKey="puranas_garuda"
      title={renderTitle}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'puranas', href: '/scriptures/puranas/garuda' }, { label: 'Garuda' }]}
      className="layout-md bg-gradient-to-br from-yellow-50 via-amber-100 to-orange-50 dark:from-gray-900 dark:via-amber-900 dark:to-orange-900 min-h-screen py-12 px-4 md:px-12 lg:px-24 border-l-8 border-amber-400 shadow-2xl"
    >
      <TextToSpeech sectionId="puranas-garuda-content" className="floating" />
      <div id="puranas-garuda-content" className="rounded-xl shadow-xl border-2 border-amber-200/60 bg-white/80 dark:bg-gray-900/60 p-6 md:p-10 lg:p-14 space-y-8">
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
    </PageLayout>
  );
}
// Content of AboutClient.tsx can be added here, depending on the actual code. This is just a placeholder.