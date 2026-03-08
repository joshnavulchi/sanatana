"use client";
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import SimilarCategories from '@components/similar-categories/SimilarCategories';
import Link from 'next/link';

/* ── Per-veda configuration ── */
const SLUG_CONFIG: Record<string, {
  icon: string;
  accentFrom: string; accentVia: string; accentTo: string;
  textAccent: string; borderAccent: string;
  chaptersKey: string; numKey: string; itemLabel: string;
}> = {
  rigveda: {
    icon: '🔥', accentFrom: 'from-[#7c2d12]', accentVia: 'via-[#c2410c]', accentTo: 'to-[#f59e0b]',
    textAccent: 'text-[#7c2d12]', borderAccent: 'border-[#c2410c]',
    chaptersKey: 'rigveda_mandalas', numKey: 'mandala', itemLabel: 'Mandala',
  },
  yajurveda: {
    icon: '🪔', accentFrom: 'from-[#92400e]', accentVia: 'via-[#d97706]', accentTo: 'to-[#fde68a]',
    textAccent: 'text-[#92400e]', borderAccent: 'border-[#d97706]',
    chaptersKey: 'yajurveda_chapters', numKey: 'chapter', itemLabel: 'Chapter',
  },
  samaveda: {
    icon: '🎵', accentFrom: 'from-[#3b3270]', accentVia: 'via-[#8b6914]', accentTo: 'to-[#e0a632]',
    textAccent: 'text-[#3b3270]', borderAccent: 'border-[#8b6914]',
    chaptersKey: 'samaveda_sections', numKey: 'section', itemLabel: 'Section',
  },
  atharvaveda: {
    icon: '🌿', accentFrom: 'from-[#1a6e5c]', accentVia: 'via-[#b45309]', accentTo: 'to-[#f59e0b]',
    textAccent: 'text-[#1a6e5c]', borderAccent: 'border-[#b45309]',
    chaptersKey: 'atharvaveda_books', numKey: 'book', itemLabel: 'Book',
  },
};

const FALLBACK = SLUG_CONFIG.rigveda;

/* ── Ornamental divider ── */
function OrnamentDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-10">
      <div className="h-px w-16 bg-linear-to-r from-transparent to-[#d8a25a]" />
      <span className="text-[#d97706] text-lg">◆</span>
      <div className="h-px w-16 bg-linear-to-l from-transparent to-[#d8a25a]" />
    </div>
  );
}

/* ── Paragraph renderer ── */
function Paragraphs({ text, className = '' }: { text: string; className?: string }) {
  return (
    <>
      {text.split('\n\n').map((p, i) => (
        <p key={i} className={`mb-4 last:mb-0 ${className}`}>{p}</p>
      ))}
    </>
  );
}

/* ── Parse chapter slug → number ── */
function parseChapterNum(chapter: string): number {
  const match = chapter.match(/(\d+)$/);
  return match ? parseInt(match[1], 10) : 1;
}

/* ══════════════════════════════════════
   Main ChapterClient
   ══════════════════════════════════════ */
