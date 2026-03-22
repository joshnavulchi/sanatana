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
    // 1. folder index (primary)
    `/data/locales/${loc}/${base}/${joined}/index.json`,

    // 2. nested file
    `/data/locales/${loc}/${base}/${joined}/${last}.json`,

    // 3. direct file
    `/data/locales/${loc}/${base}/${joined}.json`,
  ];
}

/**
 * 🔥 MAIN FETCH FUNCTION (USE THIS EVERYWHERE)
 */
export async function fetchContentByRoute(
  locale: string,
  segments: string[]
) {
  const { base, pathSegments } = resolveRoute(segments);

  if (!base) {
    return { data: null, path: null };
  }

  const paths = buildPaths(base, locale, pathSegments);

  // --- SERVER SIDE ---
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs').promises;
      const pathModule = require('path');

      for (const p of paths) {
        try {
          const rel = p.replace(/^\//, '');
          const filePath = pathModule.join(process.cwd(), 'public', rel);

          const txt = await fs.readFile(filePath, 'utf8');
          return { data: JSON.parse(txt), path: p };
        } catch {
          continue;
        }
      }
    } catch {
      // fallback to fetch
    }
  }

  // --- CLIENT SIDE ---
  for (const p of paths) {
    try {
      const res = await fetch(p, { cache: 'force-cache' } as any);
      if (res.ok) {
        return { data: await res.json(), path: p };
      }
    } catch { }
  }

  // --- FALLBACK LOCALE ---
  if (locale !== DEFAULT_LOCALE) {
    return fetchContentByRoute(DEFAULT_LOCALE, segments);
  }

  return { data: null, path: null };
}

// Itihasa helpers (kept here for convenience)
export const MAHABHARATA_PARVAS: string[] = ['adiparva', 'sabha-parva', 'vana-parva'];
export const RAMAYANA_KANDAS: string[] = ['balakanda', 'ayodhyakanda', 'aranyakanda'];

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

export function isMahabharataParvaSlug(slug: string): boolean {
  return MAHABHARATA_PARVAS.includes(slug) || /^parva-?\d+$/.test(slug);
}

export function isRamayanaKandaSlug(slug: string): boolean {
  return RAMAYANA_KANDAS.includes(slug) || /^kanda-?\d+$/.test(slug);
}