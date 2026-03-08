/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { usePathname } from 'next/navigation';
import { useLocale } from '@app/context/locale-context';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import LazyImage from './lazyimage';
import ThemeToggle from './theme-toggle/ThemeToggle';

const LanguageDropdown = dynamic(() => import("./language-dropdown/language-dropdown"), { ssr: false });

/* ── Types ── */
interface NavItem {
  href: string;
  label: string;
  children?: NavItem[];  // sub-items (kandas, chapters, etc.)
}

interface NavSection {
  key: string;
  title: string;
  basePath: string;
  items: NavItem[];
}

/* ── Route mapping (JSON key → actual route prefix) ── */
const ROUTE_MAP: Record<string, string> = {
  philosopy: '/philosophy',   // typo in JSON
  philosophy: '/philosophy',
  science: '/vedic-philosophy',
};

/* ── Section ordering & icons ── */
const SECTION_ORDER = ['vedas', 'upanishads', 'puranas', 'itihasa', 'philosopy', 'science'];
const SECTION_ICONS: Record<string, string> = {
  vedas: '📕',
  upanishads: '📜',
  puranas: '📖',
  itihasa: '⚔️',
  philosopy: '🧘',
  philosophy: '🧘',
  science: '🔬',
};

/* ── Normalize header JSON into ordered NavSection[] ── */
function buildNavSections(header: Record<string, unknown>): NavSection[] {
  const sections: NavSection[] = [];

  for (const key of SECTION_ORDER) {
    const section = header[key];
    if (!section || typeof section !== 'object') continue;

    const sec = section as Record<string, unknown>;
    const title = (sec.title as string) || key;
    const basePath = ROUTE_MAP[key] || `/${key}`;
    const nav = sec.nav;

    const items: NavItem[] = [];

    if (Array.isArray(nav)) {
      // Array nav (vedas, itihasa)
      for (const entry of nav) {
        if (!entry || typeof entry !== 'object') continue;
        const e = entry as Record<string, unknown>;
        const name = (e.name as string) || (e.chapters_list ? 'Bhagavad Gita' : '');
        if (!name) continue;
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        const href = `${basePath}/${slug}`;

        // Collect sub-items
        const subNav: Record<string, string> =
          (e.kandas as Record<string, string>) ||
          (e.chapters_list as Record<string, string>) ||
          {};
        const children: NavItem[] = Object.entries(subNav).map(([subKey, subLabel]) => ({
          href: `${href}/${subKey}`,
          label: subLabel,
        }));

        items.push({ href, label: name, children: children.length > 0 ? children : undefined });
      }
    } else if (nav && typeof nav === 'object') {
      // Object nav (upanishads, puranas, philosophy, science)
      for (const [slug, label] of Object.entries(nav as Record<string, unknown>)) {
        if (typeof label !== 'string') continue;
        items.push({ href: `${basePath}/${slug}`, label });
      }
    }

    if (items.length > 0) {
      sections.push({ key, title, basePath, items });
    }
  }

  return sections;
}

