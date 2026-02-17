"use client";

import { useEffect, useState } from 'react';
import { loadLocaleNamespace, getLocaleNamespaceObject } from '@lib/i18n';
import { useLocale } from '@app/context/locale-context';

// Hook: read a primary locale file/object for a component.
// - `section` is the primary filename (e.g., 'sharable_strings', 'home', 'about')
// Returns the resolved object (may be {} until loaded).
export default function useLocaleSection(section: string) {
  const { locale } = useLocale();
  const [obj, setObj] = useState<Record<string, any>>(() => {
    // Start with empty object to avoid hydration mismatch
    // Server-side namespace loading will happen in useEffect
    if (typeof window === 'undefined') {
      try {
        const ns = getLocaleNamespaceObject(locale, section);
        if (ns && typeof ns === 'object') {
          // Handle nested structure: { "section": { ...data } }
          if ((ns as any)[section]) {
            return (ns as any)[section];
          }
          return ns;
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
      
      // Handle nested structure: { "section": { ...data } }
      // or direct structure: { ...data }
      const payload = ns[section] ? ns[section] : ns;
      if (payload && typeof payload === 'object') {
        setObj(payload);
      }
    }).catch(() => { });

    return () => { cancelled = true; };
  }, [locale, section]);

  return obj;
}
