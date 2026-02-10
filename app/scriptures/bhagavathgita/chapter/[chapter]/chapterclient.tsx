"use client";
import { useEffect, useState } from 'react';
import { useLocale } from '@/app/context/locale-context';
import useLocaleSection from '@/app/hooks/useLocaleSection';
import Link from 'next/link';
import PageLayout from '@/app/components/common/PageLayout';

export default function BhagavathgitaChapterClientPage({ params }: { params: any }) {
  const { locale } = useLocale();
  const ns = useLocaleSection('scriptures_bhagavathgita');
  const [chapter, setChapter] = useState<any>(null);

  useEffect(() => {
    // DEBUG: Log params and ns.chapters for troubleshooting
    // Remove this after debugging
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log('params:', params, 'ns.chapters:', ns.chapters);
    }
    if (!ns || !params?.chapter) return;
    const num = Number(params.chapter);
    if (!Number.isFinite(num) || num < 1 || num > 18) {
      setChapter(null);
      return;
    }
    const chapters = Array.isArray(ns.chapters) ? ns.chapters : [];
    const ch = chapters.find((c: any, i: number) => Number(c.chapter || c.chapter_number || (i + 1)) === num);
    setChapter(ch || null);
  }, [ns, params]);

  if (!chapter) {
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
      </PageLayout>
    );
  }

  const bookTitle = ns.title || 'Bhagavad Gita';
  const chapterTitleText = chapter.title || chapter.name || `Chapter ${chapter.chapter}`;
  const excerpt = chapter.summary || '';

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
        <h2 className="text-xl md:text-2xl font-bold text-center text-orange-700 mb-4">{chapterTitleText}</h2>
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
      <div className="flex justify-between mt-10">
        {chapter.chapter > 1 ? (
          <Link href={`/scriptures/bhagavathgita/chapter/${chapter.chapter - 1}`} className="px-4 py-2 rounded bg-amber-100 text-amber-800 font-semibold shadow hover:bg-amber-200 transition">&larr; Previous</Link>
        ) : <span className="px-4 py-2 rounded bg-gray-100 text-gray-400 font-semibold shadow">&larr; Previous</span>}
        {chapter.chapter < 18 ? (
          <Link href={`/scriptures/bhagavathgita/chapter/${chapter.chapter + 1}`} className="px-4 py-2 rounded bg-orange-100 text-orange-800 font-semibold shadow hover:bg-orange-200 transition">Next &rarr;</Link>
        ) : <span className="px-4 py-2 rounded bg-gray-100 text-gray-400 font-semibold shadow">Next &rarr;</span>}
      </div>
    </PageLayout>
  );
}