/* ── Desktop dropdown item (inline sub-list, no flyout) ── */
function DesktopNavItem({ item, isActive, onToggleSub, isSubOpen }: {
  item: NavItem;
  isActive: (h: string) => boolean;
  onToggleSub: (href: string) => void;
  isSubOpen: boolean;
}) {
  if (!item.children || item.children.length === 0) {
    return (
      <Link
        href={item.href}
        role="menuitem"
        className="group/item flex items-center gap-3 px-5 py-2.5 transition-all duration-150 hover:bg-linear-to-r hover:from-[#fde7c7]/70 hover:to-transparent"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#9a3412]/10 text-xs text-[#9a3412] transition-colors duration-150 group-hover/item:bg-[#9a3412] group-hover/item:text-[#fff4df]">
          ◈
        </span>
        <span className={`text-sm font-semibold transition-colors duration-150 ${isActive(item.href) ? 'text-[#9a3412]' : 'text-[#5b2d12] group-hover/item:text-[#7a2e1f]'}`}>
          {item.label}
        </span>
      </Link>
    );
  }

  // Has children → click chevron to expand inline sub-list
  return (
    <div>
      <div className="flex items-center justify-between gap-2 px-5 py-2.5 transition-all duration-150 hover:bg-linear-to-r hover:from-[#fde7c7]/70 hover:to-transparent">
        <Link href={item.href} className="flex items-center gap-3 flex-1">
          <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs transition-colors duration-150 ${isSubOpen ? 'bg-[#9a3412] text-[#fff4df]' : 'bg-[#9a3412]/10 text-[#9a3412]'}`}>
            ◈
          </span>
          <span className={`text-md font-semibold transition-colors duration-150 ${isActive(item.href) ? 'text-[#9a3412]' : 'text-[#5b2d12]'}`}>
            {item.label}
          </span>
        </Link>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleSub(item.href); }}
          className="p-1 rounded-md hover:bg-[#fde7c7] transition-colors cursor-pointer"
          aria-expanded={isSubOpen}
          aria-label={`Toggle ${item.label} sub-items`}
        >
          <svg
            className={`h-3 w-3 text-[#b45309] transition-transform duration-200 ${isSubOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Inline sub-list — expands below the parent item */}
      {isSubOpen && (
        <div className="ml-8 mr-3 mb-1 border-l-2 border-[#d8a25a]/40 pl-3">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              role="menuitem"
              className="group/child flex items-center gap-2 px-2 py-1.5 transition-all duration-150 hover:bg-linear-to-r hover:from-[#fde7c7]/70 hover:to-transparent rounded-lg"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#d97706] shrink-0" />
              <span className={`text-md font-semibold transition-colors duration-150 ${isActive(child.href) ? 'text-[#9a3412]' : 'text-[#6b5d4f] group-hover/child:text-[#7a2e1f]'}`}>
                {child.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Desktop dropdown for a section ── */
function DesktopDropdown({ section, isActive }: {
  section: NavSection;
  isActive: (h: string) => boolean;
}) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [dropDir, setDropDir] = useState<'left' | 'right'>('right');
  const [openSubItem, setOpenSubItem] = useState<string | null>(null);
  const icon = SECTION_ICONS[section.key] || '✨';

  // Determine dropdown direction
  useEffect(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceRight = window.innerWidth - rect.left;
    setDropDir(spaceRight < 320 ? 'left' : 'right');
  }, []);

  // Reset open sub-item when dropdown closes (mouse leaves)
  const handleMouseLeave = () => { setOpenSubItem(null); };

  const toggleSub = (href: string) => {
    setOpenSubItem(prev => prev === href ? null : href);
  };

  return (
    <div ref={triggerRef} className="relative group" onMouseLeave={handleMouseLeave}>
      <span className="flex items-center justify-center rounded-sm font-semibold p-1 tracking-wide text-[#5b2d12] cursor-pointer select-none transition-all duration-200 group-hover:bg-[#fde7c7] group-hover:text-[#7a2e1f] gap-1">
        <span className="text-base">{icon}</span>
        {section.title}
        <svg className="ml-0.5 h-3.5 w-3.5 text-[#b45309] transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </span>

      {/* Dropdown panel */}
      <div className={`absolute pt-3 min-w-60 max-h-[80vh] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-20
        ${dropDir === 'left' ? 'right-0' : 'left-0'}`}
      >
        <div className="overflow-y-auto max-h-[75vh] rounded-2xl border border-[#d8a25a]/50 bg-[#fffaf0] shadow-[0_20px_50px_rgba(166,61,23,0.14)]">
          <div className="h-1 w-full bg-linear-to-r from-[#7c2d12] via-[#d97706] to-[#f59e0b]" />
          <div className="py-2">
            {section.items.map((item) => (
              <DesktopNavItem
                key={item.href}
                item={item}
                isActive={isActive}
                onToggleSub={toggleSub}
                isSubOpen={openSubItem === item.href}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Mobile collapsible sub-sections ── */
function MobileNavSection({ section, isActive, onNavigate }: {
  section: NavSection;
  isActive: (h: string) => boolean;
  onNavigate: () => void;
}) {
  const icon = SECTION_ICONS[section.key] || '✨';
  const [expanded, setExpanded] = useState(false);
  const [expandedChild, setExpandedChild] = useState<string | null>(null);

  return (
    <div className="mt-1">
      {/* Section header — tap to toggle */}
      <button
        type="button"
        onClick={() => { setExpanded(prev => !prev); setExpandedChild(null); }}
        className="w-full flex items-center gap-2 rounded-xl bg-linear-to-r from-[#fde7c7]/80 to-transparent px-4 py-2 mb-1 cursor-pointer"
        aria-expanded={expanded}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#9a3412] text-sm text-[#fff4df]">{icon}</span>
        <span className="text-xl font-black tracking-wide text-[#7a2e1f]">{section.title}</span>
        <div className="ml-auto flex items-center">
          <svg
            className={`h-4 w-4 text-[#b45309] transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Items */}
      {expanded && (
        <div className="ml-4 border-l-2 border-[#d8a25a]/30 pl-3 flex flex-col gap-0.5">
          {section.items.map((item) => (
            <div key={item.href}>
              <div className="flex items-center">
                <Link
                  href={item.href}
                  className="flex-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-xl font-semibold text-[#6b3a17] transition-all duration-150 hover:bg-[#fde7c7] hover:text-[#7a2e1f]"
                  onClick={onNavigate}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d97706]" />
                  {item.label}
                </Link>
                {item.children && item.children.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setExpandedChild(prev => prev === item.href ? null : item.href)}
                    className="p-2 rounded-lg text-[#92400e] hover:bg-[#fde7c7] transition-colors cursor-pointer"
                    aria-expanded={expandedChild === item.href}
                    aria-label={`Toggle ${item.label} sub-items`}
                  >
                    <svg
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${expandedChild === item.href ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Sub-items */}
              {item.children && expandedChild === item.href && (
                <div className="ml-6 border-l-2 border-[#d8a25a]/20 pl-3 flex flex-col gap-0.5 mt-0.5">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-base font-medium text-[#6b5d4f] transition-all duration-150 hover:bg-[#fde7c7] hover:text-[#7a2e1f]"
                      onClick={onNavigate}
                    >
                      <span className="h-1 w-1 rounded-full bg-[#c49a6c]" />
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Default fallback values ── */
const defaultSiteTitle = 'Sanātana Dharma';

export default function Header() {
  // Responsive logo width state
  const [logoWidth, setLogoWidth] = useState(50);
  useEffect(() => {
    function handleResize() {
      setLogoWidth(window.innerWidth < 640 ? 50 : 45);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement | null>(null);

  const sharable = useLocaleSection('sharable_strings');
  const siteTitle = sharable?.sitetitle || defaultSiteTitle;
  const headerData = (sharable?.header || {}) as Record<string, unknown>;
  const navSections = buildNavSections(headerData);

  const normalize = (p?: string) => {
    if (!p) return "/";
    if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
    return p;
  };
  const isActive = useCallback((href: string) => normalize(pathname) === normalize(href), [pathname]);

  // Escape to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Click outside to close mobile drawer
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!headerRef.current || (e.target && headerRef.current.contains(e.target as Node))) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  return (
    <header ref={headerRef} className="w-full sticky top-0 z-30">
      {/* Ornamental top accent */}
      <div className="h-[2] w-full bg-linear-to-r from-[#7c2d12] via-[#d97706] to-[#f59e0b]" />
      <div className="w-full bg-linear-to-r from-[#fffaf3] via-[#fdf0d7] to-[#fff8ef] shadow-[0_4px_20px_rgba(166,61,23,0.10)] px-4 py-1 md:px-0">
        <div className="flex items-center justify-between px-4 md:px-8">
          {/* ─── Logo & Title ─── */}
          <h1 className="m-0 p-0">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="relative flex items-center justify-center">
                <LazyImage
                  src="/images/logo.png"
                  alt="Sanatanadharmam Logo"
                  width={logoWidth}
                  height={40}
                  className="md:flex"
                />
              </span>
              <span className="max-w-50 md:max-w-100 text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-rose-600 to-indigo-700 drop-shadow-xl">
                {siteTitle}
              </span>
            </Link>
          </h1>

          {/* ─── Desktop Nav ─── */}
          <nav className="hidden md:flex items-center gap-2" role="menubar" aria-label="Main navigation">
            {navSections.map((section) => (
              <DesktopDropdown key={section.key} section={section} isActive={isActive} />
            ))}
            <div className="ml-1 pl-2 border-l border-[#d8a25a]/40 flex items-center gap-1">
              <LanguageDropdown />
              <ThemeToggle />
            </div>
          </nav>

          {/* ─── Mobile Toggle ─── */}
          <div className="flex items-center md:hidden gap-2">
            <LanguageDropdown />
            <ThemeToggle />
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((s) => !s)}
              className="inline-flex items-center justify-center rounded-xl p-1.5 text-[#7a2e1f] transition-all duration-200 hover:bg-[#fde7c7] focus:outline-none focus:ring-2 focus:ring-[#d97706]/50"
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 32 32" stroke="currentColor" aria-hidden="true">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 8l16 16M8 24L24 8" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h24M4 16h24M4 24h24" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* ─── Mobile Drawer ─── */}
        {open && (
          <div className="md:hidden relative z-50 mt-1 overflow-hidden rounded-b-2xl border-t border-[#d8a25a]/40 bg-linear-to-b from-[#fffaf0] to-[#fdf0d7] shadow-[0_16px_40px_rgba(166,61,23,0.12)] animate-fade-in-down">
            <div className="h-0.5 w-full bg-linear-to-r from-[#7c2d12] via-[#d97706] to-[#f59e0b]" />
            <div className="flex flex-col gap-1 py-4 px-4 max-h-[70vh] overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
              {navSections.map((section) => (
                <MobileNavSection
                  key={section.key}
                  section={section}
                  isActive={isActive}
                  onNavigate={() => setOpen(false)}
                />
              ))}
            </div>
            <div className="h-0.5 w-full bg-linear-to-r from-[#f59e0b] via-[#d97706] to-[#7c2d12]" />
          </div>
        )}
      </div>
    </header>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */