/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
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
  return <SlugClient slug={normalizePuranaSlug(slug)} />;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
