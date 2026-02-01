/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useLocale } from '../context/locale-context';
import { t as serverT, getLocaleObject, loadLocaleNamespace } from '../../lib/i18n';
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

    const resolved = serverT(key, locale);

    // If the translation wasn't found (serverT returned the original key),
    // attempt to load the namespace (client-only) and re-render when ready.
    if (typeof window !== 'undefined' && resolved === key) {
      try {
        const namespace = key.split('.')[0];
        console.debug('[useT] key missing, loading namespace', { key, namespace, locale });
        // Fire-and-forget: when the namespace finishes loading, force a rerender.
        loadLocaleNamespace(locale, namespace).then((ns) => {
          console.debug('[useT] loadLocaleNamespace resolved', { namespace, locale, has: !!ns });
          if (ns && Object.keys(ns).length > 0) {
            setTimeout(() => {
              console.debug('[useT] forcing update after namespace load', namespace);
              forceUpdate(prev => prev + 1);
            }, 0);
          }
        }).catch((err) => { console.warn('[useT] loadLocaleNamespace failed', err); });
      } catch (e) {
        console.warn('[useT] failed to start namespace load', e);
      }
    }

    return resolved;
  };
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
