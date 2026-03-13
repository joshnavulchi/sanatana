"use client";

import { getLocaleNamespaceObject } from '@lib/i18n';
import { useLocale } from '@app/context/locale-context';

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
  try {
    const ns = getLocaleNamespaceObject(locale, section);
    if (!ns || typeof ns !== 'object') return {};
    return unwrapNs(ns as Record<string, any>, section);
  } catch (_) {
    return {};
  }
}
