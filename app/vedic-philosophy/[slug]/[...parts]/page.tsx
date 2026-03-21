import { notFound } from 'next/navigation';
import PartsClient from './partsclient';
import { createGenerateMetadata } from '@lib/pageUtils';
import { getAllPhilosophyPaths } from '@/lib/getAllPhilosophyPaths';
import { loadLocaleData, DEFAULT_LOCALE } from '@lib/i18n';

type Params = { slug: string; parts: string[] };
export const dynamicParams = false;

// app/vedic-philosophy/[slug]/[...parts]/page.tsx

export async function generateStaticParams() {
  const data = await getAllPhilosophyPaths();
  // Example structure:
  // [
  //   { slug: 'advaita', parts: ['introduction'] },
  //   { slug: 'advaita', parts: ['concepts', 'maya'] }
  // ]

  return data.map(item => ({
    slug: item.slug,
    parts: item.parts, // must be array
  }));
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

  // if (!isPhilosophyTopic(slug)) notFound();
  if (!subtopic) notFound();

  try {
    const namespace = `vedic_philosophy/${slug}/${subtopic}`;
    const ns = await loadLocaleData(DEFAULT_LOCALE, namespace);
    const hasTitle = typeof (ns as any).title === 'string' && (ns as any).title.trim().length > 0;
    if (!hasTitle) notFound();
  } catch (_) { }

  return <PartsClient topic={slug} subtopic={subtopic} />;
}
