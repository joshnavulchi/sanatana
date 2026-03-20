/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";
import React, { useState, Fragment } from 'react';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import LazyImage from './lazyimage';

/* ── Types ── */
interface NavLink {
  href: string;
  label: string;
}

/* ── Section config — ordered as they should appear in the footer ── */
const SECTION_CONFIG: { key: string; icon: string; iconBg: string; basePath: string }[] = [
  { key: 'vedas', icon: '📕', iconBg: 'bg-[#7a2e1f]', basePath: '/vedas' },
  { key: 'upanishads', icon: '📜', iconBg: 'bg-[#92400e]', basePath: '/upanishads' },
  { key: 'puranas', icon: '📖', iconBg: 'bg-[#9a3412]', basePath: '/puranas' },
  // itihasa rendered separately via ItihasaColumn
  { key: 'philosophy', icon: '🧘', iconBg: 'bg-[#c2410c]', basePath: '/philosophy' },
  { key: 'science', icon: '🔬', iconBg: 'bg-[#8b3a2a]', basePath: '/vedic-philosophy' },
  { key: 'others', icon: '✨', iconBg: 'bg-[#5b2d12]', basePath: '' },
];

const INITIAL_VISIBLE = 5;

/* ── Normalize both array-based and object-based nav into a flat link list ── */
function normalizeNavLinks(nav: unknown, basePath: string): NavLink[] {
  if (Array.isArray(nav)) {
    return nav
      .filter((item: Record<string, unknown>) => item?.name && typeof item.name === 'string')
      .map((item: Record<string, unknown>) => ({
        href: `${basePath}/${(item.name as string).toLowerCase().replace(/\s+/g, '')}`,
        label: item.name as string,
      }));
  }
  if (nav && typeof nav === 'object') {
    return Object.entries(nav as Record<string, unknown>)
      .filter(([, val]) => typeof val === 'string')
      .map(([key, val]) => ({
        href: basePath ? `${basePath}/${key}` : `/${key}`,
        label: val as string,
      }));
  }
  return [];
}

