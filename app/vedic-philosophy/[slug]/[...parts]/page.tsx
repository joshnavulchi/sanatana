import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import PartsClient from './partsclient';
import { PHILOSOPHY_TOPICS, isPhilosophyTopic } from '../../philosophy-utils';
import { params as generatedParams } from '@app/generated-params/vedic-philosophy-parts';
import { loadLocaleData, DEFAULT_LOCALE } from '@lib/i18n';

type Params = { slug: string; parts: string[] };
export const dynamicParams = false;

export async function generateStaticParams() {
  // Use generated params but filter out entries missing locale namespaces.
  try {
    const { filterGeneratedParams } = await Promise.resolve().then(() => require('@lib/i18n')) as typeof import('@lib/i18n');
    return await filterGeneratedParams(generatedParams, (p: any) => `vedic_philosophy_${String(p.slug)}_${String((p.parts || [])[0] || '')}`);
  } catch (_) {
    return generatedParams;
  }
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

  try {
    const namespace = `vedic_philosophy_${slug}_${subtopic}`;
    const ns = await loadLocaleData(DEFAULT_LOCALE, namespace);
    const hasTitle = typeof (ns as any).title === 'string' && (ns as any).title.trim().length > 0;
    if (!hasTitle) notFound();
  } catch (_) { }

  return <PartsClient topic={slug} subtopic={subtopic} />;
}
