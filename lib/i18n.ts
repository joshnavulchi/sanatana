/**
 * Detects locale from searchParams or returns DEFAULT_LOCALE.
 */
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