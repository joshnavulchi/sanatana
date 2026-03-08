/* Cleaned minimal i18n utilities used by the app. */
export const DEFAULT_LOCALE = "en";
import storage from "./storage";

export const SUPPORTED_LOCALES = [
  'ar', 'de', 'en', 'es', 'fr', 'hi', 'ja', 'ne', 'nl', 'pt', 'ru', 'ta', 'te', 'ur', 'zh-CN'
];

const REMOTE_LOCALES_BASE = process.env.NEXT_PUBLIC_REMOTE_LOCALES_BASE || '';

const localesCache: Record<string, unknown> = {};
const warnedMissingKeys = new Set<string>();

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



export function getLocaleNamespaceObject(locale = DEFAULT_LOCALE, namespace = '') {
  // Support callers that pass the namespace as the first (and only) argument
  // e.g. `getLocaleNamespaceObject('scriptures_vedas')` — treat that as
  // `getLocaleNamespaceObject(DEFAULT_LOCALE, 'scriptures_vedas')`.
  if (!namespace && typeof locale === 'string' && !SUPPORTED_LOCALES.includes(locale)) {
    namespace = locale;
    locale = DEFAULT_LOCALE;
  }
  if (!namespace) return {};
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');

      // Try various file naming patterns
      const candidates = [
        namespace,
        namespace.replace(/-/g, '_'),
        namespace.replace(/_/g, '-'),
        namespace.split('_').reverse().join('_'),
        namespace.split('-').reverse().join('-')
      ];

      for (const candidate of candidates) {
        const filePath = path.join(process.cwd(), 'data', locale, `${candidate}.json`);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          return JSON.parse(content);
        }
      }
    } catch (_) { }
  }
  return {};
}

// Deprecated: No longer used. Only per-namespace files are loaded now.
// function fetchLocaleData(locale: string) { return {}; }



export async function loadLocaleNamespace(locale: string, namespace: string) {
  if (!locale || !namespace) return {};
  if (!localesCache[locale] || typeof localesCache[locale] !== 'object') localesCache[locale] = {} as any;
  const existing = (localesCache[locale] as any)[namespace];
  if (existing) return existing;

  // Try various naming patterns for the namespace file
  const candidates = [
    namespace,
    namespace.replace(/-/g, '_'),
    namespace.replace(/_/g, '-'),
    namespace.split('_').reverse().join('_'),
    namespace.split('-').reverse().join('-')
  ];

  for (const candidate of candidates) {
    try {
      const url = `/api/locale/${encodeURIComponent(locale)}/${encodeURIComponent(candidate)}`;
      const resp = await fetch(url);
      if (resp.ok) {
        const parsed = await resp.json();
        try { (localesCache[locale] as any)[namespace] = parsed; } catch (_) { }
        return parsed;
      }
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
  if (nsObj && typeof nsObj === 'object' && nsObj.meta) {
    return interpolateObject(nsObj.meta, params) as Record<string, unknown>;
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
    if (match && SUPPORTED_LOCALES.includes(match[1])) return match[1];
    const al = hdrs.get('accept-language');
    if (al && typeof al === 'string') {
      const first = al.split(',')[0].split(';')[0].trim();
      const primary = first.split('-')[0];
      if (SUPPORTED_LOCALES.includes(primary)) return primary;
    }
  } catch (_) { }
  return DEFAULT_LOCALE;
}