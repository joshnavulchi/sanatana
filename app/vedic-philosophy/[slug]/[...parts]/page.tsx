import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import PartsClient from './partsclient';
import { PHILOSOPHY_TOPICS, isPhilosophyTopic } from '../../philosophy-utils';

type Params = { slug: string; parts: string[] };

export const dynamicParams = false;

export function generateStaticParams() {
  // Provide a simple deterministic params list so Next detects the export.
  return PHILOSOPHY_TOPICS.map((slug) => ({ slug, parts: ['overview'] }));
}

export async function generateMetadata(props: { params: Promise<Params> }) {
  const { slug, parts } = await props.params;
  const subtopic = parts[0] || '';
  const namespace = `vedic_philosophy_${slug}_${subtopic}`;
  const generate = createGenerateMetadata(namespace);
  return generate({});
}

export default async function Page(props: { params: Promise<Params> }) {
  const { slug, parts } = await props.params;
  const subtopic = parts[0] || '';

  if (!isPhilosophyTopic(slug)) notFound();
  if (!subtopic) notFound();

  return <PartsClient topic={slug} subtopic={subtopic} />;
}
