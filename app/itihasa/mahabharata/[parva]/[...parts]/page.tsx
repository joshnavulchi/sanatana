import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@/app/components/structured-data/StructuredData';
import ItihasaPartClient from '../../../itihasapartclient';
import {
  isMahabharataParvaSlug,
  parseNumericSuffix,
  toTitleFromSlug,
  toUnderscoreSlug,
} from '../../../itihasa-utils';
type Params = { parva: string; parts: string[] };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  let files: string[] = [];

  const out: Params[] = [];
  const re = /^itihasa_mahabharata_([^_]+(?:_[^_]+)*)_chapter(\d+)\.json$/;
  for (const file of files) {
    const m = file.match(re);
    if (!m) continue;
    const parvaSlug = m[1].replace(/_/g, '-');
    if (!isMahabharataParvaSlug(parvaSlug)) continue;
    const chapter = Number(m[2]);
    if (!Number.isFinite(chapter) || chapter <= 0) continue;
    out.push({ parva: parvaSlug, parts: [`chapter-${chapter}`] });
  }

  out.sort((a, b) => {
    if (a.parva !== b.parva) return a.parva.localeCompare(b.parva);
    const ac = Number(a.parts[0]?.match(/(\d+)$/)?.[1] || '0');
    const bc = Number(b.parts[0]?.match(/(\d+)$/)?.[1] || '0');
    return ac - bc;
  });

  return out;
}

export async function generateMetadata(props: { params: Promise<Params> }) {
  const { parva, parts } = await props.params;
  const chapter = parseNumericSuffix(parts[0] || 'chapter-1');
  const namespace = `itihasa_mahabharata_${toUnderscoreSlug(parva)}_chapter${chapter}`;
  const generate = createGenerateMetadata(namespace);
  return generate({});
}

export default async function Page(props: { params: Promise<Params> }) {
  const { parva, parts } = await props.params;
  if (!isMahabharataParvaSlug(parva)) notFound();
  if (!parts[0]?.startsWith('chapter-')) notFound();

  const chapter = parseNumericSuffix(parts[0]);
  const namespace = `itihasa_mahabharata_${toUnderscoreSlug(parva)}_chapter${chapter}`;

  return (
    <>
      <StructuredData metaKey={namespace} />
      <ItihasaPartClient
        namespace={namespace}
        titleFallback={`${toTitleFromSlug(parva)} Chapter ${chapter}`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Itihasa', href: '/itihasa' },
          { label: 'Mahabharata', href: '/itihasa/mahabharata' },
          { label: toTitleFromSlug(parva), href: `/itihasa/mahabharata/${parva}` },
          { label: `Chapter ${chapter}` },
        ]}
      />
    </>
  );
}
