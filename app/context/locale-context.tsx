"use client";

/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createContext, useContext, useMemo } from 'react';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, t as translate } from '@lib/i18n';

type LocaleContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, localeOverride?: string) => string;
  isLoading: boolean;
};

const normalizeLocale = (value?: string | null) => {
  const candidate = String(value || '').trim();
  if (!candidate) return DEFAULT_LOCALE;
  return SUPPORTED_LOCALES.includes(candidate) ? candidate : DEFAULT_LOCALE;
};

const defaultLocaleContext: LocaleContextType = {
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key: string, localeOverride?: string) =>
    String(translate(key, localeOverride ?? DEFAULT_LOCALE)),
  isLoading: false,
};

const LocaleContext = createContext<LocaleContextType>(defaultLocaleContext);

export function LocaleProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale?: string;
}) {
  const resolvedLocale = useMemo(() => normalizeLocale(locale), [locale]);

  return (
    <LocaleContext.Provider
      value={{
        locale: resolvedLocale,
        setLocale: () => {},
        t: (key: string, localeOverride?: string) =>
          String(translate(key, localeOverride ?? resolvedLocale)),
        isLoading: false,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
