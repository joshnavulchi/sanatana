'use client';

import { useState } from 'react';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { parseList } from '@lib/parseList';
import Link from 'next/link';

/* ── Rotating temple tones for each yuga card ── */
const page = {
  cycle_time: "✦ Cycle of Time ✦",
  learn_more: "Learn more about Cosmic Time"
};

const YUGA_TONES = [{
  ring: 'border-[#d8a25a]',
  badge: 'bg-[#7a2e1f] text-[#fff4df]',
  accent: 'from-[#a63d17] via-[#d97706] to-[#f59e0b]',
  glow: 'shadow-[0_20px_50px_rgba(166,61,23,0.16)]',
  pillBg: 'bg-[#fff7ed]',
  numBg: 'bg-[#7a2e1f]'
}, {
  ring: 'border-[#c98a41]',
  badge: 'bg-[#92400e] text-[#fff7e6]',
  accent: 'from-[#92400e] via-[#c2410c] to-[#ea580c]',
  glow: 'shadow-[0_22px_48px_rgba(146,64,14,0.15)]',
  pillBg: 'bg-[#fffaf0]',
  numBg: 'bg-[#92400e]'
}, {
  ring: 'border-[#cf8f4f]',
  badge: 'bg-[#9a3412] text-[#fff3e0]',
  accent: 'from-[#7c2d12] via-[#c2410c] to-[#fb923c]',
  glow: 'shadow-[0_20px_44px_rgba(124,45,18,0.16)]',
  pillBg: 'bg-[#fff8f1]',
  numBg: 'bg-[#9a3412]'
}, {
  ring: 'border-[#d9a15d]',
  badge: 'bg-[#7c2d12] text-[#fff4df]',
  accent: 'from-[#7a2e1f] via-[#b45309] to-[#d97706]',
  glow: 'shadow-[0_22px_50px_rgba(122,46,31,0.16)]',
  pillBg: 'bg-[#fffaf2]',
  numBg: 'bg-[#7c2d12]'
}];
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
function YugaCard({
  gradientfrom,
  gradientto,
  name,
  subtitle,
  years,
  description,
  index,
  isVisible
}: YugaCardProps) {
  const tone = YUGA_TONES[index % YUGA_TONES.length];
  return <div className={`group relative flex flex-col overflow-hidden rounded-3xl border-2 ${tone.ring} ${tone.glow} transition-all duration-700 ease-out hover:-translate-y-1.5 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{
    transitionDelay: `${index * 160}ms`
  }}>
      {/* Top accent bar */}
      <div className={`h-1.5 w-full bg-linear-to-r ${tone.accent}`} />

      {/* Ornamental blurs */}
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#f4c98b]/30 blur-2xl" />
      <div className="absolute -left-4 bottom-4 h-14 w-14 rounded-full bg-[#d97706]/15 blur-2xl" />

      <div className="relative flex flex-1 flex-col p-6">
        {/* Roman numeral badge */}
        <div className="mb-4 flex items-center gap-3">
          <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${tone.numBg} text-sm font-black text-[#fff4df] tracking-wider`}>
            {ROMAN[index] || index + 1}
          </span>
          <div className="h-px flex-1 bg-linear-to-r from-[#d8a25a]/50 to-transparent" />
        </div>

        {/* Title */}
        <h3 className={`bg-linear-to-r ${tone.accent} bg-clip-text text-2xl font-black leading-tight text-transparent md:text-3xl`}>
          {name}
        </h3>

        {/* Subtitle */}
        <p className="mt-1 text-sm font-bold uppercase tracking-[0.25em] text-[#92400e]">
          {subtitle}
        </p>

        {/* Description points */}
        {description && description.length > 0 && <ul className="mt-5 flex flex-col gap-2">
            {description.map((point, i) => <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-[#5b2d12]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d97706]" />
                {point}
              </li>)}
          </ul>}

        {/* Years pill — pushed to bottom */}
        <div className="mt-auto pt-6">
          <span className={`inline-flex items-center gap-2 rounded-full border ${tone.ring} ${tone.pillBg} px-5 py-2 text-xs font-bold tracking-widest text-[#7a2e1f] transition-all duration-300 group-hover:shadow-[0_4px_16px_rgba(146,64,14,0.14)]`}>
            <svg className="h-3.5 w-3.5 text-[#d97706]" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {years}
          </span>
        </div>
      </div>
    </div>;
}
export default function OurFourCoreYugas() {
  const locale = useLocaleSection('home');
  const title = parseList(locale?.ourfourcoreyugastitle as any || '');
  const subtitle = parseList(locale?.ourfourcoreyugassubtitle as any || '');
  const yugas = Array.isArray(locale?.ourfourcoreyugas) ? locale!.ourfourcoreyugas : parseList(locale?.ourfourcoreyugas as any || '');
  const earthAgeComparisonNote = parseList(locale?.earth_age_comparison_note as any || '');
  const scalingComment = parseList(locale?.scaling_comment as any || '');
  const [isVisible] = useState(true);
  return <section className="relative overflow-hidden bg-linear-to-b from-[#fffaf1] via-[#fdf0d4] to-[#fff8ef] py-16 md:py-24">
      {/* Ornamental background shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#f3b86b]/15 blur-3xl animate-ping" />
        <div className="absolute -right-16 bottom-12 h-80 w-80 rounded-full bg-[#d97706]/15 blur-3xl animate-ping" />
        <div className="absolute left-1/2 top-0 h-32 w-[60%] -translate-x-1/2 rounded-b-full bg-[#f4c98b]/15 blur-3xl animate-ping" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
        {/* ─── Header ─── */}
        <div className={`mx-auto mb-14 max-w-4xl text-center transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Ornamental divider */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-[#d8a25a]" />
            <span className="text-2xl text-[#9a3412] animate-bounce" aria-hidden="true">🕉️</span>
            <div className="h-px w-16 bg-linear-to-l from-transparent to-[#d8a25a]" />
          </div>

          <h6 className="text-3xl md:text-4xl bg-linear-to-r from-[#a63d17] via-[#d97706] to-[#f59e0b] bg-clip-text font-black leading-tight text-transparent">
            {title}
          </h6>

          <p className="mt-6 text-base leading-8 text-[#5b2d12] md:text-lg">
            {subtitle}{' '}
            <Link href="/" className="group inline-flex items-center gap-1 text-[#9a3412] underline decoration-[#d97706]/40 underline-offset-4 transition-all duration-300 hover:text-[#7a2e1f] hover:decoration-[#d97706]" aria-label="Learn more about Cosmic Time"> {page.learn_more} <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </p>

          {/* Dot accent */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d97706]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#9a3412]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#d97706]" />
          </div>
        </div>

        {/* ─── Yuga Cards Grid ─── */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {yugas.map((y: any, idx: number) => <YugaCard key={y.name} gradientfrom={y.gradientfrom} gradientto={y.gradientto} name={y.name} subtitle={y.subtitle} years={y.years} description={y.description} index={idx} isVisible={isVisible} />)}
        </div>

        {/* ─── Bottom Notes ─── */}
        <div className={`mt-14 transition-all duration-1000 ease-out delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Divider */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-[#b45309]/50" />
            <span className="text-xs font-black uppercase tracking-[0.35em] text-[#92400e]"> {page.cycle_time} </span>
            <div className="h-px w-16 bg-linear-to-l from-transparent to-[#b45309]/50" />
          </div>

          {/* Highlight note */}
          {earthAgeComparisonNote && <div className="mx-auto max-w-3xl rounded-2xl border border-[#d8a25a]/50 px-6 py-5 text-center shadow-[0_16px_40px_rgba(166,61,23,0.10)]">
              <p className="bg-linear-to-r from-[#7a2e1f] via-[#9a3412] to-[#7a2e1f] bg-clip-text text-sm font-semibold leading-7 text-transparent md:text-lg">
                {earthAgeComparisonNote}
              </p>
            </div>}

          {scalingComment && <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-7 text-[#5b2d12] md:text-lg">
              {scalingComment}
            </p>}
        </div>
      </div>
    </section>;
}