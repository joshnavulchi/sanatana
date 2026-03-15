/* Cleaned minimal i18n utilities used by the app. */
export const DEFAULT_LOCALE = "en";
import storage from "./storage";

export const SUPPORTED_LOCALES = [
  'ar', 'de', 'en', 'es', 'fr', 'hi', 'ja', 'ru', 'te', 'zh-CN'
];

const REMOTE_LOCALES_BASE = process.env.NEXT_PUBLIC_REMOTE_LOCALES_BASE || '';

const localesCache: Record<string, unknown> = {};
const warnedMissingKeys = new Set<string>();

function normalizeSupportedLocale(input: string | undefined): string {
  const raw = String(input || '').trim();
  if (!raw) return DEFAULT_LOCALE;
  if (SUPPORTED_LOCALES.includes(raw)) return raw;

  const primary = raw.split('-')[0];
  if (SUPPORTED_LOCALES.includes(primary)) return primary;

  const byPrimary = SUPPORTED_LOCALES.find((l) => l.split('-')[0] === primary);
  if (byPrimary) return byPrimary;

  return DEFAULT_LOCALE;
}

export function normalizeLocale(input: string | undefined): string {
  return normalizeSupportedLocale(input);
}

export function setCachedLocaleNamespace(locale: string, namespace: string, value: unknown) {
  const normalized = normalizeSupportedLocale(locale);
  if (!normalized || !namespace) return;

  if (!localesCache[normalized] || typeof localesCache[normalized] !== 'object') {
    localesCache[normalized] = {} as Record<string, unknown>;
  }

  try {
    (localesCache[normalized] as Record<string, unknown>)[namespace] = value;
  } catch (_) {
    // ignore
  }
}

// Hydrate cache from server-injected global if present
if (typeof window !== 'undefined') {
  try {
    const globalCache = (globalThis as any).__LOCALE_CACHE__;
    if (globalCache && typeof globalCache === 'object') {
      for (const k of Object.keys(globalCache)) {
        if (!localesCache[k]) localesCache[k] = globalCache[k];
      }
    }
  } catch (_) { }
}



export function getLocaleNamespaceObject(locale = DEFAULT_LOCALE, namespace = ''): any {
  // Support callers that pass the namespace as the first (and only) argument
  // e.g. `getLocaleNamespaceObject('scriptures_vedas')` — treat that as
  // `getLocaleNamespaceObject(DEFAULT_LOCALE, 'scriptures_vedas')`.
  if (!namespace && typeof locale === 'string' && !SUPPORTED_LOCALES.includes(locale)) {
    namespace = locale;
    locale = DEFAULT_LOCALE;
  }
  locale = normalizeSupportedLocale(locale);
  if (!namespace) return {};
  const localeEntry = localesCache[locale];
  if (!localeEntry || typeof localeEntry !== 'object') return {};

  const localeMap = localeEntry as Record<string, unknown>;
  const candidates = [
    namespace,
    namespace.replace(/-/g, '_'),
    namespace.replace(/_/g, '-'),
  ];

  for (const candidate of candidates) {
    const parsed = localeMap[candidate];
    if (parsed) {
      return parsed;
    }
  }

  return {};
}

export async function loadLocaleNamespace(locale: string, namespace: string) {
  if (!locale || !namespace) return {};
  locale = normalizeSupportedLocale(locale);
  if (!localesCache[locale] || typeof localesCache[locale] !== 'object') localesCache[locale] = {} as any;
  const existing = (localesCache[locale] as any)[namespace];
  if (existing) return existing;

  // Try various naming patterns for the namespace file
  const candidates = [
    namespace,
    namespace.replace(/-/g, '_'),
    namespace.replace(/_/g, '-'),
  ];

  // Server-side: read namespace JSON directly from public/locales.
  if (typeof window === 'undefined') {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const roots = [locale, DEFAULT_LOCALE].filter((v, i, a) => a.indexOf(v) === i);

      for (const rootLocale of roots) {
        for (const candidate of candidates) {
          try {
            const filePath = path.join(process.cwd(), 'public', 'locales', rootLocale, `${candidate}.json`);
            const raw = await fs.readFile(filePath, 'utf8');
            const parsed = JSON.parse(raw);
            try {
              (localesCache[locale] as any)[namespace] = parsed;
              (localesCache[locale] as any)[candidate] = parsed;
            } catch (_) { }
            return parsed;
          } catch (_) {
            // try next candidate file
          }
        }
      }
    } catch (_) {
      // ignore and continue to empty fallback
    }
    return {};
  }

  // Client-side: fetch from public/locales
  for (const candidate of candidates) {
    try {
      const response = await fetch(`/locales/${locale}/${candidate}.json`, { cache: 'force-cache' });
      if (!response.ok) continue;
      const parsed = await response.json();
      try {
        (localesCache[locale] as any)[namespace] = parsed;
        (localesCache[locale] as any)[candidate] = parsed;
      } catch (_) { }
      return parsed;
    } catch (e) {
      // Continue to next candidate
    }
  }

  console.warn(`[i18n] loadLocaleNamespace: could not load ${namespace} for ${locale}`);

  // No fallback to full locale object; only per-namespace files are supported now.
  return {};
}

