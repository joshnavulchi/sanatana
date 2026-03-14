import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import PartsClient from './partsclient';
import { isPhilosophyTopic } from '../../philosophy-utils';
import fs from 'fs';
import path from 'path';

type Params = { slug: string; parts: string[] };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  const localesDir = path.join(process.cwd(), 'public', 'locales', 'en');
  let files: string[] = [];
  try {
    files = fs.readdirSync(localesDir);
  } catch (_) {
    return [];
  }

  const out: Params[] = [];
  const re = /^vedic_philosophy_([^_]+)_(.+)\.json$/;
  for (const file of files) {
    const m = file.match(re);
    if (!m) continue;
    const slug = m[1];
    const subtopic = m[2];
    if (!slug || !subtopic) continue;
    if (!isPhilosophyTopic(slug)) continue;
    out.push({ slug, parts: [subtopic] });
  }

  out.sort((a, b) => {
    if (a.slug !== b.slug) return a.slug.localeCompare(b.slug);
    return (a.parts[0] || '').localeCompare(b.parts[0] || '');
  });

  return out;
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
