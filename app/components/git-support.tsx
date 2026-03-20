"use client"
// import { useState, useEffect } from 'react';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Link from 'next/link';
import WorldMapAnimated from './worldmap/worldmapanimate';

export default function GitSupport({ locale }: { locale?: string }) {
  const loc = useLocaleSection('home');
  const isVisible = true;
  // const [isVisible, setIsVisible] = useState(false);

  // useEffect(() => {
  // setIsVisible(true);
  // }, []);

  return (
    <section className="gradient-background map-wrapper md:min-h-screen relative z-0 py-6 md:py-0 overflow-hidden">
      <WorldMapAnimated
        stroke="#ffffff"
        fill="#000000"
        fillOpacity={0.25}
        borderWidth={0.7}
        loopSpeed={6}
        stagger={16}
        fillPulse={true}
        pauseOnHover={true}
        scale={0.19}
        showGraticule={false}
      />

      {/* Overlay gradient for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/50 pointer-events-none" />

      {/* Animated decorative elements */}
      <div className="hidden! absolute top-1/4 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="hidden! absolute bottom-1/3 left-1/3 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      {/* Content Container */}
      <div className={`relative z-1 md:content-wrapper md:absolute md:top-1/2 md:left-20 md:-translate-y-1/2 p-3 md:px-0 md:py-0 transition-all duration-1000 ease-out
          ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
        {/* Card with glass-morphism effect */}
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 md:p-8 shadow-2xl max-w-2xl overflow-hidden group text-white">
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* GitHub icon decoration */}
          <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
            <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative">
            {/* Decorative top accent */}
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
              <span className="text-2xl text-amber-400">⚡</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
            </div>

            {/* Title */}
            <h6 className="text-xl md:text-2xl font-light leading-tight drop-shadow-2xl">
              {loc?.cta?.title || 'Contribute'}
            </h6>

            {/* Subtitle */}
            <p className="text-base md:text-md leading-relaxed drop-shadow-lg my-4">
              {loc?.cta?.subtitle || ''}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="https://github.com/vulchivijay/sanatana"
                target="_blank"
                className="group/btn relative px-4 md:px-8 py-3
                  bg-white/90 hover:bg-white  text-base md:text-md
                  rounded-full shadow-xl hover:shadow-2xl
                  transition-all duration-300 transform hover:-translate-y-1 hover:scale-105
                  no-underline overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-500" />
                <span className="relative flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="#000000" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span className="text-black">{loc?.cta?.contribute || 'Contribute'}</span>
                  <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="#000" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              <Link
                href="https://github.com/vulchivijay/sanatana"
                target="_blank"
                className="group/btn px-4 md:px-8 py-3
                  bg-transparent border-2 border-white/50 hover:border-white
                  text-white text-base md:text-md rounded-full
                  shadow-lg hover:shadow-xl transition-all duration-300
                  transform hover:-translate-y-1 no-underline
                  backdrop-blur-sm">
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {loc?.cta?.guidelines || 'Guidelines'}
                  <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* Decorative corner accents */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-400/20 to-transparent rounded-tl-full" />
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-transparent rounded-br-full" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute -z-1 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="absolute top-2 inset-2 md:top-0 md:-inset-2 w-4 h-4 bg-amber-400 rounded-full animate-ping" />
          <div className="absolute bottom-0 right-0 md:-bottom-2 md:-right-2 w-6 h-6 bg-orange-400 rounded-full animate-pulse" />
          <div className="absolute -bottom-1 -right-1 md:-bottom-3 md:-right-3 w-8 h-8 bg-orange-400 rounded-full animate-ping" />
          <div className="absolute -top-3 right-1/2 translate-x-1/2 md:-top-6 md:right-24 w-6 h-6 bg-amber-500 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}