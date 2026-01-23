/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
export const DEFAULT_LOCALE = "en";
import storage from "./storage";

// GitHub repository URL for locales
const GITHUB_LOCALES_BASE = 'https://raw.githubusercontent.com/vulchivijay/first-contributes/main/locales';

// Single source of supported locales used across the app
export const SUPPORTED_LOCALES = [
  'en',
  'hi',
  'te',
  'ta',
];

// Cache that holds already-loaded locale objects
const localesCache: Record<string, unknown> = {};

// Backwards-compatible `locales` export for files that import `locales`.
// Locales are loaded on demand from GitHub.
export const locales: Record<string, unknown> = {};
export function getLocaleObject(locale = DEFAULT_LOCALE) {
  if (localesCache[locale]) return localesCache[locale];
  
  // Return empty object for now - locale must be loaded via loadLocale first
  // This prevents synchronous blocking calls
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

// Fetch locale data with fallback strategy: local -> GitHub -> default
async function fetchLocaleData(locale: string) {
  // Strategy 1: Try local files first (for production builds)
  try {
    const response = await fetch(`/locales/${locale}/index.json`);
    if (response.ok) {
      const obj = await response.json();
      return obj;
    }
  } catch (err) {
    // Continue to next strategy
  }
  
  // Strategy 2: Try GitHub repository
  try {
    const response = await fetch(`${GITHUB_LOCALES_BASE}/${locale}/index.ts`);
    if (response.ok) {
      const text = await response.text();
      const obj = parseTypeScriptExport(text);
      return obj;
    }
  } catch (err) {
    // Continue to next strategy
  }
  
  // Strategy 3: Try GitHub JSON format
  try {
    const response = await fetch(`${GITHUB_LOCALES_BASE}/${locale}.json`);
    if (response.ok) {
      const obj = await response.json();
      return obj;
    }
  } catch (err) {
    console.error(`Failed to load locale ${locale}:`, err);
  }
  
  // Fallback: return default locale or empty object
  if (locale !== DEFAULT_LOCALE && localesCache[DEFAULT_LOCALE]) {
    return localesCache[DEFAULT_LOCALE];
  }
  
  return {};
}

// Helper function to parse TypeScript export
function parseTypeScriptExport(text: string): any {
  try {
    // Remove TypeScript type annotations and comments
    let cleaned = text
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .replace(/\/\/.*/g, '') // Remove single-line comments
      .replace(/export\s+default\s+/, '') // Remove export default
      .replace(/as\s+const/g, '') // Remove 'as const'
      .replace(/:\s*\w+(\[\])?/g, ''); // Remove type annotations
    
    // Extract the object between { and }
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      // Evaluate the object (be cautious with this in production)
      return eval(`(${match[0]})`);
    }
    
    return {};
  } catch (err) {
    console.error('Failed to parse TypeScript export:', err);
    return {};
  }
}
export function t(key: string, locale = DEFAULT_LOCALE): any {
  const keys = key.split(".");
  let cur: unknown = getLocaleObject(locale);
  for (const k of keys) {
    if (!cur) return key;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - reading dynamic locale object keys
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - dynamic indexing
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
  // Prefer loading per-page meta files from GitHub on the server.
  if (typeof window === 'undefined') {
    // For server-side, we can't use fetch synchronously
    // Return empty object and let client-side load it
    return interpolateObject({}, params) as Record<string, unknown>;
  }

  // Do NOT fallback to the merged `meta.json` file.
  // If no per-page meta was found in the page file, return an empty object.
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
      // @ts-ignore - dynamic get method on unknown type
      const maybeGet = (searchParams as any).get;
      if (typeof maybeGet === "function") {
        // call it with the correct receiver
        // @ts-ignore
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