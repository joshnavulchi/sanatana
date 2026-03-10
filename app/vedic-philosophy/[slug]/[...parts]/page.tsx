import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import PartsClient from './partsclient';
import { isPhilosophyTopic } from '../../philosophy-utils';

type Params = { slug: string; parts: string[] };

function readStructure() {
  const filePath = path.join(process.cwd(), 'locales', 'en', 'vedic_philosophy_structure.json');
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
}

export function generateStaticParams() {
  const structure = readStructure();
  const topics = Array.isArray(structure?.topics) ? (structure?.topics as unknown[]) : [];
  const params: Params[] = [];

  for (const topic of topics) {
    if (!topic || typeof topic !== 'object') continue;
    const topicSlug = String((topic as Record<string, unknown>).slug || '');
    const subtopics = Array.isArray((topic as Record<string, unknown>).subtopics)
      ? ((topic as Record<string, unknown>).subtopics as unknown[])
      : [];

    for (const subtopic of subtopics) {
      if (!subtopic || typeof subtopic !== 'object') continue;
      const subtopicSlug = String((subtopic as Record<string, unknown>).slug || '');
      if (!topicSlug || !subtopicSlug) continue;
      params.push({ slug: topicSlug, parts: [subtopicSlug] });
    }
  }

  return params;
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
