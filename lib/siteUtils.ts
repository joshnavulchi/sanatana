/**
 * 🔥 UNIFIED CONTENT LOADER
 * Supports:
 * - vedas
 * - itihasa
 * - puranas
 * - upanishads
 * - vedic-philosophy
 * - explore
 *
 * Handles:
 * - index.json
 * - nested slug.json
 * - deep folder structures
 */

import { DEFAULT_LOCALE } from '@lib/i18n';
import { secrets } from './secrets';

// Simple in-process build cache used during server builds to avoid repeated
// disk reads / network fetches. Keyed by absolute file path.
export const BUILD_CACHE: Map<string, { ts: number; data: any }> = new Map();

const BASES = [
  'vedas',
  'itihasa',
  'puranas',
  'upanishads',
  'vedic-philosophy',
  'explore',
] as const;

type BaseType = (typeof BASES)[number];

const EXCLUDE_KEYS = new Set(['meta', 'openGraph', 'schema', 'openSpec', 'openspec']);

function normalizeSegments(segments: string[]) {
  return Array.isArray(segments)
    ? segments.map(s => String(s).replace(/^\/+|\/+$/g, '')).filter(Boolean)
    : [];
}

function stripExcluded(obj: any) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj;
  try {
    const copy: Record<string, any> = {};
    for (const k of Object.keys(obj)) {
      if (EXCLUDE_KEYS.has(k)) continue;
      copy[k] = obj[k];
    }
    return copy;
  } catch (_) {
    return obj;
  }
}


/**
 * Resolve base + segments from URL
 */
export function resolveRoute(segments: string[]) {
  const parts = normalizeSegments(segments);

  if (!parts.length) {
    return { base: null, pathSegments: [] };
  }

  const base = parts[0] as BaseType;

  // 🚨 FIX: remove duplicated base if exists
  let pathSegments = parts.slice(1);

  if (pathSegments[0] === base) {
    pathSegments = pathSegments.slice(1);
  }

  if (!BASES.includes(base)) {
    return { base: null, pathSegments: parts };
  }

  return { base, pathSegments };
}

/**
 * 🔥 MAIN FETCH FUNCTION (USE THIS EVERYWHERE)
 */
