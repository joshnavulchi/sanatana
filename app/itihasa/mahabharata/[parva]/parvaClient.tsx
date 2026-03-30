"use client";

import { useParams } from 'next/navigation';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import Link from 'next/link';
import PageLayout from '@components/common/PageLayout';

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split('\n\n').map((p, i) => (
        <p key={i} className="mb-4 last:mb-0 text-base leading-relaxed bg-linear-to-r from-indigo-50/80 to-blue-100/60 rounded-xl px-3 py-2 shadow-sm hover:shadow-lg transition-all duration-500">
          {p}
        </p>
      ))}
    </>
  );
}

export default function ParvaClient() {
  const params = useParams();
  const parva = typeof params?.parva === 'string' ? params.parva : '';
  // "adi-parva" → folder "adi"; "bhishma-parva" → "bhishma"; etc.
  const folder = parva.replace(/-parva$/, '');
  const { isLoading } = useLocale();
  const ns = useLocaleSection(`itihasa/mahabharata/${folder}/index`);
  // Load mahabharata structure to get chapter list
  const structure = useLocaleSection('itihasa/mahabharata/index');

  const title = typeof ns?.title === 'string' ? ns.title : folder || 'Parva';
  const description = typeof ns?.description === 'string' ? ns.description : '';
  const introduction = typeof ns?.introduction === 'string' ? ns.introduction : '';
  const scriptureText = typeof ns?.scripture_text === 'string' ? ns.scripture_text : '';
  const philosophical = typeof ns?.philosophical_explanation === 'string' ? ns.philosophical_explanation : '';
  const verse = ns?.verse as Record<string, string> | undefined;

  // Find matching parva in structure to get chapter list
  const parvas = Array.isArray((structure as Record<string, unknown>)?.parvas)
    ? ((structure as Record<string, unknown>).parvas as Record<string, unknown>[])
    : [];
  const parvaEntry = parvas.find((p) => p.slug === parva);
  const chapters = Array.isArray(parvaEntry?.chapters)
    ? (parvaEntry.chapters as Array<{ chapter: number; path: string; title: string }>)
    : [];

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Itihasa', href: '/itihasa' },
    { label: 'Mahabharata', href: '/itihasa/mahabharata' },
    { label: title },
  ];

  if (isLoading && !ns?.title) {
    return (
      <PageLayout metaKey={`itihasa/mahabharata/${folder}/index`} title="" breadcrumbs={breadcrumbs} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey={`itihasa/mahabharata/${folder}/index`} title={title} breadcrumbs={breadcrumbs} className="layout-md">
      {description && (
        <div className="relative px-4 md:px-6 py-8 md:py-12 rounded-2xl border-blue-200/30 bg-linear-to-br from-blue-50 via-indigo-100 to-blue-100 overflow-hidden mb-8 shadow-lg animate-fadeIn">
          <p className="text-base body-text text-blue-900 drop-shadow">{description}</p>
        </div>
      )}

      {verse && (verse.sanskrit || verse.transliteration) && (
        <div className="relative px-4 md:px-6 py-6 bg-linear-to-br from-indigo-50 via-blue-50 to-blue-100 rounded-2xl border border-blue-300/40 mb-8 shadow-md animate-fadeIn">
          <h3 className="section-title mb-3 text-blue-800">Featured Verse</h3>
          {verse.sanskrit && <p className="font-serif text-lg text-blue-900 mb-2 leading-relaxed">{verse.sanskrit}</p>}
          {verse.transliteration && <p className="italic text-blue-700 text-sm mb-2">{verse.transliteration}</p>}
          {verse.translation && <p className="text-blue-800 text-sm leading-relaxed">{verse.translation}</p>}
        </div>
      )}

      {introduction && (
        <div className="relative px-4 md:px-6 py-8 md:py-10 rounded-2xl border-blue-200/30 bg-linear-to-br from-indigo-100 via-blue-50 to-blue-100 overflow-hidden mb-8 shadow-xl animate-fadeIn">
          <h3 className="section-title mb-4 text-blue-800">Introduction</h3>
          <div className="body-text md:text-base leading-relaxed"><Paragraphs text={introduction} /></div>
        </div>
      )}

      {scriptureText && (
        <div className="relative px-4 md:px-6 py-6 bg-linear-to-br from-blue-50 via-indigo-50 to-indigo-100 rounded-2xl border-blue-200/30 overflow-hidden mb-8 shadow-md animate-fadeIn">
          <h3 className="section-title mb-3 text-blue-800">Scripture Text</h3>
          <div className="body-text"><Paragraphs text={scriptureText} /></div>
        </div>
      )}

      {philosophical && (
        <div className="mt-8 relative overflow-hidden rounded-3xl border-blue-200/30 p-6 md:p-8 bg-linear-to-br from-blue-50 via-indigo-100 to-blue-200 shadow-xl mb-8 animate-fadeIn">
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-200/60 to-indigo-100/0 animate-pulse" />
          <h3 className="section-title mb-4 text-blue-900">Philosophical Explanation</h3>
          <div className="body-text md:text-base leading-relaxed"><Paragraphs text={philosophical} /></div>
        </div>
      )}

      {chapters.length > 0 && (
        <div className="mt-8">
          <h3 className="section-title mb-6 text-blue-900">Chapters ({chapters.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {chapters.map((c) => (
              <Link key={c.chapter} href={`/itihasa/mahabharata/${parva}/chapter-${c.chapter}`} className="group block">
                <div className="relative overflow-hidden rounded-xl border border-blue-200/50 bg-linear-to-r from-blue-100/80 to-indigo-50/60 p-3 shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:bg-blue-100/90 text-center">
                  <span className="text-sm font-semibold text-blue-800 group-hover:text-blue-700">Chapter {c.chapter}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  );
}