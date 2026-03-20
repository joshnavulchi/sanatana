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
  'ar', 'de', 'en', 'es', 'fr', 'hi', 'ja', 'ru', 'te', 'zh-CN'
];

// Public path where locale JSONs are served (update if you move them)
export const LOCALES_PUBLIC_PATH = '/data/locales';

export function localeFilePath(locale: string, namespace: string) {
  const loc = String(locale || DEFAULT_LOCALE);
  const ns = String(namespace || '').replace(/\.json$/, '');
  return `${LOCALES_PUBLIC_PATH}/${loc}/${ns}.json`;
}

const localesCache: Record<string, unknown> = {};

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
        try {
          const resp = await fetch(localeFilePath(locale, candidate), { cache: 'force-cache' } as any);
          if (!resp.ok) continue;
          const parsed = await resp.json();
          try { (localesCache[locale] as Record<string, unknown>)[candidate] = parsed; } catch (_) { }
          return parsed;
        } catch (e) {
          // ignore fetch/json errors and try next candidate
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
      // This ensures metadata is available during SSR/build by reading from public/locales.
      // try {
      // Only attempt FS read on Node (server)
      // if (typeof window === 'undefined') {
      //   const fs = await Promise.resolve().then(() => require('fs').promises) as typeof import('fs').promises;
      //   const path = await Promise.resolve().then(() => require('path')) as typeof import('path');
      //   for (const candidate of candidates) {
      //     try {
      //       const filePath = path.join(process.cwd(), 'public', 'locales', locale, `${candidate}.json`);
      //       const txt = await fs.readFile(filePath, 'utf8');
      //       const parsed = JSON.parse(txt);
      //       try { (localesCache[locale] as Record<string, unknown>)[candidate] = parsed; } catch (_) {}
      //       return parsed;
      //     } catch (e) {
      //       // ignore file read/parse errors and try next candidate
      //     }
      //   }
      // }
      // } catch (_) {
      // ignore any errors from optional fs/path requires
      // }
    }
    return maybe ?? {};
  } catch (_) {
    return {};
  }
}