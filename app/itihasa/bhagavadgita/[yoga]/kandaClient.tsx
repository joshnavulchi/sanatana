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
        <p key={i} className="mb-4 last:mb-0 text-base leading-relaxed bg-linear-to-r from-emerald-50/80 to-green-100/60 rounded-xl px-3 py-2 shadow-sm hover:shadow-lg transition-all duration-500">
          {p}
        </p>
      ))}
    </>
  );
}

export default function YogaClient() {
  const params = useParams();
  const yoga = typeof params?.yoga === 'string' ? params.yoga : '';
  const { isLoading } = useLocale();
  const ns = useLocaleSection(`itihasa/bhagavadgita/${yoga}/index`);

  const title = typeof ns?.title === 'string' ? ns.title : yoga || 'Chapter';
  const description = typeof ns?.description === 'string' ? ns.description : '';
  const introduction = typeof ns?.introduction === 'string' ? ns.introduction : '';
  const scriptureText = typeof ns?.scripture_text === 'string' ? ns.scripture_text : '';
  const philosophical = typeof ns?.philosophical_explanation === 'string' ? ns.philosophical_explanation : '';
  const verse = ns?.verse as Record<string, string> | undefined;
  const totalVerses = typeof ns?.total_verses === 'number' ? ns.total_verses : 0;

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Itihasa', href: '/itihasa' },
    { label: 'Bhagavad Gita', href: '/itihasa/bhagavadgita' },
    { label: title },
  ];

  if (isLoading && !ns?.title) {
    return (
      <PageLayout metaKey={`itihasa/bhagavadgita/${yoga}/index`} title="" breadcrumbs={breadcrumbs} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey={`itihasa/bhagavadgita/${yoga}/index`} title={title} breadcrumbs={breadcrumbs} className="layout-md">
      {description && (
        <div className="relative px-4 md:px-6 py-8 md:py-12 bg-linear-to-br from-emerald-50 via-green-100 to-emerald-100 rounded-2xl border-emerald-200/30 overflow-hidden mb-8 shadow-lg animate-fadeIn">
          <p className="text-base body-text text-emerald-900 drop-shadow">{description}</p>
        </div>
      )}

      {verse && (verse.sanskrit || verse.transliteration) && (
        <div className="relative px-4 md:px-6 py-6 bg-linear-to-br from-green-50 via-emerald-50 to-emerald-100 rounded-2xl border border-emerald-300/40 mb-8 shadow-md animate-fadeIn">
          <h3 className="section-title mb-3 text-emerald-800">Featured Verse</h3>
          {verse.sanskrit && <p className="font-serif text-lg text-emerald-900 mb-2 leading-relaxed whitespace-pre-line">{verse.sanskrit}</p>}
          {verse.transliteration && <p className="italic text-emerald-700 text-sm mb-2">{verse.transliteration}</p>}
          {verse.translation && <p className="text-emerald-800 text-sm leading-relaxed whitespace-pre-line">{verse.translation}</p>}
        </div>
      )}

      {introduction && (
        <div className="relative px-4 md:px-6 py-8 md:py-10 bg-linear-to-br from-green-100 via-emerald-50 to-emerald-100 rounded-2xl border-emerald-200/30 overflow-hidden mb-8 shadow-xl animate-fadeIn">
          <h3 className="section-title mb-4 text-emerald-800">Introduction</h3>
          <div className="body-text"><Paragraphs text={introduction} /></div>
        </div>
      )}

      {scriptureText && (
        <div className="relative px-4 md:px-6 py-6 bg-linear-to-br from-emerald-50 via-green-50 to-green-100 rounded-2xl border-emerald-200/30 overflow-hidden mb-8 shadow-md animate-fadeIn">
          <h3 className="section-title mb-3 text-emerald-800">Scripture Text</h3>
          <div className="body-text"><Paragraphs text={scriptureText} /></div>
        </div>
      )}

      {philosophical && (
        <div className="relative overflow-hidden rounded-3xl border-emerald-200/30 p-6 md:p-8 bg-linear-to-br from-emerald-50 via-green-100 to-emerald-200 shadow-xl mb-8 animate-fadeIn">
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-200/60 to-green-100/0 animate-pulse" />
          <h3 className="section-title mb-4 text-emerald-900">Philosophical Explanation</h3>
          <div className="body-text"><Paragraphs text={philosophical} /></div>
        </div>
      )}

      {totalVerses > 0 && (
        <div className="mt-8">
          <h3 className="section-title mb-6 text-emerald-900">Verses ({totalVerses})</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {Array.from({ length: totalVerses }, (_, i) => i + 1).map((v) => (
              <Link key={v} href={`/itihasa/bhagavadgita/${yoga}/verse${v}`} className="group block">
                <div className="relative overflow-hidden rounded-xl border border-emerald-200/50 bg-linear-to-r from-emerald-100/80 to-green-50/60 p-3 shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:bg-emerald-100/90 text-center">
                  <span className="text-sm font-semibold text-emerald-800 group-hover:text-emerald-700">{v}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <nav className="mt-6 flex gap-4">
        <Link href="/itihasa/bhagavadgita" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
          ← Back to Bhagavad Gita
        </Link>
      </nav>
    </PageLayout>
  );
}
