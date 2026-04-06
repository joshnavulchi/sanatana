/**
 * Detects locale from searchParams or returns DEFAULT_LOCALE.
 */
import { secrets } from './secrets';

export function detectLocale(searchParams?: Record<string, any>): string {
  if (!searchParams) return DEFAULT_LOCALE;
  const locale = searchParams.locale || searchParams.lang || searchParams.language;
  return normalizeSupportedLocale(locale);
}
/* Cleaned minimal i18n utilities used by the app. */
export const DEFAULT_LOCALE = "en";
export const SUPPORTED_LOCALES = [
  'en', 'te'
];

// Public path where locale JSONs are served (update if you move them)
export const LOCALES_PUBLIC_PATH = '/data/locales';

export function localeFilePath(locale: string, namespace: string) {
  const loc = String(locale || DEFAULT_LOCALE);
  const ns = String(namespace || '').replace(/\.json$/, '');
  return `${LOCALES_PUBLIC_PATH}/${loc}/${ns}.json`;
}

const localesCache: Record<string, unknown> = {};
// Simple time-based cache metadata keyed by `${locale}::${namespace}`
const localesCacheTimestamps: Record<string, number> = {};
const LOCALE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export type LocaleNamespace = Record<string, unknown>;

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
  const candidates = [
    namespace,
    namespace.replace(/-/g, '_'),
    namespace.replace(/_/g, '-'),
  ];

  const localeEntry = localesCache[locale];

  // If we have a cached entry on the server, return synchronously.
  if (typeof window === 'undefined') {
    if (!localeEntry || typeof localeEntry !== 'object') return {};
    const localeMap = localeEntry as Record<string, unknown>;
    for (const candidate of candidates) {
      const parsed = localeMap[candidate];
      if (parsed) return parsed;
    }
    return {};
  }

  // Client-side: if cached, return immediately; otherwise fetch from public/locales.
  // Return a Promise so callers can `await` or use `Promise.resolve(...)` uniformly.
  return (async () => {
    try {
      if (!localesCache[locale] || typeof localesCache[locale] !== 'object') localesCache[locale] = {} as Record<string, unknown>;
      const localeMap = localesCache[locale] as Record<string, unknown>;
      for (const candidate of candidates) {
        if (localeMap[candidate]) return localeMap[candidate];
      }

      for (const candidate of candidates) {
        // Try `{namespace}.json` first, then `{namespace}/index.json` for folder namespaces
        try {
          const resp = await fetch(localeFilePath(locale, candidate), { cache: 'force-cache' } as any);
          if (resp.ok) {
            const parsed = await resp.json();
            try { (localesCache[locale] as Record<string, unknown>)[candidate] = parsed; } catch (_) { }
            return parsed;
          }
        } catch (e) {
          // ignore and try index.json fallback
        }

        try {
          const indexUrl = `${LOCALES_PUBLIC_PATH}/${locale}/${candidate}/index.json`;
          const resp2 = await fetch(indexUrl, { cache: 'force-cache' } as any);
          if (resp2.ok) {
            const parsed2 = await resp2.json();
            try { (localesCache[locale] as Record<string, unknown>)[candidate] = parsed2; } catch (_) { }
            return parsed2;
          }
        } catch (e) {
          // ignore and try candidate/candidate.json fallback
        }

        try {
          const nestedUrl = `${LOCALES_PUBLIC_PATH}/${locale}/${candidate}/${candidate}.json`;
          const resp3 = await fetch(nestedUrl, { cache: 'force-cache' } as any);
          if (!resp3.ok) continue;
          const parsed3 = await resp3.json();
          try { (localesCache[locale] as Record<string, unknown>)[candidate] = parsed3; } catch (_) { }
          return parsed3;
        } catch (e) {
          // ignore and try next candidate
        }
      }
    } catch (_) { }
    return {};
  })();
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

