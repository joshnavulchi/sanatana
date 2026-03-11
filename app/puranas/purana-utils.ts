export const MAHAPURANA_SLUGS = [
  'brahma',
  'padma',
  'vishnu',
  'shiva',
  'bhagavata',
  'narada',
  'markandeya',
  'agni',
  'bhavishya',
  'brahmavaivarta',
  'linga',
  'varaha',
  'skanda',
  'vamana',
  'kurma',
  'matsya',
  'garuda',
  'brahmanda',
] as const;

export type MahapuranaSlug = (typeof MAHAPURANA_SLUGS)[number];

const LEGACY_SUFFIX = '-purana';

export function normalizePuranaSlug(slug: string): string {
  if (slug.endsWith(LEGACY_SUFFIX)) {
    return slug.slice(0, -LEGACY_SUFFIX.length);
  }
  return slug;
}

export function isMahapuranaSlug(slug: string): slug is MahapuranaSlug {
  return (MAHAPURANA_SLUGS as readonly string[]).includes(normalizePuranaSlug(slug));
}

export function getLegacyPuranaSlug(slug: string): string {
  const normalized = normalizePuranaSlug(slug);
  return `${normalized}${LEGACY_SUFFIX}`;
}

export function getPuranaOverviewNamespace(slug: string): string {
  return `puranas_${getLegacyPuranaSlug(slug)}`;
}

export function toTitleFromSlug(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function parseNumericSuffix(value: unknown): number {
  if (typeof value !== 'string') return Number.NaN;
  return Number(value.match(/(\d+)$/)?.[1] || '1');
}
