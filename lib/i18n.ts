/* Cleaned minimal i18n utilities used by the app. */
export const DEFAULT_LOCALE = "en";
import storage from "./storage";

export const SUPPORTED_LOCALES = [
  'ar', 'de', 'en', 'es', 'fr', 'hi', 'ja', 'ne', 'nl', 'pt', 'ru', 'te', 'ur', 'zh-CN'
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

export function getLocaleObject(locale = DEFAULT_LOCALE) {
  if (localesCache[locale]) return localesCache[locale];

  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'public', 'locales', locale, 'index.json');
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const obj = JSON.parse(content);
        localesCache[locale] = obj;
        return obj;
      }
    } catch (_) { }
  }

  if (typeof window !== 'undefined') {
    try {
      const globalCache = (globalThis as any).__LOCALE_CACHE__;
      if (globalCache && globalCache[locale]) {
        localesCache[locale] = globalCache[locale];
        return localesCache[locale];
      }
    } catch (_) { }
  }

  return localesCache[DEFAULT_LOCALE] || {};
}

export function getLocaleNamespaceObject(locale = DEFAULT_LOCALE, namespace = '') {
  if (!namespace) return {};
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'public', 'locales', locale, `${namespace}.json`);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
      }
    } catch (_) { }
  }
  return {};
}

async function fetchLocaleData(locale: string) {
  try {
    const url = `/locales/${locale}/index.json`;
    const resp = await fetch(url);
    if (resp.ok) return await resp.json();
    else console.warn(`[i18n] fetchLocaleData: ${url} returned ${resp.status}`);
  } catch (e) { console.warn(`[i18n] fetchLocaleData: error fetching ${locale} index`, e); }

  try {
    const apiUrl = `/api/locales/${encodeURIComponent(locale)}`;
    const apiResp = await fetch(apiUrl);
    if (apiResp.ok) return await apiResp.json();
    else console.warn(`[i18n] fetchLocaleData: ${apiUrl} returned ${apiResp.status}`);
  } catch (e) { console.warn(`[i18n] fetchLocaleData: error fetching api locale ${locale}`, e); }

  if (REMOTE_LOCALES_BASE) {
    try {
      const remoteUrl = `${REMOTE_LOCALES_BASE}/${encodeURIComponent(locale)}/index.json`;
      const r = await fetch(remoteUrl);
      if (r.ok) return await r.json();
    } catch (_) { }
  }

  if (locale !== DEFAULT_LOCALE && localesCache[DEFAULT_LOCALE]) return localesCache[DEFAULT_LOCALE];
  return {};
}

export async function loadLocale(locale: string) {
  if (!locale) return {};
  if (locale === DEFAULT_LOCALE && localesCache[DEFAULT_LOCALE]) return localesCache[DEFAULT_LOCALE];
  if (localesCache[locale]) return localesCache[locale];
  const obj = await fetchLocaleData(locale);
  localesCache[locale] = obj;
  return obj;
}

export async function loadLocaleNamespace(locale: string, namespace: string) {
  if (!locale || !namespace) return {};
  if (!localesCache[locale] || typeof localesCache[locale] !== 'object') localesCache[locale] = {} as any;
  const existing = (localesCache[locale] as any)[namespace];
  if (existing) return existing;

  try {
    const url = `/locales/${encodeURIComponent(locale)}/${encodeURIComponent(namespace)}.json`;
    const resp = await fetch(url);
    if (resp.ok) {
      const parsed = await resp.json();
      try { (localesCache[locale] as any)[namespace] = parsed; } catch (_) { }
      return parsed;
    } else {
      console.warn(`[i18n] loadLocaleNamespace: ${url} returned ${resp.status}`);
    }
  } catch (e) { console.warn(`[i18n] loadLocaleNamespace: error fetching ${namespace} for ${locale}`, e); }

  const full = await loadLocale(locale);
  if (full && typeof full === 'object' && (full as any)[namespace]) {
    try { (localesCache[locale] as any)[namespace] = (full as any)[namespace]; } catch (_) { }
    return (full as any)[namespace];
  }
  return {};
}

export function t(key: string, locale = DEFAULT_LOCALE): any {
  const keys = key.split('.');
  let cur: unknown = getLocaleObject(locale);

  if ((typeof cur !== 'object' || Object.keys(cur as object).length === 0) && typeof window === 'undefined' && keys.length > 0) {
    try {
      const namespace = keys[0];
      const nsObj = getLocaleNamespaceObject(locale, namespace);
      if (nsObj && typeof nsObj === 'object' && Object.keys(nsObj).length > 0) cur = { [namespace]: nsObj };
    } catch (_) { }
  }

  if (!cur || (typeof cur === 'object' && Object.keys(cur as object).length === 0)) return key;

  for (const k of keys) {
    if (!cur) {
      if (locale !== DEFAULT_LOCALE) {
        try {
          const def = getLocaleObject(DEFAULT_LOCALE) as any;
          let curDef: unknown = def;
          for (const kk of keys) {
            if (!curDef) break;
            curDef = (curDef as any)[kk];
          }
          if (curDef) return curDef;
        } catch (_) { }
      }
      return key;
    }
    cur = (cur as any)[k];
  }
  if (Array.isArray(cur)) return cur;
  if (cur !== null && typeof cur === 'object') {
    try { return JSON.stringify(cur); } catch (_) { return String(cur); }
  }
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
  const looksLikeMeta = (obj: unknown) => {
    if (!obj || typeof obj !== 'object') return false;
    const keys = Object.keys(obj as Record<string, unknown>);
    const metaKeys = ['title', 'description', 'keywords', 'ogImage', 'url', 'canonical'];
    return keys.some(k => metaKeys.includes(k));
  };

  if (typeof window === 'undefined') {
    const localeData = getLocaleObject(locale) as any;
    if (localeData && typeof localeData === 'object') {
      if (localeData[metaKey]?.meta) {
        const meta = localeData[metaKey].meta;
        if (looksLikeMeta(meta)) return interpolateObject(meta, params) as Record<string, unknown>;
      }
      const candidates = [metaKey, metaKey.replace(/-/g, '_'), metaKey.replace(/_/g, '')];
      for (const candidate of candidates) {
        if (localeData[candidate]?.meta) {
          const meta = localeData[candidate].meta;
          if (looksLikeMeta(meta)) return interpolateObject(meta, params) as Record<string, unknown>;
        }
      }
    }
  }
  return interpolateObject({}, params) as Record<string, unknown>;
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