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
        <p key={i} className="mb-4 last:mb-0 text-base leading-relaxed bg-linear-to-r from-amber-50/80 to-amber-100/60 rounded-xl px-3 py-2 shadow-sm hover:shadow-lg transition-all duration-500">
          {p}
        </p>
      ))}
    </>
  );
}

export default function KandaClient() {
  const params = useParams();
  const kanda = typeof params?.kanda === 'string' ? params.kanda : '';
  // "bala-kanda" → folder "bala"; "aranya-kanda" → "aranya"; etc.
  const folder = kanda.replace(/-kanda$/, '');
  const { isLoading } = useLocale();
  const ns = useLocaleSection(`itihasa/ramayana/${folder}/index`);
  // Load ramayana structure to get sarga list
  const structure = useLocaleSection('itihasa/ramayana/index');

  const title = typeof ns?.title === 'string' ? ns.title : folder || 'Kanda';
  const description = typeof ns?.description === 'string' ? ns.description : '';
  const introduction = typeof ns?.introduction === 'string' ? ns.introduction : '';
  const scriptureText = typeof ns?.scripture_text === 'string' ? ns.scripture_text : '';
  const philosophical = typeof ns?.philosophical_explanation === 'string' ? ns.philosophical_explanation : '';
  const verse = ns?.verse as Record<string, string> | undefined;

  // Find matching kanda in structure to get sarga list
  const kandas = Array.isArray((structure as Record<string, unknown>)?.kandas)
    ? ((structure as Record<string, unknown>).kandas as Record<string, unknown>[])
    : [];
  const kandaEntry = kandas.find((k) => k.slug === kanda);
  const sargas = Array.isArray(kandaEntry?.sargas)
    ? (kandaEntry.sargas as Array<{ sarga: number; path: string; title: string }>)
    : [];

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Itihasa', href: '/itihasa' },
    { label: 'Ramayana', href: '/itihasa/ramayana' },
    { label: title },
  ];

  if (isLoading && !ns?.title) {
    return (
      <PageLayout metaKey={`itihasa/ramayana/${folder}/index`} title="" breadcrumbs={breadcrumbs} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey={`itihasa/ramayana/${folder}/index`} title={title} breadcrumbs={breadcrumbs} className="layout-md">
      {description && (
        <div className="relative px-4 md:px-6 py-8 md:py-12 bg-linear-to-br from-amber-50 via-amber-100 to-yellow-50 rounded-2xl border-amber-200/30 overflow-hidden mb-8 shadow-lg animate-fadeIn">
          <p className="text-base body-text text-amber-900 drop-shadow">{description}</p>
        </div>
      )}

      {verse && (verse.sanskrit || verse.transliteration) && (
        <div className="relative px-4 md:px-6 py-6 bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl border border-amber-300/40 mb-8 shadow-md animate-fadeIn">
          <h3 className="section-title mb-3 text-amber-800">Featured Verse</h3>
          {verse.sanskrit && <p className="font-serif text-lg text-amber-900 mb-2 leading-relaxed">{verse.sanskrit}</p>}
          {verse.transliteration && <p className="italic text-amber-700 text-sm mb-2">{verse.transliteration}</p>}
          {verse.translation && <p className="text-amber-800 text-sm leading-relaxed">{verse.translation}</p>}
        </div>
      )}

      {introduction && (
        <div className="relative px-4 md:px-6 py-8 md:py-10 bg-linear-to-br from-amber-100 via-amber-50 to-yellow-100 rounded-2xl border-amber-200/30 overflow-hidden mb-8 shadow-xl animate-fadeIn">
          <h3 className="section-title mb-4 text-amber-800">Introduction</h3>
          <div className="body-text"><Paragraphs text={introduction} /></div>
        </div>
      )}

      {scriptureText && (
        <div className="relative px-4 md:px-6 py-6 bg-linear-to-br from-yellow-50 via-amber-50 to-amber-100 rounded-2xl border-amber-200/30 overflow-hidden mb-8 shadow-md animate-fadeIn">
          <h3 className="section-title mb-3 text-amber-800">Scripture Text</h3>
          <div className="body-text"><Paragraphs text={scriptureText} /></div>
        </div>
      )}

      {philosophical && (
        <div className="relative overflow-hidden rounded-3xl border-amber-200/30 p-6 md:p-8 bg-linear-to-br from-yellow-50 via-amber-100 to-amber-200 shadow-xl mb-8 animate-fadeIn">
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-200/60 to-amber-100/0 animate-pulse" />
          <h3 className="section-title mb-4 text-amber-900">Philosophical Explanation</h3>
          <div className="body-text"><Paragraphs text={philosophical} /></div>
        </div>
      )}

      {sargas.length > 0 && (
        <div className="mt-8">
          <h3 className="section-title mb-6 text-amber-900">Sargas ({sargas.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {sargas.map((s) => (
              <Link key={s.sarga} href={`/itihasa/ramayana/${kanda}/sarga-${s.sarga}`} className="group block">
                <div className="relative overflow-hidden rounded-xl border border-amber-200/50 bg-linear-to-r from-amber-100/80 to-yellow-50/60 p-3 shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:bg-amber-100/90 text-center">
                  <span className="text-sm font-semibold text-amber-800 group-hover:text-amber-700">Sarga {s.sarga}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  );
}