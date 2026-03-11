/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import SlugClient from './slugclient';

const VALID_SLUGS = [
  'bala-kanda', 'ayodhya-kanda', 'aranya-kanda', 'kishkinda-kanda',
  'sundara-kanda', 'yuddha-kanda', 'uttara-kanda',
];

export const dynamicParams = false;

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const generate = createGenerateMetadata(`ramayana_${slug}`);
  return generate({});
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  return <SlugClient slug={slug} />;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
