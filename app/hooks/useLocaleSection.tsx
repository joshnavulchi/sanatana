"use client";

import { useEffect, useState } from 'react';
import { loadLocaleNamespace, getLocaleNamespaceObject } from '@lib/i18n';
import { useLocale } from '@app/context/locale-context';

// Hook: read a primary locale file/object for a component.
// - `section` is the primary filename (e.g., 'sharable_strings', 'home', 'about')
// Returns the resolved object (may be {} until loaded).
/**
 * Unwrap a loaded namespace object.
 * Priority:
 *   1. ns[section]  — key matches section name
 *   2. If ns has exactly ONE top-level key that is a plain object → unwrap it
 *   3. ns as-is
 */
function unwrapNs(ns: Record<string, any>, section: string): Record<string, any> {
  if (ns[section] && typeof ns[section] === 'object' && !Array.isArray(ns[section])) {
    return ns[section];
  }
  const keys = Object.keys(ns);
  if (keys.length === 1 && typeof ns[keys[0]] === 'object' && !Array.isArray(ns[keys[0]])) {
    return ns[keys[0]];
  }
  return ns;
}

export default function useLocaleSection(section: string) {
  const { locale } = useLocale();
  const [obj, setObj] = useState<Record<string, any>>(() => {
    // Start with empty object to avoid hydration mismatch
    // Server-side namespace loading will happen in useEffect
    if (typeof window === 'undefined') {
      try {
        const ns = getLocaleNamespaceObject(locale, section);
        if (ns && typeof ns === 'object') {
          return unwrapNs(ns, section);
        }
      } catch (_) { }
    }
    return {};
  });

  useEffect(() => {
    let cancelled = false;

    // Try to load namespace file for this section
    loadLocaleNamespace(locale, section).then((ns: any) => {
      if (cancelled) return;
      if (!ns || typeof ns !== 'object') return;

      const payload = unwrapNs(ns, section);
      if (payload && typeof payload === 'object') {
        setObj(payload);
      }
    }).catch(() => { });

    return () => { cancelled = true; };
  }, [locale, section]);

  return obj;
}
