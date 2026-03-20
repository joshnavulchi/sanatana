import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import PartsClient from './partsclient';
import { normalizePuranaSlug, parseNumericSuffix, MAHAPURANA_SLUGS } from '../../purana-utils';
type Params = { slug: string; parts: string[] };

import { params as generatedParams } from '@app/generated-params/puranas-slugs-parts';

export const dynamicParams = false;

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

export async function generateStaticParams() {
  // Return the generated params list for purana parts to export all available pages.
  return generatedParams;
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
  const normalizedSlug = normalizePuranaSlug(slug);
  return (
    <>
      <StructuredData metaKey={`puranas_${normalizedSlug}`} />
      <PartsClient slug={normalizedSlug} parts={parts} />
    </>
  );
}