export async function getLocaleNamespaceObjectAsync(locale = DEFAULT_LOCALE, namespace = ''): Promise<any> {
  // Delegate to existing function which may return a Promise on client.
  try {
    const maybe = getLocaleNamespaceObject(locale, namespace);
    if (maybe && typeof (maybe as any).then === 'function') {
      const awaited = await maybe;
      return awaited ?? {};
    }
    // If server-side and the synchronous result is empty, attempt server fetch from public/locales
    if (typeof window === 'undefined') {
      // Normalize args similar to original helper
      if (!namespace && typeof locale === 'string' && !SUPPORTED_LOCALES.includes(locale)) {
        namespace = locale;
        locale = DEFAULT_LOCALE;
      }
      locale = normalizeSupportedLocale(locale);
      if (!namespace) return {};
      const candidates = [namespace, namespace.replace(/-/g, '_'), namespace.replace(/_/g, '-')];
      if (!localesCache[locale] || typeof localesCache[locale] !== 'object') localesCache[locale] = {} as Record<string, unknown>;
      const localeMap = localesCache[locale] as Record<string, unknown>;
      for (const candidate of candidates) {
        if (localeMap[candidate]) return localeMap[candidate];
      }

      const base = String(secrets.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
      // First try HTTPS fetch from the configured site URL (works in dev when NEXT_PUBLIC_SITE_URL is set)
      if (base) {
        for (const candidate of candidates) {
          try {
            const url = `${base}${localeFilePath(locale, candidate)}`;
            const resp = await fetch(url, { cache: 'force-cache' } as any);
            if (!resp.ok) continue;
            const parsed = await resp.json();
            try { (localesCache[locale] as Record<string, unknown>)[candidate] = parsed; } catch (_) { }
            return parsed;
          } catch (_) {
            // ignore and try next
          }
        }
      }

      // If HTTP fetch failed or no base URL provided, attempt server-side filesystem read
      // This ensures metadata is available during SSR/build by reading from public/data/locales.
      try {
        // Only attempt FS read on Node (server)
        if (typeof window === 'undefined') {
          const fs = await Promise.resolve().then(() => require('fs').promises) as typeof import('fs').promises;
          const path = await Promise.resolve().then(() => require('path')) as typeof import('path');
          for (const candidate of candidates) {
            try {
              // Try namespace.json first
              const filePath = path.join(process.cwd(), 'public', 'data', 'locales', locale, `${candidate}.json`);
              try {
                const txt = await fs.readFile(filePath, 'utf8');
                const parsed = JSON.parse(txt);
                try { (localesCache[locale] as Record<string, unknown>)[candidate] = parsed; } catch (_) { }
                return parsed;
              } catch (_) {
                // Try folder/index.json fallback
                const idxPath = path.join(process.cwd(), 'public', 'data', 'locales', locale, candidate, 'index.json');
                try {
                  const txt2 = await fs.readFile(idxPath, 'utf8');
                  const parsed2 = JSON.parse(txt2);
                  try { (localesCache[locale] as Record<string, unknown>)[candidate] = parsed2; } catch (_) { }
                  return parsed2;
                } catch (_) {
                  // Try nested file {candidate}/{candidate}.json
                  const nestedPath = path.join(process.cwd(), 'public', 'data', 'locales', locale, candidate, `${candidate}.json`);
                  const txt3 = await fs.readFile(nestedPath, 'utf8');
                  const parsed3 = JSON.parse(txt3);
                  try { (localesCache[locale] as Record<string, unknown>)[candidate] = parsed3; } catch (_) { }
                  return parsed3;
                }
              }
            } catch (e) {
              // ignore file read/parse errors and try next candidate
            }
          }
        }
      } catch (_) {
        // ignore any errors from optional fs/path requires
      }
    }
    return maybe ?? {};
  } catch (_) {
    return {};
  }
}

// Robust loader wrapper to use across pages/components.
export async function loadLocaleData(locale = DEFAULT_LOCALE, namespace = ''): Promise<Record<string, unknown>> {
  const composite = `${locale}::${namespace}`;
  try {
    // Fast-path: respect in-memory cache + TTL
    const localeEntry = localesCache[locale] as Record<string, unknown> | undefined;
    if (localeEntry && typeof localeEntry === 'object' && namespace && (localeEntry as any)[namespace]) {
      const ts = localesCacheTimestamps[composite] || 0;
      if (Date.now() - ts < LOCALE_CACHE_TTL_MS) {
        return (localeEntry as Record<string, unknown>)[namespace] as Record<string, unknown>;
      }
    }

    const data = await getLocaleNamespaceObjectAsync(locale, namespace);
    if (!data || typeof data !== 'object') return {};
    try {
      if (!localesCache[locale] || typeof localesCache[locale] !== 'object') localesCache[locale] = {} as Record<string, unknown>;
      (localesCache[locale] as Record<string, unknown>)[namespace] = data;
      localesCacheTimestamps[composite] = Date.now();
    } catch (_) { }
    return data as Record<string, unknown>;
  } catch (_) {
    return {};
  }
}

// Small runtime helper used by components to pick a safe string fallback.
export function safeString(value: unknown, fallback = ''): string {
  if (typeof value === 'string') {
    const s = value.trim();
    if (s) return s;
  }
  return fallback;
}

// Filter an array of generated params by checking that the locale namespace exists.
export async function filterGeneratedParams<T extends Record<string, any>>(
  params: T[] | { params?: T[] },
  metaKeyForParam: (p: T) => string
): Promise<T[]> {
  const list: T[] = Array.isArray((params as any).params) ? (params as any).params : (params as T[] || []);
  const out: T[] = [];
  for (const p of list) {
    try {
      const key = metaKeyForParam(p);
      if (!key) continue;
      const ns = await loadLocaleData(DEFAULT_LOCALE, key);
      // Consider valid if namespace object has at least one key or a non-empty title
      if (ns && typeof ns === 'object') {
        if (Object.keys(ns).length > 0) {
          out.push(p);
          continue;
        }
        if (typeof (ns as any).title === 'string' && (ns as any).title.trim()) {
          out.push(p);
          continue;
        }
      }
    } catch (_) {
      // ignore and skip this param
    }
  }
  return out;
}