import { createGenerateMetadata } from '@lib/pageUtils';
import { PURANAS_PART_PARAMS } from '@lib/generated/scriptureStaticParams';
import PartsClient from './partsclient';
import { MAHAPURANA_SLUGS, normalizePuranaSlug, parseNumericSuffix } from '../../purana-utils';

type Params = { slug: string; parts: string[] };

export const dynamicParams = false;
export const dynamic = 'force-static';

function getNamespace(slug: string, parts: string[]): string {
  if (slug === 'bhagavata') {
    const skanda = parseNumericSuffix(parts[0] || 'skanda-1');
    if (parts.length === 1) return `puranas_bhagavata_skanda${skanda}`;
    const chapter = parseNumericSuffix(parts[1] || 'chapter-1');
    if (parts.length === 2) return `puranas_bhagavata_skanda${skanda}_chapter${chapter}`;
    const verse = parseNumericSuffix(parts[2] || 'verse-1');
    return `puranas_bhagavata_skanda${skanda}_chapter${chapter}_verse${verse}`;
  }

  const chapter = parseNumericSuffix(parts[0] || 'chapter-1');
  if (parts.length === 1) return `puranas_${slug}_chapter${chapter}`;
  const verse = parseNumericSuffix(parts[1] || 'verse-1');
  return `puranas_${slug}_chapter${chapter}_verse${verse}`;
}

export function generateStaticParams() {
  return PURANAS_PART_PARAMS as Params[];
}

export async function generateMetadata(props: { params: Promise<Params> }) {
  const { slug, parts } = await props.params;
  const normalizedSlug = normalizePuranaSlug(slug);
  const namespace = getNamespace(normalizedSlug, parts);
  const generate = createGenerateMetadata(namespace);
  return generate({});
}

export default async function Page(props: { params: Promise<Params> }) {
  const { slug, parts } = await props.params;
  return <PartsClient slug={normalizePuranaSlug(slug)} parts={parts} />;
}
