/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";
import { useState } from 'react';
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
    <div className="flex flex-col gap-2">
      <p className="mb-2 flex items-center gap-2 text-md font-black uppercase tracking-[0.25em] text-[#7a2e1f]">
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
          className={`text-sm font-semibold transition-colors duration-200 ${isActive(href) ? 'text-[#9a3412] underline decoration-[#d97706] underline-offset-4' : 'text-[#6b3a17] hover:text-[#7a2e1f]'}`}
          role="menuitem"
          onClick={e => { if (isActive(href)) e.preventDefault(); }}
        >
          {label}
        </Link>
      ))}
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          className="mt-1 flex items-center gap-1 text-sm font-semibold text-[#92400e] hover:text-[#7a2e1f] transition-colors duration-200 cursor-pointer"
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : `Show more (${links.length - INITIAL_VISIBLE})`}
          <svg
            className={`bg-white h-4 w-4 p-1 rounded-sm transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
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
    const slug = name.toLowerCase().replace(/\s+/g, '-');
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
              className={`text-sm font-semibold transition-colors duration-200 ${isActive(href) ? 'text-[#9a3412] underline decoration-[#d97706] underline-offset-4' : 'text-[#6b3a17] hover:text-[#7a2e1f]'}`}
              role="menuitem"
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
                    className={`text-sm font-semibold transition-colors duration-200 ${isActive(subHref) ? 'text-[#9a3412] underline decoration-[#d97706] underline-offset-2' : 'text-[#6b5d4f] hover:text-[#7a2e1f]'}`}
                    role="menuitem"
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
      <footer className="relative w-full overflow-hidden bg-linear-to-b from-[#fffaf3] via-[#fdf0d7] to-[#fff8ef]">
        {/* Top ornamental bar */}
        <div className="h-[3] w-full bg-linear-to-r from-[#f59e0b] via-[#d97706] to-[#7c2d12]" />

        {/* Decorative background blurs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-20 h-40 w-40 rounded-2xl bg-[#d97706] blur-2xl animate-ping" />
          <div className="absolute -right-20 bottom-20 h-40 w-40 rounded-2xl bg-[#7c2d12] blur-2xl animate-ping" />
        </div>

        <div className="relative z-10">
          {/* ─── Hero CTA Section ─── */}
          <section className="content-wrapper text-center py-16 md:py-20">
            <div className="bg-white mx-auto max-w-3xl rounded-xl shadow-xs my-16 p-4">
              <h2 className="text-3xl/10 md:text-4xl/12 my-12 font-extrabold text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-rose-600 to-indigo-700 drop-shadow-xl">
                {footer.title}
              </h2>
            </div>

            <p className="mx-auto max-w-4xl text-xl md:text-lg mt-6 px-4 leading-8 text-[#5b2d12]">
              {footer.quote} {footer.quotesource}
            </p>

            {/* CTA Buttons */}
            <div className="w-full text-center flex flex-col md:flex-row md:justify-center gap-4 mt-6">
              <Link
                href="/contact"
                className="group relative md:inline-flex px-8 py-3 bg-linear-to-r from-amber-500 to-orange-600
                hover:from-amber-600 hover:to-orange-700 text-white text-xl md:text-lg rounded-full shadow-xl font-light hover:shadow-2xl
                transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 no-underline overflow-hidden">
                <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                <span className="relative flex items-center justify-center gap-2">
                  {footer.contact || 'Contact'}
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/donate"
                className="group md:inline-flex px-8 py-3 bg-white/10 backdrop-blur-md
                hover:bg-white/20 border-2 border-white/50 hover:border-white
                text-white text-xl md:text-lg font-light rounded-full shadow-lg hover:shadow-xl
                transition-all duration-300 transform hover:-translate-y-1 no-underline">
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
          <div className="flex items-center justify-center gap-3 px-8">
            <div className="h-px flex-1 max-w-40 bg-linear-to-r from-transparent to-[#d8a25a]/60" />
            <span className="text-lg text-[#9a3412]" aria-hidden="true">✦</span>
            <div className="h-px flex-1 max-w-40 bg-linear-to-l from-transparent to-[#d8a25a]/60" />
          </div>

          {/* ─── Navigation Columns ─── */}
          <div className="mx-auto max-w-7xl px-3 md:px-0 py-7 md:py-14">
            <nav role="menu" className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4" aria-label="Footer navigation">
              {SECTION_CONFIG.map(({ key, icon, iconBg, basePath }) => {
                const section = footer[key];
                if (!section || typeof section !== 'object') return null;
                const title = section.title || key;
                const links = normalizeNavLinks(section.nav, basePath);

                // Insert ItihasaColumn after puranas
                return (
                  <>
                    <NavColumn
                      key={key}
                      title={title}
                      links={links}
                      icon={icon}
                      iconBg={iconBg}
                    />
                    {key === 'puranas' && footer.itihasa && (
                      <ItihasaColumn key="itihasa" section={footer.itihasa} />
                    )}
                  </>
                );
              })}
            </nav>
          </div>

          {/* ─── Bottom Bar ─── */}
          <div className="border-t border-[#d8a25a]/30 bg-linear-to-r from-[#fff7ed] via-[#fde7c7] to-[#fff7ed]">
            {/* Disclaimer + Socials */}
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 md:flex-row">
              <div>
                <small className="text-xs leading-5 text-[#6b3a17]">
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
                  <Link href="/privacy-policy" className={`text-xs font-semibold transition-colors duration-200 no-underline ${isActive('/privacy-policy') ? 'text-[#9a3412] underline decoration-[#d97706] underline-offset-4' : 'text-[#6b3a17] hover:text-[#7a2e1f]'}`}>{footer.privacy}</Link>
                  <span className="text-[#d8a25a]">·</span>
                  <Link href="/terms-of-service" className={`text-xs font-semibold transition-colors duration-200 no-underline ${isActive('/terms-of-service') ? 'text-[#9a3412] underline decoration-[#d97706] underline-offset-4' : 'text-[#6b3a17] hover:text-[#7a2e1f]'}`}>{footer.terms}</Link>
                </div>
                <small className="text-xs text-[#92400e]">{footer.copyright}</small>
              </div>
            </div>
          </div>

          {/* Bottom ornamental bar */}
          <div className="h-[4] w-full bg-linear-to-r from-[#7c2d12] via-[#d97706] to-[#f59e0b]" />
        </div>
      </footer>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */