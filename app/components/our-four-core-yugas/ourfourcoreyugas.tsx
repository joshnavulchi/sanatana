'use client';

import { useState, useEffect } from 'react';
import useLocaleSection from '../../hooks/useLocaleSection';
import { parseList } from 'lib/parseList';
import Link from 'next/link';

const Segment = ({ title, subtitle, years, isFirst, isLast, index }: any) => {
  const [isVisible] = useState(true);
  return (
    <div className={`relative flex flex-col items-center transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
      {/* Arrow segment with enhanced design */}
      <div className={[
        "group relative",
        "text-white",
        "shadow-2xl hover:shadow-3xl",
        "transition-all duration-500",
        "hover:-translate-y-2",
        // Arrow shape via clip-path polygon
        !isFirst && !isLast
          ? "clip-path-[polygon(0%_0%,85%_0%,100%_50%,85%_100%,0%_100%,7%_50%)]"
          : isFirst
            ? "clip-path-[polygon(0%_0%,85%_0%,100%_50%,85%_100%,0%_100%)]"
            : "clip-path-[polygon(0%_0%,85%_0%,100%_50%,85%_100%,0%_100%,0%_50%)]",
        // Gradient backgrounds
        "bg-gradient-to-br from-amber-600/90 via-orange-600/90 to-red-700/90",
        "hover:from-amber-500 hover:via-orange-500 hover:to-red-600",
        // Backdrop blur
        "backdrop-blur-sm",
        // Border effects
        "ring-2 ring-white/20 group-hover:ring-white/40",
        "ring-offset-2 ring-offset-transparent",
        // Inner glow
        "before:absolute before:inset-0",
        "before:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.25),transparent_70%)]",
        "before:pointer-events-none",
        "before:opacity-50 group-hover:before:opacity-100",
        "before:transition-opacity before:duration-500",
      ].join(" ")}>
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </div>

        {/* Title + subtitle container */}
        <div className="relative flex items-center gap-3 px-6 py-6 md:px-8 md:py-8">
          {/* Arrow glyph */}
          {!isFirst && (
            <span className="hidden sm:inline-block text-white/80 group-hover:text-white transition-colors duration-300">
              <svg width="24" height="24" viewBox="0 0 24 24" className="animate-pulse">
                <path
                  d="M3 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}

          <div className="text-center sm:text-left">
            <h6 className="text-2xl
              font-light tracking-wide
              drop-shadow-lg group-hover:scale-105 transition-transform duration-300 m-0">
              {title}
            </h6>
            <p className="text-lg md:text-base font-light text-white/90 group-hover:text-white
              transition-colors duration-300 my-6">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Corner decorative elements */}
        <div className="absolute top-2 right-4 w-2 h-2 bg-white/40 rounded-full group-hover:scale-150 group-hover:bg-white/60 transition-all duration-300" />
        <div className="absolute bottom-2 left-4 w-1.5 h-1.5 bg-white/30 rounded-full group-hover:scale-150 group-hover:bg-white/50 transition-all duration-300" />
      </div>

      {/* Years badge */}
      <div className="
        relative mt-4 px-6 py-2
        bg-white/10 backdrop-blur-md
        border border-white/20
        rounded-full
        text-white/90
        text-xs sm:text-sm
        font-medium tracking-wide
        shadow-lg
        hover:bg-white/20 hover:scale-105
        transition-all duration-300
      ">
        {years}
      </div>

      {/* Connecting line */}
      {!isLast && (
        <div className="
          absolute top-full mt-4 md:top-1/2 md:left-full md:mt-0 md:ml-4
          w-0.5 h-8 md:w-8 md:h-0.5
          bg-gradient-to-b md:bg-gradient-to-r from-white/50 to-white/20
          animate-pulse
        " />
      )}
    </div>
  );
};


export default function OurFourCoreYugas() {
  const locale = useLocaleSection('home');
  const title = parseList((locale?.ourfourcoreyugastitle as any) || '');
  const subtitle = parseList((locale?.ourfourcoreyugassubtitle as any) || '');
  const yugas = Array.isArray(locale?.ourfourcoreyugas) ? locale!.ourfourcoreyugas : parseList((locale?.ourfourcoreyugas as any) || '');
  const [isVisible] = useState(true);

  return (
    <section className="relative px-3 bg-[radial-gradient(120%_120%_at_50%_0%,#8a3a31_10%,#b25435_40%,#502a26_100%)] text-center py-20 md:py-32 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="w-full md:mx-auto md:max-w-7xl relative z-10 px-6">
        {/* Header Section */}
        <div
          className={`mb-16 md:mb-24 transition-all duration-1000 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          `}>
          {/* Decorative top accent */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-400" />
            <span className="text-3xl text-amber-300 animate-bounce">🕉️</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-400" />
          </div>

          <h6 className="text-3xl md:text-4xl font-light text-amber-200 drop-shadow-2xl [text-shadow:_2px_2px_8px_rgb(0_0_0_/_80%)] my-6">
            {title}
          </h6>

          <div className="mx-auto max-w-5xl">
            <p className="text-md md:text-lg text-white/90 leading-relaxed">
              {subtitle}{' '}
              <Link
                href="/cosmictime"
                className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 underline underline-offset-4 decoration-2 decoration-amber-400/50 hover:decoration-amber-400 font-semibold transition-all duration-300 group"
                aria-label="Learn more about Cosmic Time"
              >
                Learn more about Cosmic Time
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </p>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
          </div>
        </div>

        {/* Yugas Timeline Container */}
        <div className="relative w-full flex flex-col md:flex-row md:items-center md:justify-center gap-16 md:gap-8 lg:gap-12">
          {/* Background connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-y-1/2" />

          {/* Yugas Segments */}
          {yugas.map((y, idx) => (
            <Segment
              key={y.name}
              title={y.name}
              subtitle={y.subtitle}
              years={y.years}
              gradientFrom={y.gradientFrom}
              gradientTo={y.gradientTo}
              isFirst={idx === 0}
              isLast={idx === yugas.length - 1}
              index={idx}
            />
          ))}
        </div>

        {/* Bottom decorative accent */}
        <div
          className={`
            mt-16 flex items-center justify-center gap-3
            transition-all duration-1000 ease-out delay-700
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          `}
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-orange-400" />
          <span className="text-orange-300 text-sm font-light tracking-widest">✦ CYCLE OF TIME ✦</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-orange-400" />
        </div>
      </div>

      {/* Soft vignette overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_50%,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
    </section>
  )
}