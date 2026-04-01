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
  const [visible, setVisible] = useState(Math.min(CHUNK, maxVisible));

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
        <div className="flex items-center justify-center py-4 text-md leading-relaxed font-normal">
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
      className="layout-md bg-gradient-to-br from-[#fdf6e3] via-[#f5e6ca] to-[#f7d9c4] min-h-screen animate-fade-in">
      {/* Main characters */}
      {page.main_characters && page.main_characters.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-br from-[#f7d9c4]/80 via-[#f5e6ca]/80 to-[#fdf6e3]/80 shadow-xl border border-[#f5e6ca]/40 p-6 mb-8 animate-fade-in-up">
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
        <div className="rounded-2xl bg-gradient-to-br from-[#f7e6c4]/80 via-[#f5e6ca]/80 to-[#fdf6e3]/80 shadow-xl border border-[#f5e6ca]/40 p-6 mb-8 animate-fade-in-up">
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
        <div className="rounded-2xl bg-gradient-to-br from-[#f7e6c4]/80 via-[#f5e6ca]/80 to-[#fdf6e3]/80 shadow-xl border border-[#f5e6ca]/40 p-6 mb-8 animate-fade-in-up">
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
        <div className="rounded-2xl bg-gradient-to-br from-[#f7e6c4]/80 via-[#f5e6ca]/80 to-[#fdf6e3]/80 shadow-xl border border-[#f5e6ca]/40 p-6 mb-8 animate-fade-in-up">
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
            {s.sanskrit ? <p className="h5">{s.sanskrit}</p> : null}
            {s.transliteration ? <p className="h5">{s.transliteration}</p> : null}
            {s.meaning ? <p className="text-left">Meaning: {s.meaning}</p> : null}
          </div>
        ))}

        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            disabled={visible >= maxVisible}
            aria-disabled={visible >= maxVisible}
            className={`btn btn-outline cursor-pointer ${visible >= maxVisible ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            {visible >= maxVisible ? 'All loaded' : `Load (${Math.min(CHUNK, maxVisible - visible)} more)`}
          </button>
        </div>
      </div>
    </PageLayout>
  );
}