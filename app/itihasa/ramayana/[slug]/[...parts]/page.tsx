import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@/app/components/structured-data/StructuredData';
import ItihasaPartClient from '../../../itihasapartclient';
import {
  isRamayanaKandaSlug,
  parseNumericSuffix,
  toTitleFromSlug,
  toUnderscoreSlug,
} from '../../../itihasa-utils';
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
  const re = /^itihasa_ramayana_([^_]+(?:_[^_]+)*)_sarga(\d+)\.json$/;
  for (const file of files) {
    const m = file.match(re);
    if (!m) continue;
    const kandaSlug = m[1].replace(/_/g, '-');
    if (!isRamayanaKandaSlug(kandaSlug)) continue;
    const sarga = Number(m[2]);
    if (!Number.isFinite(sarga) || sarga <= 0) continue;
    out.push({ slug: kandaSlug, parts: [`sarga-${sarga}`] });
  }

  out.sort((a, b) => {
    if (a.slug !== b.slug) return a.slug.localeCompare(b.slug);
    const as = Number(a.parts[0]?.match(/(\d+)$/)?.[1] || '0');
    const bs = Number(b.parts[0]?.match(/(\d+)$/)?.[1] || '0');
    return as - bs;
  });

  return out;
}

export async function generateMetadata(props: { params: Promise<Params> }) {
  const { slug, parts } = await props.params;
  const sarga = parseNumericSuffix(parts[0] || 'sarga-1');
  const namespace = `itihasa_ramayana_${toUnderscoreSlug(slug)}_sarga${sarga}`;
  const generate = createGenerateMetadata(namespace);
  return generate({});
}

export default async function Page(props: { params: Promise<Params> }) {
  const { slug, parts } = await props.params;
  if (!isRamayanaKandaSlug(slug)) notFound();
  if (!parts[0]?.startsWith('sarga-')) notFound();

  const sarga = parseNumericSuffix(parts[0]);
  const namespace = `itihasa_ramayana_${toUnderscoreSlug(slug)}_sarga${sarga}`;

  return (
    <>
      <StructuredData metaKey={`itihasa_ramayana_${toUnderscoreSlug(slug)}_sarga${sarga}`} />
      <ItihasaPartClient
        namespace={namespace}
        titleFallback={`${toTitleFromSlug(slug)} Sarga ${sarga}`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Itihasa', href: '/itihasa' },
          { label: 'Ramayana', href: '/itihasa/ramayana' },
          { label: toTitleFromSlug(slug), href: `/itihasa/ramayana/${slug}` },
          { label: `Sarga ${sarga}` },
        ]}
      />
    </>
  );
}
