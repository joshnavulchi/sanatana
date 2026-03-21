/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { usePathname } from 'next/navigation';
import { useLocale } from '@app/context/locale-context';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import LazyImage from './lazyimage';
// ThemeToggle removed — header is light-only (no dark mode)

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
  // typo in JSON
  philosophy: '/vedic-philosophy',
  // export uses `vedic-philosophy` for both philosophy and science namespaces
  science: '/vedic-philosophy',
};

/* ── Section ordering & icons ── */
const SECTION_ORDER = ['vedas', 'upanishads', 'puranas', 'itihasa', 'philosophy', 'science'];
const SECTION_ICONS: Record<string, string> = {
  vedas: '📕',
  upanishads: '📜',
  puranas: '📖',
  itihasa: '⚔️',
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
        let slug = name.toLowerCase().replace(/\s+/g, '-');
        // Special-case: exported route for Bhagavad Gita uses 'bhagavadgita' (no hyphen)
        if (slug === 'bhagavad-gita' || /\bbhagavad\b/.test(slug) && /gita/.test(slug)) {
          slug = 'bhagavadgita';
        }
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
        className="group/item flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 text-gray-600 hover:text-primary-600"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-700/10 text-xs text-primary-700 transition-colors duration-150 group-hover/item:bg-primary-700 group-hover/item:text-white">
          ◈
        </span>
        <span className={`text-sm font-semibold transition-all duration-200 ${isActive(item.href) ? 'text-primary-600' : 'text-gray-700 group-hover/item:text-primary-600'}`}>
          {item.label}
        </span>
      </Link>
    );
  }

  // Has children → click chevron to expand inline sub-list
  return (
    <div>
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 transition-all duration-150 hover:bg-amber-50 rounded-md">
        <Link href={item.href} className="flex items-center gap-3 flex-1">
          <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs transition-colors duration-150 ${isSubOpen ? 'bg-primary-700 text-white' : 'bg-primary-700/10 text-primary-700'}`}>
            ◈
          </span>
          <span className={`text-sm font-semibold transition-colors duration-150 ${isActive(item.href) ? 'text-amber-700' : 'text-gray-700'}`}>
            {item.label}
          </span>
        </Link>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleSub(item.href); }}
          className="p-1 rounded-md hover:bg-amber-100 transition-colors cursor-pointer"
          aria-expanded={isSubOpen}
          aria-label={`Toggle ${item.label} sub-items`}
        >
          <svg
            className={`h-3 w-3 text-primary-700 transition-transform duration-200 ${isSubOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Inline sub-list — expands below the parent item */}
      {isSubOpen && (
        <div className="ml-6 mr-3 mb-1 pl-2 p-2 space-y-2 rounded-md bg-white/10 backdrop-blur-sm border border-white/10">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="group/child flex items-center gap-3 px-3 py-2 transition-colors duration-150 hover:bg-white/20 rounded-md"
            >
              <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
              <span className={`text-sm font-medium transition-colors duration-150 ${isActive(child.href) ? 'text-amber-700' : 'text-gray-700 group-hover/child:text-amber-700'}`}>
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
      <span className="flex items-center gap-1 px-1 py-1 rounded-md text-sm text-gray-900 cursor-pointer transition-all duration-200 hover:bg-white/50 hover:text-primary-600">
        <span className="text-base">{icon}</span>
        {section.title}
        <svg className="ml-0.5 h-3.5 w-3.5 text-amber-500 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </span>

      {/* Dropdown panel */}
      <div className="absolute pt-3 min-w-[18rem] max-h-[80vh] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-20 right-0 origin-top-right">

        <div className="overflow-y-auto max-h-[75vh] rounded-xl border border-gray-100 bg-white shadow-lg">
          <div className="h-1 w-full bg-linear-to-r from-primary-700 via-primary-500 to-primary-400" />
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
        className="w-full flex items-center gap-2 rounded-xl bg-white px-4 py-2 mb-1 cursor-pointer"
        aria-expanded={expanded}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#9a3412] text-sm text-[#fff4df]">{icon}</span>
        <span className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">{section.title}</span>
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
                  className="flex-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[#6b3a17] transition-all duration-150 hover:bg-[#fde7c7] hover:text-[#7a2e1f]"
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
                      className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-[#6b5d4f] transition-all duration-150 hover:bg-[#fde7c7] hover:text-[#7a2e1f]"
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
    <header ref={headerRef} className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="h-px w-full bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-400" />
      <div className="flex items-center justify-between px-4 sm:px-2 lg:px-6 py-1 shadow-sm">
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
            <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-rose-600 to-indigo-700 drop-shadow-xl">
              {siteTitle}
            </span>
          </Link>
        </h1>

        {/* ─── Desktop Nav ─── */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navSections.map((section) => (
            <DesktopDropdown key={section.key} section={section} isActive={isActive} />
          ))}
          <div className="ml-2 pl-2 border-l border-transparent flex items-center gap-1">
            <LanguageDropdown />
          </div>
        </nav>

        {/* ─── Mobile Toggle ─── */}
        <div className="flex items-center md:hidden gap-2">
          <LanguageDropdown />
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
        <div className="md:hidden relative z-50 mt-1 overflow-hidden rounded-b-2xl border-t border-white/10 bg-white/30 backdrop-blur-md shadow-lg animate-fade-in-down">
          <div className="h-px w-full bg-linear-to-r from-primary-700 via-primary-500 to-primary-400" />
          <div className="flex flex-col gap-1 py-3 px-3 max-h-[70vh] overflow-y-auto">
            {navSections.map((section) => (
              <MobileNavSection
                key={section.key}
                section={section}
                isActive={isActive}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </div>
          <div className="h-px w-full bg-linear-to-r from-primary-400 via-primary-500 to-primary-700" />
        </div>
      )}
    </header>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */