/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLanguagePersistence } from '../../hooks/useLanguagePersistence';

import { DEFAULT_LOCALE, loadLocale } from '../../../lib/i18n';
import { useT } from '../../hooks/useT';
import { useLocale } from '../../context/locale-context';
// Use plain <img> for small globe icon to avoid next/image intermittent issues
import localesList from '../../../lib/localesList.json';
import localeMeta from '../../../lib/localeMeta.json';

import styles from './langdropdown.module.scss';

export default function LanguageDropdown() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(DEFAULT_LOCALE);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { language, saveLanguage, isLoaded, hasStoredLanguage } = useLanguagePersistence();
  const { setLocale } = useLocale();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const debounceRef = useRef<number | null>(null);
  const [highlighted, setHighlighted] = useState(-1);

  // Set client flag and load stored language
  useEffect(() => {
    // Schedule state updates to avoid synchronous setState-in-effect
    setTimeout(() => setIsClient(true), 0);
    // First check URL params, then fall back to stored language
    const urlLang = searchParams?.get("lang");
    if (urlLang) {
      setTimeout(() => setCurrentLang(urlLang), 0);
    } else if (language) {
      setTimeout(() => setCurrentLang(language), 0);
    }
  }, [searchParams, language]);

  // Auto-open popup when there is no stored language after load
  useEffect(() => {
    if (isLoaded && !hasStoredLanguage) {
      setTimeout(() => setOpen(true), 0);
    }
  }, [isLoaded, hasStoredLanguage]);

  // focus the search input when popup opens
  useEffect(() => {
    if (open) {
      setTimeout(() => searchInputRef.current?.focus(), 10);
      // initialize highlighted to current language index once open
      setTimeout(() => setHighlighted(-1), 0);
    } else {
      setTimeout(() => setQuery(''), 0);
      setTimeout(() => setSearchTerm(''), 0);
      setTimeout(() => setHighlighted(-1), 0);
    }
  }, [open]);

  // debounce the query to update searchTerm
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    // 180ms debounce
    debounceRef.current = window.setTimeout(() => setSearchTerm(query.trim()), 180) as unknown as number;
    return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current); };
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleLanguageChange = async (langCode: string) => {
    // ensure locale is loaded in client cache before switching
    try {
      await loadLocale(langCode);
    } catch (e) {
      // ignore preload errors
    }
    setCurrentLang(langCode);
    setOpen(false);

    // Save to localStorage
    saveLanguage(langCode);

    // Also set a cookie so server-side rendering can pick up the new language
    try {
      // 1 year
      const maxAge = 60 * 60 * 24 * 365;
      document.cookie = `sanatana_dharma_language=${langCode}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
    } catch (e) {
      // ignore cookie set errors
    }

    // Update client context so client components re-render immediately
    try {
      setLocale(langCode);
    } catch (e) {
      // ignore
    }

    // Build new URL with language parameter
    const params = new URLSearchParams(searchParams);
    params.set("lang", langCode);

    const newUrl = `${pathname}?${params.toString()}`;

    // Push the new URL and refresh server components so metadata and server-rendered
    // content use the updated cookie/locale immediately.
    await router.push(newUrl);
    try {
      router.refresh();
    } catch (e) {
      // ignore refresh errors
    }
  };

  const allLanguages = Array.isArray(localesList) ? localesList : [];
  const currentLanguage = allLanguages.find((lang) => lang.code === currentLang);
  const filteredLanguages = useMemo(() => {
    const q = (searchTerm || '').toLowerCase();
    if (!q) return allLanguages;
    return allLanguages.filter((lang) => {
      return (
        (lang.code || '').toLowerCase().includes(q) ||
        (lang.name || '').toLowerCase().includes(q) ||
        (lang.nativeName || '').toLowerCase().includes(q)
      );
    });
  }, [allLanguages, searchTerm]);

  // keep highlighted index in bounds when filteredLanguages change
  useEffect(() => {
    if (!open) return;
    if (filteredLanguages.length === 0) {
      setTimeout(() => setHighlighted(-1), 0);
      return;
    }
    // if no highlighted, set to index of current language or 0
    if (highlighted < 0) {
      const idx = filteredLanguages.findIndex((l) => l.code === currentLang);
      setTimeout(() => setHighlighted(idx >= 0 ? idx : 0), 0);
    } else if (highlighted >= filteredLanguages.length) {
      setTimeout(() => setHighlighted(filteredLanguages.length - 1), 0);
    }
  }, [filteredLanguages, open, currentLang]);

  return (
    <div role="menuItem" ref={dropdownRef} className="relative">
      {/* Dropdown Button */}
      <button
        role="button"
        aria-haspopup="menu"
        aria-controls="language-menu"
        onClick={() => setOpen(!open)}
        className={`${styles.langbtn} inline-flex items-center cursor-pointer`}
        aria-label={t('sharable_strings.languagedropdown.arialabel')}
        aria-expanded={open}
      >
        <img src="/images/svg/ml.svg" alt={t('sharable_strings.languagedropdown.iconalt')} width={20} height={20} />
        {isClient && (
          <span className="font-sm sr-only">{currentLanguage?.nativeName || t('sharable_strings.languagedropdown.english')}</span>
        )}
      </button>

      {/* Popup Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="language-dialog-title">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div ref={dropdownRef} className={`${styles.multilang} rounded-md w-11/12 max-w-md md:w-auto md:max-w-xl shadow-lg border`}>
            <div role="group" className="flex items-center justify-between">
              <div id="language-dialog-title" className="font-semibold">{t('sharable_strings.languagedropdown.title') || 'Choose language'}</div>
              <button role="button" aria-label="Close" onClick={() => setOpen(false)} className="cursor-pointer">✕</button>
            </div>
            <div className="search-wrapper">
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setHighlighted((h) => Math.min(filteredLanguages.length - 1, Math.max(0, h + 1)));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setHighlighted((h) => Math.max(0, h - 1));
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (highlighted >= 0 && filteredLanguages[highlighted]) {
                      handleLanguageChange(filteredLanguages[highlighted].code);
                    }
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    setOpen(false);
                  }
                }}
                placeholder={t('sharable_strings.languagedropdown.searchplaceholder') || 'Search languages...'}
                className={`${styles.langsearchinput} w-full rounded border theme-border-color`}
                aria-label={t('sharable_strings.languagedropdown.searcharia') || 'Search languages'}
              />
            </div>
            <div id="language-menu" role="menu" className="max-h-96 overflow-y-auto md:flex md:flex-wrap">
              {filteredLanguages.map((lang, idx) => {
                const meta = (localeMeta as any)[lang.code] || {};
                const flag = meta.flag || '';
                const region = meta.region || lang.name;
                return (
                  <button
                    key={lang.code}
                    role="menuitem"
                    onMouseEnter={() => {
                      setHighlighted(idx);
                      // non-blocking preload when user hovers a language
                      try { loadLocale(lang.code); } catch (e) { /* ignore */ }
                    }}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full md:w-1/2 flex items-center justify-between text-left transition-colors ${currentLang === lang.code ? "" : ""} ${highlighted === idx ? 'border ' : 'border '}`}
                  >
                    <div className={`${styles.langbox} flex items-center`}>
                      <div aria-hidden>{flag}</div>
                      <div className="nowrap">
                        <div className="font-semibold">{lang.nativeName}</div>
                        <div>{region}</div>
                      </div>
                    </div>
                    {currentLang === lang.code && (
                      <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */