"use client";
import { useState } from 'react';
import Link from 'next/link';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import SimilarCategories from '@components/similar-categories/SimilarCategories';

/* ── Configuration per slug ── */
const SLUG_CONFIG: Record<string, {
  icon: string;
  fileKey: string;
  accentFrom: string; accentVia: string; accentTo: string;
  textAccent: string; borderAccent: string;
  chaptersKey: string; chaptersLabel: string; itemLabel: string;
  chapterPrefix: string;
  deitiesKey: string; deitiesLabel: string;
}> = {
  rigveda: {
    icon: '🔥', fileKey: 'vedas_rigveda',
    accentFrom: 'from-[#7c2d12]', accentVia: 'via-[#c2410c]', accentTo: 'to-[#f59e0b]',
    textAccent: 'text-[#7c2d12]', borderAccent: 'border-[#c2410c]',
    chaptersKey: 'mandalas', chaptersLabel: 'The 10 Mandalas of Rigveda', itemLabel: 'Mandala',
    chapterPrefix: 'mandala',
    deitiesKey: 'major_rigvedic_deities', deitiesLabel: 'Major Rigvedic Deities',
  },
  yajurveda: {
    icon: '🪔', fileKey: 'vedas_yajurveda',
    accentFrom: 'from-[#92400e]', accentVia: 'via-[#d97706]', accentTo: 'to-[#fde68a]',
    textAccent: 'text-[#92400e]', borderAccent: 'border-[#d97706]',
    chaptersKey: 'yajurveda_chapters', chaptersLabel: 'Chapters of the Yajurveda', itemLabel: 'Chapter',
    chapterPrefix: 'chapter',
    deitiesKey: 'major_yajurvedic_deities', deitiesLabel: 'Major Yajurvedic Deities',
  },
  samaveda: {
    icon: '🎵', fileKey: 'vedas_samaveda',
    accentFrom: 'from-[#3b3270]', accentVia: 'via-[#8b6914]', accentTo: 'to-[#e0a632]',
    textAccent: 'text-[#3b3270]', borderAccent: 'border-[#8b6914]',
    chaptersKey: 'samaveda_sections', chaptersLabel: 'Sections of the Samaveda', itemLabel: 'Section',
    chapterPrefix: 'section',
    deitiesKey: 'major_samavedic_deities', deitiesLabel: 'Major Samavedic Deities',
  },
  atharvaveda: {
    icon: '🌿', fileKey: 'vedas_atharvaveda',
    accentFrom: 'from-[#1a6e5c]', accentVia: 'via-[#b45309]', accentTo: 'to-[#f59e0b]',
    textAccent: 'text-[#1a6e5c]', borderAccent: 'border-[#b45309]',
    chaptersKey: 'atharvaveda_books', chaptersLabel: 'Books of the Atharvaveda', itemLabel: 'Book',
    chapterPrefix: 'book',
    deitiesKey: 'major_atharvavedic_deities', deitiesLabel: 'Major Atharvavedic Deities',
  },
};

const FALLBACK_CONFIG = SLUG_CONFIG.rigveda;

/* ── Small reusable ornamental divider ── */
function OrnamentDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-10">
      <div className="h-px w-16 bg-linear-to-r from-transparent to-[#d8a25a]" />
      <span className="text-[#d97706] text-lg">◆</span>
      <div className="h-px w-16 bg-linear-to-l from-transparent to-[#d8a25a]" />
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

