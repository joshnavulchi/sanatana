/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";
import { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLanguagePersistence } from '@app/hooks/useLanguagePersistence';
import { DEFAULT_LOCALE } from '@lib/i18n';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { useLocale } from '@app/context/locale-context';
// Use plain <img> for small globe icon to avoid next/image intermittent issues
import localesList from '@lib/localesList.json';
import localeMeta from '@lib/localeMeta.json';

export default function LanguageDropdown() {
  const locale = useLocaleSection('sharable_strings');
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

    // Only navigate if the URL is different
    if (newUrl !== `${pathname}?${searchParams.toString()}`) {
      await router.push(newUrl);
      try {
        router.refresh();
      } catch (e) {
        // ignore refresh errors
      }
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
        className="group relative inline-flex items-center gap-2 py-2 px-3 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 rounded-full border-2 border-amber-200 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform"
        aria-label={locale?.languagedropdown?.arialabel || 'Choose language'}
        aria-expanded={open}
      >
        <div className="relative">
          <img src="/images/svg/ml.svg" alt={locale?.languagedropdown?.iconalt || 'Language selector'} width={24} height={24} className="transition-transform duration-300 group-hover:rotate-12" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
        </div>
        {isClient && (
          <span className="hidden md:flex text-md md:text-sm group-hover:text-amber-700 transition-colors duration-300">
            {currentLanguage?.nativeName || locale?.languagedropdown?.english || 'English'}
          </span>
        )}
        <svg className={`w-6 h-5 text-amber-800 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} fill="none" stroke="#F97316" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Popup Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="language-dialog-title">
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)} />

          {/* Modal Container */}
          <div ref={dropdownRef} className="relative bg-white rounded-3xl w-full max-w-3xl shadow-2xl border-2 border-amber-200 overflow-hidden transform animate-scale-in">
            {/* Decorative gradient header */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400"></div>

            {/* Header */}
            <div role="group" className="relative flex items-center justify-between p-6 bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-50 border-b-2 border-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.490 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 id="language-dialog-title" className="text-md md:text-md font-bold text-gray-900">{locale?.languagedropdown?.title || 'Choose language'}</h2>
                  <p className="text-md md:text-md text-gray-600">{filteredLanguages.length} languages available</p>
                </div>
              </div>
              <button
                role="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="group w-10 h-10 flex items-center justify-center bg-white  hover:bg-red-50 border-2 border-amber-200 hover:border-red-300 rounded-full transition-all duration-300 cursor-pointer transform hover:rotate-90 hover:scale-110 shadow-md"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Input */}
            <div className="p-6 bg-gradient-to-br from-white to-amber-50/30 ">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-amber-800 group-focus-within:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
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
                  placeholder={locale?.languagedropdown?.searchplaceholder || 'Search languages...'}
                  className="w-full px-12 py-3 bg-white border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all duration-300 text-gray-900 placeholder-gray-400 shadow-sm hover:shadow-md"
                  aria-label={locale?.languagedropdown?.searcharia || 'Search languages'}
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-amber-100 hover:bg-amber-200 rounded-full transition-colors duration-300"
                    aria-label="Clear search"
                  >
                    <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Language List */}
            <div id="language-menu" role="menu" className="max-h-96 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-amber-400 scrollbar-track-amber-100 ">
              <div className="flex flex-wrap gap-3">
                {filteredLanguages.map((lang, idx) => {
                  const meta = (localeMeta as any)[lang.code] || {};
                  const flag = meta.flag || '';
                  const region = meta.region || lang.name;
                  const isSelected = currentLang === lang.code;
                  const isHighlighted = highlighted === idx;
                  return (
                    <button
                      key={lang.code}
                      role="menuitem"
                      onMouseEnter={() => {
                        setHighlighted(idx);
                      }}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`
                        group relative flex-1 md:min-w-[calc(50%-0.375rem)] flex items-center gap-3 p-4 rounded-xl
                        transition-all duration-300 transform hover:-translate-y-1
                        ${isSelected
                          ? 'bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-500 shadow-lg'
                          : isHighlighted
                            ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 shadow-md'
                            : 'bg-white border-2 border-amber-200/50 hover:border-amber-300 shadow-sm hover:shadow-md'
                        }
                      `}
                    >
                      {/* Flag Icon */}
                      <div className={`
                        flex-shrink-0 w-12 h-12 flex items-center justify-center text-3xl rounded-xl transition-all duration-300
                        ${isSelected
                          ? 'bg-white/50 shadow-md scale-110'
                          : 'bg-amber-50 group-hover:scale-110'
                        }
                      `} aria-hidden="true">
                        {flag}
                      </div>

                      {/* Language Info */}
                      <div className="flex-1 text-left min-w-0">
                        <div className={`
                          font-semibold truncate transition-colors duration-300
                          ${isSelected
                            ? 'text-amber-900'
                            : 'text-gray-900 group-hover:text-amber-700'
                          }
                        `}>
                          {lang.nativeName}
                        </div>
                        <div className={`
                          text-md truncate transition-colors duration-300
                          ${isSelected
                            ? 'text-amber-700'
                            : 'text-gray-600'
                          }
                        `}>
                          {region}
                        </div>
                      </div>

                      {/* Check Icon */}
                      {isSelected && (
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}

                      {/* Hover indicator arrow */}
                      {!isSelected && (
                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg className="w-4 h-4 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* No results message */}
              {filteredLanguages.length === 0 && (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 bg-amber-100  rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">No languages found</p>
                  <p className="text-md text-gray-500 mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */