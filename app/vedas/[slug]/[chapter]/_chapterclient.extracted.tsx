"use client";

import { useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import SimilarCategories from '@components/similar-categories/SimilarCategories';
import Link from 'next/link';

/* ── Per-veda configuration ── */
const page = {
  all: "All",
  details: "Details",
  hymns: "Hymns in this",
  introduc: "Introduction",
  of: "of",
  philosop_signific: "Philosophical Significance",
  s: "s in",
  s_1: "s",
  s_2: "s of",
  scriptur_text: "Scripture Text",
  view: "View"
};

type PerFileConfig = {
  mode: 'per-file';
  icon: string;
  accentFrom: string;
  accentVia: string;
  accentTo: string;
  textAccent: string;
  borderAccent: string;
  chapterPrefix: string;
  itemLabel: string;
  filePattern: string;
  totalItems: number;
};
type FromMainConfig = {
  mode: 'from-main';
  icon: string;
  accentFrom: string;
  accentVia: string;
  accentTo: string;
  textAccent: string;
  borderAccent: string;
  chapterPrefix: string;
  itemLabel: string;
  fileKey: string;
  listKey: string;
  idKey: string;
  detailFileKey?: string;
  detailListKey?: string;
  detailItemsKey?: string;
  detailItemLabel?: string;
  detailItemPrefix?: string;
};
type SlugConfig = PerFileConfig | FromMainConfig;
const SLUG_CONFIG: Record<string, SlugConfig> = {
  rigveda: {
    mode: 'per-file',
    icon: '🔥',
    accentFrom: 'from-[#7c2d12]',
    accentVia: 'via-[#c2410c]',
    accentTo: 'to-[#f59e0b]',
    textAccent: 'text-[#7c2d12]',
    borderAccent: 'border-[#c2410c]',
    chapterPrefix: 'mandala',
    itemLabel: 'Mandala',
    filePattern: 'vedas_rigveda_madala',
    totalItems: 10
  },
  yajurveda: {
    mode: 'from-main',
    icon: '🪔',
    accentFrom: 'from-[#92400e]',
    accentVia: 'via-[#d97706]',
    accentTo: 'to-[#fde68a]',
    textAccent: 'text-[#92400e]',
    borderAccent: 'border-[#d97706]',
    chapterPrefix: 'chapter',
    itemLabel: 'Chapter',
    fileKey: 'vedas_yajurveda',
    listKey: 'yajurveda_chapters',
    idKey: 'chapter',
    detailFileKey: 'vedas_yajurveda_structure',
    detailListKey: 'chapters',
    detailItemsKey: 'mantras',
    detailItemLabel: 'Mantra',
    detailItemPrefix: 'mantra'
  },
  samaveda: {
    mode: 'from-main',
    icon: '🎵',
    accentFrom: 'from-[#3b3270]',
    accentVia: 'via-[#8b6914]',
    accentTo: 'to-[#e0a632]',
    textAccent: 'text-[#3b3270]',
    borderAccent: 'border-[#8b6914]',
    chapterPrefix: 'hymn',
    itemLabel: 'Hymn',
    fileKey: 'vedas_samaveda',
    listKey: 'samaveda_sections',
    idKey: 'section'
  },
  atharvaveda: {
    mode: 'from-main',
    icon: '🌿',
    accentFrom: 'from-[#1a6e5c]',
    accentVia: 'via-[#b45309]',
    accentTo: 'to-[#f59e0b]',
    textAccent: 'text-[#1a6e5c]',
    borderAccent: 'border-[#b45309]',
    chapterPrefix: 'book',
    itemLabel: 'Book',
    fileKey: 'vedas_atharvaveda',
    listKey: 'atharvaveda_books',
    idKey: 'book',
    detailFileKey: 'vedas_atharvaveda_structure',
    detailListKey: 'books',
    detailItemsKey: 'hymns',
    detailItemLabel: 'Hymn',
    detailItemPrefix: 'hymn'
  }
};
const FALLBACK = SLUG_CONFIG.rigveda;

/* ── Ornamental divider ── */
function OrnamentDivider() {
  return <div className="flex items-center justify-center gap-3 my-10">
      <div className="h-px w-16 bg-linear-to-r from-transparent to-[#d8a25a]" />
      <span className="text-[#d97706] text-lg">◆</span>
      <div className="h-px w-16 bg-linear-to-l from-transparent to-[#d8a25a]" />
    </div>;
}

/* ── Paragraph renderer ── */
function Paragraphs({
  text,
  className = ''
}: {
  text: string;
  className?: string;
}) {
  return <>
      {text.split('\n\n').map((p, i) => <p key={i} className={`mb-4 last:mb-0 ${className}`}>{p}</p>)}
    </>;
}

/* ── Parse chapter slug → number ── */
function parseChapterNum(chapter: unknown): number {
  if (typeof chapter !== 'string') return 1;
  const match = chapter.match(/(\d+)$/);
  return match ? parseInt(match[1], 10) : 1;
}

/* ── Hymn card (accordion) ── */
function HymnCard({
  hymn,
  index,
  accentFrom,
  accentTo,
  detailHref,
  detailLabel
}: {
  hymn: Record<string, unknown>;
  index: number;
  accentFrom: string;
  accentTo: string;
  detailHref?: string;
  detailLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const num = (hymn.hymn_number ?? hymn.mantra_number ?? index + 1) as number;
  const title = typeof hymn.title === 'string' ? hymn.title : `Hymn ${num}`;
  const intro = typeof hymn.introduction === 'string' ? hymn.introduction : '';
  const scripture = typeof hymn.scripture_text === 'string' ? hymn.scripture_text : '';
  const philo = typeof hymn.philosophical_explanation === 'string' ? hymn.philosophical_explanation : '';
  const shells = ['bg-linear-to-br from-[#fffaf3] via-[#fef3e2] to-[#fbe8c8]', 'bg-linear-to-br from-[#fffbf5] via-[#fdf1dc] to-[#f8e4c0]', 'bg-linear-to-br from-[#fff9f0] via-[#fce9ce] to-[#f5d9ae]'];
  return <div className={`rounded-2xl border border-[#d8a25a]/30 overflow-hidden ${shells[index % 3]} transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(146,64,14,0.08)]`}>
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 p-4 md:p-5 text-left cursor-pointer">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${accentFrom} ${accentTo} text-xs font-extrabold text-[#fffaf0] shadow-[0_4px_20px_rgba(122,46,31,0.25)]`}>
          {num}
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm md:text-base font-bold text-[#3d2e22] truncate">{title}</h4>
        </div>
        <svg className={`h-4 w-4 text-[#b45309] shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && <div className="px-4 md:px-5 pb-5 pt-0 border-t border-[#edc98f]/40 space-y-4">
          {intro && <div className="mt-4">
              <p className="text-sm text-[#5b2d12] leading-relaxed">{intro}</p>
            </div>}
          {scripture && <div className="rounded-xl border border-[#edc98f]/50 bg-[#fffaf3] p-4">
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#a89278] mb-2">{page.scriptur_text}</h5>
              <div className="text-sm text-[#5b2d12] leading-relaxed">
                <Paragraphs text={scripture} />
              </div>
            </div>}
          {philo && <div className="rounded-xl border border-[#e0a632]/30 bg-[#fffaf3] p-4">
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#a89278] mb-2">{page.philosop_signific}</h5>
              <div className="text-sm text-[#5b2d12] leading-relaxed">
                <Paragraphs text={philo} />
              </div>
            </div>}
          {detailHref && <div className="text-right">
              <Link href={detailHref} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#b45309] hover:text-[#92400e] transition-colors"> {page.view} {detailLabel} {num} {page.details} <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>}
        </div>}
    </div>;
}

/* ══════════════════════════════════════
   Main ChapterClient
   ══════════════════════════════════════ */
export default function ChapterClient({
  slug,
  chapter
}: {
  slug: string;
  chapter: string;
}) {
  const {
    isLoading
  } = useLocale();
  const cfg = SLUG_CONFIG[slug] || FALLBACK;
  const chapterNum = parseChapterNum(chapter);
  const vedaTitle = slug.replace(/\b\w/g, c => c.toUpperCase());
  const fileKey = cfg.mode === 'per-file' ? `${cfg.filePattern}${chapterNum}` : cfg.fileKey;
  const ns = useLocaleSection(fileKey);
  const detailNs = useLocaleSection(cfg.mode === 'from-main' && cfg.detailFileKey ? cfg.detailFileKey : '');
  const hymns: Record<string, unknown>[] = cfg.mode === 'per-file' && Array.isArray(ns?.hymns) ? ns.hymns as Record<string, unknown>[] : [];
  const mainItems: Record<string, unknown>[] = cfg.mode === 'from-main' && Array.isArray((ns as Record<string, unknown> | null | undefined)?.[cfg.listKey]) ? ((ns as Record<string, unknown>)[cfg.listKey] as unknown[] || []).filter((x): x is Record<string, unknown> => !!x && typeof x === 'object') : [];
  const selectedMain = cfg.mode === 'from-main' ? mainItems.find(item => Number(item[cfg.idKey]) === chapterNum) : undefined;
  const detailRoot = cfg.mode === 'from-main' ? (detailNs?.[slug] ?? detailNs) as Record<string, unknown> : {};
  const detailContainer = cfg.mode === 'from-main' && cfg.detailListKey && Array.isArray(detailRoot?.[cfg.detailListKey]) ? detailRoot[cfg.detailListKey] as Record<string, unknown>[] : [];
  const selectedDetail = cfg.mode === 'from-main' && cfg.detailItemsKey ? detailContainer.find(entry => Number(entry[cfg.idKey]) === chapterNum) : undefined;
  const detailItems: Record<string, unknown>[] = cfg.mode === 'per-file' ? hymns : cfg.mode === 'from-main' && cfg.detailItemsKey && Array.isArray(selectedDetail?.[cfg.detailItemsKey]) ? selectedDetail[cfg.detailItemsKey] as Record<string, unknown>[] : [];
  const titleFromJson = cfg.mode === 'from-main' ? typeof selectedMain?.title === 'string' ? selectedMain.title : typeof ns?.title === 'string' ? ns.title : undefined : typeof ns?.title === 'string' ? ns.title : undefined;
  const descriptionFromJson = cfg.mode === 'from-main' ? typeof selectedMain?.introduction === 'string' ? selectedMain.introduction : typeof ns?.description === 'string' ? ns.description : undefined : typeof ns?.description === 'string' ? ns.description : undefined;
  const entryIntro = typeof selectedMain?.introduction === 'string' ? selectedMain.introduction : '';
  const entryScripture = typeof selectedMain?.scripture_text === 'string' ? selectedMain.scripture_text : '';
  const entryPhilo = typeof selectedMain?.philosophical_explanation === 'string' ? selectedMain.philosophical_explanation : '';
  const totalItems = cfg.mode === 'per-file' ? cfg.totalItems : mainItems.length;
  const prevNum = chapterNum > 1 ? chapterNum - 1 : null;
  const nextNum = totalItems > 0 && chapterNum < totalItems ? chapterNum + 1 : null;
  const breadcrumbs = [{
    label: 'Home',
    href: '/'
  }, {
    label: 'Vedas',
    href: '/vedas'
  }, {
    label: vedaTitle,
    href: `/vedas/${slug}`
  }, {
    label: `${cfg.itemLabel} ${chapterNum}`
  }];
  const pageTitle = titleFromJson || `${vedaTitle} – ${cfg.itemLabel} ${chapterNum}`;
  const hasContent = cfg.mode === 'per-file' ? !!titleFromJson || hymns.length > 0 : !!titleFromJson || !!entryIntro || !!entryScripture || !!entryPhilo || detailItems.length > 0;
  if (isLoading && !hasContent) {
    return <PageLayout metaKey={fileKey} title="" breadcrumbs={breadcrumbs} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>;
  }
  return <PageLayout metaKey={fileKey} title={pageTitle} breadcrumbs={breadcrumbs} className="layout-md">

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

          {/* Title + stats */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#3d2e22] mb-3">{pageTitle}</h1>
          {descriptionFromJson && <p className="text-base text-[#6b5d4f] leading-relaxed max-w-3xl">
              {descriptionFromJson}
            </p>}
          {hymns.length > 0 && <p className="text-base text-[#6b5d4f] mt-3">
              {hymns.length} {page.hymns} {cfg.itemLabel}
            </p>}
          {cfg.mode === 'from-main' && totalItems > 0 && <p className="text-base text-[#6b5d4f] mt-3">
              {totalItems} {cfg.itemLabel}{page.s} {vedaTitle}
            </p>}
        </div>
      </section>

      {/* ═══════════ Hymns / Mantras List ═══════════ */}
      {detailItems.length > 0 && <>
          <OrnamentDivider />
          <section>
            <h2 className={`text-2xl md:text-3xl font-extrabold bg-linear-to-r ${cfg.accentFrom} ${cfg.accentVia} ${cfg.accentTo} bg-clip-text text-transparent mb-8 text-center`}>
              {cfg.mode === 'from-main' ? cfg.detailItemLabel || 'Items' : 'Hymns'} {page.of} {cfg.itemLabel} {chapterNum}
            </h2>
            <div className="space-y-3">
              {detailItems.map((hymn, i) => {
            const itemNum = Number(hymn.hymn_number ?? hymn.mantra_number ?? i + 1);
            const itemPrefix = cfg.mode === 'from-main' ? cfg.detailItemPrefix || 'item' : 'hymn';
            const detailLabel = cfg.mode === 'from-main' ? cfg.detailItemLabel || 'Item' : 'Hymn';
            return <HymnCard key={i} hymn={hymn} index={i} accentFrom={cfg.accentFrom} accentTo={cfg.accentTo} detailLabel={detailLabel} detailHref={`/vedas/${slug}/${cfg.chapterPrefix}-${chapterNum}/${itemPrefix}-${itemNum}`} />;
          })}
            </div>
          </section>
        </>}

      {/* ═══════════ Chapter Entry Content (non-Rigveda) ═══════════ */}
      {cfg.mode === 'from-main' && (entryIntro || entryScripture || entryPhilo) && <>
          <OrnamentDivider />
          <section className="space-y-4">
            {entryIntro && <div className="rounded-2xl border border-[#d8a25a]/30 bg-[#fffaf3] p-5 md:p-6 shadow-[0_8px_30px_rgba(146,64,14,0.06)]">
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-[#a89278] mb-3">{page.introduc}</h2>
                <div className="text-base text-[#5b2d12] leading-relaxed">
                  <Paragraphs text={entryIntro} />
                </div>
              </div>}

            {entryScripture && <div className="rounded-2xl border border-[#edc98f]/50 bg-[#fffaf3] p-5 md:p-6">
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-[#a89278] mb-3">{page.scriptur_text}</h2>
                <div className="text-base text-[#5b2d12] leading-relaxed">
                  <Paragraphs text={entryScripture} />
                </div>
              </div>}

            {entryPhilo && <div className="rounded-2xl border border-[#e0a632]/30 bg-[#fffaf3] p-5 md:p-6">
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-[#a89278] mb-3">{page.philosop_signific}</h2>
                <div className="text-base text-[#5b2d12] leading-relaxed">
                  <Paragraphs text={entryPhilo} />
                </div>
              </div>}
          </section>
        </>}

      {/* ═══════════ Prev / Next Navigation ═══════════ */}
      <OrnamentDivider />
      <nav className="flex items-center justify-between gap-4">
        {prevNum ? <Link href={`/vedas/${slug}/${cfg.chapterPrefix}-${prevNum}`} className="group flex items-center gap-2 rounded-2xl border border-[#d8a25a]/40 bg-[#fffaf0] px-5 py-3 shadow-[0_4px_20px_rgba(139,105,20,0.08)] hover:shadow-[0_8px_30px_rgba(166,61,23,0.14)] transition-all duration-300 hover:-translate-y-0.5">
            <svg className="h-4 w-4 text-[#b45309] transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-semibold text-[#7a2e1f]">{cfg.itemLabel} {prevNum}</span>
          </Link> : <span />}

        <Link href={`/vedas/${slug}`} className="text-xs font-bold uppercase tracking-widest text-[#a89278] hover:text-[#92400e] transition-colors"> {page.all} {cfg.itemLabel}{page.s_1} </Link>

        {nextNum ? <Link href={`/vedas/${slug}/${cfg.chapterPrefix}-${nextNum}`} className="group flex items-center gap-2 rounded-2xl border border-[#d8a25a]/40 bg-[#fffaf0] px-5 py-3 shadow-[0_4px_20px_rgba(139,105,20,0.08)] hover:shadow-[0_8px_30px_rgba(166,61,23,0.14)] transition-all duration-300 hover:-translate-y-0.5">
            <span className="text-sm font-semibold text-[#7a2e1f]">{cfg.itemLabel} {nextNum}</span>
            <svg className="h-4 w-4 text-[#b45309] transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link> : <span />}
      </nav>

      {/* ═══════════ Other Chapters Quick Links ═══════════ */}
      {totalItems > 1 && <>
          <OrnamentDivider />
          <section className="rounded-3xl border border-[#d8a25a]/20 bg-linear-to-br from-[#fffaf3] via-[#fef3e2] to-[#fbe8c8] p-6 md:p-8">
            <h3 className="text-lg font-extrabold text-[#3d2e22] mb-5 text-center"> {page.all} {cfg.itemLabel}{page.s_2} {vedaTitle}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {Array.from({
            length: totalItems
          }, (_, i) => i + 1).map(n => {
            const isCurrent = n === chapterNum;
            return <Link key={n} href={`/vedas/${slug}/${cfg.chapterPrefix}-${n}`} className={`group flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all duration-200 hover:-translate-y-0.5 ${isCurrent ? `${cfg.borderAccent} bg-[#fffaf3] shadow-[0_4px_20px_rgba(122,46,31,0.15)]` : 'border-[#edc98f]/50 bg-[#fffaf3] hover:shadow-[0_4px_20px_rgba(139,105,20,0.10)]'}`}>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-extrabold ${isCurrent ? `bg-linear-to-br ${cfg.accentFrom} ${cfg.accentTo} text-[#fffaf0] shadow-[0_2px_10px_rgba(122,46,31,0.25)]` : 'bg-[#fde7c7]/60 text-[#92400e]'}`}>
                      {n}
                    </span>
                    <span className={`text-[10px] font-semibold text-center leading-tight ${isCurrent ? cfg.textAccent : 'text-[#6b5d4f]'}`}>
                      {cfg.itemLabel} {n}
                    </span>
                  </Link>;
          })}
            </div>
          </section>
        </>}
    </PageLayout>;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */