/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
export const DEFAULT_LOCALE = "en";
import storage from "./storage";

// Single source of supported locales used across the app
export const SUPPORTED_LOCALES = [
  'ar',
  'de',
  'en',
  'es',
  'fr',
  'hi',
  'ja',
  'ne',
  'nl',
  'pt',
  'ru',
  'te',
  'ur',
  'zh-CN',
];

// Remote fallback for runtime when static locales are missing (set via env in Render)
const REMOTE_LOCALES_BASE = process.env.NEXT_PUBLIC_REMOTE_LOCALES_BASE || 'https://raw.githubusercontent.com/vulchivijay/first-contributes/main/locales';

// Cache that holds already-loaded locale objects
const localesCache: Record<string, unknown> = {};

// Track missing-key warnings we've already emitted to avoid noisy repeated logs
const warnedMissingKeys = new Set<string>();

// Hydrate client-side cache from server-injected global if present.
if (typeof window !== 'undefined') {
  try {
    // global injected by `app/layout.tsx` as `window.__LOCALE_CACHE__`
    const globalCache = (globalThis as any).__LOCALE_CACHE__;
    if (globalCache && typeof globalCache === 'object') {
      for (const k of Object.keys(globalCache)) {
        if (!localesCache[k]) localesCache[k] = globalCache[k];
      }
    }
  } catch (e) {
    // ignore
  }
}

// Backwards-compatible `locales` export for files that import `locales`.
// Locales are loaded on demand from GitHub.
export const locales: Record<string, unknown> = {};
export function getLocaleObject(locale = DEFAULT_LOCALE) {
  if (localesCache[locale]) return localesCache[locale];
  
  // On the server, try to load synchronously from filesystem
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'public', 'locales', locale, 'index.json');
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const obj = JSON.parse(content);
        localesCache[locale] = obj;
        // console.log(`[i18n] Server: Loaded locale ${locale} synchronously (${Object.keys(obj).length} keys)`);
        return obj;
      }
    } catch (err) {
      console.error(`[i18n] Server: Failed to load locale ${locale}:`, err);
    }
  }
  
  // Return default locale or empty object
  // If client has a global-injected cache, attempt one more time
  if (typeof window !== 'undefined') {
    try {
      const globalCache = (globalThis as any).__LOCALE_CACHE__;
      if (globalCache && globalCache[locale]) {
        localesCache[locale] = globalCache[locale];
        return localesCache[locale];
      }
    } catch (e) {
      // ignore
    }
  }

  return localesCache[DEFAULT_LOCALE] || {};
}
// Dynamically fetch and load a locale file from GitHub and cache it. Returns the locale object.
export async function loadLocale(locale: string) {
  if (!locale || locale === DEFAULT_LOCALE) {
    // Load default locale if not cached
    if (!localesCache[DEFAULT_LOCALE]) {
      const obj = await fetchLocaleData(DEFAULT_LOCALE);
      localesCache[DEFAULT_LOCALE] = obj;
      return obj;
    }
    return localesCache[DEFAULT_LOCALE] || {};
  }
  
  if (localesCache[locale]) return localesCache[locale];
  
  const obj = await fetchLocaleData(locale);
  localesCache[locale] = obj;
  return obj;
}

