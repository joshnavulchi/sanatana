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
        className="layout-sm"
      >
        <div className="flex items-center justify-center py-4 text-base leading-relaxed font-normal">
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
      className="layout-sm">
      {/* Main characters */}
      {page.main_characters && page.main_characters.length > 0 && (
        <div>
          <h2 className="h4">Main Characters</h2>
          <ul role="list" className="list-disc">
            {page.main_characters.map((c: any, idx: number) => (
              <li key={idx}>
                <strong>{c.name}</strong> - {c.role ? <span>{c.role}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Important places */}
      {page.important_places && page.important_places.length > 0 && (
        <div>
          <h3 className="h4">Important Places</h3>
          <ul role="list" className="list-disc">
            {page.important_places.map((p: any, idx: number) => (
              <li key={idx}>
                <strong>{p.name}</strong> - {p.desc ? <span>{p.desc}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Timeline */}
      {page.timeline && page.timeline.length > 0 && (
        <div>
          <h4>Timeline</h4>
          <ol role="list" className="list-disc">
            {page.timeline.map((ev: any, idx: number) => (
              <li key={idx}>
                <strong>{ev.event}</strong> - {ev.desc ? <span>{ev.desc}</span> : null}
              </li>
            ))}
          </ol>
        </div>
      )}
      {/* Core themes */}
      {page.core_themes && page.core_themes.length > 0 && (
        <div>
          <h5 className="h4">Core Themes</h5>
          <ul role="list" className="list-disc">
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