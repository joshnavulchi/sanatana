"use client";
import { useEffect, useState } from 'react';
import { useLocale } from '@/app/context/locale-context';
import useLocaleSection from '@/app/hooks/useLocaleSection';
import Link from 'next/link';
import PageLayout from '@/app/components/common/PageLayout';

export default function BhagavathgitaChapterClientPage({ params }: { params: any }) {
    const chapterState = useMemo(() => {
      if (!ns || !params?.chapter) {
        return {
          chapter: null,
          currentIdx: -1,
          prevChapter: null,
          nextChapter: null,
        };
      }
      let num = params.chapter;
      if (typeof num === 'string') {
        try {
          const parsed = JSON.parse(num);
          if (parsed && (parsed.chapter || parsed.chapter === 0)) {
            num = parsed.chapter;
          } else {
            num = num;
          }
        } catch {
          num = parseInt(num, 10);
        }
      }
      if (!Number.isFinite(num) || num < 1 || num > 18) {
        return {
          chapter: null,
          currentIdx: -1,
          prevChapter: null,
          nextChapter: null,
        };
      }
      let chapters = [];
      if (Array.isArray(ns.chapters)) {
        chapters = ns.chapters;
      } else if (ns.scriptures_bhagavathgita && Array.isArray(ns.scriptures_bhagavathgita.chapters)) {
        chapters = ns.scriptures_bhagavathgita.chapters;
      }
      let ch = null;
      if (Array.isArray(chapters)) {
        ch = chapters.find((c: any, i: number) => {
          let cnum = c.chapter ?? c.chapter_number ?? (i + 1);
          if (typeof cnum === 'string') cnum = parseInt(cnum, 10);
          return Number(cnum) === Number(num);
        }) || null;
      }
      let idx = -1;
      let prev = null;
      let next = null;
      if (ch && chapters.length > 0) {
        idx = chapters.findIndex((c: any, i: number) => {
          let cnum = c.chapter ?? c.chapter_number ?? (i + 1);
          if (typeof cnum === 'string') cnum = parseInt(cnum, 10);
          let chnum = ch.chapter;
          if (typeof chnum === 'string') chnum = parseInt(chnum, 10);
          return Number(cnum) === Number(chnum);
        });
        prev = idx > 0 ? chapters[idx - 1] : null;
        next = idx >= 0 && idx < chapters.length - 1 ? chapters[idx + 1] : null;
      }
      return {
        chapter: ch || null,
        currentIdx: idx,
        prevChapter: prev,
        nextChapter: next,
      };
    }, [ns, params]);
  const { locale } = useLocale();
  const ns = useLocaleSection('scriptures_bhagavathgita');
    if (Array.isArray(ns.chapters)) {
      chapters = ns.chapters;
    } else if (ns.scriptures_bhagavathgita && Array.isArray(ns.scriptures_bhagavathgita.chapters)) {
      chapters = ns.scriptures_bhagavathgita.chapters;
    }
    return (
      <PageLayout
        metaKey="scriptures_bhagavathgita"
        title={ns.title || 'Bhagavad Gita'}
        breadcrumbs={[ 
          { labelKey: 'Home', href: '/' },
          { label: ns.title || 'Bhagavad Gita', href: '/scriptures/bhagavathgita' },
          { label: 'Chapter', href: '#' }
        ]}
        className="layout-md"
      >
        <div className="max-w-2xl mx-auto p-8 text-center text-gray-500">Chapter not found or loading...</div>
        <details className="bg-orange-50 border border-orange-200 rounded p-4 mt-6 text-left text-xs text-gray-700">
          <summary className="font-bold text-orange-700 cursor-pointer">Debug Info</summary>
          <div><b>params:</b> <pre>{JSON.stringify(params, null, 2)}</pre></div>
          <div><b>ns.title:</b> {String(ns.title || '')}</div>
          <div><b>ns.chapters:</b> <pre>{JSON.stringify(ns.chapters ? ns.chapters.slice(0,2) : null, null, 2)}{ns.chapters && ns.chapters.length > 2 ? '\n... (' + ns.chapters.length + ' total)' : ''}</pre></div>
          <div><b>ns.scriptures_bhagavathgita.chapters:</b> <pre>{JSON.stringify(ns.scriptures_bhagavathgita && ns.scriptures_bhagavathgita.chapters ? ns.scriptures_bhagavathgita.chapters.slice(0,2) : null, null, 2)}{ns.scriptures_bhagavathgita && ns.scriptures_bhagavathgita.chapters && ns.scriptures_bhagavathgita.chapters.length > 2 ? '\n... (' + ns.scriptures_bhagavathgita.chapters.length + ' total)' : ''}</pre></div>
        </details>
      </PageLayout>
    );
  }

  const bookTitle = ns.title || 'Bhagavad Gita';
  const chapter = chapterState.chapter;
  const currentIdx = chapterState.currentIdx;
  const prevChapter = chapterState.prevChapter;
  const nextChapter = chapterState.nextChapter;
  const chapterTitleText = chapter?.title || chapter?.name || (chapter ? `Chapter ${chapter.chapter}` : '');
  const excerpt = chapter?.summary || '';

  return (
    <PageLayout
      metaKey="scriptures_bhagavathgita"
      title={bookTitle}
      breadcrumbs={[
        { labelKey: 'Home', href: '/' },
        { label: bookTitle, href: '/scriptures/bhagavathgita' },
        { label: chapterTitleText, href: '#' }
      ]}
      className="layout-md"
    >
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-xl md:text-2xl font-bold text-center text-orange-700 mb-4">{chapterTitleText}</h3>
        {excerpt && <p className="text-center text-gray-700 mb-2 italic">{excerpt}</p>}
      </div>
      {chapter.verses && chapter.verses.length > 0 ? (
        <section className="space-y-8">
          {chapter.verses.map((v: any, idx: number) => {
            const verseNum = v.text_number || v.verse || v.number || (typeof v.id === 'number' ? v.id : null) || (typeof v.id === 'string' && /^\d+$/.test(v.id) ? Number(v.id) : null) || idx + 1;
            const pickString = (val: any) => {
              if (!val && val !== 0) return null;
              if (typeof val === 'string') return val;
              if (Array.isArray(val)) return val.join('\n\n');
              return String(val);
            };
            const translation = pickString(v.translation || v.translation_text || v.translation_lines || v.text || v.meaning || v.lines || null);
            const original = pickString(v.original || v.original_lines || v.sanskrit || null);
            const transliteration = pickString(v.transliteration_lines || v.transliteration || v.transliterationLines || null);
            const speakerHeader = pickString(v.speaker_header || v.speaker || v.speakerHeader || null);
            const heading = pickString(v.heading || v.header || v.title || null);
            const purport = pickString(v.purport || v.purport_paragraphs || v.purports || null);
            const wordMeaning = pickString(v.word_meaning_lines || v.word_meanings || null);
            return (
              <div key={idx} className="bg-white rounded-xl shadow p-6 border border-amber-100">
                {heading && <h3 className="text-lg font-semibold text-orange-800 mb-2">{heading}</h3>}
                {speakerHeader && <div className="text-sm text-amber-700 mb-1">{speakerHeader}</div>}
                <div className="flex items-start gap-3 mb-2">
                  <span className="font-bold text-amber-600 text-lg min-w-[2.5rem]">{verseNum}.</span>
                  <span className="text-gray-900 text-base">{translation || <em>Verse not available</em>}</span>
                </div>
                {original && (
                  <pre className="bg-amber-50 text-amber-900 rounded p-3 text-base font-serif whitespace-pre-wrap mb-2">{original}</pre>
                )}
                {transliteration && (
                  <pre className="bg-orange-50 text-orange-900 rounded p-3 text-base font-mono whitespace-pre-wrap mb-2">{transliteration}</pre>
                )}
                {wordMeaning && (
                  <div className="text-sm text-gray-700 mb-2"><span className="font-semibold">Word Meaning:</span> {wordMeaning}</div>
                )}
                {purport && (
                  <div className="mt-2 p-4 bg-orange-50 border-l-4 border-orange-300 rounded text-gray-800"><span className="font-semibold">Purport:</span> {purport}</div>
                )}
              </div>
            );
          })}
        </section>
      ) : (
        <p className="text-center text-gray-500">Verse content not available for this chapter.</p>
      )}
      <div className="flex flex-wrap gap-4 justify-between mt-10">
        <Link href="/scriptures/bhagavathgita" className="px-4 py-2 rounded bg-amber-50 text-amber-800 font-semibold shadow hover:bg-amber-100 transition">&larr; All Chapters</Link>
        <div className="flex gap-4">
          {prevChapter ? (
            <Link href={`/scriptures/bhagavathgita/chapter/${prevChapter.chapter || (currentIdx)}`} className="px-4 py-2 rounded bg-amber-100 text-amber-800 font-semibold shadow hover:bg-amber-200 transition">&larr; Previous</Link>
          ) : <span className="px-4 py-2 rounded bg-gray-100 text-gray-400 font-semibold shadow">&larr; Previous</span>}
          {nextChapter ? (
            <Link href={`/scriptures/bhagavathgita/chapter/${nextChapter.chapter || (currentIdx + 2)}`} className="px-4 py-2 rounded bg-orange-100 text-orange-800 font-semibold shadow hover:bg-orange-200 transition">Next &rarr;</Link>
          ) : <span className="px-4 py-2 rounded bg-gray-100 text-gray-400 font-semibold shadow">Next &rarr;</span>}
        </div>
      </div>
    </PageLayout>
  );

