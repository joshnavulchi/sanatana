import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { createGenerateMetadata } from '@lib/pageUtils';
import ItihasaPartClient from '../../../itihasapartclient';
import {
  isRamayanaKandaSlug,
  parseNumericSuffix,
  RAMAYANA_KANDAS,
  toTitleFromSlug,
  toUnderscoreSlug,
} from '../../../itihasa-utils';

type Params = { slug: string; parts: string[] };

function readRamayanaStructure() {
  const filePath = path.join(process.cwd(), 'locales', 'en', 'itihasa_ramayana_structure.json');
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
}

export function generateStaticParams() {
  const structure = readRamayanaStructure();
  const kandas = Array.isArray(structure?.kandas) ? (structure?.kandas as unknown[]) : [];

  const params: Params[] = [];
  if (kandas.length > 0) {
    for (const kanda of kandas) {
      if (!kanda || typeof kanda !== 'object') continue;
      const kandaSlug = String((kanda as Record<string, unknown>).slug || '');
      const sargas = Array.isArray((kanda as Record<string, unknown>).sargas)
        ? ((kanda as Record<string, unknown>).sargas as unknown[])
        : [];

      for (const sarga of sargas) {
        if (!sarga || typeof sarga !== 'object') continue;
        const sargaNumber = Number((sarga as Record<string, unknown>).sarga);
        if (!Number.isFinite(sargaNumber)) continue;
        params.push({ slug: kandaSlug, parts: [`sarga-${sargaNumber}`] });
      }
    }
    return params;
  }

  for (const kanda of RAMAYANA_KANDAS) {
    params.push({ slug: kanda, parts: ['sarga-1'] });
  }

  return params;
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
  );
}
