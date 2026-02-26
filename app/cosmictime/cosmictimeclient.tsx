"use client";
import PageLayout from "@components/common/PageLayout";
import { useLocale } from "@app/context/locale-context";
import useLocaleSection from "../hooks/useLocaleSection";
import { loadLocaleNamespace } from "@lib/i18n";
import { useEffect, useState } from 'react';
import Loader from "@components/loader";
import SimilarCategories from "@components/similar-categories/SimilarCategories";
import DashavataraTimeline from "../components/dashavataraTimeline";

export default function CosmictimeClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection("cosmictime");
  const [cosmicSource, setCosmicSource] = useState<any>(null);

  // Prefer the `cosmic` object inside the cosmictime namespace when present.
  // useLocaleSection may return the nested `cosmictime` payload which omits top-level `cosmic`.
  // Load the full namespace file client-side to extract `cosmic` reliably.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const parsed = await loadLocaleNamespace(locale, 'cosmictime');
        if (cancelled) return;
        const found = parsed?.cosmic || parsed?.cosmictime?.cosmic || ns?.cosmic || null;
        setCosmicSource(found);
      } catch (e) {
        if (!cancelled) setCosmicSource(ns?.cosmic || null);
      }
    })();
    return () => { cancelled = true; };
  }, [locale, ns]);

  const source = cosmicSource || ns?.cosmic || ns || {};

  // Do not read `meta` or `schema` objects — render only the `cosmic` content.
  const data = {
    // Keep a simple title from the parent namespace if available; avoid reading `metadata`.
    title: ns?.title || "Cosmic Time",
    raw: source,
  } as any;

  // Static styling maps for badges (avoid dynamic tailwind class generation)
  const BADGE_BG: Record<string, string> = {
    cosmic_evolution: 'bg-amber-50',
    planetary_evolution: 'bg-orange-50',
    abiogenesis: 'bg-yellow-50',
    biological_evolution: 'bg-emerald-50',
    human_evolution_global: 'bg-lime-50',
    human_evolution_india: 'bg-amber-50',
    timeline: 'bg-orange-50'
    , part1: 'bg-amber-50', part2: 'bg-amber-50', part3: 'bg-amber-50', part4: 'bg-amber-50', part5: 'bg-amber-50', part6: 'bg-amber-50', part7: 'bg-amber-50', part8: 'bg-amber-50', part9: 'bg-amber-50', part10: 'bg-amber-50'
  };
  const BADGE_BORDER: Record<string, string> = {
    cosmic_evolution: 'border-amber-200',
    planetary_evolution: 'border-orange-200',
    abiogenesis: 'border-yellow-200',
    biological_evolution: 'border-emerald-200',
    human_evolution_global: 'border-lime-200',
    human_evolution_india: 'border-amber-200',
    timeline: 'border-orange-200'
    , part1: 'border-amber-200', part2: 'border-amber-200', part3: 'border-amber-200', part4: 'border-amber-200', part5: 'border-amber-200', part6: 'border-amber-200', part7: 'border-amber-200', part8: 'border-amber-200', part9: 'border-amber-200', part10: 'border-amber-200'
  };
  const BADGE_TEXT: Record<string, string> = {
    cosmic_evolution: 'text-amber-500',
    planetary_evolution: 'text-orange-400',
    abiogenesis: 'text-yellow-500',
    biological_evolution: 'text-emerald-500',
    human_evolution_global: 'text-lime-600',
    human_evolution_india: 'text-amber-600',
    timeline: 'text-orange-400'
    , part1: 'text-amber-500', part2: 'text-amber-500', part3: 'text-amber-500', part4: 'text-amber-500', part5: 'text-amber-500', part6: 'text-amber-500', part7: 'text-amber-500', part8: 'text-amber-500', part9: 'text-amber-500', part10: 'text-amber-500'
  };
  const SECTIONS: string[] = [
    'cosmic_evolution',
    'planetary_evolution',
    'abiogenesis',
    'biological_evolution',
    'human_evolution_global',
    'human_evolution_india',
    'timeline',
    'part1', 'part2', 'part3', 'part4', 'part5', 'part6', 'part7', 'part8', 'part9', 'part10'
  ];

  // Part-specific visual variants (unique look per part)
  const PART_VARIANTS: Record<string, { card: string; badge: string; title: string; subtitle?: string }> = {
    part1: { card: 'bg-gradient-to-br from-amber-50 to-amber-100 border-l-8 border-amber-300 p-6 rounded-2xl shadow-md', badge: 'bg-amber-200 text-amber-700', title: 'text-amber-800', subtitle: 'text-lg text-amber-700' },
    part2: { card: 'bg-gradient-to-br from-orange-50 to-orange-100 border-l-8 border-orange-300 p-6 rounded-2xl shadow-md', badge: 'bg-orange-200 text-orange-700', title: 'text-orange-800', subtitle: 'text-lg text-orange-700' },
    part3: { card: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-8 border-yellow-300 p-6 rounded-2xl shadow-md', badge: 'bg-yellow-200 text-yellow-700', title: 'text-yellow-800', subtitle: 'text-lg text-yellow-700' },
    part4: { card: 'bg-gradient-to-br from-amber-50 to-amber-100 border-l-8 border-amber-300 p-6 rounded-2xl shadow-md', badge: 'bg-amber-200 text-amber-700', title: 'text-amber-800', subtitle: 'text-lg text-amber-700' },
    part5: { card: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-l-8 border-emerald-300 p-6 rounded-2xl shadow-md', badge: 'bg-emerald-200 text-emerald-700', title: 'text-emerald-800', subtitle: 'text-lg text-emerald-700' },
    part6: { card: 'bg-gradient-to-br from-lime-50 to-lime-100 border-l-8 border-lime-300 p-6 rounded-2xl shadow-md', badge: 'bg-lime-200 text-lime-700', title: 'text-lime-800', subtitle: 'text-lg text-lime-700' },
    part7: { card: 'bg-gradient-to-br from-amber-50 to-amber-100 border-l-8 border-amber-300 p-6 rounded-2xl shadow-md', badge: 'bg-amber-200 text-amber-700', title: 'text-amber-800', subtitle: 'text-lg text-amber-700' },
    part8: { card: 'bg-gradient-to-br from-orange-50 to-orange-100 border-l-8 border-orange-300 p-6 rounded-2xl shadow-md', badge: 'bg-orange-200 text-orange-700', title: 'text-orange-800', subtitle: 'text-lg text-orange-700' },
    part9: { card: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-8 border-yellow-300 p-6 rounded-2xl shadow-md', badge: 'bg-yellow-200 text-yellow-700', title: 'text-yellow-800', subtitle: 'text-lg text-yellow-700' },
    part10: { card: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-l-8 border-emerald-300 p-6 rounded-2xl shadow-md', badge: 'bg-emerald-200 text-emerald-700', title: 'text-emerald-800', subtitle: 'text-lg text-emerald-700' }
  };

  if (isLoading && !data.title) {
    return (
      <PageLayout metaKey="cosmictime" title="" breadcrumbs={[{ labelKey: "Home", href: "/" }, { label: "Cosmic Time" }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="cosmictime"
      title={data.title}
      breadcrumbs={[{ labelKey: "Home", href: "/" }, { label: data.title }]}
      className="layout-md"
    >
      <div id="cosmictime-content">
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="w-full lg:w-3/4 hidden!">
            <header className="px-6 py-10 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border border-orange-100 shadow-sm">
              <div className="max-w-5xl mx-auto text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-white/80 border border-amber-200 flex items-center justify-center mb-4 shadow">
                  <svg className="w-10 h-10 text-amber-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M12 2v6M12 16v6M4.2 7.8l4.2 2.4M15.6 13.8l4.2 2.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-orange-900 mb-2">{data.title}</h3>
                <p className="text-amber-900 max-w-3xl mx-auto">Concise, structured insights from cosmic to human time — organized for clarity and study.</p>
                <div className="mt-4 flex justify-center gap-3">
                  <span className="inline-flex items-center gap-2 bg-white/80 border border-amber-100 px-3 py-1 rounded-full text-lg text-amber-800">Research Sections</span>
                  <span className="inline-flex items-center gap-2 bg-white/80 border border-amber-100 px-3 py-1 rounded-full text-lg text-amber-800">Citable</span>
                </div>
              </div>
            </header>

            <section className="mt-8 grid gap-6">
              {SECTIONS.map((sectionKey) => {
                const section = (data.raw || {})[sectionKey];
                if (!section) return null;
                const badgeBg = BADGE_BG[sectionKey] || 'bg-amber-50';
                const badgeBorder = BADGE_BORDER[sectionKey] || 'border-amber-200';
                const badgeText = BADGE_TEXT[sectionKey] || 'text-amber-500';
                const isPart = sectionKey.startsWith('part');
                if (isPart) {
                  const variant = PART_VARIANTS[sectionKey] || PART_VARIANTS['part1'];
                  // If dataset_metadata.title exists, show it as subtitle
                  const subtitle = section?.dataset_metadata?.title || section?.dataset_metadata?.scope || '';
                  return (
                    <article key={sectionKey} className={variant.card}>
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${variant.badge} border`}>
                          <svg className={`w-6 h-6 ${variant.title}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-xl md:text-lg font-semibold ${variant.title} mb-2`}>{`Part ${sectionKey.replace('part', '')}: ${section?.dataset_metadata?.title || sectionKey.replace(/_/g, ' ')}`}</h3>
                          {subtitle && <div className={`${variant.subtitle} mb-3`}>{subtitle}</div>}
                          <div className="space-y-3 text-amber-900 text-md">
                            {renderSectionContent(section)}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                }
                return (
                  <article key={sectionKey} className="bg-white border-l-4 rounded-2xl p-6 shadow-sm hover:shadow-md transform hover:-translate-y-1 transition">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${badgeBg} ${badgeBorder} flex items-center justify-center`}>
                        <svg className={`${badgeText} w-6 h-6`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                          <path d="M12 6v6l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl md:text-lg font-semibold text-orange-800 mb-2">{sectionKey.replace(/_/g, ' ')}</h3>
                        <div className="space-y-3 text-amber-900 text-md">
                          {sectionKey === 'timeline' ? renderTimeline(section) : renderSectionContent(section)}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          </main>
          <div className="w-full lg:w-3/4 ">
            <DashavataraTimeline />
          </div>
          <aside className="w-full lg:w-1/4">
            <SimilarCategories />
            <div className="bg-amber-50 border border-amber-100 rounded-lg mt-6 p-4">
              <h4 className="font-semibold text-amber-800">Contents</h4>
              <ul className="mt-2 text-amber-900 text-lg space-y-1">
                <li>Cosmic evolution</li>
                <li>Planetary evolution</li>
                <li>Abiogenesis</li>
                <li>Biological evolution</li>
                <li>Human evolution (global & India)</li>
                <li>Timeline</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </PageLayout>
  );
}

// Helper: render primitive/object/array content into simple JSX
function renderSectionContent(section: any) {
  if (typeof section === 'string') return <p>{section}</p>;
  if (Array.isArray(section)) {
    // array of primitives
    if (section.every(i => typeof i === 'string')) {
      return <ul className="list-disc pl-6">{section.map((s, i) => <li key={i}>{s}</li>)}</ul>;
    }
    // array of objects
    return <div className="space-y-3">{section.map((item: any, idx: number) => <div key={idx} className="p-3 bg-amber-50 border border-amber-100 rounded">{renderSectionContent(item)}</div>)}</div>;
  }
  if (section && typeof section === 'object') {
    return (
      <div className="space-y-2">
        {(() => {
          const SPECIAL_LIST_KEYS = new Set(["scope", "chronological_span_years", "time_range", "structural_weakening", "regional_polities", "population_trends", "urbanization", "independence"]);
          return Object.entries(section).map(([k, v]) => {
            const isSpecial = SPECIAL_LIST_KEYS.has(k);
            return (
              <div key={k}>
                <div className="font-semibold text-amber-800">{k.replace(/_/g, ' ')}{typeof v === 'string' ? ':' : ''}</div>
                <div className="ml-3 mt-2">
                  {isSpecial ? (
                    Array.isArray(v) ? (
                      <ul className="list-disc pl-6 space-y-1 text-amber-900">
                        {v.map((item: any, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : (
                      <p className="text-amber-900">{String(v)}</p>
                    )
                  ) : (
                    renderSectionContent(v)
                  )}
                </div>
              </div>
            );
          });
        })()}
      </div>
    );
  }
  return null;
}

function renderTimeline(section: any) {
  // Timeline could be an object with entries or an array — render as vertical timeline
  if (!section) return null;
  if (Array.isArray(section)) {
    return (
      <ol className="space-y-8">
        {section.map((item: any, idx: number) => (
          <li key={idx} className={`relative flex flex-col md:flex-row items-start gap-4 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
            <div className="md:w-1/12 flex justify-center">
              <div className="w-3 h-3 rounded-full bg-amber-400 border border-white mt-2" />
            </div>
            <div className="md:w-11/12">
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 shadow-sm">
                {typeof item === 'string' ? <div className="text-amber-900">{item}</div> : renderSectionContent(item)}
              </div>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  if (section && typeof section === 'object') {
    return (
      <ol className="space-y-8">
        {Object.entries(section).map(([k, v], idx) => (
          <li key={k} className={`relative flex flex-col md:flex-row items-start gap-4 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
            <div className="md:w-1/12 flex justify-center">
              <div className="w-3 h-3 rounded-full bg-amber-400 border border-white mt-2" />
            </div>
            <div className="md:w-11/12">
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 shadow-sm">
                <div className="text-amber-800 font-medium mb-1">{k.replace(/_/g, ' ')}</div>
                <div className="text-amber-900">{renderSectionContent(v)}</div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return null;
}