// Fetch locale data with fallback strategy: local -> default
async function fetchLocaleData(locale: string) {
  // Try local files (works for both dev and production)
  try {
    const url = `/locales/${locale}/index.json`;
    // console.log(`[i18n] Fetching locale ${locale} from ${url}`);
    const response = await fetch(url);
    
    if (response.ok) {
      const obj = await response.json();
      // console.log(`[i18n] ✓ Loaded locale ${locale} (${Object.keys(obj).length} keys)`);
      return obj;
    } else {
      // try API fallback when static file missing
      try {
        const apiUrl = `/api/locales/${encodeURIComponent(locale)}`;
        const apiResp = await fetch(apiUrl);
        if (apiResp.ok) return await apiResp.json();
      } catch (_) {
        // ignore
      }
      // console.warn(`[i18n] Failed to load ${url}: ${response.status} ${response.statusText}`);
    }
  } catch (err) {
    // console.error(`[i18n] Error loading locale ${locale}:`, err);
  }

  // Remote fallback: attempt to fetch from configured raw content base
  try {
    const remoteUrl = `${REMOTE_LOCALES_BASE}/${encodeURIComponent(locale)}/index.json`;
    // console.log(`[i18n] Trying remote locale ${remoteUrl}`);
    const resp = await fetch(remoteUrl);
    if (resp.ok) {
      const obj = await resp.json();
      console.log(`[i18n] Fallback: loaded ${locale} from remote`);
      return obj;
    }
  } catch (e) {
    // ignore remote fallback errors
  }
  
  // Fallback: return default locale or empty object
  if (locale !== DEFAULT_LOCALE && localesCache[DEFAULT_LOCALE]) {
    // console.warn(`[i18n] Falling back to default locale for ${locale}`);
    return localesCache[DEFAULT_LOCALE];
  }
  
  // console.error(`[i18n] Failed to load locale ${locale}, returning empty object`);
  return {};
}

