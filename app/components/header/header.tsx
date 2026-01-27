/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useEffect, useRef, useState } from 'react';
import { useT } from '../../hooks/useT';
import { usePathname } from 'next/navigation';
import { getLocaleObject, loadLocale, DEFAULT_LOCALE } from '../../../lib/i18n';
import { useLocale } from '../../context/locale-context';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import LazyImage from '../lazy-image/LazyImage';

const LanguageDropdown = dynamic(() => import("../language-dropdown/language-dropdown"), { ssr: false });
// Start with default-locale fallbacks so header can render synchronously

import styles from './header.module.scss';

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const defaultObj = (getLocaleObject(DEFAULT_LOCALE) as Record<string, unknown>) || {};
  const defaultSiteTitle = (defaultObj?.siteTitle && (defaultObj.siteTitle?.siteTitle || defaultObj.siteTitle)) || (defaultObj?.sitetitle) || 'Sanātana Dharma';
  const defaultNav = (defaultObj?.nav as Record<string, unknown>) || {};
  const defaultBanner = (defaultObj && (defaultObj.bannerNotifications ?? defaultObj.banner ?? defaultObj.banner_notifications)) || null;
  const defaultBanner2 = (defaultObj && (defaultObj.bannerNotifications2 ?? defaultObj.banner2 ?? defaultObj.banner_notifications2)) || null;
  const [translations, setTranslations] = useState<{
    siteTitle: string;
    nav: Record<string, unknown>;
    banner: unknown;
    banner2: unknown;
  }>({
    siteTitle: defaultSiteTitle,
    nav: defaultNav,
    banner: defaultBanner,
    banner2: defaultBanner2,
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
    } catch {
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
      <div
        id={id}
        role="menu"
        aria-hidden={!open}
        style={style as React.CSSProperties}
        className={`absolute top-full w-56 rounded bg-white shadow-md overflow-hidden transition-all duration-150 transform origin-top ${positionLeft != null ? '' : alignClass} ${visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1"} ${styles.dropdownAnimate}`}
      >
        {children}
      </div>
    );
  }

  const { locale } = useLocale();
  const t = useT();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadLocale(locale);
        if (!mounted) return;
        const locObj = (getLocaleObject(locale) as Record<string, unknown>) || {}; // entire locale files getting
        const siteTitle = (locObj?.sitetitle) || 'Sanātana Dharma';
        const nav = (locObj?.nav as Record<string, unknown>) || {};
        // Support multiple key styles in locale files: snake_case (banner_notifications)
        // and camelCase (bannerNotifications). Prefer explicit banner keys when present.
        const banner = (locObj && (locObj.bannerNotifications ?? locObj.banner ?? locObj.banner_notifications)) || null;
        const banner2 = (locObj && (locObj.bannerNotifications2 ?? locObj.banner2 ?? locObj.banner_notifications2)) || null;
        setTranslations({ siteTitle, nav, banner, banner2 });
      } catch {
        // fallback to English (already in state)
      }
    })();
    return () => { mounted = false; };
  }, [locale]);

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
    <header ref={headerRef} className={`${styles.header} w-full sticky top-0 z-30 shadow-md`}>
      {/* <BannerNotifications id="first_banner" message={translations.banner} marquee="true" />
      {/* <BannerNotifications id="second_banner" message={translations.banner2} marquee="false" showClose={true} backgroundclass="notification-alternative-background-color" /> */}
      <div className={styles.logoTitleNavWrapper}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className={`${styles.logoTitle} logo flex items-center no-underline gap-2`}>
              <LazyImage
                src="/images/logo.png"
                alt="Sanatanadharmam Logo"
                width={80}
                height={72}
                sizes="(min-width:1024px) 40px, 80px"
                className="w-[80px] md:w-[40px]"
              />
              <span>
                {translations.siteTitle}
              </span>
            </Link>
          </div>
          <nav role="menubar" aria-label="Main navigation" className="hidden items-center md:flex">
            {(() => {
              const entries = Object.entries(translations.nav);
              const topKeys = entries.map(([k]) => k);
              // keys that render dropdowns on desktop (exclude simple links)
              const dropdownKeys = entries
                .filter(([k]) => !(k === 'home' || k === 'contact' || k === 'about' || k === 'donate'))
                .filter(([k, v]) => typeof v !== 'string')
                .map(([k]) => k);
              return entries.map(([key, val]: [string, unknown]) => {
                if (key === 'home') return null;
                if (key === 'contact') return null;
                if (key === 'about') return null;
                if (key === 'donate') return null;
                if (typeof val === "string") {
                  const href = key === "home" ? "/" : `/${key}`;
                  const className = key === "donate"
                    ? ` hover: hover:theme-text-color no-underline ${isActive(href) ? " " : " "}`
                    : `${isActive(href) ? "active" : ""}`;
                  return (
                    <Link role="menuitem" key={key} href={href} className={className}>
                      {val}
                    </Link>
                  );
                }

                const title = val.title ?? key;
                const children = val.nav ?? {};

                return (
                  <div
                    role="none"
                    key={key}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(key)}
                    onMouseLeave={() => setOpenDropdown((s) => (s === key ? null : s))}
                  >
                    <button
                      ref={(el) => { triggerRefs.current[key] = el; }}
                      role="menuitem"
                      className={`${styles.navPrimaryBtn} inline-flex items-center gap-1`}
                      aria-haspopup="true"
                      aria-expanded={openDropdown === key}
                      aria-controls={`submenu-${key}`}
                      onFocus={() => openDropdownForKey(key)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openDropdownForKey(key);
                          setTimeout(() => {
                            const arr = dropdownRefs.current[key] || [];
                            if (arr[0]) (arr[0] as HTMLElement).focus();
                          }, 50);
                          return;
                        }

                        const idx = topKeys.indexOf(key);
                        if (e.key === 'ArrowRight') {
                          e.preventDefault();
                          const next = topKeys[(idx + 1) % topKeys.length];
                          triggerRefs.current[next]?.focus();
                          return;
                        }
                        if (e.key === 'ArrowLeft') {
                          e.preventDefault();
                          const prev = topKeys[(idx - 1 + topKeys.length) % topKeys.length];
                          triggerRefs.current[prev]?.focus();
                          return;
                        }
                        if (e.key === 'Home') {
                          e.preventDefault();
                          triggerRefs.current[topKeys[0]]?.focus();
                          return;
                        }
                        if (e.key === 'End') {
                          e.preventDefault();
                          triggerRefs.current[topKeys[topKeys.length - 1]]?.focus();
                          return;
                        }

                        if (e.key === 'Escape') {
                          setOpenDropdown(null);
                          return;
                        }
                      }}
                    >
                      <span>{title}</span>
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {(() => {
                      const isDropdown = typeof val !== 'string';
                      const isLastTwo = isDropdown && dropdownKeys.indexOf(key) >= Math.max(0, dropdownKeys.length - 2);
                      const defaultAlign = isLastTwo ? 'right' : 'left';
                      const computedAlign = (val && val.align) ? val.align : (dropdownAligns[key] || defaultAlign);
                      const positionLeft = dropdownPositions[key];
                        return (
                        <DropdownPanel open={openDropdown === key} id={`submenu-${key}`} align={computedAlign} positionLeft={positionLeft}>
                          <ul role="list" className={`${styles.navPrimarySubmenu} flex flex-col`}>
                            {Object.entries(children).map(([cKey, cLabel], idx) => (
                              <li key={cKey}>
                                <Link
                                  href={`/${key}/${cKey}`}
                                  className="block"
                                  role="menuitem"
                                  tabIndex={0}
                                  ref={(el: HTMLAnchorElement | null) => {
                                    if (!dropdownRefs.current[key]) dropdownRefs.current[key] = [];
                                    dropdownRefs.current[key][idx] = el;
                                  }}
                                  onKeyDown={(e: React.KeyboardEvent) => {
                                    const arr = dropdownRefs.current[key] || [];
                                    if (e.key === 'ArrowDown') {
                                      e.preventDefault();
                                      const next = arr[idx + 1] ?? arr[0];
                                      next?.focus();
                                    }
                                    if (e.key === 'ArrowUp') {
                                      e.preventDefault();
                                      const prev = arr[idx - 1] ?? arr[arr.length - 1];
                                      prev?.focus();
                                    }
                                    if (e.key === 'Escape') {
                                      closeDropdown();
                                      setTimeout(() => triggerRefs.current[key]?.focus(), 0);
                                    }
                                  }}
                                >{cLabel as string}</Link>
                              </li>
                            ))}
                          </ul>
                        </DropdownPanel>
                      );
                    })()}
                    
                  </div>
                );
              });
            })()}
            <LanguageDropdown />
            {/* <ThemeToggle /> */}
          </nav>

          <div role="menu" className="flex items-center justify-center md:hidden">
            <LanguageDropdown />
            <button
              role="menuitem"
              aria-expanded={open}
              aria-label={open ? (t('nav.closeMenu') || 'Close menu') : (t('nav.openMenu') || 'Open menu')}
              onClick={() => setOpen((s) => !s)}
              className="inline-flex items-center justify-center rounded"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 32 32" stroke="currentColor" aria-hidden="true">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {open && (
          <div className={`md:hidden ${styles.mobile} border-t border-b border-white/50`}>
            <div role="menu" className={`${styles.mobilePrimaryMenu} flex flex-col`}>
                {Object.entries(translations.nav).map(([key, val]: [string, unknown]) => {
                if (key === 'home') return null;
                if (key === 'contact') return null;
                if (key === 'about') return null;
                if (key === 'donate') return null;
                if (typeof val === "string") {
                  const href = key === "home" ? "/" : `/${key}`;
                  return (
                    <Link key={key} href={href} className={`${isActive(href) ? "active" : ""}`}>{val}</Link>
                  );
                }

                const title = val.title ?? key;
                const children = val.nav ?? null;

                if (!children) {
                  const href = `/${key}`;
                  return <Link key={key} href={href} className={`${isActive(href) ? "active" : ""}`}>{title}</Link>;
                }

                const expanded = !!expandedKeys[key];
                return (
                  <div role="none" key={key} className="flex flex-col gap-2">
                    <button
                      onClick={() => setExpandedKeys((s) => ({ ...s, [key]: !s[key] }))}
                      role="menuitem"
                      className={`${styles.navPrimaryBtn} flex items-center justify-between w-full font-semibold`}
                      aria-expanded={expanded}
                    >
                      <span>{title}</span>
                      <svg className={`h-4 w-4 transform ${expanded ? "rotate-180" : "rotate-0"}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {expanded && (
                      <div className={`flex flex-col gap-2 ${styles.mobilePrimarySubmenu} overflow-hidden accordion-transition ${expanded ? "max-h-96" : "max-h-0"}`}>
                        {Object.entries(children).map(([cKey, cLabel]) => (
                          <Link key={cKey} href={`/${key}/${cKey}`} className={`${isActive(`/${key}/${cKey}`) ? "active" : ""}`}>{cLabel as string}</Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */