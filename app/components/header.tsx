/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useEffect, useRef, useState } from 'react';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { usePathname } from 'next/navigation';
// import { loadLocaleNamespace, DEFAULT_LOCALE } from '@lib/i18n';
import { useLocale } from '@app/context/locale-context';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import LazyImage from './lazyimage';
// import BannerNotifications from './bannernotifications';
import ThemeToggle from './theme-toggle/ThemeToggle';

const LanguageDropdown = dynamic(() => import("./language-dropdown/language-dropdown"), { ssr: false });
// Start with default-locale fallbacks so header can render synchronously

// Default fallback values
const defaultSiteTitle = 'Sanātana Dharma';
const defaultHeader = {};
const defaultBanner = null;
const defaultBanner2 = null;

export default function Header() {
  // Responsive logo width state
  const [logoWidth, setLogoWidth] = useState(50);
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setLogoWidth(50); // mobile
      } else {
        setLogoWidth(45); // tablet
      }
    }
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [translations, setTranslations] = useState<any>({
    siteTitle: 'Sanātana Dharma',
    header: {},
    banner: null,
    banner2: null,
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});
  const [dropdownAligns, setDropdownAligns] = useState<Record<string, 'left' | 'center' | 'right'>>({});
  const [dropdownPositions, setDropdownPositions] = useState<Record<string, number>>({});
  const dropdownRefs = useRef<Record<string, (HTMLElement | null)[]>>({});
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const headerRef = useRef<HTMLElement | null>(null);
  const lastOpenKeyRef = useRef<string | null>(null);

  const openDropdownForKey = (k: string) => {
    lastOpenKeyRef.current = k;
    try {
      const trigger = triggerRefs.current[k];
      if (trigger && typeof window !== 'undefined') {
        const rect = trigger.getBoundingClientRect();
        const dropdownWidth = 14 * 16; // w-56 -> 14rem * 16px
        const padding = 12; // keep a small padding from viewport edge
        // compute left so panel stays within viewport
        let left = Math.max(padding, rect.left);
        if (left + dropdownWidth > window.innerWidth - padding) {
          // align to the right edge of viewport minus dropdown width
          left = Math.max(padding, window.innerWidth - padding - dropdownWidth);
          setDropdownAligns((s) => ({ ...s, [k]: 'right' }));
        } else {
          setDropdownAligns((s) => ({ ...s, [k]: 'left' }));
        }
        setDropdownPositions((s) => ({ ...s, [k]: Math.round(left) }));
      }
    } catch (e) {
      // ignore measurement errors
    }
    setOpenDropdown(k);
  };
  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  // Small animated panel used for desktop submenus so open/close animate
  function DropdownPanel({ open, id, align = 'left', positionLeft, children }: { open: boolean; id?: string; align?: 'left' | 'center' | 'right'; positionLeft?: number; children: React.ReactNode }) {
    const [render, setRender] = useState(open);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
      if (open) {
        setRender(true);
        // next tick so transition from initial -> visible runs
        requestAnimationFrame(() => setVisible(true));
      } else {
        setVisible(false);
        const t = setTimeout(() => setRender(false), 160);
        return () => clearTimeout(t);
      }
    }, [open]);

    if (!render) return null;
    const alignClass = align === 'center' ? 'left-1/2 -translate-x-1/2' : (align === 'right' ? 'right-0' : 'left-0');
    const style = positionLeft != null ? { left: `${positionLeft}px` } : undefined;
    return (
      <div id={id} role="menu" aria-hidden={!open} style={style as any} className={`absolute top-full w-56 rounded bg-white shadow-md overflow-hidden transition-all duration-150 transform origin-top ${positionLeft != null ? '' : alignClass} ${visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1"} `}>
        {children}
      </div>
    );
  }

  // Use centralized hook to read `sharable_strings` section (synchronous if cached,
  // otherwise will fetch and update state). Keeps pattern consistent with footer.
  const sharable = useLocaleSection('sharable_strings');
  useEffect(() => {
    if (sharable && Object.keys(sharable).length > 0) {
      const siteTitle = sharable?.sitetitle || defaultSiteTitle;
      const header = sharable?.header || defaultHeader;
      const banner = (sharable?.bannerNotifications ?? sharable?.banner ?? sharable?.banner_notifications) || defaultBanner;
      const banner2 = (sharable?.bannerNotifications2 ?? sharable?.banner2 ?? sharable?.banner_notifications2) || defaultBanner2;
      setTranslations({ siteTitle, header, banner, banner2 });
    }
  }, [sharable]);

  const normalize = (p?: string) => {
    if (!p) return "/";
    if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
    return p;
  };

  const isActive = (href: string) => normalize(pathname) === normalize(href);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setOpenDropdown(null);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close mobile menu and collapse expanded sections when navigation changes
  useEffect(() => {
    // Close the mobile drawer and any open dropdowns when pathname changes
    setOpen(false);
    setExpandedKeys({});
    setOpenDropdown(null);
  }, [pathname]);

  // Click outside to close dropdowns
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const target = e.target as Node | null;
      if (!headerRef.current) return;
      if (target && headerRef.current.contains(target)) return;
      // clicked outside header
      closeDropdown();
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  // When a dropdown closes (openDropdown becomes null) return focus to its trigger
  useEffect(() => {
    if (openDropdown === null && lastOpenKeyRef.current) {
      const key = lastOpenKeyRef.current;
      // give the DOM a tick in case focus changes concurrently
      setTimeout(() => {
        triggerRefs.current[key]?.focus();
      }, 0);
      lastOpenKeyRef.current = null;
    }
  }, [openDropdown]);

  if (!translations) return null;

  return (
    <header ref={headerRef} className={`w-full sticky top-0 z-30 shadow-md`}>
      {/* <BannerNotifications id="first_banner" message={translations.banner} marquee="true" />
      {/* <BannerNotifications id="second_banner" message={translations.banner2} marquee="false" showClose={true} backgroundclass="notification-alternative-background-color" /> */}
      <div className="w-full px-4 md:px-0 bg-white/95 shadow-md sticky top-0 z-30 py-1">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and Title */}
          <h1 className="m-0 p-0">
            <Link href="/" className="flex items-center gap-1 group">
              <LazyImage
                src="/images/logo.png"
                alt="Sanatanadharmam Logo"
                width={logoWidth}
                height={40}
                className="md:flex"
              />
              <span className="max-w-50 md:max-w-100 text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-700 drop-shadow-xl">
                {translations.siteTitle}
              </span>
            </Link>
          </h1>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2" role="menubar" aria-label="Main navigation">
            {Object.entries(translations.header).map(([key, val]: [string, any]) => {
              if (typeof val === "string") {
                const href = key === "home" ? "/" : `/${key}`;
                return (
                  <Link key={key} href={href} role="menuitem" className={`px-4 py-2 rounded-lg font-semibold text-amber-800 hover:bg-amber-100 hover:text-orange-700 transition-colors duration-150 ${isActive(href) ? "bg-orange-100 text-orange-700" : ""}`}>
                    {val}
                  </Link>
                );
              }
              // Dropdown nav: flatten and show all children as sub-links
              if (typeof val === "object" && val.title && val.nav) {
                // Unique icon per section (simple emoji, can be replaced with SVG)
                const sectionIcons: Record<string, string> = {
                  scriptures: "📜",
                  philosophy: "🧘",
                  kidszone: "🧒",
                };
                const icon = sectionIcons[key as string] || "✨";
                return (
                  <div key={key} className="relative group">
                    <span className="px-3 py-2 rounded-lg font-semibold text-amber-800 group-hover:bg-amber-100 group-hover:text-orange-700 transition-colors duration-150 cursor-pointer select-none flex items-center gap-1">
                      <span className="text-md md:text-lg">{icon}</span> {val.title}
                    </span>
                    <div className="absolute left-0 pt-2 min-w-[220px] bg-white border border-amber-200 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-20 animate-fade-in-down overflow-hidden">
                      {/* Accent bar */}
                      <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300" />
                      {Object.entries(val.nav).map(([subKey, subLabel], idx) => (
                        <Link key={subKey} href={`/${key}/${subKey}`} role="menuitem" className="flex items-center gap-3 px-5 py-2 text-amber-800 rounded transition-colors duration-150 hover:bg-orange-100 hover:text-orange-700 focus:bg-orange-200 focus:text-orange-800" style={{ animationDelay: `${idx * 40}ms` }}>
                          <span className="text-base">🔸</span>
                          <span>{String(subLabel)}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })}
            <LanguageDropdown />
            <ThemeToggle />
          </nav>

          {/* Mobile Nav Toggle */}
          <div className="flex items-center md:hidden gap-2">
            <LanguageDropdown />
            <ThemeToggle />
            <button aria-label="Open menu" onClick={() => setOpen((s) => !s)} className="inline-flex items-center justify-center rounded-lg hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400">
              <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 32 32" stroke="currentColor" aria-hidden="true">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h24M4 16h24M4 24h24" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {open && (
          <div className="md:hidden relative z-50 bg-white/95 border-t border-b border-amber-100 shadow-lg animate-fade-in-down">
            <div className="flex flex-col gap-2 py-4 px-4 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-400 scrollbar-track-amber-100" style={{ WebkitOverflowScrolling: 'touch' }}>
              {Object.entries(translations.header).map(([key, val]: [string, any]) => {
                if (typeof val === "string") {
                  const href = key === "home" ? "/" : `/${key}`;
                  return (
                    <Link key={key} href={href} className={`block px-4 py-2 rounded-lg font-semibold text-amber-800 hover:bg-amber-100 hover:text-orange-700 transition-colors duration-150 ${isActive(href) ? "bg-orange-100 text-orange-700" : ""}`} onClick={() => setOpen(false)}>
                      {val}
                    </Link>
                  );
                }
                // Dropdown nav: flatten and show all children as sub-links
                if (typeof val === "object" && val.title && val.nav) {
                  const sectionIcons: Record<string, string> = {
                    scriptures: "📜",
                    philosophy: "🧘",
                    kidszone: "🧒",
                  };
                  const icon = sectionIcons[key as string] || "✨";
                  return (
                    <div key={key} className="flex flex-col border-l-4 border-orange-300 pl-2 mb-2">
                      <span className="px-4 py-2 rounded-lg font-semibold text-amber-800 bg-amber-50 mb-1 select-none flex items-center gap-2">
                        <span className="text-md md:text-lg">{icon}</span> {val.title}
                      </span>
                      {Object.entries(val.nav).map(([subKey, subLabel]) => (
                        <Link
                          key={subKey}
                          href={`/${key}/${subKey}`}
                          className="flex items-center gap-2 px-7 py-2 text-amber-700 rounded transition-colors duration-150 hover:bg-orange-100 hover:text-orange-700 focus:bg-orange-200 focus:text-orange-800"
                          onClick={() => setOpen(false)}
                        >
                          <span className="text-base">🔸</span>
                          <span>{String(subLabel)}</span>
                        </Link>
                      ))}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */