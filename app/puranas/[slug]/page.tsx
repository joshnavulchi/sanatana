/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import SlugClient from './slugclient';

const VALID_SLUGS = [
  'brahma-purana', 'padma-purana', 'vishnu-purana', 'shiva-purana', 'bhagavata-purana',
  'narada-purana', 'markandeya-purana', 'agni-purana', 'bhavishya-purana',
  'brahmavaivarta-purana', 'linga-purana', 'varaha-purana', 'skanda-purana',
  'vamana-purana', 'kurma-purana', 'matsya-purana', 'garuda-purana', 'brahmanda-purana',
];

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const generate = createGenerateMetadata(`puranas_${slug}`);
  return generate({});
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  return <SlugClient slug={slug} />;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
