'use client';
import { useT } from '../../hooks/useT';
import { useEffect, useState } from 'react';
import { getLocaleObject, loadLocaleNamespace } from '../../../lib/i18n';
import { useLocale } from '../../context/locale-context';
import { parseList } from 'lib/parseList';
import LazyImage from '../lazy-image/LazyImage';
import Link from 'next/link';
import Image from 'next/image';
import styles from './herosection.module.scss';

interface HeroSectionProps {
  isLoading?: boolean;
}

export default function HeroSection({ isLoading = false }: HeroSectionProps) {

  const t = useT();
  const { locale } = useLocale();

  const localeObj = getLocaleObject(locale) as any;
  const initialHero = (localeObj && localeObj.home && typeof localeObj.home === 'object')
    ? localeObj.home.hero || localeObj.home
    : {};

  const [hero, setHero] = useState<Record<string, any>>(initialHero || {});

  useEffect(() => {
    const obj = getLocaleObject(locale) as any;
    if (obj && obj.home && obj.home.hero) {
      setHero(obj.home.hero);
      return;
    }

    let cancelled = false;
    loadLocaleNamespace(locale, 'home').then((ns: any) => {
      if (cancelled) return;
      // `loadLocaleNamespace` may return the namespace object directly or the full locale
      const candidate = ns?.hero ? ns.hero : (ns?.home ? ns.home.hero : ns);
      if (candidate && typeof candidate === 'object') setHero(candidate);
    }).catch(() => { });
    return () => { cancelled = true; };
  }, [locale]);

  return (
    <div className={`${styles.herosection} w-full`} style={{ minHeight: '500px' }}>
      {/* LCP hero image - Mobile version */}
      <Image
        className={`${styles.heroImage} block md:hidden`}
        src="/images/home/mobile-hero.png"
        alt="Sanātana Dharma hero background"
        fill
        sizes="100vw"
        priority
        quality={90}
        style={{ objectFit: 'cover', zIndex: 0 }}
        unoptimized
      />
      {/* LCP hero image - Desktop version */}
      <Image
        className={`${styles.heroImage} hidden md:block`}
        src="/images/home/hero.png"
        alt="Sanātana Dharma hero background"
        fill
        sizes="100vw"
        priority
        quality={90}
        style={{ objectFit: 'cover', zIndex: 0 }}
        unoptimized
      />
      <div className="relative content-wrapper md:min-h-130 md:flex md:items-center md:justify-center">
        <div className={`${styles.herocontent} w-full md:w-1/2`}>
          <h1 className={`${styles.title} md:text-shadow-lg/4 md:max-w-md`}>
            <span>{hero?.heading}</span> <br />
            <span className={`h3 md:max-w-md`}>{hero?.subheading}</span>
          </h1>
          <p className={`md:max-w-md`}>{hero?.description}</p>
          <div className="flex flex-col md:flex-row gap-4">
            <Link href={hero?.primarycta?.link ? `/${hero.primarycta.link}` : '/scriptures'} className="btn btn-primary no-underline">
              {hero?.primarycta?.label || 'Explore'}
            </Link>
            <Link href={hero?.secondarycta?.link ? `/${hero.secondarycta.link}` : '/sanatanadharma'} className="btn btn-outline no-underline">
              {hero?.secondarycta?.label || 'Start Learning'}
            </Link>
          </div>
          <div className={`${styles.scrolltext} text-left`}>
            <LazyImage src="/images/svg/arrow.svg" alt="Scroll Down" width={16} height={16} className="inline-block animate-bounce" />
            <span>{hero?.scroll}</span>
          </div>
          {/* <div className="text-left mt-10">
            <ul className="md:flex md:gap-2 m-0! p-0!">
              {tags && tags.map((tag: any, idx: number) => (
                <li key={idx}>
                  <Link href={`/${tag}`} className="underline!">{tag}</Link>
                </li>
              ))}
            </ul>
          </div> */}
        </div>
        <div className="w-full md:w-1/2">
        </div>
      </div>
    </div>
  )
}