"use client";
import { useState } from 'react';
import { useLocale } from '../context/locale-context';
import useLocaleSection from '../hooks/useLocaleSection';
import Loader from '@components/loader';
import PageLayout from '@components/common/PageLayout';

export default function SlokasClient() {
  const isVisible = true;
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('sanksheparamayana');

  const page: any = (() => {
    const ram = ns || {};
    return {
      title: ram.title || '',
      author: ram.author || '',
      source: ram.source || '',
      description: ram.description || '',
      main_characters: Array.isArray(ram.main_characters) ? ram.main_characters : [],
      important_places: Array.isArray(ram.important_places) ? ram.important_places : [],
      timeline: ram.timeline || [],
      core_themes: ram.core_themes || [],
      slokas: ram.slokas || []
    };
  })();

  const CHUNK = 10;
  const total = Array.isArray(page.slokas) ? page.slokas.length : 0;
  const maxVisible = Math.min(100, total);
  const [visible, setVisible] = useState(CHUNK);

  const loadMore = () => setVisible((v) => Math.min(v + CHUNK, maxVisible));

  // Show loading state if locale is still loading and we have no content
  if (isLoading && !page.title) {
    return (
      <PageLayout
        metaKey="about"
        title={page?.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Sanksheparamayana' }]}
        className="layout-md"
      >
        <div className="flex items-center justify-center py-4 text-lg sm:text-base leading-relaxed font-normal">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="sanksheparamayana"
      title={page.title}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title }]}
      className="layout-md min-h-screen">
      {/* Main characters */}
      {page.main_characters && page.main_characters.length > 0 && (
        <div className="rounded-2xl p-6 mb-8">
          <h2 className="h4 text-[#a15c1b] font-bold mb-3 drop-shadow">Main Characters</h2>
          <ul role="list" className="list-disc ml-6 space-y-2">
            {page.main_characters.map((c: any, idx: number) => (
              <li key={idx} className="text-[#7a3b0c] font-medium">
                <strong className="text-[#a15c1b]">{c.name}</strong> - {c.role ? <span className="text-[#b97d3a]">{c.role}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Important places */}
      {page.important_places && page.important_places.length > 0 && (
        <div className="border border-[#f5e6ca]/40 p-6 mb-8">
          <h3 className="h4 text-[#a15c1b] font-bold mb-3 drop-shadow">Important Places</h3>
          <ul role="list" className="list-disc ml-6 space-y-2">
            {page.important_places.map((p: any, idx: number) => (
              <li key={idx} className="text-[#7a3b0c] font-medium">
                <strong className="text-[#a15c1b]">{p.name}</strong> - {p.desc ? <span className="text-[#b97d3a]">{p.desc}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Timeline */}
      {page.timeline && page.timeline.length > 0 && (
        <div className="border border-[#f5e6ca]/40 p-6 mb-8">
          <h4 className="text-[#a15c1b] font-bold mb-3 drop-shadow">Timeline</h4>
          <ol role="list" className="list-decimal ml-6 space-y-2">
            {page.timeline.map((ev: any, idx: number) => (
              <li key={idx} className="text-[#7a3b0c] font-medium">
                <strong className="text-[#a15c1b]">{ev.event}</strong> - {ev.desc ? <span className="text-[#b97d3a]">{ev.desc}</span> : null}
              </li>
            ))}
          </ol>
        </div>
      )}
      {/* Core themes */}
      {page.core_themes && page.core_themes.length > 0 && (
        <div className="border border-[#f5e6ca]/40 p-6 mb-8">
          <h5 className="h4 text-[#a15c1b] font-bold mb-3 drop-shadow">Core Themes</h5>
          <ul role="list" className="list-disc ml-6 space-y-2">
            {page.core_themes.map((ct: any, idx: number) => (
              <li key={idx}>{(typeof ct.title === 'string') ? ct.title : ct['title']}</li>
            ))}
          </ul>
        </div>
      )}
      {/* Sankshepa ramayanam and slokas */}
      <div className="sankshepa-slokas">
        {Array.isArray(page.slokas) && page.slokas.slice(0, visible).map((s: any, idx: number) => (
          <div key={s.sloka || s.sanskrit || idx} className="text-center mt-10">
            {s.sanskrit ? <p className="h5 text-lg sm:text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-rose-600 to-indigo-700 drop-shadow-xl">{s.sanskrit}</p> : null}
            {s.transliteration ? <p className="mb-3">{s.transliteration}</p> : null}
            {s.storycontext ? <p className="text-left my-1"><span className="text-amber-900 underline">Context:</span> {s.storycontext}</p> : null}
            {s.simplemeaning ? <p className="text-left my-1"><span className="text-amber-900 underline">Meaning:</span> {s.simplemeaning}</p> : null}
          </div>
        ))}

        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            disabled={visible >= maxVisible}
            aria-disabled={visible >= maxVisible}
            className={`group relative md:inline-flex px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-lg sm:text-base rounded-full shadow-xl font-light hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 no-underline overflow-hidden cursor-pointer ${visible >= maxVisible ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            <span className="relative flex items-center justify-center gap-2">
              {visible >= maxVisible ? 'All loaded' : `Load (${Math.min(CHUNK, maxVisible - visible)} more)`}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
