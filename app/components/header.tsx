/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useEffect, useRef, useState } from 'react';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { usePathname } from 'next/navigation';
import { useLocale } from '@app/context/locale-context';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import LazyImage from './lazyimage';
import ThemeToggle from './theme-toggle/ThemeToggle';

const LanguageDropdown = dynamic(() => import("./language-dropdown/language-dropdown"), { ssr: false });

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
  const headerRef = useRef<HTMLElement | null>(null);

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

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

  if (!translations) return null;

  const sectionIcons: Record<string, string> = {
    scriptures: "📜",
    philosophy: "🧘",
    kidszone: "🧒",
  };

  return (
    <header ref={headerRef} className="w-full sticky top-0 z-30">
      {/* Ornamental top accent — saffron / gold / copper gradient */}
      <div className="h-[2] w-full bg-linear-to-r from-[#7c2d12] via-[#d97706] to-[#f59e0b]" />
      <div className="w-full bg-linear-to-r from-[#fffaf3] via-[#fdf0d7] to-[#fff8ef] shadow-[0_4px_20px_rgba(166,61,23,0.10)] px-4 py-1 md:px-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
              <span className="max-w-50 md:max-w-100 text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-700 drop-shadow-xl">
                {translations.siteTitle}
              </span>
            </Link>
          </h1>

          {/* ─── Desktop Nav ─── */}
          <nav className="hidden md:flex items-center gap-2" role="menubar" aria-label="Main navigation">
            {Object.entries(translations.header).map(([key, val]: [string, any]) => {
              if (typeof val === "string") {
                const href = key === "home" ? "/" : `/${key}`;
                return (
                  <Link key={key} href={href} role="menuitem"
                    className={`relative rounded-sm text-sm font-semibold p-1 tracking-wide transition-all duration-200
                      ${isActive(href) ? "bg-[#7a2e1f] text-[#fff4df] shadow-[0_2px_12px_rgba(122,46,31,0.22)]"
                        : "text-[#5b2d12] hover:bg-[#fde7c7] hover:text-[#7a2e1f]"
                      }`} >
                    {val}
                    {isActive(href) && (
                      <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-linear-to-r from-[#d97706] to-[#f59e0b]" />
                    )}
                  </Link>
                );
              }
              if (typeof val === "object" && val.title && val.nav) {
                const icon = sectionIcons[key] || "✨";
                return (
                  <div key={key} className="relative group">
                    <span className="flex items-center rounded-sm font-semibold p-1 tracking-wide text-[#5b2d12] cursor-pointer select-none transition-all duration-200 group-hover:bg-[#fde7c7] group-hover:text-[#7a2e1f]">
                      <span className="text-base">{icon}</span>
                      {val.title}
                      <svg className="ml-0.5 h-3.5 w-3.5 text-[#b45309] transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>

                    {/* Dropdown */}
                    <div className="absolute left-0 pt-3 min-w-60 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-20">
                      <div className="overflow-hidden rounded-2xl border border-[#d8a25a]/50 bg-[#fffaf0] shadow-[0_20px_50px_rgba(166,61,23,0.14)]">
                        {/* Gold accent bar */}
                        <div className="h-1 w-full bg-linear-to-r from-[#7c2d12] via-[#d97706] to-[#f59e0b]" />
                        <div className="py-2">
                          {Object.entries(val.nav).map(([subKey, subLabel]) => (
                            <Link
                              key={subKey}
                              href={`/${key}/${subKey}`}
                              role="menuitem"
                              className="group/item flex items-center gap-3 px-5 py-2.5 transition-all duration-150 hover:bg-linear-to-r hover:from-[#fde7c7]/70 hover:to-transparent"
                            >
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#9a3412]/10 text-md text-[#9a3412] transition-colors duration-150 group-hover/item:bg-[#9a3412] group-hover/item:text-[#fff4df]">
                                ◈
                              </span>
                              <span className="text-md font-semibold text-[#5b2d12] group-hover/item:text-[#7a2e1f]">
                                {String(subLabel)}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
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
            {/* Top accent */}
            <div className="h-0.5 w-full bg-linear-to-r from-[#7c2d12] via-[#d97706] to-[#f59e0b]" />

            <div className="flex flex-col gap-1 py-4 px-4 max-h-[70vh] overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
              {Object.entries(translations.header).map(([key, val]: [string, any]) => {
                if (typeof val === "string") {
                  const href = key === "home" ? "/" : `/${key}`;
                  return (
                    <Link
                      key={key}
                      href={href}
                      className={`block rounded-xl px-4 py-2.5 text-xl font-bold tracking-wide transition-all duration-150
                        ${isActive(href)
                          ? "bg-[#7a2e1f] text-[#fff4df] shadow-[0_2px_12px_rgba(122,46,31,0.18)]"
                          : "text-[#5b2d12] hover:bg-[#fde7c7] hover:text-[#7a2e1f]"
                        }`}
                      onClick={() => setOpen(false)}
                    >
                      {val}
                    </Link>
                  );
                }
                if (typeof val === "object" && val.title && val.nav) {
                  const icon = sectionIcons[key] || "✨";
                  return (
                    <div key={key} className="mt-1">
                      {/* Section header */}
                      <div className="flex items-center gap-2 rounded-xl bg-linear-to-r from-[#fde7c7]/80 to-transparent px-4 py-2 mb-1">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#9a3412] text-sm text-[#fff4df]">{icon}</span>
                        <span className="text-xl font-black tracking-wide text-[#7a2e1f]">{val.title}</span>
                        <div className="ml-auto h-px flex-1 bg-linear-to-r from-[#d8a25a]/40 to-transparent" />
                      </div>
                      {/* Sub-links */}
                      <div className="ml-4 border-l-2 border-[#d8a25a]/30 pl-3 flex flex-col gap-0.5">
                        {Object.entries(val.nav).map(([subKey, subLabel]) => (
                          <Link
                            key={subKey}
                            href={`/${key}/${subKey}`}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xl font-semibold text-[#6b3a17] transition-all duration-150 hover:bg-[#fde7c7] hover:text-[#7a2e1f]"
                            onClick={() => setOpen(false)}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-[#d97706]" />
                            {String(subLabel)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* Bottom ornament */}
            <div className="h-0.5 w-full bg-linear-to-r from-[#f59e0b] via-[#d97706] to-[#7c2d12]" />
          </div>
        )}
      </div>
    </header>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */