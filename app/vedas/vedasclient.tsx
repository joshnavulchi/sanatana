"use client";

import { useState } from 'react';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import PageLayout from '@components/common/PageLayout';

// import Link from 'next/link';

// export default function Page() {
//   const vedas = [
//     { id: 'atharvaveda', label: 'Atharvaveda' },
//     { id: 'rigveda', label: 'Rigveda' },
//     { id: 'samaveda', label: 'Samaveda' },
//     { id: 'yajurveda', label: 'Yajurveda' },
//   ];

//   return (
//     <main className="max-w-3xl mx-auto p-4">
//       <h1 className="text-3xl font-semibold mb-4">Vedas</h1>
//       <p className="mb-6">Select a Veda to explore its content.</p>
//       <ul className="space-y-3">
//         {vedas.map((v) => (
//           <li key={v.id}>
//             <Link href={`/vedas/${v.id}`} className="text-blue-600 hover:underline">
//               {v.label}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </main>
//   );
// }

/* ── Veda icon map ── */
const VEDA_ICONS: Record<string, string> = {
  Rigveda: '🔥',
  Yajurveda: '🪔',
  Samaveda: '🎵',
  Atharvaveda: '🌿',
};

const VEDA_ACCENTS: Record<string, { from: string; via: string; to: string; text: string; border: string }> = {
  Rigveda: { from: 'from-[#7c2d12]', via: 'via-[#c2410c]', to: 'to-[#f59e0b]', text: 'text-[#7c2d12]', border: 'border-[#c2410c]' },
  Yajurveda: { from: 'from-[#92400e]', via: 'via-[#d97706]', to: 'to-[#fde68a]', text: 'text-[#92400e]', border: 'border-[#d97706]' },
  Samaveda: { from: 'from-[#3b3270]', via: 'via-[#8b6914]', to: 'to-[#e0a632]', text: 'text-[#3b3270]', border: 'border-[#8b6914]' },
  Atharvaveda: { from: 'from-[#1a6e5c]', via: 'via-[#b45309]', to: 'to-[#f59e0b]', text: 'text-[#1a6e5c]', border: 'border-[#b45309]' },
};

/* ── Small reusable ornamental divider ── */
function OrnamentDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-10">
      <div className="h-px w-14 bg-linear-to-r from-transparent to-[#d8a25a]" />
      <span className="text-[#d97706] text-lg">◆</span>
      <div className="h-px w-14 bg-linear-to-l from-transparent to-[#d8a25a]" />
    </div>
  );
}

/* ── Paragraph renderer (splits \n\n into <p> blocks) ── */
function Paragraphs({ text, className = '' }: { text: string; className?: string }) {
  return (
    <>
      {text.split('\n\n').map((p, i) => (
        <p key={i} className={`mb-4 last:mb-0 ${className}`}>{p}</p>
      ))}
    </>
  );
}

