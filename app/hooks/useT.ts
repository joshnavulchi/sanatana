/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useLocale } from '../context/locale-context';
import { t as serverT, getLocaleObject } from '../../lib/i18n';
import { useState, useEffect } from 'react';

export function useT() {
  const { locale, isLoading } = useLocale();
  const [, forceUpdate] = useState(0);

  // Force re-render when locale finishes loading
  useEffect(() => {
    if (!isLoading) {
      const localeObj = getLocaleObject(locale);
      if (localeObj && typeof localeObj === 'object' && Object.keys(localeObj).length > 0) {
        // Avoid calling setState synchronously inside the effect body
        // to prevent cascading renders; schedule asynchronously.
        setTimeout(() => forceUpdate(prev => prev + 1), 0);
      }
    }
  }, [locale, isLoading]);

  // Heuristic to determine if a translation key likely represents a list/array
  const isLikelyListKey = (k: string) => {
    const last = k.split('.').pop() || '';
    const listIndicators = ['list', 'items', 'sections', 'structure', 'chapters', 'yugas', 'nav', 'pages'];
    if (listIndicators.some(ind => last.toLowerCase().includes(ind))) return true;
    // simple plural heuristic
    if (last.endsWith('s') && last.length > 2) return true;
    return false;
  };

  const humanizeKey = (k: string) => {
    const last = k.split('.').pop() || k;
    return last.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (key: string) => {
    // If locale isn't loaded yet, return a safe fallback.
    if (isLoading) {
      // For keys that look like lists, return undefined so `parseList` -> []
      if (isLikelyListKey(key)) return undefined as any;
      // For scalar keys, return a humanized fallback so UI shows readable text
      return humanizeKey(key) as any;
    }

    return serverT(key, locale);
  };
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
