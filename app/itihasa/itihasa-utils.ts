export const RAMAYANA_KANDAS = [
  'bala-kanda',
  'ayodhya-kanda',
  'aranya-kanda',
  'kishkinda-kanda',
  'sundara-kanda',
  'yuddha-kanda',
  'uttara-kanda',
] as const;

export const MAHABHARATA_PARVAS = [
  'adi-parva',
  'sabha-parva',
  'vana-parva',
  'virata-parva',
  'udyoga-parva',
  'bhishma-parva',
  'drona-parva',
  'karna-parva',
  'shalya-parva',
  'sauptika-parva',
  'stri-parva',
  'shanti-parva',
  'anushasana-parva',
  'ashvamedhika-parva',
  'ashramavasika-parva',
  'mousala-parva',
  'mahaprasthanika-parva',
  'svargarohana-parva',
] as const;

export type RamayanaKandaSlug = (typeof RAMAYANA_KANDAS)[number];
export type MahabharataParvaSlug = (typeof MAHABHARATA_PARVAS)[number];

export function parseNumericSuffix(value: string): number {
  return Number(value.match(/(\d+)$/)?.[1] || '1');
}

export function toTitleFromSlug(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function toUnderscoreSlug(slug: string): string {
  return slug.replace(/-/g, '_');
}

export function isRamayanaKandaSlug(slug: string): slug is RamayanaKandaSlug {
  return (RAMAYANA_KANDAS as readonly string[]).includes(slug);
}

export function isMahabharataParvaSlug(slug: string): slug is MahabharataParvaSlug {
  return (MAHABHARATA_PARVAS as readonly string[]).includes(slug);
}
