/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getMeta, detectLocale, DEFAULT_LOCALE, detectServerLocaleFromHeaders, getLocaleNamespaceObject } from './i18n';
import { headers } from 'next/headers';
import { secrets } from './secrets';

export function resolveLocaleFromHeaders() {
  try {
    const h = headers() as unknown;
    return detectServerLocaleFromHeaders(h as Record<string, unknown>);
  } catch (e) {
    return DEFAULT_LOCALE;
  }
}

export function createGenerateMetadata(metaKey: string, titleKey?: string, descriptionKey?: string) {

  return async function generateMetadata(props: Record<string, unknown> | undefined) {
    const { searchParams } = (props || {}) as { searchParams?: unknown };
    // `searchParams` can be a Promise in newer Next.js versions.
    // Do NOT await it here because awaiting makes the metadata generation
    // depend on runtime values and prevents static rendering. If it's
    // a Promise-like object, treat it as unresolved so we fall back to
    // header-based detection on the server.
    let resolvedSearchParams: unknown = searchParams;
    try {
      if (resolvedSearchParams && typeof (resolvedSearchParams as any).then === 'function') {
        resolvedSearchParams = undefined;
      }
    } catch (e) {
      resolvedSearchParams = undefined;
    }
    let locale = detectLocale(resolvedSearchParams);
    if (!locale) locale = resolveLocaleFromHeaders();
    let meta = getMeta(metaKey, {}, locale) || {};
    // If getMeta returned nothing (commonly when only per-namespace JSON exists
    // and no consolidated index.json is present), attempt to read the namespace
    // file directly on the server and use its `meta` block as a fallback.
    if ((!meta || Object.keys(meta).length === 0) && typeof window === 'undefined') {
      try {
        const ns = getLocaleNamespaceObject(locale, metaKey) || {};
        if (ns && typeof ns === 'object') {
          // Handle nested structure: { "metaKey": { "meta": {...} } }
          if ((ns as any)[metaKey]?.meta && typeof (ns as any)[metaKey].meta === 'object') {
            meta = (ns as any)[metaKey].meta as Record<string, unknown>;
          } else if ((ns as any).meta && typeof (ns as any).meta === 'object') {
            meta = (ns as any).meta as Record<string, unknown>;
          } else if (ns.meta && typeof ns.meta === 'object') {
            meta = ns.meta as Record<string, unknown>;
          } else {
            meta = ns as Record<string, unknown>;
          }
        }
      } catch (e) { /* ignore and continue with empty meta */ }
    }
    // Prefer explicit titleKey/descriptionKey -> translation, otherwise fall back to meta values.
    // The `t()` function returns the key string when a translation is missing, so
    // treat that case as "not found" and use `meta` as the fallback.
    let title: string | undefined;
    if (titleKey) {
      const tv = t(titleKey, locale);
      title = (typeof tv === 'string' && tv !== titleKey) ? tv : (typeof meta.title === 'string' ? meta.title : undefined);
    } else {
      title = typeof meta.title === 'string' ? meta.title : undefined;
    }
    let description: string | undefined;
    if (descriptionKey) {
      const dv = t(descriptionKey, locale);
      description = (typeof dv === 'string' && dv !== descriptionKey) ? dv : (typeof meta.description === 'string' ? meta.description : undefined);
    } else {
      description = typeof meta.description === 'string' ? meta.description : undefined;
    }
    // Build absolute OG image URL when a relative path is provided in meta.ogImage
    let ogImages: Array<{ url: string } | string> | undefined = undefined;
    if (meta.ogImage) {
      try {
        const og = String(meta.ogImage);
        const base = meta.url || secrets.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in';
        const host = String(base).replace(/\/$/, '');
        const imgUrl = og.startsWith('http://') || og.startsWith('https://') ? og : `${host}${og.startsWith('/') ? '' : '/'}${og}`;
        ogImages = [{ url: imgUrl }];
      } catch (e) {
        // Ensure we produce a string image URL for TypeScript compatibility
        ogImages = [String((meta as any).ogImage)];
      }
    }
    // Normalize canonical: prefer explicit `meta.canonical` or `meta.url`,
    // but ensure non-root URLs end with a trailing slash to match exported routing.
    const rawCanonical = meta.canonical || meta.url || secrets.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in';
    let canonical = String(rawCanonical || '').trim();
    try {
      // Only append trailing slash for non-root, non-file-like paths
      const urlObj = new URL(canonical);
      const isRoot = urlObj.pathname === '/' || urlObj.pathname === '';
      const looksLikeFile = /\.[a-z0-9]{1,6}$/i.test(urlObj.pathname);
      if (!isRoot && !looksLikeFile && !urlObj.pathname.endsWith('/')) {
        urlObj.pathname = urlObj.pathname + '/';
        canonical = urlObj.toString();
      } else {
        canonical = urlObj.toString();
      }
    } catch (e) {
      // If URL construction fails, fallback to simple normalization
      if (canonical && canonical !== 'https://sanatanadharmam.in' && !canonical.endsWith('/') && !/\.[a-z0-9]{1,6}$/i.test(canonical)) {
        canonical = canonical + '/';
      }
    }

    return {
      title,
      description,
      keywords: meta.keywords || undefined,
      openGraph: { title: title || meta.title, description, images: ogImages },
      alternates: { canonical },
      robots: {
        index: true,
        follow: true,
        // Optional fine-grained controls:
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          // examples: maxSnippet: -1, maxImagePreview: 'large', maxVideoPreview: -1
        },
      },
    };
  };
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */ 