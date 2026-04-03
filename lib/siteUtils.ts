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

function normalizeSegments(segments: string[]) {
  return Array.isArray(segments)
    ? segments.map(s => String(s).replace(/^\/+|\/+$/g, '')).filter(Boolean)
    : [];
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

  // When running on the server (build / node), prefer reading locale JSON
  // files from the local `public/data/locales` path and cache them in-memory
    const EXCLUDE_KEYS = new Set(['meta', 'openGraph', 'schema', 'openSpec', 'openspec']);
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
  // for the life of the Node process. This speeds up repeated loads during
  // static render/build.
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const diskPath = path.join(process.cwd(), 'public', 'data', 'locales', loc, base, joined, 'index.json');

      // Return cached value when available
      const cached = BUILD_CACHE.get(diskPath);
      if (cached) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.debug('[fetchContentByRoute] build-cache hit', diskPath);
        }
        return { data: cached.data, path: diskPath };
      }

      // Attempt to read from disk
      if (fs.existsSync(diskPath)) {
        const raw = fs.readFileSync(diskPath, 'utf8');
        let parsed: any = {};
        try {
          parsed = JSON.parse(raw);
          parsed = stripExcluded(parsed);
        } catch (e) {
          // parse error - leave parsed as empty
        }
        BUILD_CACHE.set(diskPath, { ts: Date.now(), data: parsed });
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.debug('[fetchContentByRoute] read from disk', diskPath);
        }
        return { data: parsed, path: diskPath };
      }
      // If the exact path wasn't found, attempt a slug->folder fallback.
      // Some namespaces store the content under a shorter folder name whose
      // index.json contains a top-level key equal to the slug (e.g. folder
      // `bala` contains `{ "bala-kanda": { ... } }`). In that case we can
      // scan sibling directories of the requested parent and return the
      // matching index.json when found.
      try {
        const path = require('path');
        const parentDir = path.dirname(diskPath); // .../ramayana/bala-kanda
        const parentParent = path.dirname(parentDir); // .../ramayana
        const lastSegment = path.basename(parentDir); // e.g. 'bala-kanda'
        if (fs.existsSync(parentParent)) {
          const entries = fs.readdirSync(parentParent, { withFileTypes: true });
          for (const ent of entries) {
            if (!ent.isDirectory()) continue;
            const candidateIdx = path.join(parentParent, ent.name, 'index.json');
              try {
                if (!fs.existsSync(candidateIdx)) continue;
                const txt = fs.readFileSync(candidateIdx, 'utf8');
                let parsed: any = {};
                try { parsed = JSON.parse(txt); parsed = stripExcluded(parsed); } catch (_) { }
                if (parsed && Object.prototype.hasOwnProperty.call(parsed, lastSegment)) {
                  if (process.env.NODE_ENV !== 'production') {
                    // eslint-disable-next-line no-console
                    console.debug('[fetchContentByRoute] slug-folder fallback', candidateIdx, 'matched', lastSegment);
                  }
                  BUILD_CACHE.set(candidateIdx, { ts: Date.now(), data: parsed });
                  return { data: parsed, path: candidateIdx };
                }
              } catch (_) {
              // ignore parse/read errors
            }
          }
        }
      } catch (_) {
        // ignore fallback errors and continue to network fetch
      }

      // If no index.json was found, attempt to aggregate any JSON files that
      // exist directly inside the requested folder. This supports folders
      // which contain multiple JSON pieces (e.g. mantra1.json, mantra2.json)
      // but do not have a central `index.json`. We will return an object
      // mapping filenames (without .json) to parsed content.
      try {
        const dirPath = path.join(process.cwd(), 'public', 'data', 'locales', loc, base, joined);
        if (fs.existsSync(dirPath)) {
          const entries = fs.readdirSync(dirPath, { withFileTypes: true });
          const jsonFiles = entries.filter((e: any) => e.isFile() && String(e.name).toLowerCase().endsWith('.json'))
            .map((e: any) => String(e.name));
          if (jsonFiles.length > 0) {
            const aggregated: Record<string, any> = {};
            for (const fname of jsonFiles) {
              try {
                const fp = path.join(dirPath, fname);
                const txt = fs.readFileSync(fp, 'utf8');
                const key = fname.replace(/\.json$/i, '');
                let parsed: any = {};
                try { const txt = fs.readFileSync(fp, 'utf8'); parsed = JSON.parse(txt); parsed = stripExcluded(parsed); } catch (_) { parsed = {}; }
                // use that inner object under the filename key to avoid extra
                // nesting.
                if (parsed && typeof parsed === 'object' && Object.keys(parsed).length === 1) {
                  const innerKey = Object.keys(parsed)[0];
                  aggregated[key] = parsed[innerKey];
                } else {
                  aggregated[key] = parsed;
                }
              } catch (e) {
                // ignore parse errors for individual files
              }
            }
            if (Object.keys(aggregated).length > 0) {
              BUILD_CACHE.set(dirPath, { ts: Date.now(), data: aggregated });
              if (process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.debug('[fetchContentByRoute] aggregated folder JSON', dirPath);
              }
              return { data: aggregated, path: dirPath };
            }
          }
        }
      } catch (_) {
        // ignore aggregation errors and continue to network fetch
      }
      // fallthrough to network fetch if file missing
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('[fetchContentByRoute] build-file read failed', primaryPath, e && (e as any).message);
      }
      // continue to network fetch fallback
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
      try {
        const path = require('path');
        // parent index URL e.g. /data/locales/en/vedas/yajurveda/index.json
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

// Attempt to populate from public/data/locales/{locale}/itihasa on server start.
// This runs only in Node (server) and won't pull `fs` into client bundles.
if (typeof window === 'undefined') {
  try {
    const fs = require('fs');
    const path = require('path');
    const baseLocale = String(DEFAULT_LOCALE || 'en');

    const mahabPath = path.join(process.cwd(), 'public', 'data', 'locales', baseLocale, 'itihasa', 'mahabharata');
    const ramaPath = path.join(process.cwd(), 'public', 'data', 'locales', baseLocale, 'itihasa', 'ramayana');

    try {
      const mahabDirs = fs.readdirSync(mahabPath, { withFileTypes: true })
        .filter((d: any) => d.isDirectory())
        .map((d: any) => String(d.name))
        .filter(Boolean);
      if (Array.isArray(mahabDirs) && mahabDirs.length > 0) {
        MAHABHARATA_PARVAS = mahabDirs.sort();
      }
    } catch (e) {
      // ignore and keep defaults
    }

    try {
      const ramaDirs = fs.readdirSync(ramaPath, { withFileTypes: true })
        .filter((d: any) => d.isDirectory())
        .map((d: any) => String(d.name))
        .filter(Boolean);
      if (Array.isArray(ramaDirs) && ramaDirs.length > 0) {
        RAMAYANA_KANDAS = ramaDirs.sort();
      }
    } catch (e) {
      // ignore and keep defaults
    }
  } catch (e) {
    // fs not available or other error — keep fallbacks
  }
}

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