export function t(key: string, locale = DEFAULT_LOCALE): any {
  const keys = key.split(".");
  let cur: unknown = getLocaleObject(locale);

  // If locale object is empty, avoid noisy warnings on the client while
  // the locale is being loaded asynchronously. Keep server-side warnings
  // so developers are notified during SSR where synchronous loading is
  // expected to work.
  if (!cur || (typeof cur === 'object' && Object.keys(cur as object).length === 0)) {
    if (typeof window === 'undefined') {
      console.warn(`[i18n] t("${key}", "${locale}"): Locale not loaded, returning key`);
    }
    return key;
  }
  
  for (const k of keys) {
    if (!cur) {
      // Attempt fallback to default locale before warning
      if (locale !== DEFAULT_LOCALE) {
        try {
          const def = getLocaleObject(DEFAULT_LOCALE) as any;
          let curDef: unknown = def;
          for (const kk of keys) {
            if (!curDef) break;
            curDef = (curDef as any)[kk];
          }
          if (curDef) return curDef;
        } catch (e) {
          // ignore fallback errors and continue to warn
        }
      }

      const warnKey = `${locale}::${key}`;
      if (typeof window === 'undefined') {
        if (!warnedMissingKeys.has(warnKey)) {
          warnedMissingKeys.add(warnKey);
          console.warn(`[i18n] t("${key}", "${locale}"): Key not found at "${k}", returning original key`);
        }
      }
      return key;
    }
    cur = (cur as any)[k];
  }
  // If the resolved value is an array, return it for list usage.
  if (Array.isArray(cur)) return cur;
  // If the resolved value is an object (but not array), stringify it so
  // React/JSX and TypeScript don't complain when pages pass it into
  // elements expecting strings or React nodes.
  if (cur !== null && typeof cur === 'object') {
    try {
      return JSON.stringify(cur);
    } catch (_) {
      return String(cur);
    }
  }
  return cur ?? key;
}
// Simple interpolation for templates like "Hello {{name}}"
export function interpolate(template: string, params?: Record<string, string>) {
  if (!params || typeof template !== "string") return template;
  return template.replace(/{{\s*([^}]+)\s*}}/g, (_, p) => {
    const v = params[p.trim()];
    return v ?? "";
  });
}
// Deeply interpolate strings in an object using provided params
function interpolateObject(obj: unknown, params?: Record<string, string>): unknown {
  if (!params) return obj;
  if (typeof obj === "string") return interpolate(obj, params);
  if (Array.isArray(obj)) return obj.map((v) => interpolateObject(v, params));
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(obj as Record<string, unknown>)) {
      out[k] = interpolateObject((obj as any)[k], params);
    }
    return out;
  }
  return obj;
}
// Return a metadata object from `locales[locale].meta[metaKey]` with interpolation
export function getMeta(metaKey: string, params?: Record<string, string>, locale = DEFAULT_LOCALE) {
  // Helper: determine whether an object looks like a meta object
  const looksLikeMeta = (obj: unknown) => {
    if (!obj || typeof obj !== 'object') return false;
    const keys = Object.keys(obj as Record<string, unknown>);
    const metaKeys = ['title', 'description', 'keywords', 'ogImage', 'url', 'canonical'];
    return keys.some(k => metaKeys.includes(k));
  };
  
  // On server side, load locale data synchronously if needed
  if (typeof window === 'undefined') {
    const localeData = getLocaleObject(locale) as any;
    
    if (localeData && typeof localeData === 'object') {
      // Try to find meta data in the locale object
      // Check if metaKey exists as a top-level key with meta property
      if (localeData[metaKey]?.meta) {
        const meta = localeData[metaKey].meta;
        if (looksLikeMeta(meta)) {
          return interpolateObject(meta, params) as Record<string, unknown>;
        }
      }
      
      // Try with underscore variations
      const candidates = [
        metaKey,
        metaKey.replace(/-/g, "_"),
        metaKey.replace(/_/g, ""),
      ];
      
      for (const candidate of candidates) {
        if (localeData[candidate]?.meta) {
          const meta = localeData[candidate].meta;
          if (looksLikeMeta(meta)) {
            return interpolateObject(meta, params) as Record<string, unknown>;
          }
        }
      }
    }
  }

  // Return empty object if not found
  return interpolateObject({}, params) as Record<string, unknown>;
}
export function detectLocale(searchParams?: unknown) {
  // Avoid accessing any properties if `searchParams` is an unresolved
  // Promise-like object (Next may pass a Promise proxy). Use safe checks
  // that do not access properties on the object.
  if (searchParams && typeof searchParams === "object") {
    try {
      if (searchParams instanceof Promise) return DEFAULT_LOCALE;
      const tag = Object.prototype.toString.call(searchParams);
      if (tag === "[object Promise]") return DEFAULT_LOCALE;
    } catch (e) {
      // ignore and continue with guarded access below
    }

    // Safe to access properties now (not a Promise-like).
    try {
      // Only use .get if it's a function on the object (URLSearchParams-like).
      const maybeGet = (searchParams as any).get;
      if (typeof maybeGet === "function") {
        // call it with the correct receiver
        const v = maybeGet.call(searchParams, "lang");
        if (v) return String(v);
      }

      // Fallback for plain objects like { lang: 'hi' } or { lang: ['hi'] }
      const candidate = (searchParams as Record<string, unknown>)["lang"];
      if (candidate) {
        if (Array.isArray(candidate)) return String(candidate[0]);
        return String(candidate);
      }
    } catch (e) {
      // defensive: ignore and fall through
    }
  }
      // If running on the server and no `lang` found in `searchParams`,
      // return undefined so callers can fall back to header-based detection.
      if (typeof window === 'undefined') return undefined;
  // Check persisted storage (client-side only) via storage abstraction
  if (typeof window !== "undefined") {
    try {
      const s = storage.getItem("sanatana_dharma_language");
      if (s) return s;
    } catch (e) {
      // ignore storage errors (private mode, disabled storage, etc.)
    }
  }
  // Fall back to browser language (client only)
  if (typeof navigator !== "undefined" && navigator?.language) {
    return navigator.language.split("-")[0];
  }
  return DEFAULT_LOCALE; // default
}
// Server-side helper: detect a locale from a Next `headers()`-like object.
// Callers should pass the result of `headers()` (from `next/headers`).
export function detectServerLocaleFromHeaders(hdrs: any) {
  const supported = SUPPORTED_LOCALES;
  try {
    if (!hdrs || typeof hdrs.get !== 'function') return DEFAULT_LOCALE;
    const cookie = hdrs.get('cookie') || '';
    const match = typeof cookie === 'string' ? cookie.match(/sanatana_dharma_language=([^;]+)/) : null;
    if (match && supported.includes(match[1])) return match[1];
    const al = hdrs.get('accept-language');
    if (al && typeof al === 'string') {
      const first = al.split(',')[0].split(';')[0].trim();
      const primary = first.split('-')[0];
      if (supported.includes(primary)) return primary;
    }
  } catch (err) {
    // ignore and fall back
  }
  return DEFAULT_LOCALE;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */