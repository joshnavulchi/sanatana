'use client';
import { useT } from '../../hooks/useT';
import { parseList } from 'lib/parseList';
import Link from 'next/link';
import styles from './herosection.module.scss';

export default function HeroSection() {
  const t = useT();
  const heading = parseList(t("home.hero.heading"));
  const subheading = parseList(t("home.hero.subheading"));
  const description = parseList(t("home.hero.description"));
  const primaryCtaLabel = parseList(t("home.hero.primaryCta.label"));
  const primaryCtaLink = parseList(t("home.hero.primaryCta.link"));
  const secondaryCtaLabel = parseList(t("home.hero.secondaryCta.label"));
  const secondaryCtaLink = parseList(t("home.hero.secondaryCta.link"));
  const tags = parseList(t("home.topics")); 

  return (
    <div className={`${styles.herosection} w-full md:h-full`}>
      <div className="relative content-wrapper md:min-h-130 md:flex md:items-center md:justify-center overflow-hidden">
        <div className={`${styles.herocontent} w-full md:w-1/2 text-center`}>
          <h1 className={`title site-title md:max-w-md`}>{heading}</h1>
          <p className={`subtitle site-subtitle font-semibold md:max-w-md`}>{subheading}</p>
          <p className={`description md:max-w-md`}>{description}</p>
          <div className="flex flex-col md:flex-row gap-4">
            <Link href={`/scriptures/${primaryCtaLink}`} className="button inline-block shadow-sm bg-amber-300 hover:bg-amber-400 no-underline">
              {primaryCtaLabel}
            </Link>
            <Link href={`${secondaryCtaLink}`} className="button inline-block shadow-sm bg-white/75 hover:bg-white no-underline">
              {secondaryCtaLabel}
            </Link>
          </div>
          <div className="text-left mt-10">
            <ul className="flex gap-2 m-0! p-0!">
              {tags && tags.map((tag: any, idx: number) => (
                <li key={idx} className="text-sm!">
                  <Link href={`/${tag}`} className="underline!">{tag}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full md:w-1/2">
        </div>
      </div>
    </div>
  )
}