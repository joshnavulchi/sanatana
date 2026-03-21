export const revalidate = 60;
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import { notFound } from 'next/navigation';
import SlugClient from './slugclient';
import { PHILOSOPHY_TOPICS, isPhilosophyTopic } from '../philosophy-utils';
import { params as generatedParams } from '@app/generated-params/vedic-philosophy-slugs';

export const dynamicParams = false;
export const dynamic = 'force-static';

export async function generateStaticParams() {
  // Filter generated params by checking topic namespace presence.
  try {
    const { filterGeneratedParams } = await Promise.resolve().then(() => require('@lib/i18n')) as typeof import('@lib/i18n');
    return await filterGeneratedParams(generatedParams, (p: any) => `vedic_philosophy_topic_${String(p.slug)}`);
  } catch (_) {
    return generatedParams;
  }
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
