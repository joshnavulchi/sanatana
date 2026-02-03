'use client';
import { useEffect, useState } from 'react';
import { loadLocaleNamespace } from '../../../lib/i18n';
import { useLocale } from '../../context/locale-context';
import { parseList } from 'lib/parseList';
import LazyImage from '../lazy-image/LazyImage';
import Link from 'next/link';
import Image from 'next/image';

interface HeroSectionProps {
  isLoading?: boolean;
}

export default function HeroSection({ isLoading = false }: HeroSectionProps) {

  const { locale } = useLocale();
  const [hero, setHero] = useState<Record<string, any>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadLocaleNamespace(locale, 'home').then((ns: any) => {
      setIsVisible(true);
      if (cancelled) return;
      const candidate = ns?.hero ? ns.hero : (ns?.home ? ns.home.hero : ns);
      if (candidate && typeof candidate === 'object') setHero(candidate);
    }).catch(() => { });
    return () => { cancelled = true; };
  }, [locale]);

  return (
    <div className="relative w-full min-h-[600px] px-3 overflow-hidden">
      {/* Background Images with Overlay */}
      <div className="absolute inset-0">
        {/* Mobile hero image */}
        <Image
          className="block md:hidden"
          src="/images/home/mobile-hero.png"
          alt="Sanātana Dharma hero background"
          fill
          sizes="100vw"
          priority
          quality={90}
          style={{ objectFit: 'cover', backgroundPosition: 'top right' }}
          unoptimized
        />
        {/* Desktop hero image */}
        <Image
          className="hidden md:block"
          src="/images/home/hero.png"
          alt="Sanātana Dharma hero background"
          fill
          sizes="100vw"
          priority
          quality={90}
          style={{ objectFit: 'cover', backgroundPosition: 'top right' }}
          unoptimized
        />
        {/* Gradient Overlays for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
      </div>

      {/* Animated decorative elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content Container */}
      <div className="relative z-10 md:mx-auto md:max-w-6xl flex items-center">
        <div className="w-full flex flex-col md:flex-row items-center py-16 md:py-32 md:gap-12">
          {/* Left Content */}
          <div className={`hidden md:flex items-center justify-center transition-all duration-1000 ease-out delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-600/20 blur-3xl rounded-full" />

              {/* Decorative card */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                {/* Om symbol large */}
                <div className="text-center space-y-6">
                  <div className="text-9xl text-amber-300/80 font-serif animate-pulse">ॐ</div>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                  <p className="text-white/90 text-xl font-serif italic">सत्यमेव जयते</p>
                  <p className="text-amber-200 text-sm">Truth Alone Triumphs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Decorative Card */}
          <div className={`w-full transition-all text-center duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="flex flex-col items-center md:mx-auto md:max-w-2xl">
              {/* Om Symbol Accent */}
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
                <span className="text-3xl text-amber-400 animate-pulse">ॐ</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
              </div>
              {/* Decorative dots */}
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
            </div>


            {/* Main Heading */}
            <div className="flex flex-col md:mx-auto md:max-w-3xl">
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-2xl [text-shadow:_2px_2px_8px_rgb(0_0_0_/_80%)] mt-6">
                {hero?.heading || 'Sanātana Dharma'}
              </h3>
              <h4 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-amber-300 leading-snug drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_60%)]">
                {hero?.subheading || 'Eternal Wisdom'}
              </h4>

              {/* Description */}
              <p className="text-sm md:text-lg lg:text-xl text-gray-100 drop-shadow-lg [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%)] mt-6">
                {hero?.description || 'Discover the timeless teachings and sacred wisdom of ancient India'}
              </p>

              {/* CTA Buttons */}
              <div className="w-full text-center flex flex-col md:flex-row md:justify-center gap-4 mt-6">
                <Link href={hero?.primarycta?.link ? `/${hero.primarycta.link}` : '/scriptures'}
                  className="group relative md:inline-flex px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600
                    hover:from-amber-600 hover:to-orange-700 text-white text-lg rounded-full shadow-xl hover:shadow-2xl
                    transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 no-underline overflow-hidden">
                  <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                  <span className="relative flex items-center justify-center gap-2">
                    {hero?.primarycta?.label || 'Explore Scriptures'}
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>

                <Link
                  href={hero?.secondarycta?.link ? `/${hero.secondarycta.link}` : '/sanatanadharma'}
                  className="group md:inline-flex px-8 py-4 bg-white/10 backdrop-blur-md
                    hover:bg-white/20 border-2 border-white/50 hover:border-white
                    text-white text-lg rounded-full shadow-lg hover:shadow-xl
                    transition-all duration-300 transform hover:-translate-y-1 no-underline">
                  <span className="flex items-center justify-center gap-2">
                    {hero?.secondarycta?.label || 'Start Learning'}
                    <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </span>
                </Link>
              </div>

              {/* Scroll Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                <LazyImage src="/images/svg/arrow.svg" alt="Scroll Down" width={16} height={16} className="inline-block text-amber-200 animate-bounce" />
                <span className="text-sm font-medium drop-shadow-md text-amber-200">{hero?.scroll || 'Scroll to explore'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom decorative border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
    </div>
  )
}