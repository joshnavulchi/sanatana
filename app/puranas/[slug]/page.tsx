/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import SlugClient from './slugclient';
import { getPuranaOverviewNamespace, MAHAPURANA_SLUGS, normalizePuranaSlug } from '../purana-utils';

const VALID_SLUGS = [...MAHAPURANA_SLUGS];

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
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
