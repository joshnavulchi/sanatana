/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";
import { useEffect, useState } from 'react';
import { loadLocaleNamespace } from '@lib/i18n';
import { useLocale } from '@app/context/locale-context';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import LazyImage from './lazyimage';

export default function Footer() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const [footer, setFooter] = useState<Record<string, any>>({});

  useEffect(() => {
    // Load the `sharable_strings` namespace once for this locale and update state.
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
    <>
      <footer className="relative w-full overflow-hidden bg-linear-to-b from-[#fffaf3] via-[#fdf0d7] to-[#fff8ef]">
        {/* Top ornamental bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-[#7c2d12] via-[#d97706] to-[#f59e0b]" />

        {/* Decorative background blurs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-[#f3b86b]/15 blur-3xl" />
          <div className="absolute -right-16 bottom-20 h-80 w-80 rounded-full bg-[#d97706]/10 blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* ─── Hero CTA Section ─── */}
          <section className="content-wrapper py-16 text-center md:py-20">
            <div className="mx-auto max-w-3xl rounded-3xl border border-[#d8a25a]/50 bg-linear-to-br from-[#fff7ed] via-[#fde7c7] to-[#f8d7a0] px-8 py-10 shadow-[0_20px_50px_rgba(166,61,23,0.12)] md:px-16">
              <h2 className="bg-linear-to-r from-[#7a2e1f] via-[#c2410c] to-[#d97706] bg-clip-text text-3xl font-black leading-tight text-transparent md:text-4xl">
                {footer?.title || footer?.titleText}
              </h2>
            </div>

            <p className="mx-auto mt-6 max-w-4xl px-4 text-base leading-8 text-[#5b2d12] md:text-lg">
              {footer?.quote || footer?.quotes} {footer?.quoteSource || footer?.quotesource}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 md:flex-row">
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#7a2e1f] px-8 py-3.5 text-base font-bold tracking-wide text-[#fff4df] shadow-[0_8px_24px_rgba(122,46,31,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#9a3412] hover:shadow-[0_12px_32px_rgba(122,46,31,0.28)] no-underline"
              >
                {footer?.contact || footer?.contactLabel || 'Contact'}
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <Link
                href="/donate"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-[#d8a25a] bg-[#fffaf2] px-8 py-3.5 text-base font-bold tracking-wide text-[#7a2e1f] shadow-[0_6px_20px_rgba(146,64,14,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b45309] hover:bg-[#fde7c7] hover:shadow-[0_10px_28px_rgba(146,64,14,0.16)] no-underline"
              >
                {footer?.donate || footer?.donateLabel || 'Donate'}
                <svg className="h-4 w-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </Link>
            </div>
          </section>

          {/* ─── Ornamental Divider ─── */}
          <div className="flex items-center justify-center gap-3 px-8">
            <div className="h-px flex-1 max-w-40 bg-linear-to-r from-transparent to-[#d8a25a]/60" />
            <span className="text-lg text-[#9a3412]" aria-hidden="true">✦</span>
            <div className="h-px flex-1 max-w-40 bg-linear-to-l from-transparent to-[#d8a25a]/60" />
          </div>

          {/* ─── Navigation Columns ─── */}
          <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
            <nav role="menu" className="grid gap-8 md:grid-cols-5" aria-label="Footer navigation">
              {/* Scriptures */}
              <div className="flex flex-col gap-2">
                {(() => {
                  const sec = footer?.scriptures || {};
                  const title = sec?.title || footer?.scripturesTitle || 'Scriptures';
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
                      <p className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-[0.25em] text-[#7a2e1f]">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#7a2e1f] text-xs text-[#fff4df]">📜</span>
                        {title}
                      </p>
                      <div className="mb-1 h-px w-12 bg-linear-to-r from-[#d97706] to-transparent" />
                      {Object.entries(nav).map(([key, val]) => {
                        if (typeof val !== 'string') return null;
                        const href = key === 'home' ? '/' : `/scriptures/${key}`;
                        return (
                          <Link
                            key={key}
                            href={href}
                            className={`text-sm font-semibold transition-colors duration-200 ${isActive(href) ? 'text-[#9a3412] underline decoration-[#d97706] underline-offset-4' : 'text-[#6b3a17] hover:text-[#7a2e1f]'}`}
                            role="menuitem"
                            onClick={e => { if (isActive(href)) e.preventDefault(); }}
                          >
                            {val}
                          </Link>
                        );
                      })}
                    </>
                  );
                })()}
              </div>

              {/* Philosophy */}
              <div className="flex flex-col gap-2">
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
                      <p className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-[0.25em] text-[#7a2e1f]">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#92400e] text-xs text-[#fff4df]">🧘</span>
                        {title}
                      </p>
                      <div className="mb-1 h-px w-12 bg-linear-to-r from-[#d97706] to-transparent" />
                      {Object.entries(nav).map(([key, val]) => {
                        if (typeof val !== 'string') return null;
                        const href = key === 'home' ? '/' : `/philosophy/${key}`;
                        return (
                          <Link key={key} href={href} className={`text-sm font-semibold transition-colors duration-200 ${isActive(href) ? 'text-[#9a3412] underline decoration-[#d97706] underline-offset-4' : 'text-[#6b3a17] hover:text-[#7a2e1f]'}`} role="menuitem">
                            {val}
                          </Link>
                        );
                      })}
                    </>
                  );
                })()}
              </div>

              {/* Stories */}
              <div className="flex flex-col gap-2">
                {(() => {
                  const sec = footer?.stories || {};
                  const title = sec?.title || footer?.philosophyTitle || 'Stories';
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
                      <p className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-[0.25em] text-[#7a2e1f]">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#9a3412] text-xs text-[#fff4df]">📖</span>
                        {title}
                      </p>
                      <div className="mb-1 h-px w-12 bg-linear-to-r from-[#d97706] to-transparent" />
                      {Object.entries(nav).map(([key, val]) => {
                        if (typeof val !== 'string') return null;
                        const href = key === 'home' ? '/' : `/stories/${key}`;
                        return (
                          <Link key={key} href={href} className={`text-sm font-semibold transition-colors duration-200 ${isActive(href) ? 'text-[#9a3412] underline decoration-[#d97706] underline-offset-4' : 'text-[#6b3a17] hover:text-[#7a2e1f]'}`} role="menuitem">
                            {val}
                          </Link>
                        );
                      })}
                    </>
                  );
                })()}
              </div>

              {/* Stotras Mantras (hidden) */}
              <div className="hidden">
                {(() => {
                  const sec = footer?.stotrasmantras || {};
                  const title = sec?.title || footer?.philosophyTitle || 'Stotras Mantras';
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
                      <p className="mb-2 text-sm font-black uppercase tracking-[0.25em] text-[#7a2e1f]">{title}</p>
                      {Object.entries(nav).map(([key, val]) => {
                        if (typeof val !== 'string') return null;
                        const href = key === 'home' ? '/' : `/stotrasmantras/${key}`;
                        return (
                          <Link key={key} href={href} className={`text-sm font-semibold transition-colors duration-200 ${isActive(href) ? 'text-[#9a3412]' : 'text-[#6b3a17] hover:text-[#7a2e1f]'}`} role="menuitem">
                            {val}
                          </Link>
                        );
                      })}
                    </>
                  );
                })()}
              </div>

              {/* Kids Zone */}
              <div className="flex flex-col gap-2">
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
                      <p className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-[0.25em] text-[#7a2e1f]">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#b45309] text-xs text-[#fff4df]">🧒</span>
                        {title}
                      </p>
                      <div className="mb-1 h-px w-12 bg-linear-to-r from-[#d97706] to-transparent" />
                      {Object.entries(nav).map(([key, val]) => {
                        if (typeof val !== 'string') return null;
                        const href = key === 'home' ? '/' : `/kidszone/${key}`;
                        return (
                          <Link key={key} href={href} className={`text-sm font-semibold transition-colors duration-200 ${isActive(href) ? 'text-[#9a3412] underline decoration-[#d97706] underline-offset-4' : 'text-[#6b3a17] hover:text-[#7a2e1f]'}`} role="menuitem">
                            {val}
                          </Link>
                        );
                      })}
                    </>
                  );
                })()}
              </div>

              {/* Others / More */}
              <div className="flex flex-col gap-2">
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
                      <p className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-[0.25em] text-[#7a2e1f]">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#c2410c] text-xs text-[#fff4df]">✨</span>
                        {title}
                      </p>
                      <div className="mb-1 h-px w-12 bg-linear-to-r from-[#d97706] to-transparent" />
                      {Object.entries(nav).map(([key, val]) => {
                        if (typeof val !== 'string') return null;
                        const href = key === 'home' ? '/' : `/${key}`;
                        return (
                          <Link key={key} href={href} className={`text-sm font-semibold transition-colors duration-200 ${isActive(href) ? 'text-[#9a3412] underline decoration-[#d97706] underline-offset-4' : 'text-[#6b3a17] hover:text-[#7a2e1f]'}`} role="menuitem">
                            {val}
                          </Link>
                        );
                      })}
                    </>
                  );
                })()}
              </div>
            </nav>
          </div>

          {/* ─── Bottom Bar ─── */}
          <div className="border-t border-[#d8a25a]/30 bg-linear-to-r from-[#fff7ed] via-[#fde7c7] to-[#fff7ed]">
            {/* Disclaimer + Socials */}
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 md:flex-row">
              <div>
                <small className="text-xs leading-5 text-[#6b3a17]">
                  {footer?.disclaimer}<br />{footer?.contentChange}
                </small>
              </div>
              <nav role="list" className="flex items-center gap-5" aria-label="Social links">
                <Link role="listitem" aria-label="Visit us on LinkedIn" href="https://in.linkedin.com/in/vulchivijayakumar" target="_blank" className="rounded-full border border-[#d8a25a]/40 bg-[#fffaf2] p-2 transition-all duration-200 hover:border-[#d97706] hover:shadow-[0_4px_12px_rgba(146,64,14,0.12)] no-underline">
                  <LazyImage src="/images/svg/linkedin.svg" alt="linkedin" width={20} height={20} className="inline-block" />
                </Link>
                <Link role="listitem" aria-label="Visit us on Codepen" href="https://codepen.io/vulchivijay" target="_blank" className="rounded-full border border-[#d8a25a]/40 bg-[#fffaf2] p-2 transition-all duration-200 hover:border-[#d97706] hover:shadow-[0_4px_12px_rgba(146,64,14,0.12)] no-underline">
                  <LazyImage src="/images/svg/codepen.svg" alt="codepen" width={20} height={20} className="inline-block" />
                </Link>
                <Link role="listitem" aria-label="Visit us on Github" href="https://github.com/vulchivijay" target="_blank" className="rounded-full border border-[#d8a25a]/40 bg-[#fffaf2] p-2 transition-all duration-200 hover:border-[#d97706] hover:shadow-[0_4px_12px_rgba(146,64,14,0.12)] no-underline">
                  <LazyImage src="/images/svg/github.svg" alt="github" width={20} height={20} className="inline-block" />
                </Link>
                <Link role="listitem" aria-label="Visit us on Twitter" href="#" target="_blank" className="rounded-full border border-[#d8a25a]/40 bg-[#fffaf2] p-2 transition-all duration-200 hover:border-[#d97706] hover:shadow-[0_4px_12px_rgba(146,64,14,0.12)] no-underline">
                  <LazyImage src="/images/svg/twitter.svg" alt="twitter" width={20} height={20} className="inline-block" />
                </Link>
              </nav>
            </div>

            {/* Copyright bar */}
            <div className="border-t border-[#d8a25a]/20">
              <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 md:flex-row">
                <div className="flex items-center gap-4">
                  <Link href="/privacy-policy" className={`text-xs font-semibold transition-colors duration-200 no-underline ${isActive('/privacy-policy') ? 'text-[#9a3412] underline decoration-[#d97706] underline-offset-4' : 'text-[#6b3a17] hover:text-[#7a2e1f]'}`}>{footer?.privacy}</Link>
                  <span className="text-[#d8a25a]">·</span>
                  <Link href="/terms-of-service" className={`text-xs font-semibold transition-colors duration-200 no-underline ${isActive('/terms-of-service') ? 'text-[#9a3412] underline decoration-[#d97706] underline-offset-4' : 'text-[#6b3a17] hover:text-[#7a2e1f]'}`}>{footer?.terms}</Link>
                </div>
                <small className="text-xs text-[#92400e]">{footer?.copyright}</small>
              </div>
            </div>
          </div>

          {/* Bottom ornamental bar */}
          <div className="h-1 w-full bg-linear-to-r from-[#f59e0b] via-[#d97706] to-[#7c2d12]" />
        </div>
      </footer>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */