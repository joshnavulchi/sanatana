/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import { notFound } from 'next/navigation';
import SlugClient from './slugclient';
import { PHILOSOPHY_TOPICS, isPhilosophyTopic } from '../philosophy-utils';

const VALID_SLUGS = PHILOSOPHY_TOPICS;

export const dynamicParams = false;
export const dynamic = 'force-static';

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const generate = createGenerateMetadata(`vedic_philosophy_topic_${slug}`);
  return generate({});
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  if (!isPhilosophyTopic(slug)) {
    notFound();
  }
  return <SlugClient slug={slug} />;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
