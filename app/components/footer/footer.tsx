/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useEffect, useState } from 'react';
import { getLocaleObject, loadLocaleNamespace } from '../../../lib/i18n';
import { useLocale } from '../../context/locale-context';
import { parseList } from 'lib/parseList';
import { useT } from '../../hooks/useT';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import LazyImage from '../lazy-image/LazyImage';
import styles from './footer.module.scss';

export default function Footer() {
  const t = useT();
  const { locale } = useLocale();
  const pathname = usePathname();

  const localeObj = getLocaleObject(locale) as any;
  const initialFooter = (localeObj && localeObj.sharable_strings)
    ? (localeObj.sharable_strings.footer || localeObj.sharable_strings)
    : {};

  const [footer, setFooter] = useState<Record<string, any>>(initialFooter || {});

  useEffect(() => {
    // If we already have sections from the runtime cache, use them.
    const obj = getLocaleObject(locale) as any;
    if (obj && obj.sharable_strings && obj.sharable_strings.footer) {
      setFooter(obj.sharable_strings.footer);
      return;
    }

    // Otherwise load the `sharable_strings` namespace once for this locale and update state.
    let cancelled = false;
    loadLocaleNamespace(locale, 'sharable_strings').then((ns: any) => {
      if (cancelled) return;
      // `ns` may be the namespace object or may wrap the namespace under a
      // top-level `sharable_strings` key depending on how the JSON is authored.
      const payload = (ns && ns.sharable_strings) ? ns.sharable_strings : ns;
      if (payload) {
        if (payload.footer) setFooter(payload.footer);
        else setFooter(payload);
      }
    }).catch(() => { });
    return () => { cancelled = true; };
  }, [locale]);

  const normalize = (p?: string) => {
    if (!p) return "/";
    if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
    return p;
  };

  const isActive = (href: string) => normalize(pathname) === normalize(href);

  return (
    <footer className={`${styles.footer} gradient-background w-full`} style={{ minHeight: '400px' }}>
      <div className={`relative z-29`}>
        <section className="content-wrapper text-center">
          <p className={`h2 font-light! text-shadow-lg/14 title`}>{footer?.title || footer?.titleText}</p>
          <p className={`mx-auto max-w-4xl`}>{footer?.quote || footer?.quotes} {footer?.quoteSource || footer?.quotesource}</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/contact" className={`bg-black/24! btn btn-outline no-underline`}>
              {footer?.contact || footer?.contactLabel || 'Contact'}
            </Link>
            <Link href="/donate" className={`bg-black/24! btn btn-outline no-underline`}>
              {footer?.donate || footer?.donateLabel || 'Donate'}
            </Link>
          </div>
        </section>

        <div className={`${styles.navWrapper} w-full relative z-10 flex flex-col md:flex-row md:items-start md:justify-between border-t`}>
          <nav role="menu" className="md:w-full gap-4 flex flex-col  md:flex-row md:items-start">
            <div className="md:w-1/4 flex flex-col gap-2">
              {(() => {
                const sec = footer?.scriptures || {};
                const title = sec?.title || footer?.scripturesTitle || 'Scriptures';
                const nav = sec?.nav || (typeof sec === 'object' ? (() => {
                  // if sec contains keys that are strings, treat sec itself as nav
                  const maybeNav: Record<string, string> = {} as any;
                  for (const k of Object.keys(sec)) {
                    if (k === 'title' || k === 'nav') continue;
                    const v = (sec as any)[k];
                    if (typeof v === 'string') maybeNav[k] = v;
                  }
                  return Object.keys(maybeNav).length ? maybeNav : {};
                })() : {})
                return (
                  <>
                    <p className="description underline">{title}</p>
                    {Object.entries(nav).map(([key, val]) => {
                      if (typeof val !== 'string') return null;
                      const href = key === 'home' ? '/' : `/scriptures/${key}`;
                      return <Link key={key} href={href} className={isActive(href) ? 'active' : ''} role="menuitem">{val}</Link>;
                    })}
                  </>
                );
              })()}
            </div>

            <div className="md:w-1/4 flex flex-col gap-2">
              {(() => {
                const sec = footer?.philosophy || {};
                const title = sec?.title || footer?.philosophyTitle || 'Philosophy';
                const nav = sec?.nav || (typeof sec === 'object' ? (() => {
                  const maybeNav: Record<string, string> = {} as any;
                  for (const k of Object.keys(sec)) {
                    if (k === 'title' || k === 'nav') continue;
                    const v = (sec as any)[k];
                    if (typeof v === 'string') maybeNav[k] = v;
                  }
                  return Object.keys(maybeNav).length ? maybeNav : {};
                })() : {});
                return (
                  <>
                    <p className="description underline">{title}</p>
                    {Object.entries(nav).map(([key, val]) => {
                      if (typeof val !== 'string') return null;
                      const href = key === 'home' ? '/' : `/philosophy/${key}`;
                      return <Link key={key} href={href} className={isActive(href) ? 'active' : ''} role="menuitem">{val}</Link>;
                    })}
                  </>
                );
              })()}
            </div>

            <div className="md:w-1/7 flex flex-col gap-2 hidden">
              <p className="description underline">{footer?.stotrasTitle}</p>
              {(footer?.stotras ? Object.entries(footer.stotras) : []).map(([key, val]) => {
                if (typeof val !== 'string') return null;
                const href = key === 'home' ? '/' : `/stotrasmantras/${key}`;
                return (
                  <Link key={key} href={href} className={isActive(href) ? 'active' : ''} role="menuitem">
                    {val}
                  </Link>
                );
              })}
            </div>

            <div className="md:w-1/7 flex flex-col gap-2 hidden">
              <p className="description underline">{footer?.storiesTitle}</p>
              {(footer?.stories ? Object.entries(footer.stories) : []).map(([key, val]) => {
                if (typeof val !== 'string') return null;
                const href = key === 'home' ? '/' : `/stories/${key}`;
                return (
                  <Link key={key} href={href} className={isActive(href) ? 'active' : ''} role="menuitem">
                    {val}
                  </Link>
                );
              })}
            </div>

            <div className="md:w-1/4 flex flex-col gap-2">
              {(() => {
                const sec = footer?.kidszone || {};
                const title = sec?.title || footer?.kidszoneTitle || 'Kids Zone';
                const nav = sec?.nav || (typeof sec === 'object' ? (() => {
                  const maybeNav: Record<string, string> = {} as any;
                  for (const k of Object.keys(sec)) {
                    if (k === 'title' || k === 'nav') continue;
                    const v = (sec as any)[k];
                    if (typeof v === 'string') maybeNav[k] = v;
                  }
                  return Object.keys(maybeNav).length ? maybeNav : {};
                })() : {});
                return (
                  <>
                    <p className="description underline">{title}</p>
                    {Object.entries(nav).map(([key, val]) => {
                      if (typeof val !== 'string') return null;
                      const href = key === 'home' ? '/' : `/kidszone/${key}`;
                      return <Link key={key} href={href} className={isActive(href) ? 'active' : ''} role="menuitem">{val}</Link>;
                    })}
                  </>
                );
              })()}
            </div>

            <div className="md:w-1/4 flex flex-col gap-2">
              {(() => {
                const sec = footer?.others || {};
                const title = sec?.title || footer?.othersTitle || 'More';
                const nav = sec?.nav || (typeof sec === 'object' ? (() => {
                  const maybeNav: Record<string, string> = {} as any;
                  for (const k of Object.keys(sec)) {
                    if (k === 'title' || k === 'nav') continue;
                    const v = (sec as any)[k];
                    if (typeof v === 'string') maybeNav[k] = v;
                  }
                  return Object.keys(maybeNav).length ? maybeNav : {};
                })() : {});
                return (
                  <>
                    <p className="description underline">{title}</p>
                    {Object.entries(nav).map(([key, val]) => {
                      if (typeof val !== 'string') return null;
                      const href = key === 'home' ? '/' : `/${key}`;
                      return <Link key={key} href={href} className={isActive(href) ? 'active' : ''} role="menuitem">{val}</Link>;
                    })}
                  </>
                );
              })()}
            </div>
          </nav>
        </div>

        <div className={`${styles.disclaimer} w-full flex flex-col md:flex-row items-center justify-between`}>
          <div>
            <small>{footer && footer?.disclaimer}<br /> {footer && footer?.contentChange}</small>
            {/* <small> I am using <Link href='https://gemini.google.com/' title='Gemini AI' target='_blank' className='text-white no-underline'>Gemini AI</Link>, <Link href='https://www.meta.ai/' title='Meta AI' target='_blank' className='text-white no-underline'>Meta AI</Link> and  <Link href='https://github.com/features/copilot' title='Github Copilot' target='_blank' className='text-white no-underline'>Github Copilot</Link> basic plan to generating content of the website.</small> */}
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
            <Link href="/privacy-policy" className={`${isActive('/privacy-policy') ? "active" : ""} `}>{footer?.privacy}</Link>
            <Link href="/terms-of-service" className={`${isActive('/terms-of-service') ? "active" : ""} `}>{footer?.terms}</Link>
          </div>
          <small>{footer?.copyright}</small>
        </div>
      </div>
    </footer>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */