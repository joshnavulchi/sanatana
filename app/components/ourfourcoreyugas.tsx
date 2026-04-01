'use client';

import { useState } from 'react';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { parseList } from '@lib/parse';
import Link from 'next/link';

/* ── Rotating temple tones for each yuga card ── */
const YUGA_TONES = [
  {
    ring: 'border-[#d8a25a]',
    badge: 'bg-[#7a2e1f] text-[#fff4df]',
    accent: 'from-[#a63d17] via-[#d97706] to-[#f59e0b]',
    glow: 'shadow-[0_20px_50px_rgba(166,61,23,0.16)]',
    pillBg: 'bg-[#fff7ed]',
    numBg: 'bg-[#7a2e1f]',
  },
  {
    ring: 'border-[#c98a41]',
    badge: 'bg-[#92400e] text-[#fff7e6]',
    accent: 'from-[#92400e] via-[#c2410c] to-[#ea580c]',
    glow: 'shadow-[0_22px_48px_rgba(146,64,14,0.15)]',
    pillBg: 'bg-[#fffaf0]',
    numBg: 'bg-[#92400e]',
  },
  {
    ring: 'border-[#cf8f4f]',
    badge: 'bg-[#9a3412] text-[#fff3e0]',
    accent: 'from-[#7c2d12] via-[#c2410c] to-[#fb923c]',
    glow: 'shadow-[0_20px_44px_rgba(124,45,18,0.16)]',
    pillBg: 'bg-[#fff8f1]',
    numBg: 'bg-[#9a3412]',
  },
  {
    ring: 'border-[#d9a15d]',
    badge: 'bg-[#7c2d12] text-[#fff4df]',
    accent: 'from-[#7a2e1f] via-[#b45309] to-[#d97706]',
    glow: 'shadow-[0_22px_50px_rgba(122,46,31,0.16)]',
    pillBg: 'bg-[#fffaf2]',
    numBg: 'bg-[#7c2d12]',
  },
];

const ROMAN = ['I', 'II', 'III', 'IV'];

interface YugaCardProps {
  name: string;
  subtitle: string;
  years: string;
  description?: string[];
  index: number;
  isVisible: boolean;
  gradientfrom: string;
  gradientto: string;
}

