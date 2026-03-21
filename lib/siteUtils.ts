// Consolidated site utilities: itihasa, purana helpers, safe generated params loader,
// and philosophy paths fallback.

// Itihasa helpers
export const MAHABHARATA_PARVAS: string[] = ['adiparva', 'sabha-parva', 'vana-parva'];
export const RAMAYANA_KANDAS: string[] = ['balakanda', 'ayodhyakanda', 'aranyakanda'];

export function parseNumericSuffix(slug: string): number | null {
  const m = String(slug || '').match(/-(\d+)$/);
  return m ? Number(m[1]) : null;
}

export function toTitleFromSlug(slug: string): string {
  return String(slug || '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
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

// Purana helpers
export const MAHAPURANA_SLUGS: string[] = ['brahmanda-purana', 'skanda-purana'];

export function normalizePuranaSlug(slug: string): string {
  return String(slug || '').toLowerCase().replace(/\s+/g, '-');
}

export function getPuranaOverviewNamespace(slug: string): string {
  return `puranas/${normalizePuranaSlug(slug)}/overview`;
}

// Note: safe generated params loader was moved to `lib/safeGeneratedParams.ts` to
// keep dynamic requires out of modules that are imported by client components.

// Philosophy paths fallback
export async function getAllPhilosophyPaths(): Promise<Array<{ slug: string; parts?: string[] }>> {
  return [];
}

export function getAllPhilosophyPathsSync(): Array<{ slug: string; parts?: string[] }> {
  return [];
}

// Content path helpers
import { LOCALES_PUBLIC_PATH } from './i18n';

export function getContentPath(locale: string, segments: string[]) {
  const loc = String(locale || 'en').replace(/\/$/, '');
  const seg = Array.isArray(segments) ? segments.map(s => String(s).replace(/^\/+|\/+$/g, '')).filter(Boolean).join('/') : '';
  return `${LOCALES_PUBLIC_PATH}/${loc}/${seg}.json`;
}

// Fetch content with index fallback
export async function fetchContent(locale: string, segments: string[]) {
  const primary = getContentPath(locale, segments);
  try {
    const res = await fetch(primary, { cache: 'force-cache' } as any);
    if (res.ok) {
      const data = await res.json();
      return { data, path: primary };
    }
    if (res.status !== 404) {
      // continue to fallback
    }
  } catch (e) {
    // ignore and try fallback
  }

  // Fallback: try folder index at /.../{segments}/index.json
  const folderPathSegments = Array.isArray(segments) ? [...segments, 'index'] : [...(segments || []), 'index'];
  const indexPath = getContentPath(locale, folderPathSegments);
  try {
    const r2 = await fetch(indexPath, { cache: 'force-cache' } as any);
    if (r2.ok) {
      const data = await r2.json();
      return { data, path: indexPath };
    }
  } catch (e) {
    // ignore
  }

  return { data: null, path: null };
}