export function t(key: string, locale = DEFAULT_LOCALE): any {
  // Only per-namespace translation is supported now
  const keys = key.split('.');
  if (keys.length === 0) return key;
  const namespace = keys[0];
  const nsObj = getLocaleNamespaceObject(locale, namespace);
  let cur: any = nsObj;
  for (let i = 1; i < keys.length; i++) {
    if (!cur) return key;
    cur = cur[keys[i]];
  }
  if (Array.isArray(cur)) return cur;
  if (cur !== null && typeof cur === 'object') return cur;
  return cur ?? key;
}

export function interpolate(template: string, params?: Record<string, string>) {
  if (!params || typeof template !== 'string') return template;
  return template.replace(/{{\s*([^}]+)\s*}}/g, (_, p) => params[p.trim()] ?? '');
}

function interpolateObject(obj: unknown, params?: Record<string, string>): unknown {
  if (!params) return obj;
  if (typeof obj === 'string') return interpolate(obj, params);
  if (Array.isArray(obj)) return obj.map((v) => interpolateObject(v, params));
  if (obj && typeof obj === 'object') {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(obj as Record<string, unknown>)) out[k] = interpolateObject((obj as any)[k], params);
    return out;
  }
  return obj;
}

export function getMeta(metaKey: string, params?: Record<string, string>, locale = DEFAULT_LOCALE) {
  // Only per-namespace meta is supported now
  const nsObj = getLocaleNamespaceObject(locale, metaKey);
  if (nsObj && typeof nsObj === 'object') {
    const meta = (nsObj as Record<string, unknown>).meta;
    if (meta && typeof meta === 'object') {
      return interpolateObject(meta, params) as Record<string, unknown>;
    }
  }
  return {};
}

export function detectLocale(searchParams?: unknown) {
  if (searchParams && typeof searchParams === 'object') {
    try {
      if (searchParams instanceof Promise) return DEFAULT_LOCALE;
      const maybeGet = (searchParams as any).get;
      if (typeof maybeGet === 'function') {
        const v = maybeGet.call(searchParams, 'lang');
        if (v) return String(v);
      }
      const candidate = (searchParams as Record<string, unknown>)['lang'];
      if (candidate) return Array.isArray(candidate) ? String(candidate[0]) : String(candidate);
    } catch (_) { }
  }
  if (typeof window === 'undefined') return undefined;
  try { const s = storage.getItem('sanatana_dharma_language'); if (s) return s; } catch (_) { }
  if (typeof navigator !== 'undefined' && navigator?.language) return navigator.language.split('-')[0];
  return DEFAULT_LOCALE;
}

export function detectServerLocaleFromHeaders(hdrs: any) {
  try {
    if (!hdrs || typeof hdrs.get !== 'function') return DEFAULT_LOCALE;
    const cookie = hdrs.get('cookie') || '';
    const match = typeof cookie === 'string' ? cookie.match(/sanatana_dharma_language=([^;]+)/) : null;
    if (match) return normalizeSupportedLocale(match[1]);
    const al = hdrs.get('accept-language');
    if (al && typeof al === 'string') {
      const first = al.split(',')[0].split(';')[0].trim();
      return normalizeSupportedLocale(first);
    }
  } catch (_) { }
  return DEFAULT_LOCALE;
}