/* ── Scripture text section card ── */
function ScriptureSection({ item, index, accentFrom, accentVia, accentTo }: {
  item: Record<string, unknown>; index: number;
  accentFrom: string; accentVia: string; accentTo: string;
}) {
  const section = String(item.section || '');
  const content = String(item.content || '');

  const shells = [
    'bg-linear-to-br from-[#fffaf3] via-[#fef3e2] to-[#fbe8c8]',
    'bg-linear-to-br from-[#fffbf5] via-[#fdf1dc] to-[#f8e4c0]',
    'bg-linear-to-br from-[#fff9f0] via-[#fce9ce] to-[#f5d9ae]',
  ];

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-[#d8a25a]/30 p-6 md:p-8 ${shells[index % 3]} shadow-[0_8px_30px_rgba(146,64,14,0.06)]`}>
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${accentFrom} ${accentVia} ${accentTo}`} />
      {/* Pillar accent */}
      <div className={`absolute left-0 top-1 bottom-0 w-1 bg-linear-to-b ${accentFrom} ${accentTo}`} />

      <div className="flex items-center gap-3 mb-5 pl-2">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${accentFrom} ${accentTo} text-xs font-extrabold text-[#fffaf0] shadow-[0_4px_20px_rgba(122,46,31,0.25)]`}>
          {index + 1}
        </span>
        <h3 className="text-xl md:text-2xl font-extrabold text-[#3d2e22]">{section}</h3>
      </div>
      <div className="text-base text-[#5b2d12] leading-relaxed pl-2">
        <Paragraphs text={content} />
      </div>
    </div>
  );
}

