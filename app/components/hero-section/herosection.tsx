'use client';
import { useT } from '../../hooks/useT';
import { parseList } from 'lib/parseList';
import Link from 'next/link';
import styles from './herosection.module.scss';
import LazyImage from '../lazy-image/LazyImage';

export default function HeroSection() {
  const t = useT();
  const heading = parseList(t("home.hero.heading"));
  const subheading = parseList(t("home.hero.subheading"));
  const description = parseList(t("home.hero.description"));
  const primaryCtaLabel = parseList(t("home.hero.primarycta.label"));
  const primaryCtaLink = parseList(t("home.hero.primarycta.link"));
  const secondaryCtaLabel = parseList(t("home.hero.secondarycta.label"));
  const secondaryCtaLink = parseList(t("home.hero.secondarycta.link"));
  const scroll = parseList(t("home.hero.scroll"));
  const tags = parseList(t("home.topics"));

  return (
    <div className={`${styles.herosection} w-full md:h-full`}>
      <div className="relative content-wrapper md:min-h-130 md:flex md:items-center md:justify-center overflow-hidden">
        {/* LCP image as an actual <img> so it's discoverable by the browser */}
        <img
          className={styles.heroImage}
          src="/images/home/mobile-hero.png"
          srcSet="/images/home/hero.png 1024w, /images/home/mobile-hero.png 768w"
          sizes="(min-width: 1024px) 50vw, 100vw"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          alt=""
          aria-hidden="true"
        />
        <div className={`${styles.herocontent} w-full md:w-1/2`}>
          <h1 className={`${styles.title} md:text-shadow-lg/4 md:max-w-md`}>
            <span>{heading}</span> <br />
            <span className={`h3 md:max-w-md`}>{subheading}</span>
          </h1>
          <p className={`md:max-w-md`}>{description}</p>
          <div className="flex flex-col md:flex-row gap-4">
            <Link href={`/scriptures/${primaryCtaLink}`} className="btn btn-primary no-underline">
              {primaryCtaLabel}
            </Link>
            <Link href={`/${secondaryCtaLink}`} className="btn btn-outline no-underline">
              {secondaryCtaLabel}
            </Link>
          </div>
          <div className={`${styles.scrolltext} text-left`}>
            <LazyImage src="/images/svg/arrow.svg" alt="Scroll Down" width={16} height={16} className="inline-block animate-bounce" />
            <span>{scroll}</span>
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