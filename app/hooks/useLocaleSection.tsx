"use client";

import { useEffect, useState } from 'react';
import { getLocaleObject, loadLocaleNamespace } from '../../lib/i18n';
import { useLocale } from '../context/locale-context';

// Hook: read a primary locale file/object for a component.
// - `section` is the primary filename (e.g., 'sharable_strings', 'home', 'header')
// Returns the resolved object (may be {} until loaded).
export default function useLocaleSection(section: string) {
  const { locale } = useLocale();
  const [obj, setObj] = useState<Record<string, any>>(() => {
    try {
      const full = getLocaleObject(locale) as any;
      if (!full) return {};
      // prefer top-level file, else fall back to sharable_strings
      return full[section] || (full.sharable_strings && full.sharable_strings[section]) || (section === 'sharable_strings' ? (full.sharable_strings || {}) : {});
    } catch (_) { return {}; }
  });

  useEffect(() => {
    let cancelled = false;
    try {
      const full = getLocaleObject(locale) as any;
      if (full && (full[section] || (full.sharable_strings && full.sharable_strings[section]) || (section === 'sharable_strings' && full.sharable_strings))) {
        const val = full[section] || (full.sharable_strings && full.sharable_strings[section]) || (section === 'sharable_strings' ? full.sharable_strings : {});
        setObj(val || {});
        return;
      }
    } catch (_) { }

    loadLocaleNamespace(locale, section).then((ns: any) => {
      if (cancelled) return;
      const payload = ns && ns[section] ? ns[section] : ns;
      if (payload) setObj(payload);
    }).catch(() => { });

    return () => { cancelled = true; };
  }, [locale, section]);

  return obj;
}
