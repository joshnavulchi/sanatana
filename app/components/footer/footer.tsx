/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useT } from '../../hooks/useT';
import LazyImage from '../lazy-image/LazyImage';
import styles from './footer.module.scss';

export default function Footer() {
  const t = useT();
  const pathname = usePathname();

  const normalize = (p?: string) => {
    if (!p) return "/";
    if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
    return p;
  };
  const isActive = (href: string) => normalize(pathname) === normalize(href);

  const getNav = (path: string) => {
    try {
      const raw = t(path);
      if (!raw) return {};
      if (typeof raw === 'string') {
        try { return JSON.parse(raw); } catch { return {} }
      }
      return raw as Record<string, string>;
    } catch (e) {
      return {};
    }
  };

  const title = t('footer.title');
  const quote = t('footer.quote');
  const quoteSource = t('footer.quotesource');
  const contactLabel = t('footer.contact');
  const donateLabel = t('footer.donate');
  const disclaimer = t('footer.disclaimer');
  const contentChange = t('footer.contentchange');
  const privacy = t('footer.privacy');
  const terms = t('footer.terms');
  const copyright = t('footer.copyright');

  const scriptures = getNav('footer.nav.scriptures.nav');
  const stotras = getNav('footer.nav.stotrasmantras.nav');
  const philosophy = getNav('footer.nav.philosophy.nav');
  const practices = getNav('footer.nav.practices.nav');
  const stories = getNav('footer.nav.stories.nav');
  const kidszone = getNav('footer.nav.kidszone.nav');
  const others = getNav('footer.nav.others.nav');

  const scripturesTitle = t('footer.nav.scriptures.title');
  const stotrasTitle = t('footer.nav.stotrasmantras.title');
  const philosophyTitle = t('footer.nav.philosophy.title');
  const practicesTitle = t('footer.nav.practices.title');
  const storiesTitle = t('footer.nav.stories.title');
  const kidszoneTitle = t('footer.nav.kidszone.title');
  const othersTitle = t('footer.nav.others.title');

  return (
    <footer className={`${styles.footer} gradient-background w-full`}>
      <div className={`relative z-29`}>
        <section className="content-wrapper text-center">
          <p className={`h2 font-light! text-shadow-lg/14 title`}>{title}</p>
          <p>{quote} {quoteSource}</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/contact" className={`btn btn-outline no-underline`}>
              {contactLabel}
            </Link>
            <Link href="/donate" className={`btn btn-outline no-underline`}>
              {donateLabel}
            </Link>
          </div>
        </section>

        <div className={`${styles.navWrapper} w-full relative z-10 flex flex-col md:flex-row md:items-start md:justify-between border-t`}>
          <nav role="menu" className="md:w-full gap-4 flex flex-col  md:flex-row md:items-start">
            <div className="md:w-1/7 flex flex-col gap-2">
              <p className="description underline">{scripturesTitle}</p>
              {Object.entries(scriptures).map(([key, val]) => {
                if (typeof val !== 'string') return null;
                const href = key === 'home' ? '/' : `/scriptures/${key}`;
                return (
                  <Link key={key} href={href} className={isActive(href) ? 'active' : ''} role="menuitem">
                    {val}
                  </Link>
                );
              })}
            </div>

            <div className="md:w-1/7 flex flex-col gap-2">
              <p className="description underline">{stotrasTitle}</p>
              {Object.entries(stotras).map(([key, val]) => {
                if (typeof val !== 'string') return null;
                const href = key === 'home' ? '/' : `/stotrasmantras/${key}`;
                return (
                  <Link key={key} href={href} className={isActive(href) ? 'active' : ''} role="menuitem">
                    {val}
                  </Link>
                );
              })}
            </div>

            <div className="md:w-1/7 flex flex-col gap-2">
              <p className="description underline">{philosophyTitle}</p>
              {Object.entries(philosophy).map(([key, val]) => {
                if (typeof val !== 'string') return null;
                const href = key === 'home' ? '/' : `/philosophy/${key}`;
                return (
                  <Link key={key} href={href} className={isActive(href) ? 'active' : ''} role="menuitem">
                    {val}
                  </Link>
                );
              })}
            </div>

            <div className="md:w-1/7 flex flex-col gap-2">
              <p className="description underline">{practicesTitle}</p>
              {Object.entries(practices).map(([key, val]) => {
                if (typeof val !== 'string') return null;
                const href = key === 'home' ? '/' : `/practices/${key}`;
                return (
                  <Link key={key} href={href} className={isActive(href) ? 'active' : ''} role="menuitem">
                    {val}
                  </Link>
                );
              })}
            </div>

            <div className="md:w-1/7 flex flex-col gap-2">
              <p className="description underline">{storiesTitle}</p>
              {Object.entries(stories).map(([key, val]) => {
                if (typeof val !== 'string') return null;
                const href = key === 'home' ? '/' : `/stories/${key}`;
                return (
                  <Link key={key} href={href} className={isActive(href) ? 'active' : ''} role="menuitem">
                    {val}
                  </Link>
                );
              })}
            </div>

            <div className="md:w-1/7 flex flex-col gap-2">
              <p className="description underline">{kidszoneTitle}</p>
              {Object.entries(kidszone).map(([key, val]) => {
                if (typeof val !== 'string') return null;
                const href = key === 'home' ? '/' : `/kidszone/${key}`;
                return (
                  <Link key={key} href={href} className={isActive(href) ? 'active' : ''} role="menuitem">
                    {val}
                  </Link>
                );
              })}
            </div>

            <div className="md:w-1/7 flex flex-col gap-2">
              <p className="description underline">{othersTitle}</p>
              {Object.entries(others).map(([key, val]) => {
                if (typeof val !== 'string') return null;
                const href = key === 'home' ? '/' : `/${key}`;
                return (
                  <Link key={key} href={href} className={isActive(href) ? 'active' : ''} role="menuitem">
                    {val}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
        

        <div className={`${styles.disclaimer} w-full flex flex-col md:flex-row items-center justify-between`}>
          <div>
            <small>{disclaimer}<br /> {contentChange}</small>
            <small> I am using <Link href='https://gemini.google.com/' title='Gemini AI' target='_blank' className='text-white no-underline'>Gemini AI</Link>, <Link href='https://www.meta.ai/' title='Meta AI' target='_blank' className='text-white no-underline'>Meta AI</Link> and  <Link href='https://github.com/features/copilot' title='Github Copilot' target='_blank' className='text-white no-underline'>Github Copilot</Link> basic plan to generating content of the website.</small>
          </div>
          <nav role="list" className={`${styles.socialIcons} md:w-1/4 flex items-center justify-end gap-6`}>
            <Link role="listitem" aria-label="Visit us on LinkedIn" href="https://in.linkedin.com/in/vulchivijayakumar" target="_blank" className=" no-underline">
              <LazyImage src="/images/svg/linkedin.svg" alt="linkedin" width={24} height={24} className="inline-block" />
            </Link>
            <Link role="listitem" aria-label="Visit us on Codepen" href="https://codepen.io/vulchivijay" target="_blank" className=" no-underline">
              <LazyImage src="/images/svg/codepen.svg" alt="codepen" width={24} height={24} className="inline-block" />
            </Link>
            <Link role="listitem" aria-label="Visit us on Github" href="https://github.com/vulchivijay" target="_blank" className=" no-underline">
              <LazyImage src="/images/svg/github.svg" alt="github" width={24} height={24} className="inline-block" />
            </Link>
            <Link role="listitem" aria-label="Visit us on Twitter" href="#" target="_blank" className="no-underline">
              <LazyImage src="/images/svg/twitter.svg" alt="twitter" width={24} height={24} className="inline-block" />
            </Link>
          </nav>
        </div>

        <div className={`${styles.copyrights} w-full md:flex md:items-center md:justify-between`}>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className={`${isActive('/privacy-policy') ? "active" : ""} `}>{privacy}</Link>
            <Link href="/terms-of-service" className={`${isActive('/terms-of-service') ? "active" : ""} `}>{terms}</Link>
          </div>
          <small>{copyright}</small>
        </div>
      </div>
    </footer>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */