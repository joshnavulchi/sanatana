export const revalidate = 60;
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@/app/components/structured-data/StructuredData';
import SlugClient from './slugclient';
import { getPuranaOverviewNamespace, MAHAPURANA_SLUGS, normalizePuranaSlug } from '../purana-utils';

const VALID_SLUGS: string[] = [];
for (const slug of MAHAPURANA_SLUGS) {
  VALID_SLUGS.push(slug);
  VALID_SLUGS.push(`${slug}-purana`);
}

export const dynamicParams = false;
export const dynamic = 'force-static';

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug: String(slug) }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const canonicalSlug = normalizePuranaSlug(slug);
  const generate = createGenerateMetadata(getPuranaOverviewNamespace(canonicalSlug));
  return generate({});
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const canonicalSlug = normalizePuranaSlug(slug);
  return (
    <>
      <StructuredData metaKey={`puranas_${canonicalSlug}`} />
      <SlugClient slug={canonicalSlug} />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