function YugaCard({ gradientfrom, gradientto, name, subtitle, years, description, index, isVisible }: YugaCardProps) {
  const tone = YUGA_TONES[index % YUGA_TONES.length];

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-3xl border-2 ${tone.ring} ${tone.glow} bg-gradient-to-br from-white/80 via-${gradientfrom} to-${gradientto} dark:from-gray-900/80 dark:via-${gradientfrom} dark:to-${gradientto} backdrop-blur-xl shadow-xl transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-2xl ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} delay-[${index * 160}ms]`}
    >
      {/* Top accent gradient border */}
      <div className={`h-[3px] w-full rounded-t-3xl bg-gradient-to-r ${tone.accent} shadow-md`} />

      {/* Ornamental blurs */}
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-yellow-200/40 to-pink-200/30 blur-2xl" />
      <div className="absolute -left-4 bottom-4 h-14 w-14 rounded-full bg-gradient-to-br from-orange-200/30 to-pink-100/20 blur-2xl" />

      <div className="relative flex flex-1 flex-col p-6 sm:p-8">
        {/* Roman numeral badge */}
        <div className="mb-5 flex items-center gap-4">
          <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 via-pink-400 to-indigo-400 shadow-lg text-lg font-black text-white tracking-widest border-4 border-white dark:border-gray-900`}>
            {ROMAN[index] || index + 1}
          </span>
          <div className="h-1 w-16 bg-linear-to-r from-indigo-300/40 to-transparent" />
        </div>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-extrabold leading-tight text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-pink-500 to-indigo-700 drop-shadow-xl">
          {name}
        </h3>

        {/* Subtitle */}
        <p className="mt-2 text-lg sm:text-base font-semibold uppercase tracking-widest text-indigo-700">
          {subtitle}
        </p>

        {/* Description points */}
        {description && description.length > 0 && (
          <ul className="mt-6 flex flex-col gap-3">
            {description.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-lg sm:text-base leading-relaxed text-gray-700 dark:text-gray-200">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-br from-amber-400 to-pink-400" />
                {point}
              </li>
            ))}
          </ul>
        )}

        {/* Years pill — pushed to bottom */}
        <div className="mt-auto pt-6">
          <span className={`inline-flex items-center gap-2 rounded-xl border-2 border-indigo-200 bg-gradient-to-r from-amber-50 via-pink-50 to-indigo-50 px-3 py-2 text-lg sm:text-base font-bold tracking-widest text-indigo-700 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-105`}>
            <svg className="h-4 w-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {years}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function OurFourCoreYugas() {
  const locale = useLocaleSection('home');
  const title = parseList((locale?.ourfourcoreyugastitle as any) || '');
  const subtitle = parseList((locale?.ourfourcoreyugassubtitle as any) || '');
  const yugas = Array.isArray(locale?.ourfourcoreyugas) ? locale!.ourfourcoreyugas : parseList((locale?.ourfourcoreyugas as any) || '');
  const earthAgeComparisonNote = parseList((locale?.earth_age_comparison_note as any) || '');
  const scalingComment = parseList((locale?.scaling_comment as any) || '');
  const [isVisible] = useState(true);

  return (
    <section className="relative bg-white/50 backdrop-blur-sm py-6 md:py-20 overflow-hidden">
      {/* Ornamental background shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-25 top-5 h-72 w-72 rounded-full bg-[#f3b86b]/10 blur-2xl animate-ping" />
        <div className="absolute -right-25 bottom-5 h-80 w-80 rounded-full bg-[#d97706]/10 blur-2xl animate-ping" />
        <div className="absolute left-1/2 top-0 h-32 w-[60%] -translate-x-1/2 rounded-b-full bg-[#f4c98b]/10 blur-2xl animate-ping" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
        {/* ─── Header ─── */}
        <div className={`mx-auto mb-8 max-w-4xl text-center transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
          {/* Ornamental divider */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-[#d8a25a]" />
            <span className="text-2xl text-[#9a3412] animate-bounce" aria-hidden="true">🕉️</span>
            <div className="h-px w-16 bg-linear-to-l from-transparent to-[#d8a25a]" />
          </div>

          <h6 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-rose-600 to-indigo-700 drop-shadow-xl">
            {title}
          </h6>

          <p className="mt-4 text-lg sm:text-base leading-relaxed text-gray-700">
            {subtitle}{' '}
            <Link
              href="/"
              className="group inline-flex items-center gap-1 text-[#9a3412] underline decoration-[#d97706]/40 underline-offset-4 transition-all duration-300 hover:text-[#7a2e1f] hover:decoration-[#d97706]"
              aria-label="Learn more about Cosmic Time"
            >
              Learn more about Cosmic Time
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </p>

          {/* Dot accent */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d97706]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#9a3412]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#d97706]" />
          </div>
        </div>

        {/* ─── Yuga Cards Grid ─── */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {yugas.map((y: any, idx: number) => (
            <YugaCard
              key={y.name}
              gradientfrom={y.gradientfrom}
              gradientto={y.gradientto}
              name={y.name}
              subtitle={y.subtitle}
              years={y.years}
              description={y.description}
              index={idx}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* ─── Bottom Notes ─── */}
        <div className={`mt-10 transition-all duration-1000 ease-out delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Divider */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-[#b45309]/50" />
            <span className="text-lg sm:text-base font-black uppercase tracking-[0.35em] text-[#92400e]">
              ✦ Cycle of Time ✦
            </span>
            <div className="h-px w-16 bg-linear-to-l from-transparent to-[#b45309]/50" />
          </div>

          {/* Highlight note */}
          {earthAgeComparisonNote && (
            <div className="mx-auto max-w-5xl bg-black/5 rounded-md border border-[#d8a25a]/15 p-4 text-center shadow-[0_2px_5px_rgba(166,61,23,0.10)]">
              <p className="bg-linear-to-r from-[#7a2e1f] via-[#9a3412] to-[#7a2e1f] bg-clip-text text-lg sm:text-base leading-relaxed">
                {earthAgeComparisonNote}
              </p>
            </div>
          )}

          {scalingComment && (
            <p className="mx-auto mt-5 max-w-4xl text-center text-lg sm:text-base leading-relaxed text-[#5b2d12]">
              {scalingComment}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}