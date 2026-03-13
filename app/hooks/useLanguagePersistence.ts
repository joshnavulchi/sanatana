/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
// Server-only: language persistence handled via cookies/URL
export function useLanguagePersistence(locale: string) {
  // No-op for client, language is determined server-side
  return {
    language: locale,
    saveLanguage: () => {},
    isLoaded: true,
    hasStoredLanguage: false,
  };
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
