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
  const pathSegments = parts.slice(1);

  if (!BASES.includes(base)) {
    return { base: null, pathSegments: parts };
  }

  return { base, pathSegments };
}

/**
 * Build deterministic hierarchical paths
 */
function buildPaths(base: string, locale: string, segments: string[]) {
  const loc = locale || DEFAULT_LOCALE;
  const parts = normalizeSegments(segments);

  if (!parts.length) return [];

  const joined = parts.join('/');
  const last = parts[parts.length - 1];

  return [
    `/data/locales/${loc}/${base}/${joined}/index.json`,
    `/data/locales/${loc}/${base}/${joined}.json`,
    `/data/locales/${loc}/${base}/${joined}/${last}.json`,
  ];
}

// For pre-generating static paths for top-level upanishads
// This is a bit hacky but avoids needing to crawl the filesystem or maintain a separate list of top-level upanishads.
async function doesContentExist(path: string) {
  try {
    const res = await fetch(path, {
      method: 'HEAD', // ⚡ very fast (no body)
      cache: 'force-cache',
    } as any);

    return res.ok;
  } catch {
    return false;
  }
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

  // ✅ PRIMARY PATH ONLY (no loops)
  const primaryPath = `/data/locales/${loc}/${base}/${joined}/index.json`;

  // 🔍 FAST existence check
  const exists = await doesContentExist(primaryPath);

  if (!exists) {
    return { data: null, path: null }; // 🚀 SKIP immediately
  }

  // ✅ FETCH ONLY IF EXISTS
  const res = await fetch(primaryPath, {
    cache: 'force-cache',
    next: { revalidate: 60 },
  } as any);

  if (res.ok) {
    return { data: await res.json(), path: primaryPath };
  }

  return { data: null, path: null };
}

// Itihasa helpers (kept here for convenience)
// Default fallbacks (used on client or if fs read fails)
export let MAHABHARATA_PARVAS: string[] = ['adiparva', 'sabhaparva', 'vanaparva'];
export let RAMAYANA_KANDAS: string[] = ['balakanda', 'ayodhyakanda', 'aranyakanda'];

// Attempt to populate from public/data/locales/{locale}/itihasa on server start.
// This runs only in Node (server) and won't pull `fs` into client bundles.
// if (typeof window === 'undefined') {
//   try {
//     const fs = require('fs');
//     const path = require('path');
//     const baseLocale = String(DEFAULT_LOCALE || 'en');

//     const mahabPath = path.join(process.cwd(), 'public', 'data', 'locales', baseLocale, 'itihasa', 'mahabharata');
//     const ramaPath = path.join(process.cwd(), 'public', 'data', 'locales', baseLocale, 'itihasa', 'ramayana');

//     try {
//       const mahabDirs = fs.readdirSync(mahabPath, { withFileTypes: true })
//         .filter((d: any) => d.isDirectory())
//         .map((d: any) => String(d.name))
//         .filter(Boolean);
//       if (Array.isArray(mahabDirs) && mahabDirs.length > 0) {
//         MAHABHARATA_PARVAS = mahabDirs.sort();
//       }
//     } catch (e) {
//       // ignore and keep defaults
//     }

//     try {
//       const ramaDirs = fs.readdirSync(ramaPath, { withFileTypes: true })
//         .filter((d: any) => d.isDirectory())
//         .map((d: any) => String(d.name))
//         .filter(Boolean);
//       if (Array.isArray(ramaDirs) && ramaDirs.length > 0) {
//         RAMAYANA_KANDAS = ramaDirs.sort();
//       }
//     } catch (e) {
//       // ignore and keep defaults
//     }
//   } catch (e) {
//     // fs not available or other error — keep fallbacks
//   }
// }

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