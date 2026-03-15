/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useEffect, useState } from 'react';
import { DEFAULT_LOCALE } from '@lib/i18n';
import storage from '@lib/storage';

const LANGUAGE_STORAGE_KEY = "sanatana_dharma_language";

export function useLanguagePersistence() {
  const [language, setLanguage] = useState<string>(DEFAULT_LOCALE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasStoredLanguage, setHasStoredLanguage] = useState<boolean>(false);

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedLanguage: string | null = null;
      try {
        storedLanguage = storage.getItem(LANGUAGE_STORAGE_KEY);
      } catch (e) {
        storedLanguage = null;
      }
      if (storedLanguage) {
        setLanguage(storedLanguage);
        setHasStoredLanguage(true);
      } else {
        setLanguage(DEFAULT_LOCALE);
        setHasStoredLanguage(false);
      }
      setIsLoaded(true);
    }
  }, []);

  // Save language to localStorage
  const saveLanguage = (lang: string) => {
    setLanguage(lang);
    try {
      storage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setHasStoredLanguage(true);
    } catch (e) {
      // ignore storage errors
    }
  };

  return { language, saveLanguage, isLoaded, hasStoredLanguage };
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
