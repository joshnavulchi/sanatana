/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import en from "../locales/en";
export const DEFAULT_LOCALE = "en";
import storage from "./storage";
// Single source of supported locales used across the app
export const SUPPORTED_LOCALES = [
  'en', 'te'
];
// Cache that holds already-loaded locale objects. Keep English bundled
// so the first render is fast. Other locales are loaded on demand.
const localesCache: Record<string, unknown> = {
  en,
};
// Backwards-compatible `locales` export for files that import `locales`.
// Only `en` is eagerly available; other locales should be loaded via `loadLocale`.
export const locales: Record<string, unknown> = {
  en: localesCache.en,
};
export function getLocaleObject(locale = DEFAULT_LOCALE) {
  if (localesCache[locale]) return localesCache[locale];
  // If running on the server, attempt to synchronously require the locale
  // so server-side code (e.g. `createGenerateMetadata`) can access locale data
  // without making the callers async. This avoids bundling non-default
  // locales into the client main chunk while keeping server usage working.
  if (typeof window === 'undefined') {
    try {
      // use CommonJS require on the server for a sync load
      const mod = require(`../locales/${locale}`);
      const obj = (mod && (mod.default || mod)) as unknown;
      localesCache[locale] = obj;
      return obj;
    } catch (err) {
      return localesCache[DEFAULT_LOCALE];
    }
  }
  return localesCache[DEFAULT_LOCALE];
}
// Dynamically import a locale file and cache it. Returns the locale object.
export async function loadLocale(locale: string) {
  if (!locale || locale === DEFAULT_LOCALE) return localesCache[DEFAULT_LOCALE];
  if (localesCache[locale]) return localesCache[locale];
  try {
    // dynamic import so non-English locale code isn't included in main bundle
    const mod = await import(`../locales/${locale}`);
    const obj = (mod && (mod.default || mod)) as unknown;
    localesCache[locale] = obj;
    return obj;
  } catch (err) {
    // on error, fall back to default
    return localesCache[DEFAULT_LOCALE];
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
  // Prefer loading per-page meta files from `locales/<locale>/<metaKey>.json` on the server.
  if (typeof window === 'undefined') {
    try {
      // Try several filename variants for the page file so server-side callers
      // can synchronously load the appropriate per-page locale file. Many
      // meta keys use snake_case (e.g. `privacy_policy`) while files may be
      // named `privacy-policy.json` or `privacypolicy.json` — try all three.
      const candidates = [
        metaKey,
        metaKey.replace(/_/g, "-"),
        metaKey.replace(/_/g, ""),
      ];

      for (const candidateKey of candidates) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const mod = require(`../locales/${locale}/${candidateKey}.json`);
          const obj = (mod && (mod.default || mod)) as any;

          // The file may export either a top-level `meta`, an object keyed by
          // the page (e.g. { "home": { meta: {...} } }) or the meta object
          // itself. Prefer `pageObj.meta`, then `obj.meta`, then the pageObj.
          let pageObj = obj?.[metaKey] ?? obj?.[candidateKey] ?? obj;

          // If the file exports an object keyed by a page name (e.g. { "donatePage": { meta: {...} } })
          // try to find a nested key that likely corresponds to the requested metaKey.
          if (pageObj === obj && obj && typeof obj === 'object') {
            const norm = metaKey.replace(/_/g, '').toLowerCase();
            for (const k of Object.keys(obj)) {
              const kn = k.replace(/[_\- ]/g, '').toLowerCase();
              if (kn === norm || kn.includes(norm) || norm.includes(kn)) {
                pageObj = (obj as any)[k];
                break;
              }
            }
          }

          const candidate = pageObj?.meta ?? obj?.meta ?? pageObj;

          if (candidate && typeof candidate === 'object') {
            return interpolateObject(candidate, params) as Record<string, unknown>;
          }
        } catch (err) {
          // try next candidate filename
          continue;
        }
      }
    } catch (e) {
      // ignore and fall back to merged locale data below
    }
  }

  // Fallback (client or server fallback): read from merged locale object.
  const loc = getLocaleObject(locale) as Record<string, unknown> | undefined;
  const metaRoot = ((loc as any)?.meta as Record<string, unknown> | undefined)
    ?? (((getLocaleObject(DEFAULT_LOCALE) as any)?.meta) as Record<string, unknown> | undefined)
    ?? {};
  const meta = (metaRoot?.[metaKey] as unknown) ?? {};
  return interpolateObject(meta, params) as Record<string, unknown>;
}
export function detectLocale(searchParams?: unknown) {
  if (searchParams && typeof searchParams === "object") {
    try {
      // Only use .get if searchParams is a URLSearchParams or has a safe .get method
      // @ts-ignore - dynamic get method on unknown type
      if (typeof (searchParams as any).get === "function") {
        // @ts-ignore
        const v = (searchParams as any).get("lang");
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