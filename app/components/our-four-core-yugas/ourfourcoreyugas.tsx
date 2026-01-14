'use client';

import { useT } from '../../hooks/useT';
import { parseList } from 'lib/parseList';
import styles from './ourfourcoreyugas.module.scss';

const Segment = ({ title, subtitle, years, gradientFrom, gradientTo, isFirst, isLast, }: any) => {
  return (
    <div className="relative flex flex-col items-center">
      {/* Arrow segment */}
      <div className={["relative text-white", "bg-gradient-to-r", gradientFrom, gradientTo,
        "shadow-lg/60", "drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]",
        // Arrow shape via clip-path polygon
        // left square + center rectangle + right trapezoid arrow tip
        // tweak values for sharper tip or taller body
        !isFirst && !isLast
          ? "clip-path-[polygon(0%_0%,85%_0%,100%_50%,85%_100%,0%_100%,7%_50%)]"
          : isFirst
            ? "clip-path-[polygon(0%_0%,85%_0%,100%_50%,85%_100%,0%_100%)]"
            : "clip-path-[polygon(0%_0%,85%_0%,100%_50%,85%_100%,0%_100%,0%_50%)]",
        // Soft inner highlight (using pseudo overlay)
        "before:absolute before:inset-0 before:rounded-[0.5rem]", "before:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.20),transparent_60%)]", "before:pointer-events-none",
        // Subtle border glow
        "ring-1 ring-white/10",
      ].join(" ")}>
        {/* Title + subtitle */}
        <div className={`${styles.boxarrow} flex items-center before:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.20),transparent_60%)`}>
          {/* Optional tiny feather/arrow glyph on left */}
          {!isFirst && (
            <span className="hidden sm:inline-block text-white/70">
              {/* minimalist arrow glyph */}
              <svg width="22" height="22" viewBox="0 0 24 24" className="opacity-80">
                <path
                  d="M3 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
          <div className={`${styles.arrow} text-center sm:text-left`}>
            <div className={`${styles.title} tracking-wide drop-shadow-[0_1px_0_rgba(0,0,0,0.25)]`}>
              {title}
            </div>
            <div className={`${styles.subtitle} text-white/80`}>
              {subtitle}
            </div>
          </div>
        </div>
      </div>

      {/* Years below segment */}
      <div className={`${styles.years} text-white/90 text-xs sm:text-sm tracking-wide`}>
        {years}
      </div>

      {/* Vertical divider between rows (optional aesthetic) */}
      {!isLast && (
        <div className={`absolute bg-white/50  ${styles.yearsafterline}`} />
      )}
    </div>
  );
};


export default function OurFourCoreYugas() {
  const t = useT();
  const title = parseList(t("home.ourfourcoreyugastitle"));
  const subtitle = parseList(t("home.ourfourcoreyugassubtitle"));
  const yugas = parseList(t("home.ourfourcoreyugas"));
  return (
    <section className={`bg-[radial-gradient(120%_120%_at_50%_0%,#8a3a31_10%,#b25435_40%,#502a26_100%)] text-center ${styles.ourFourCoreYugas} ? ${styles.ourFourCoreYugas} : ''`}>
      <div className="max-w-7xl mx-auto relative overflow-hidden">
        <p className={`${styles.title} text-shadow-lg/14 text-3xl! text-white`}>{title}</p>
        <p className={`${styles.subtitle} mx-auto max-w-6xl mb-12! text-white`}>{subtitle}</p>
        {/* Container */}
        <div className={`${styles.boxarrowwrapper} relative w-full flex flex-col md:flex-row md:items-center md:justify-center gap-10 md:gap-0`}>
          {/* Thin line behind segments */}
          <div className={`${styles.bgline} md:absolute md:bg-white/20`} />
          {/* Segments row */}
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
            />
          ))}
        </div>
        {/* Optional soft vignette edges */}
        {/* <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_0%,rgba(0,0,0,0.25)_80%)]" /> */}
      </div>
    </section>
  )
}