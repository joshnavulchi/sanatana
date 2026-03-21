export const revalidate = 60;
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import { notFound } from 'next/navigation';
import SlugClient from './slugclient';
import { PHILOSOPHY_TOPICS, isPhilosophyTopic } from '../philosophy-utils';
import { loadGeneratedParamsSync } from '@lib/siteUtils';

export const dynamicParams = false;
export const dynamic = 'force-static';

export async function generateStaticParams() {
  // Return the build-time generated params directly to remain compatible with
  // `output: 'export'` and avoid runtime requires inside the build worker.
  const list: any[] = loadGeneratedParamsSync('@app/generated-params/vedic-philosophy-slugs');
  return list
    .map((p) => ({ slug: String((p && (p.slug ?? (p.params && p.params.slug))) || '') }))
    .filter((p) => p.slug);
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
