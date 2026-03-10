export const PHILOSOPHY_TOPICS = [
  'dharma',
  'karma',
  'moksha',
  'samsara',
  'purushartha',
  'advaita',
  'bhakti',
  'yoga',
] as const;

export type PhilosophyTopic = (typeof PHILOSOPHY_TOPICS)[number];

export function isPhilosophyTopic(value: string): value is PhilosophyTopic {
  return (PHILOSOPHY_TOPICS as readonly string[]).includes(value);
}

export function toTitleFromSlug(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}