/* ── Scripture card for each Veda ── */
function VedaCard({ item }: { item: Record<string, unknown> }) {
  const name = String(item.veda || '');
  const icon = VEDA_ICONS[name] || '📕';
  const accent = VEDA_ACCENTS[name] || VEDA_ACCENTS.Rigveda;
  const description = String(item.description || '');
  const focus = String(item.primary_focus || '');
  const structure = item.structure as Record<string, unknown> | undefined;
  const deities = Array.isArray(item.major_deities) ? item.major_deities : [];
  const themes = Array.isArray(item.major_themes) ? item.major_themes : [];
  const topics = Array.isArray(item.primary_topics) ? item.primary_topics : [];
  const applications = Array.isArray(item.applications) ? item.applications : [];
  const divisions = Array.isArray(item.divisions) ? item.divisions : [];
  const importance = typeof item.importance === 'string' ? item.importance : '';

  const tags = [...themes, ...topics, ...applications].filter(Boolean);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#d8a25a]/40 bg-[#fffaf0] shadow-[0_10px_40px_rgba(122,46,31,0.10)] transition-all duration-300 hover:shadow-[0_20px_60px_rgba(166,61,23,0.16)]">
      {/* Top accent bar */}
      <div className={`h-1.5 w-full bg-linear-to-r ${accent.from} ${accent.via} ${accent.to}`} />

      {/* Pillar left accent */}
      <div className={`absolute left-0 top-1.5 bottom-0 w-1 bg-linear-to-b ${accent.from} ${accent.to}`} />

      <div className="p-4 md:p-8 pl-5 md:pl-7">
        {/* Header row */}
        <div className="flex items-center gap-4 mb-5">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 ${accent.border} bg-[#fffaf3] text-2xl shadow-[0_4px_20px_rgba(122,46,31,0.12)]`}>
            {icon}
          </div>
          <div>
            <h3 className={`text-2xl md:text-3xl font-extrabold ${accent.text}`}>{name}</h3>
            {focus && <p className="text-sm font-medium text-[#8b6914] mt-0.5">{focus}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="text-[#5b2d12] leading-relaxed text-md">
          <Paragraphs text={description} />
        </div>

        {importance && (
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#92400e]">
            <span className="text-md">✦</span> {importance}
          </div>
        )}

        {/* Stats row */}
        {structure && (
          <div className="mt-6 flex flex-wrap gap-3">
            {Object.entries(structure).map(([key, value]) => (
              <div key={key} className="flex flex-col items-center rounded-xl border border-[#edc98f] bg-[#fffaf3] px-4 py-2.5 min-w-20">
                <span className="text-xl font-extrabold text-[#7a2e1f]">{String(value)}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#a89278]">
                  {key.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Divisions (for Yajurveda) */}
        {divisions.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {divisions.map((div: Record<string, unknown>, i: number) => (
              <div key={i} className="rounded-xl border border-[#edc98f]/60 bg-[#fffaf3] p-4">
                <h4 className="font-bold text-[#3d2e22] text-sm">{String(div.type || '')}</h4>
                <p className="text-xs text-[#6b5d4f] mt-1">({String(div.meaning || '')})</p>
                <p className="text-xs text-[#5b2d12] mt-1">{String(div.characteristics || '')}</p>
              </div>
            ))}
          </div>
        )}

        {/* Deities chips */}
        {deities.length > 0 && (
          <div className="mt-5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#a89278] mb-2">Major Deities</h4>
            <div className="flex flex-wrap gap-2">
              {deities.map((d: string) => (
                <span key={d} className={`inline-flex items-center rounded-lg border ${accent.border}/40 bg-[#fffaf3] px-3 py-1 text-xs font-semibold ${accent.text}`}>
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Theme/Topic tags */}
        {tags.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#a89278] mb-2">Key Themes</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((t: string, i: number) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-lg bg-[#fde7c7]/60 px-3 py-1 text-xs font-medium text-[#92400e]">
                  <span className="h-1 w-1 rounded-full bg-[#d97706]" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Mandala accordion row ── */
function MandalaRow({ mandala, index }: { mandala: Record<string, unknown>; index: number }) {
  const [open, setOpen] = useState(false);
  const num = mandala.mandala_number as number;
  const hymns = mandala.hymn_count as number;
  const classification = String(mandala.classification || mandala.character || '');
  const rishiFamily = String(mandala.associated_rishi_family || '');
  const mainRishis = Array.isArray(mandala.main_rishis) ? mandala.main_rishis : [];
  const associatedRishis = Array.isArray(mandala.associated_rishis) ? mandala.associated_rishis : [];
  const deities = Array.isArray(mandala.primary_deities) ? mandala.primary_deities : [];
  const primaryDeity = typeof mandala.primary_deity === 'string' ? mandala.primary_deity : '';
  const themes = Array.isArray(mandala.themes) ? mandala.themes : [];
  const commentary = String(mandala.commentary || '');
  const sampleHymns = Array.isArray(mandala.sample_hymns) ? mandala.sample_hymns : [];
  const importantHymns = Array.isArray(mandala.important_hymns) ? mandala.important_hymns : [];
  const importantHymn = mandala.important_hymn as Record<string, unknown> | undefined;

  const allDeities = primaryDeity ? [primaryDeity, ...deities] : deities;
  const allRishis = [...mainRishis, ...associatedRishis, ...(rishiFamily ? [rishiFamily] : [])];
  const allHymns = [...sampleHymns, ...importantHymns, ...(importantHymn ? [importantHymn] : [])];

  // Alternating shell backgrounds
  const shellBg = index % 3 === 0
    ? 'bg-linear-to-br from-[#fffaf3] via-[#fef3e2] to-[#fbe8c8]'
    : index % 3 === 1
      ? 'bg-linear-to-br from-[#fffbf5] via-[#fdf1dc] to-[#f8e4c0]'
      : 'bg-linear-to-br from-[#fff9f0] via-[#fce9ce] to-[#f5d9ae]';

  return (
    <div className={`rounded-2xl border border-[#d8a25a]/30 overflow-hidden ${shellBg} transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(146,64,14,0.08)]`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-4 md:p-5 text-left cursor-pointer"
      >
        {/* Number badge — carved-stone tablet feel */}
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#7c2d12] to-[#d97706] text-sm font-extrabold text-[#fffaf0] shadow-[0_4px_20px_rgba(122,46,31,0.25)]">
          {num}
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="text-md md:text-lg font-bold text-[#3d2e22]">
            Mandala {num} <span className="text-[#a89278] font-normal text-sm ml-2">— {hymns} hymns</span>
          </h4>
          {classification && <p className="text-xs text-[#6b5d4f] mt-0.5 truncate">{classification}</p>}
        </div>
        <svg
          className={`h-4 w-4 text-[#b45309] shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-4 md:px-5 pb-5 pt-0 border-t border-[#edc98f]/40">
          {commentary && <p className="text-sm text-[#5b2d12] leading-relaxed mt-4">{commentary}</p>}

          {/* Rishis & Deities */}
          <div className="mt-4 flex flex-wrap gap-4">
            {allRishis.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#a89278]">Rishis</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {allRishis.map((r: string) => (
                    <span key={r} className="rounded-lg bg-[#fffaf3] border border-[#edc98f]/60 px-2.5 py-0.5 text-xs font-semibold text-[#92400e]">{r}</span>
                  ))}
                </div>
              </div>
            )}
            {allDeities.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#a89278]">Deities</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {allDeities.map((d: string) => (
                    <span key={d} className="rounded-lg bg-[#fde7c7]/50 border border-[#d97706]/30 px-2.5 py-0.5 text-xs font-semibold text-[#7a2e1f]">{d}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Themes */}
          {themes.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {themes.map((t: string, i: number) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-lg bg-[#fde7c7]/40 px-2.5 py-1 text-[11px] font-medium text-[#5b2d12]">
                  <span className="h-1 w-1 rounded-full bg-[#d97706]" /> {t}
                </span>
              ))}
            </div>
          )}

          {/* Important hymns */}
          {allHymns.length > 0 && (
            <div className="mt-5 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#a89278]">Notable Hymns</span>
              {allHymns.map((h: Record<string, unknown>, i: number) => (
                <div key={i} className="rounded-xl border border-[#edc98f]/50 bg-[#fffaf3] p-3.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-extrabold text-[#7a2e1f]">{String(h.hymn_id || '')}</span>
                    {typeof h.name === 'string' && <span className="text-xs font-semibold text-[#8b6914]">— {h.name}</span>}
                  </div>
                  {typeof h.theme === 'string' && <p className="text-[11px] font-medium text-[#92400e] mb-1">Theme: {h.theme}</p>}
                  {typeof h.explanation === 'string' && <p className="text-xs text-[#5b2d12] leading-relaxed">{h.explanation}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Deity card ── */
function DeityCard({ deity }: { deity: Record<string, unknown> }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#e0a632]/40 bg-[#fffaf0] p-5 shadow-[0_4px_20px_rgba(139,105,20,0.08)] hover:shadow-[0_12px_40px_rgba(139,105,20,0.14)] transition-all duration-300 hover:-translate-y-1">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#8b6914] via-[#b8952e] to-[#e0a632]" />
      <h4 className="text-lg font-extrabold text-[#3d2e22]">{String(deity.name || '')}</h4>
      <p className="text-sm text-[#6b5d4f] mt-1">{String(deity.role || '')}</p>
      <p className="text-xs text-[#92400e] font-medium mt-2">{String(deity.importance || '')}</p>
    </div>
  );
}

/* ── Main VedasClient ── */
export default function VedasClient() {
  const { isLoading } = useLocale();
  const ns = useLocaleSection('vedas');

  const title = ns?.title || 'Vedas';
  const definition = typeof ns?.definition === 'string' ? ns.definition : '';
  const meaningOfWord = typeof ns?.meaning_of_word_veda === 'string' ? ns.meaning_of_word_veda : '';
  const introduction = typeof ns?.introduction === 'string' ? ns.introduction : '';
  const scriptureText = Array.isArray(ns?.scripture_text) ? ns.scripture_text : [];
  const philosophicalExplanation = typeof ns?.philosophical_explanation === 'string' ? ns.philosophical_explanation : '';
  const relatedConcepts = Array.isArray(ns?.related_concepts) ? ns.related_concepts : [];
  const period = ns?.estimated_composition_period as Record<string, string> | undefined;
  const stats = ns?.statistics as Record<string, number> | undefined;
  const society = ns?.vedic_society as Record<string, unknown> | undefined;
  const influence = ns?.influence_of_vedas as Record<string, unknown> | undefined;
  const timeline = ns?.vedic_timeline as Record<string, string> | undefined;
  const philoConcepts = ns?.vedic_philosophical_concepts as Record<string, string> | undefined;
  const mandalas = Array.isArray(ns?.mandalas) ? ns.mandalas : [];
  const deities = Array.isArray(ns?.major_rigvedic_deities) ? ns.major_rigvedic_deities : [];

  if (isLoading && !ns?.title) {
    return (
      <PageLayout metaKey="vedas" title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Vedas' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey="vedas" title={title} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Vedas' }]} className="layout-md">

      {/* ═══════════ Hero Section ═══════════ */}
      <section className="relative overflow-hidden rounded-3xl border border-[#d8a25a]/30 bg-linear-to-br from-[#fffaf3] via-[#fdf0d7] to-[#fff8ef] p-4 md:p-10">
        {/* Decorative warm glow blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#f59e0b]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#c2410c]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          {/* Decorative header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-linear-to-r from-transparent to-[#d97706]" />
            <span className="text-3xl">🕉️</span>
            <div className="h-px w-12 bg-linear-to-l from-transparent to-[#d97706]" />
          </div>

          {definition && (
            <p className="text-lg sm:text-md text-[#5b2d12] leading-relaxed italic font-medium mb-6">{definition}</p>
          )}

          {meaningOfWord && (
            <div className="rounded-xl border border-[#e0a632]/40 bg-[#fffaf3] p-4 inline-block mb-4">
              <p className="text-sm text-[#92400e]">
                <span className="font-bold text-[#7a2e1f]">Etymology:</span> {meaningOfWord}
              </p>
            </div>
          )}

          {/* Stats badges */}
          {stats && (
            <div className="flex flex-wrap gap-4 mt-6">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center rounded-xl border border-[#edc98f] bg-[#fffaf3] px-5 py-3 shadow-[0_4px_20px_rgba(122,46,31,0.08)]">
                  <span className="text-2xl font-extrabold bg-linear-to-r from-[#7c2d12] via-[#c2410c] to-[#f59e0b] bg-clip-text text-transparent">{String(value).toLocaleString()}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#a89278] mt-0.5">{key}</span>
                </div>
              ))}
            </div>
          )}

          {/* Composition period */}
          {period && (
            <div className="flex flex-wrap gap-3 mt-5">
              {Object.entries(period).map(([key, value]) => (
                <span key={key} className="inline-flex items-center gap-2 rounded-lg bg-[#fde7c7]/50 px-3 py-1 text-xs font-medium text-[#5b2d12]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d97706]" />
                  <span className="font-semibold text-[#92400e]">{key.replace(/_/g, ' ')}:</span> {value}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ Introduction ═══════════ */}
      {introduction && (
        <>
          <OrnamentDivider />
          <section className="rounded-3xl border border-[#d8a25a]/20 bg-[#fffaf0] p-4 md:p-10 shadow-[0_8px_30px_rgba(146,64,14,0.06)]">
            <h2 className="text-2xl md:text-3xl font-extrabold bg-linear-to-r from-[#a63d17] via-[#d97706] to-[#f59e0b] bg-clip-text text-transparent mb-6">
              Introduction
            </h2>
            <div className="text-md text-[#5b2d12] leading-relaxed">
              <Paragraphs text={introduction} />
            </div>
          </section>
        </>
      )}

      {/* ═══════════ The Four Vedas ═══════════ */}
      {scriptureText.length > 0 && (
        <>
          <OrnamentDivider />
          <section>
            <h2 className="text-2xl md:text-3xl font-extrabold bg-linear-to-r from-[#92400e] via-[#c2410c] to-[#ea580c] bg-clip-text text-transparent mb-8 text-center">
              The Four Vedas
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {scriptureText.map((item: Record<string, unknown>, i: number) => (
                <VedaCard key={i} item={item} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* ═══════════ Vedic Timeline ═══════════ */}
      {timeline && Object.keys(timeline).length > 0 && (
        <>
          <OrnamentDivider />
          <section className="rounded-3xl border border-[#d8a25a]/20 bg-linear-to-br from-[#fffaf3] via-[#fef3e2] to-[#fbe8c8] p-4 md:p-10">
            <h2 className="text-2xl md:text-3xl font-extrabold bg-linear-to-r from-[#7c2d12] via-[#c2410c] to-[#fb923c] bg-clip-text text-transparent mb-8">
              Vedic Timeline
            </h2>
            <div className="relative ml-4">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-linear-to-b from-[#c2410c] to-[#f59e0b]" />
              <div className="space-y-6">
                {Object.entries(timeline).map(([key, value], i) => (
                  <div key={key} className="relative flex items-start gap-5 pl-6">
                    {/* Timeline dot */}
                    <span className="absolute left-1.25 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-[#7c2d12] to-[#d97706] text-[10px] font-bold text-[#fffaf0] shadow-[0_4px_20px_rgba(122,46,31,0.25)]">
                      {i + 1}
                    </span>
                    <div className="rounded-xl border border-[#edc98f]/50 bg-[#fffaf3] px-4 py-3 flex-1">
                      <h4 className="text-sm font-bold text-[#3d2e22]">{key.replace(/_/g, ' ')}</h4>
                      <p className="text-sm text-[#92400e] font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ═══════════ Philosophical Explanation ═══════════ */}
      {philosophicalExplanation && (
        <>
          <OrnamentDivider />
          <section className="rounded-3xl border border-amber-200/20 bg-amber-50 p-4 md:p-10 shadow-[0_8px_30px_rgba(146,64,14,0.06)]">
            <h2 className="section-title mb-6">Philosophical Foundations</h2>
            <div className="body-text">
              <Paragraphs text={philosophicalExplanation} />
            </div>
          </section>
        </>
      )}

      {/* ═══════════ Vedic Philosophical Concepts ═══════════ */}
      {philoConcepts && Object.keys(philoConcepts).length > 0 && (
        <>
          <OrnamentDivider />
          <section>
            <h2 className="section-title mb-8 text-center">Core Vedic Concepts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.entries(philoConcepts).map(([key, value]) => (
                <div key={key} className="relative overflow-hidden rounded-2xl border border-amber-200/30 bg-amber-50 p-5 hover:shadow-[0_8px_30px_rgba(146,64,14,0.10)] transition-all duration-200 hover:-translate-y-0.5">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300" />
                  <h4 className="text-md font-extrabold text-gray-900 capitalize">{key}</h4>
                  <p className="meta-text mt-1">{value}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ═══════════ Major Rigvedic Deities ═══════════ */}
      {deities.length > 0 && (
        <>
          <OrnamentDivider />
          <section>
            <h2 className="section-title mb-8 text-center">Major Rigvedic Deities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {deities.map((d: Record<string, unknown>, i: number) => (
                <DeityCard key={i} deity={d} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* ═══════════ 10 Mandalas ═══════════ */}
      {mandalas.length > 0 && (
        <>
          <OrnamentDivider />
          <section>
            <h2 className="section-title mb-8 text-center">The 10 Mandalas of Rigveda</h2>
            <div className="space-y-4">
              {mandalas.map((m: Record<string, unknown>, i: number) => (
                <MandalaRow key={i} mandala={m} index={i} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* ═══════════ Vedic Society ═══════════ */}
      {society && Object.keys(society).length > 0 && (
        <>
          <OrnamentDivider />
          <section className="rounded-3xl border border-amber-200/20 bg-amber-50 p-4 md:p-10">
            <h2 className="section-title mb-8">Vedic Society</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(society).map(([key, items]) => {
                const list = Array.isArray(items) ? items : [];
                if (list.length === 0) return null;
                return (
                  <div key={key} className="rounded-2xl border border-[#edc98f]/50 bg-[#fffaf3] p-5">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-amber-700 mb-3">{key.replace(/_/g, ' ')}</h4>
                    <ul className="space-y-2">
                      {list.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary-600 mt-1.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* ═══════════ Influence of the Vedas ═══════════ */}
      {influence && Object.keys(influence).length > 0 && (
        <>
          <OrnamentDivider />
          <section>
            <h2 className="section-title mb-8 text-center">Influence of the Vedas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.entries(influence).map(([key, items]) => {
                const list = Array.isArray(items) ? items : [];
                if (list.length === 0) return null;
                const iconMap: Record<string, string> = {
                  religious_influence: '🙏',
                  philosophical_influence: '💡',
                  scientific_influence: '🔬',
                  cultural_influence: '🎭',
                };
                return (
                  <div key={key} className="relative overflow-hidden rounded-2xl border border-amber-200/30 bg-amber-50 p-4 md:p-6">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-300" />
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">{iconMap[key] || '✦'}</span>
                      <h4 className="text-md font-bold text-gray-900 capitalize">{key.replace(/_/g, ' ')}</h4>
                    </div>
                    <ul className="space-y-2">
                      {list.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary-600 mt-1.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* ═══════════ Related Concepts ═══════════ */}
      {relatedConcepts.length > 0 && (
        <>
          <OrnamentDivider />
          <section className="rounded-3xl border border-[#d8a25a]/20 bg-linear-to-br from-[#fffaf3] via-[#fef3e2] to-[#fbe8c8] p-4 md:p-8 text-center">
            <h2 className="text-xl font-extrabold text-[#3d2e22] mb-5">Related Concepts</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {relatedConcepts.map((concept: string) => (
                <span key={concept} className="inline-flex items-center rounded-xl border border-[#e0a632]/40 bg-[#fffaf3] px-4 py-2 text-sm font-semibold text-[#7a2e1f] shadow-[0_2px_10px_rgba(139,105,20,0.08)] hover:shadow-[0_4px_20px_rgba(139,105,20,0.14)] transition-shadow duration-200">
                  {concept}
                </span>
              ))}
            </div>
          </section>
        </>
      )}
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