/* ── Single nav column with optional "Show more / less" toggle ── */
function NavColumn({ title, links, icon, iconBg }: {
  title: string;
  links: NavLink[];
  icon: string;
  iconBg: string;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  const normalize = (p?: string) => {
    if (!p) return '/';
    return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
  };
  const isActive = (href: string) => normalize(pathname) === normalize(href);

  if (!title || links.length === 0) return null;

  const hasMore = links.length > INITIAL_VISIBLE;
  const visible = expanded ? links : links.slice(0, INITIAL_VISIBLE);

  return (
    <div className="flex flex-col gap-3">
      <p className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-[0.25em] text-[#7a2e1f]">
        <span className={`inline-flex h-6 w-6 p-[2] rounded-full ${iconBg} text-sm text-[#fff4df]`}>
          {icon}
        </span>
        {title}
      </p>
      <div className="mb-1 h-px w-12 bg-linear-to-r from-[#d97706] to-transparent" />
      {visible.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`text-base font-medium transition-colors duration-200 ${isActive(href) ? 'text-[#9a3412] underline decoration-[#d97706] underline-offset-4' : 'text-[#4b2a10] hover:text-[#7a2e1f]'}`}
          onClick={e => { if (isActive(href)) e.preventDefault(); }}
        >
          {label}
        </Link>
      ))}
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          className="mt-2 flex items-center gap-2 text-sm font-medium text-[#92400e] hover:text-[#7a2e1f] transition-colors duration-200 cursor-pointer"
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : `Show more (${links.length - INITIAL_VISIBLE})`}
          <svg
            className={`h-4 w-4 p-1 rounded-sm transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}

/* ── Itihasa column — epics with collapsible sub-lists ── */
function ItihasaColumn({ section }: { section: Record<string, unknown> }) {
  const pathname = usePathname();
  const [expandedEpic, setExpandedEpic] = useState<string | null>(null);

  const normalize = (p?: string) => {
    if (!p) return '/';
    return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
  };
  const isActive = (href: string) => normalize(pathname) === normalize(href);

  if (!section || !Array.isArray(section.nav)) return null;

  const title = (section.title as string) || 'Epics';
  const epics = section.nav as Record<string, unknown>[];

  /* Derive a display name and sub-items for each epic entry */
  const epicEntries = epics.map((epic) => {
    const name = (epic.name as string) || (epic.chapters_list ? 'Bhagavad Gita' : 'Epic');
    const slug = name.toLowerCase().replace(/\s+/g, '');
    const href = `/itihasa/${slug}`;

    // Collect sub-items from kandas, parvas (if object), or chapters_list
    const subNav: Record<string, string> =
      (epic.kandas as Record<string, string>) ||
      (epic.chapters_list as Record<string, string>) ||
      {};

    return { name, slug, href, subNav, hasSubItems: Object.keys(subNav).length > 0 };
  });

  return (
    <div className="flex flex-col gap-2">
      <p className="mb-2 flex items-center gap-2 text-md font-black uppercase tracking-[0.25em] text-[#7a2e1f]">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#b45309] text-xs text-[#fff4df]">⚔️</span>
        {title}
      </p>
      <div className="mb-1 h-px w-12 bg-linear-to-r from-[#d97706] to-transparent" />

      {epicEntries.map(({ name, slug, href, subNav, hasSubItems }) => (
        <div key={slug} className="flex flex-col">
          {/* Epic parent link + toggle */}
          <div className="flex items-center gap-1">
            <Link
              href={href}
              className={`text-base font-medium transition-colors duration-200 ${isActive(href) ? 'text-[#9a3412] underline decoration-[#d97706] underline-offset-4' : 'text-[#4b2a10] hover:text-[#7a2e1f]'}`}
              onClick={e => { if (isActive(href)) e.preventDefault(); }}
            >
              {name}
            </Link>
            {hasSubItems && (
              <button
                type="button"
                onClick={() => setExpandedEpic(prev => prev === slug ? null : slug)}
                className="bg-white ml-1 inline-flex items-center justify-center rounded-sm h-4 w-4 text-[#92400e] hover:text-[#7a2e1f] hover:bg-[#fde7c7] transition-all duration-200 cursor-pointer"
                aria-expanded={expandedEpic === slug}
                aria-label={`Toggle ${name} sub-items`}
              >
                <svg
                  className={`h-3 w-3 transition-transform duration-200 ${expandedEpic === slug ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>

          {/* Sub-items (kandas / chapters) */}
          {hasSubItems && expandedEpic === slug && (
            <div className="ml-1 mt-1 flex flex-col gap-1 border-l-2 border-[#d8a25a]/30 pl-3">
              {Object.entries(subNav).map(([subKey, subLabel]) => {
                const subHref = `${href}/${subKey}`;
                return (
                  <Link
                    key={subKey}
                    href={subHref}
                    className={`text-base font-medium transition-colors duration-200 ${isActive(subHref) ? 'text-[#9a3412] underline decoration-[#d97706] underline-offset-2' : 'text-[#5c4b3f] hover:text-[#7a2e1f]'}`}
                    onClick={e => { if (isActive(subHref)) e.preventDefault(); }}
                  >
                    {subLabel}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Footer() {
  const shared = useLocaleSection('sharable_strings');
  const footer = shared?.footer || {};
  const pathname = usePathname();

  const normalize = (p?: string) => {
    if (!p) return '/';
    return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
  };
  const isActive = (href: string) => normalize(pathname) === normalize(href);

  return (
    <>
      <footer className="relative w-full overflow-hidden bg-white/60 backdrop-blur-sm">
        {/* Top ornamental bar */}
        <div className="h-1 w-full bg-linear-to-r from-amber-600 via-amber-500 to-yellow-400" />

        {/* Decorative background blurs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 -top-16 h-40 w-40 rounded-2xl bg-[#d97706] blur-3xl animate-ping" />
          <div className="absolute -right-20 bottom-20 h-40 w-40 rounded-2xl bg-[#7c2d12] blur-3xl animate-ping" />
        </div>

        <div className="relative z-10">
          {/* ─── Hero CTA Section ─── */}
          <section className="content-wrapper text-center py-6 md:py-16">
            <div className="mx-auto max-w-4xl rounded-xl bg-white/80 backdrop-blur-sm shadow-lg my-4 p-6">
              <h6 className="text-2xl/8 md:text-3xl/12 font-extrabold text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-rose-600 to-indigo-700 drop-shadow-xl">
                {footer.title}
              </h6>
            </div>

            <p className="mx-auto max-w-5xl text-base md:text-md mt-6 px-4 leading-8 text-gray-800">
              {footer.quote} {footer.quotesource}
            </p>

            {/* CTA Buttons */}
            <div className="w-full text-center flex flex-col md:flex-row md:justify-center gap-4 mt-6">
              <Link
                href="/contact"
                className="group relative md:inline-flex px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-base md:text-base rounded-full shadow-md font-medium transition transform hover:-translate-y-0.5 no-underline overflow-hidden">
                <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                <span className="relative flex items-center justify-center gap-2">
                  {footer.contact || 'Contact'}
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/donate"
                className="group md:inline-flex px-4 py-2 bg-white/40 backdrop-blur-sm border border-amber-200 text-amber-700 text-base md:text-base font-medium rounded-full shadow-sm hover:bg-white/60 transition transform hover:-translate-y-0.5 no-underline">
                <span className="flex items-center justify-center gap-2">
                  {footer.donate || 'Donate'}
                  <svg className="h-4 w-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
              </Link>
            </div>
          </section>

          {/* ─── Ornamental Divider ─── */}
          <div className="flex items-center justify-center gap-3 px-6">
            <div className="h-px flex-1 max-w-40 bg-linear-to-r from-transparent to-[#d8a25a]/60" />
            <span className="text-lg text-[#9a3412]" aria-hidden="true">✦</span>
            <div className="h-px flex-1 max-w-40 bg-linear-to-l from-transparent to-[#d8a25a]/60" />
          </div>

          {/* ─── Navigation Columns ─── */}
          <div className="mx-auto max-w-7xl px-3 md:px-0 py-6 md:py-12">
            <nav className="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4" aria-label="Footer navigation">
              {SECTION_CONFIG.map(({ key, icon, iconBg, basePath }) => {
                const section = footer[key];
                if (!section || typeof section !== 'object') return null;
                const title = section.title || key;
                const links = normalizeNavLinks(section.nav, basePath);

                // Insert ItihasaColumn after puranas
                return (
                  <Fragment key={key}>
                    <NavColumn
                      title={title}
                      links={links}
                      icon={icon}
                      iconBg={iconBg}
                    />
                    {key === 'puranas' && footer.itihasa && (
                      <ItihasaColumn key="itihasa" section={footer.itihasa} />
                    )}
                  </Fragment>
                );
              })}
            </nav>
          </div>

          {/* ─── Bottom Bar ─── */}
          <div className="border-t border-[#f0d9bf]/40 bg-white/60">
            {/* Disclaimer + Socials */}
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 md:flex-row">
              <div>
                <small className="text-sm leading-6 text-gray-700">
                  {footer.disclaimer}<br />{footer.contentchange}
                </small>
              </div>
              <nav role="list" className="flex items-center gap-4" aria-label="Social links">
                <Link role="listitem" aria-label="Visit us on LinkedIn" href="https://in.linkedin.com/in/vulchivijayakumar" target="_blank" className="flex items-center justify-center rounded-sm border border-[#d8a25a]/40 px-2 py-1 transition-all duration-200 hover:shadow-[0_4px_12px_rgba(146,64,14,0.12)] no-underline">
                  <LazyImage src="/images/svg/linkedin.svg" alt="linkedin" width={20} height={20} className="inline-block" />
                </Link>
                <Link role="listitem" aria-label="Visit us on Codepen" href="https://codepen.io/vulchivijay" target="_blank" className="flex items-center justify-center rounded-sm border border-[#d8a25a]/40 px-2 py-1 transition-all duration-200 hover:shadow-[0_4px_12px_rgba(146,64,14,0.12)] no-underline">
                  <LazyImage src="/images/svg/codepen.svg" alt="codepen" width={20} height={20} className="inline-block" />
                </Link>
                <Link role="listitem" aria-label="Visit us on Github" href="https://github.com/vulchivijay" target="_blank" className="flex items-center justify-center rounded-sm border border-[#d8a25a]/40 px-2 py-1 transition-all duration-200 hover:shadow-[0_4px_12px_rgba(146,64,14,0.12)] no-underline">
                  <LazyImage src="/images/svg/github.svg" alt="github" width={20} height={20} className="inline-block" />
                </Link>
                <Link role="listitem" aria-label="Visit us on Twitter" href="#" target="_blank" className="flex items-center justify-center rounded-sm border border-[#d8a25a]/40 px-2 py-1 transition-all duration-200 hover:shadow-[0_4px_12px_rgba(146,64,14,0.12)] no-underline">
                  <LazyImage src="/images/svg/twitter.svg" alt="twitter" width={20} height={20} className="inline-block" />
                </Link>
              </nav>
            </div>

            {/* Copyright bar */}
            <div className="border-t border-[#d8a25a]/20">
              <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 md:flex-row">
                <div className="flex items-center gap-4">
                  <Link href="/privacy-policy" className={`text-sm font-medium transition-colors duration-200 no-underline ${isActive('/privacy-policy') ? 'text-[#9a3412] underline decoration-[#d97706] underline-offset-4' : 'text-[#4b2a10] hover:text-[#7a2e1f]'}`}>{footer.privacy}</Link>
                  <span className="text-[#d8a25a]">·</span>
                  <Link href="/terms-of-service" className={`text-sm font-medium transition-colors duration-200 no-underline ${isActive('/terms-of-service') ? 'text-[#9a3412] underline decoration-[#d97706] underline-offset-4' : 'text-[#4b2a10] hover:text-[#7a2e1f]'}`}>{footer.terms}</Link>
                </div>
                <small className="text-sm text-[#92400e]">{footer.copyright}</small>
              </div>
            </div>
          </div>

          {/* Bottom ornamental bar */}
          <div className="h-1 w-full bg-linear-to-r from-[#7c2d12] via-[#d97706] to-[#f59e0b]" />
        </div>
      </footer>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */