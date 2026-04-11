/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useLocale } from '@app/context/locale-context';
import { t as serverT, getLocaleNamespaceObject } from '@lib/i18n';
import { useState } from 'react';

export function useT() {
  const { locale, isLoading } = useLocale();
  const [, setForceUpdate] = useState(0);

  // Force re-render when locale finishes loading
  // No need to check getLocaleObject; re-rendering is handled by context/namespace hooks

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
        getLocaleNamespaceObject(locale, namespace).then((ns: any) => {
          console.debug('[useT] getLocaleNamespaceObject resolved', { namespace, locale, has: !!ns });
          if (ns && Object.keys(ns).length > 0) {
            setTimeout(() => {
              console.debug('[useT] forcing update after namespace load', namespace);
              setForceUpdate(prev => prev + 1);
            }, 0);
          }
        }).catch((err: any) => { console.warn('[useT] getLocaleNamespaceObject failed', err); });
      } catch (e) {
        console.warn('[useT] failed to start namespace load', e);
      }
    }

    return resolved;
  };
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