/* ── Chapter/Mandala/Book accordion row ── */
function ChapterRow({ item, index, itemLabel, accentFrom, accentTo, slug, chapterPrefix }: {
  item: Record<string, unknown>; index: number; itemLabel: string;
  accentFrom: string; accentTo: string;
  slug: string; chapterPrefix: string;
}) {
  const [open, setOpen] = useState(false);

  // Detect the number key: could be mandala, chapter, book, section
  const num = (item.mandala ?? item.chapter ?? item.book ?? item.section ?? (index + 1)) as number;
  const title = String(item.title || `${itemLabel} ${num}`);
  const intro = typeof item.introduction === 'string' ? item.introduction : '';
  const scriptureText = typeof item.scripture_text === 'string' ? item.scripture_text : '';
  const philoExplanation = typeof item.philosophical_explanation === 'string' ? item.philosophical_explanation : '';
  const totalHymns = typeof item.total_hymns === 'number' ? item.total_hymns : 0;
  const hasExpandableContent = intro || scriptureText || philoExplanation;
  const chapterHref = `/vedas/${slug}/${chapterPrefix}-${num}`;

  const shells = [
    'bg-linear-to-br from-[#fffaf3] via-[#fef3e2] to-[#fbe8c8]',
    'bg-linear-to-br from-[#fffbf5] via-[#fdf1dc] to-[#f8e4c0]',
    'bg-linear-to-br from-[#fff9f0] via-[#fce9ce] to-[#f5d9ae]',
  ];

  return (
    <div className={`rounded-2xl border border-[#d8a25a]/30 overflow-hidden ${shells[index % 3]} transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(146,64,14,0.08)]`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-4 md:p-5 text-left cursor-pointer"
      >
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${accentFrom} ${accentTo} text-sm font-extrabold text-[#fffaf0] shadow-[0_4px_20px_rgba(122,46,31,0.25)]`}>
          {num}
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="text-base md:text-lg font-bold text-[#3d2e22] truncate">{title}</h4>
          {totalHymns > 0 && <p className="text-xs text-[#6b5d4f] mt-0.5">{totalHymns} Hymns</p>}
        </div>
        {hasExpandableContent ? (
          <svg
            className={`h-4 w-4 text-[#b45309] shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <Link href={chapterHref} className="text-xs font-bold text-[#b45309] hover:text-[#92400e] transition-colors">
            View →
          </Link>
        )}
      </button>

      {open && hasExpandableContent && (
        <div className="px-4 md:px-5 pb-5 pt-0 border-t border-[#edc98f]/40 space-y-4">
          {intro && (
            <div className="mt-4">
              <p className="text-sm text-[#5b2d12] leading-relaxed">{intro}</p>
            </div>
          )}

          {scriptureText && (
            <div className="rounded-xl border border-[#edc98f]/50 bg-[#fffaf3] p-4">
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#a89278] mb-2">Scripture Text</h5>
              <div className="text-sm text-[#5b2d12] leading-relaxed">
                <Paragraphs text={scriptureText} />
              </div>
            </div>
          )}

          {philoExplanation && (
            <div className="rounded-xl border border-[#e0a632]/30 bg-[#fffaf3] p-4">
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#a89278] mb-2">Philosophical Explanation</h5>
              <div className="text-sm text-[#5b2d12] leading-relaxed">
                <Paragraphs text={philoExplanation} />
              </div>
            </div>
          )}

          <div className="text-right">
            <Link href={chapterHref} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#b45309] hover:text-[#92400e] transition-colors">
              View {itemLabel} {num} Details
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Deity card ── */
function DeityCard({ deity, accentFrom, accentVia, accentTo }: {
  deity: Record<string, unknown>;
  accentFrom: string; accentVia: string; accentTo: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#e0a632]/40 bg-[#fffaf0] p-5 shadow-[0_4px_20px_rgba(139,105,20,0.08)] hover:shadow-[0_12px_40px_rgba(139,105,20,0.14)] transition-all duration-300 hover:-translate-y-1">
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r ${accentFrom} ${accentVia} ${accentTo}`} />
      <h4 className="text-lg font-extrabold text-[#3d2e22]">{String(deity.name || '')}</h4>
      <p className="text-sm text-[#6b5d4f] mt-1">{String(deity.role || '')}</p>
      <p className="text-xs text-[#92400e] font-medium mt-2">{String(deity.importance || '')}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Main SlugClient – renders any of the 4 Vedas
   ══════════════════════════════════════════════ */
export default function SlugClient({ slug }: { slug: string }) {
  const { isLoading } = useLocale();
  const cfg = SLUG_CONFIG[slug] || FALLBACK_CONFIG;
  const ns = useLocaleSection(cfg.fileKey);
  const displayTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  // Extract all content fields
  const title = typeof ns?.title === 'string' ? ns.title : displayTitle;
  const description = typeof ns?.description === 'string' ? ns.description : '';
  const introduction = typeof ns?.introduction === 'string' ? ns.introduction : '';
  const scriptureText = Array.isArray(ns?.scripture_text) ? ns.scripture_text : [];
  const philosophicalExplanation = typeof ns?.philosophical_explanation === 'string' ? ns.philosophical_explanation : '';
  const relatedConcepts = Array.isArray(ns?.related_concepts) ? ns.related_concepts : [];
  const chapters = Array.isArray(ns?.[cfg.chaptersKey]) ? ns[cfg.chaptersKey] : [];
  const deities = Array.isArray(ns?.[cfg.deitiesKey]) ? ns[cfg.deitiesKey] : [];

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Vedas', href: '/vedas' },
    { label: displayTitle },
  ];

  if (isLoading && !ns?.title) {
    return (
      <PageLayout metaKey={cfg.fileKey} title="" breadcrumbs={breadcrumbs} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey={cfg.fileKey} title={title} breadcrumbs={breadcrumbs} className="layout-md">

      {/* ═══════════ Hero Section ═══════════ */}
      <section className="relative overflow-hidden rounded-3xl border border-[#d8a25a]/30 bg-linear-to-br from-[#fffaf3] via-[#fdf0d7] to-[#fff8ef] p-6 md:p-10">
        {/* Warm glow blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#f59e0b]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#c2410c]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-linear-to-r from-transparent to-[#d97706]" />
            <span className="text-3xl">{cfg.icon}</span>
            <div className="h-px w-12 bg-linear-to-l from-transparent to-[#d97706]" />
          </div>

          {description && (
            <p className="text-lg md:text-xl text-[#5b2d12] leading-relaxed italic font-medium">{description}</p>
          )}
        </div>
      </section>

      {/* ═══════════ Introduction ═══════════ */}
      {introduction && (
        <>
          <OrnamentDivider />
          <section className="rounded-3xl border border-[#d8a25a]/20 bg-[#fffaf0] p-6 md:p-10 shadow-[0_8px_30px_rgba(146,64,14,0.06)]">
            <h2 className={`text-2xl md:text-3xl font-extrabold bg-linear-to-r ${cfg.accentFrom} ${cfg.accentVia} ${cfg.accentTo} bg-clip-text text-transparent mb-6`}>
              Introduction
            </h2>
            <div className="text-base text-[#5b2d12] leading-relaxed">
              <Paragraphs text={introduction} />
            </div>
          </section>
        </>
      )}

      {/* ═══════════ Scripture Text Sections ═══════════ */}
      {scriptureText.length > 0 && (
        <>
          <OrnamentDivider />
          <section>
            <h2 className="text-2xl md:text-3xl font-extrabold bg-linear-to-r from-[#92400e] via-[#c2410c] to-[#ea580c] bg-clip-text text-transparent mb-8 text-center">
              Scripture &amp; Teachings
            </h2>
            <div className="space-y-6">
              {scriptureText.map((item: Record<string, unknown>, i: number) => (
                <ScriptureSection
                  key={i}
                  item={item}
                  index={i}
                  accentFrom={cfg.accentFrom}
                  accentVia={cfg.accentVia}
                  accentTo={cfg.accentTo}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {/* ═══════════ Philosophical Explanation ═══════════ */}
      {philosophicalExplanation && (
        <>
          <OrnamentDivider />
          <section className="rounded-3xl border border-[#d8a25a]/20 bg-[#fffaf0] p-6 md:p-10 shadow-[0_8px_30px_rgba(146,64,14,0.06)]">
            <h2 className={`text-2xl md:text-3xl font-extrabold bg-linear-to-r ${cfg.accentFrom} ${cfg.accentVia} ${cfg.accentTo} bg-clip-text text-transparent mb-6`}>
              Philosophical Foundations
            </h2>
            <div className="text-base text-[#5b2d12] leading-relaxed">
              <Paragraphs text={philosophicalExplanation} />
            </div>
          </section>
        </>
      )}

      {/* ═══════════ Major Deities ═══════════ */}
      {deities.length > 0 && (
        <>
          <OrnamentDivider />
          <section>
            <h2 className="text-2xl md:text-3xl font-extrabold bg-linear-to-r from-[#8b6914] via-[#b8952e] to-[#e0a632] bg-clip-text text-transparent mb-8 text-center">
              {cfg.deitiesLabel}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {deities.map((d: Record<string, unknown>, i: number) => (
                <DeityCard
                  key={i}
                  deity={d}
                  accentFrom={cfg.accentFrom}
                  accentVia={cfg.accentVia}
                  accentTo={cfg.accentTo}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {/* ═══════════ Chapters / Mandalas / Books ═══════════ */}
      {chapters.length > 0 && (
        <>
          <OrnamentDivider />
          <section>
            <h2 className={`text-2xl md:text-3xl font-extrabold bg-linear-to-r ${cfg.accentFrom} ${cfg.accentVia} ${cfg.accentTo} bg-clip-text text-transparent mb-8 text-center`}>
              {cfg.chaptersLabel}
            </h2>
            <div className="space-y-4">
              {chapters.map((item: Record<string, unknown>, i: number) => (
                <ChapterRow
                  key={i}
                  item={item}
                  index={i}
                  itemLabel={cfg.itemLabel}
                  accentFrom={cfg.accentFrom}
                  accentTo={cfg.accentTo}
                  slug={slug}
                  chapterPrefix={cfg.chapterPrefix}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {/* ═══════════ Related Concepts ═══════════ */}
      {relatedConcepts.length > 0 && (
        <>
          <OrnamentDivider />
          <section className="rounded-3xl border border-[#d8a25a]/20 bg-linear-to-br from-[#fffaf3] via-[#fef3e2] to-[#fbe8c8] p-6 md:p-8 text-center">
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