export async function fetchContentByRoute(locale: string, segments: string[]) {
  const { base, pathSegments } = resolveRoute(segments);

  if (!base || !pathSegments.length) {
    return { data: null, path: null };
  }

  const loc = locale || DEFAULT_LOCALE;
  const joined = pathSegments.join('/');

  const primaryPath = `/data/locales/${loc}/${base}/${joined}/index.json`;

  // for the life of the Node process. This speeds up repeated loads during
  // static render/build.
  if (typeof window === 'undefined') {
    try {
      const server = await import('./siteUtils.server');
      const diskResult = await server.fetchContentByRouteFromDisk(loc, base, joined);
      if (diskResult) {
        const cached = BUILD_CACHE.get(diskResult.path);
        if (cached) {
          return { data: cached.data, path: diskResult.path };
        }
        BUILD_CACHE.set(diskResult.path, { ts: Date.now(), data: diskResult.data });
        return { data: diskResult.data, path: diskResult.path };
      }
    } catch (_) {
      // ignore server-only import/fetch failures and fall back to network fetch
    }
  }

  try {
    // Determine fetch URL. On server fetch needs an absolute URL; prefer NEXT_PUBLIC_SITE_URL when available.
    let fetchUrl = primaryPath;
    if (typeof window === 'undefined') {
      const base = (secrets && secrets.NEXT_PUBLIC_SITE_URL) || process.env.NEXT_PUBLIC_SITE_URL;
      if (base && String(fetchUrl).startsWith('/')) {
        fetchUrl = String(base).replace(/\/$/, '') + fetchUrl;
      }
    }

    // In development, log the exact path/URL we will attempt to fetch to aid debugging.
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[fetchContentByRoute] fetching', fetchUrl);
    }

    const res = await fetch(fetchUrl, {
      cache: 'force-cache',
      next: { revalidate: 60 },
    } as any);

    if (!res.ok) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('[fetchContentByRoute] fetch failed', fetchUrl, 'status', res.status);
      }
      // Network fallback: attempt to fetch parent index and aggregate child JSON files
      if (typeof window !== 'undefined') {
        return { data: null, path: fetchUrl };
      }
      try {
        const path = await Promise.resolve().then(() => require('path')) as typeof import('path');
        // parent index URL e.g. /data/locales/${loc}/${base}/index.json
        const parentUrl = ` /data/locales/${loc}/${base}/index.json`.replace(/\s+/g, '');
        const parentResp = await fetch(parentUrl, { cache: 'force-cache' } as any);
        if (!parentResp.ok) return { data: null, path: fetchUrl };
        const parentJson = await parentResp.json();

        // Find candidate child file basenames that reference the requested joined path
        const joinedParts = String(joined).split('/').filter(Boolean);
        const slug = joinedParts[joinedParts.length - 1];

        const candidates: string[] = [];
        const collectPaths = (obj: any) => {
          if (!obj || typeof obj !== 'object') return;
          for (const k of Object.keys(obj)) {
            const v = obj[k];
            if (typeof v === 'string' && v.includes(`/${slug}/`)) {
              const parts = String(v).split('/').filter(Boolean);
              const last = parts[parts.length - 1];
              if (last) candidates.push(last);
            } else if (Array.isArray(v)) {
              for (const it of v) collectPaths(it);
            } else if (typeof v === 'object') {
              collectPaths(v);
            }
          }
        };
        collectPaths(parentJson);

        // Normalize candidate names and try to fetch each variant from the folder
        const tryNames = (name: string) => {
          const out = new Set<string>();
          out.add(name);
          out.add(name.replace(/[-_]/g, ''));
          out.add(name.replace(/-/g, '_'));
          out.add(name.replace(/_/g, '-'));
          return Array.from(out);
        };

        const aggregated: Record<string, any> = {};
        for (const raw of candidates) {
          const variants = tryNames(raw.replace(/\.json$/i, ''));
          for (const vname of variants) {
            const fileUrl = `/data/locales/${loc}/${base}/${joined}/${vname}.json`;
            try {
              const r = await fetch(fileUrl, { cache: 'force-cache' } as any);
              if (!r.ok) continue;
              let parsed = await r.json();
              parsed = stripExcluded(parsed);
              const key = vname;
              if (parsed && typeof parsed === 'object' && Object.keys(parsed).length === 1) {
                const innerKey = Object.keys(parsed)[0];
                aggregated[key] = parsed[innerKey];
              } else {
                aggregated[key] = parsed;
              }
            } catch (_) {
              // ignore individual file errors
            }
          }
        }

        if (Object.keys(aggregated).length > 0) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.debug('[fetchContentByRoute] network-aggregated folder JSON', fetchUrl);
          }
          return { data: aggregated, path: fetchUrl };
        }
      } catch (_) {
        // ignore network aggregation errors
      }

      return { data: null, path: fetchUrl };
    }

    const top = await res.json();
    const topStripped = stripExcluded(top);
    return { data: topStripped, path: fetchUrl };
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[fetchContentByRoute] fetch error for', primaryPath, err && (err as any).message);
    }
    return { data: null, path: primaryPath };
  }
}

// Itihasa helpers (kept here for convenience)
// Default fallbacks (used on client or if fs read fails)
export let MAHABHARATA_PARVAS: string[] = ['adiparva', 'sabhaparva', 'vanaparva'];
export let RAMAYANA_KANDAS: string[] = ['balakanda', 'ayodhyakanda', 'aranyakanda'];

export function parseNumericSuffix(slug: string): number | null {
  const m = String(slug || '').match(/-(\d+)$/);
  return m ? Number(m[1]) : null;
}

export function toTitleFromSlug(slug: string): string {
  return String(slug || '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => (c as string).toUpperCase());
}

export function toUnderscoreSlug(slug: string): string {
  return String(slug || '').replace(/-/g, '_');
}

// export function isMahabharataParvaSlug(slug: string): boolean {
//   return MAHABHARATA_PARVAS.includes(slug) || /^parva-?\d+$/.test(slug);
// }

// export function isRamayanaKandaSlug(slug: string): boolean {
//   return RAMAYANA_KANDAS.includes(slug) || /^kanda-?\d+$/.test(slug);
// }