export default function ChapterClient({ slug, chapter }: { slug: string; chapter: string }) {
  const { isLoading } = useLocale();
  const ns = useLocaleSection(slug);

  const cfg = SLUG_CONFIG[slug] || FALLBACK;
  const chapterNum = parseChapterNum(chapter);
  const vedaTitle = slug.replace(/\b\w/g, (c) => c.toUpperCase());

  // Find the specific chapter data from the chapters array
  const allChapters: Record<string, unknown>[] = Array.isArray(ns?.[cfg.chaptersKey]) ? ns[cfg.chaptersKey] : [];
  const chapterData = allChapters.find((c) => (c[cfg.numKey] as number) === chapterNum) || null;

  const title = typeof chapterData?.title === 'string' ? chapterData.title : `${cfg.itemLabel} ${chapterNum}`;
  const introduction = typeof chapterData?.introduction === 'string' ? chapterData.introduction : '';
  const scriptureText = typeof chapterData?.scripture_text === 'string' ? chapterData.scripture_text : '';
  const philoExplanation = typeof chapterData?.philosophical_explanation === 'string' ? chapterData.philosophical_explanation : '';

  // Prev / Next navigation
  const prevNum = chapterNum > 1 ? chapterNum - 1 : null;
  const nextNum = chapterNum < allChapters.length ? chapterNum + 1 : null;
  const prefixSlug = chapter.replace(/\d+$/, ''); // e.g. "mandala-"

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Vedas', href: '/vedas' },
    { label: vedaTitle, href: `/vedas/${slug}` },
    { label: `${cfg.itemLabel} ${chapterNum}` },
  ];

  if (isLoading && !chapterData) {
    return (
      <PageLayout metaKey={slug} title="" breadcrumbs={breadcrumbs} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey={slug} title={title} breadcrumbs={breadcrumbs} className="layout-md">

      {/* ═══════════ Hero ═══════════ */}
      <section className="relative overflow-hidden rounded-3xl border border-[#d8a25a]/30 bg-linear-to-br from-[#fffaf3] via-[#fdf0d7] to-[#fff8ef] p-6 md:p-10">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#f59e0b]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#c2410c]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          {/* Badge + Icon */}
          <div className="flex items-center gap-4 mb-6">
            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 ${cfg.borderAccent} bg-[#fffaf3] text-2xl shadow-[0_4px_20px_rgba(122,46,31,0.12)]`}>
              {cfg.icon}
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#a89278]">{vedaTitle}</span>
              <div className="flex items-center gap-3 mt-0.5">
                <span className={`flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br ${cfg.accentFrom} ${cfg.accentTo} text-xs font-extrabold text-[#fffaf0] shadow-[0_4px_20px_rgba(122,46,31,0.25)]`}>
                  {chapterNum}
                </span>
                <h2 className={`text-lg md:text-xl font-extrabold ${cfg.textAccent}`}>{cfg.itemLabel} {chapterNum}</h2>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#3d2e22] mb-3">{title}</h1>
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

      {/* ═══════════ Scripture Text ═══════════ */}
      {scriptureText && (
        <>
          <OrnamentDivider />
          <section className="relative overflow-hidden rounded-3xl border border-[#d8a25a]/30 bg-linear-to-br from-[#fffaf3] via-[#fef3e2] to-[#fbe8c8] p-6 md:p-10">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${cfg.accentFrom} ${cfg.accentVia} ${cfg.accentTo}`} />
            <div className={`absolute left-0 top-1 bottom-0 w-1 bg-linear-to-b ${cfg.accentFrom} ${cfg.accentTo}`} />

            <h2 className="text-2xl md:text-3xl font-extrabold bg-linear-to-r from-[#92400e] via-[#c2410c] to-[#ea580c] bg-clip-text text-transparent mb-6 pl-2">
              Scripture Text
            </h2>
            <div className="text-base text-[#5b2d12] leading-relaxed pl-2">
              <Paragraphs text={scriptureText} />
            </div>
          </section>
        </>
      )}

      {/* ═══════════ Philosophical Explanation ═══════════ */}
      {philoExplanation && (
        <>
          <OrnamentDivider />
          <section className="rounded-3xl border border-[#d8a25a]/20 bg-[#fffaf0] p-6 md:p-10 shadow-[0_8px_30px_rgba(146,64,14,0.06)]">
            <h2 className={`text-2xl md:text-3xl font-extrabold bg-linear-to-r ${cfg.accentFrom} ${cfg.accentVia} ${cfg.accentTo} bg-clip-text text-transparent mb-6`}>
              Philosophical Significance
            </h2>
            <div className="text-base text-[#5b2d12] leading-relaxed">
              <Paragraphs text={philoExplanation} />
            </div>
          </section>
        </>
      )}

      {/* ═══════════ Prev / Next Navigation ═══════════ */}
      <OrnamentDivider />
      <nav className="flex items-center justify-between gap-4">
        {prevNum ? (
          <Link
            href={`/vedas/${slug}/${prefixSlug}${prevNum}`}
            className="group flex items-center gap-2 rounded-2xl border border-[#d8a25a]/40 bg-[#fffaf0] px-5 py-3 shadow-[0_4px_20px_rgba(139,105,20,0.08)] hover:shadow-[0_8px_30px_rgba(166,61,23,0.14)] transition-all duration-300 hover:-translate-y-0.5"
          >
            <svg className="h-4 w-4 text-[#b45309] transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-semibold text-[#7a2e1f]">{cfg.itemLabel} {prevNum}</span>
          </Link>
        ) : <span />}

        <Link
          href={`/vedas/${slug}`}
          className="text-xs font-bold uppercase tracking-widest text-[#a89278] hover:text-[#92400e] transition-colors"
        >
          All {cfg.itemLabel}s
        </Link>

        {nextNum ? (
          <Link
            href={`/vedas/${slug}/${prefixSlug}${nextNum}`}
            className="group flex items-center gap-2 rounded-2xl border border-[#d8a25a]/40 bg-[#fffaf0] px-5 py-3 shadow-[0_4px_20px_rgba(139,105,20,0.08)] hover:shadow-[0_8px_30px_rgba(166,61,23,0.14)] transition-all duration-300 hover:-translate-y-0.5"
          >
            <span className="text-sm font-semibold text-[#7a2e1f]">{cfg.itemLabel} {nextNum}</span>
            <svg className="h-4 w-4 text-[#b45309] transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : <span />}
      </nav>

      {/* ═══════════ Other Chapters Quick Links ═══════════ */}
      {allChapters.length > 1 && (
        <>
          <OrnamentDivider />
          <section className="rounded-3xl border border-[#d8a25a]/20 bg-linear-to-br from-[#fffaf3] via-[#fef3e2] to-[#fbe8c8] p-6 md:p-8">
            <h3 className="text-lg font-extrabold text-[#3d2e22] mb-5 text-center">
              All {cfg.itemLabel}s of {vedaTitle}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {allChapters.map((ch) => {
                const n = ch[cfg.numKey] as number;
                const chTitle = typeof ch.title === 'string' ? ch.title : `${cfg.itemLabel} ${n}`;
                const isCurrent = n === chapterNum;
                return (
                  <Link
                    key={n}
                    href={`/vedas/${slug}/${prefixSlug}${n}`}
                    className={`group flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all duration-200 hover:-translate-y-0.5 ${isCurrent
                        ? `${cfg.borderAccent} bg-[#fffaf3] shadow-[0_4px_20px_rgba(122,46,31,0.15)]`
                        : 'border-[#edc98f]/50 bg-[#fffaf3] hover:shadow-[0_4px_20px_rgba(139,105,20,0.10)]'
                      }`}
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-extrabold ${isCurrent
                        ? `bg-linear-to-br ${cfg.accentFrom} ${cfg.accentTo} text-[#fffaf0] shadow-[0_2px_10px_rgba(122,46,31,0.25)]`
                        : 'bg-[#fde7c7]/60 text-[#92400e]'
                      }`}>
                      {n}
                    </span>
                    <span className={`text-[10px] font-semibold text-center leading-tight ${isCurrent ? cfg.textAccent : 'text-[#6b5d4f]'}`}>
                      {chTitle.length > 30 ? `${cfg.itemLabel} ${n}` : chTitle}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </>
      )}

      <div className="mt-10">
        <SimilarCategories />
      </div>
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
