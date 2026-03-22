import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { detectServerLocaleFromHeaders, SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@lib/i18n';
import { secrets } from '@lib/secrets';
import { createGenerateMetadata } from '@lib/pageUtils';
import { buildPath, buildIndexPath } from '@lib/vedasUtils';
import StructuredData from '@components/structured-data/StructuredData';
import VedasClientRenderer from './VedasClientRenderer';

type VedasData = {
  title?: string;
  description?: string;
  content?: string | Record<string, any>;
  children?: string[];
};

export async function generateStaticParams() {
  // Safe, filesystem-free fallback: emit only top-level vedas slugs per locale.
  // This avoids importing generated index modules which may reference
  // missing `structure.json` files at build time.
  const topLevel = ['rigveda', 'yajurveda', 'samaveda', 'atharvaveda'];
  const out: Array<{ segments: string[] }> = [];
  for (const loc of SUPPORTED_LOCALES) {
    for (const s of topLevel) out.push({ segments: [s] });
  }
  return out;
}

export async function generateMetadata(props: any) {
  let params = props?.params;
  try {
    if (params && typeof (params as any).then === 'function') {
      params = await params;
    }
  } catch (e) {
    params = undefined;
  }
  const segments = Array.isArray(params?.segments) ? params.segments : [];

  const candidates: string[] = [];
  if (segments.length === 1) {
    candidates.push(`vedas/${segments[0]}/${segments[0]}`);
  }
  if (segments.length > 0) {
    candidates.push(`vedas/${segments.join('/')}/index`);
    candidates.push(`vedas/${segments.join('/')}`);
    candidates.push(`${segments.join('/')}`);
  }
  candidates.push('vedas');

  for (const key of candidates) {
    try {
      const gen = createGenerateMetadata(key);
      const meta = await gen(props);
      if (meta && meta.title && !String(meta.title).toLowerCase().includes('sanatana')) return meta;
    } catch (e) {
      // ignore and try next
    }
  }

  // fallback: generic vedas metadata
  return createGenerateMetadata('vedas')(props);
}

export default async function Page({ params }: { params: { segments?: string[] } }) {
  const segments = Array.isArray(params?.segments) ? params.segments : [];
  if (!segments || segments.length === 0) return notFound();

  const hdrs = headers();
  const locale = detectServerLocaleFromHeaders(hdrs) || 'en';

  // Try file first
  const filePath = buildPath(locale, segments);
  let data: VedasData | null = null;
  // Try common JSON locations: file, folder/index.json, folder/<name>.json
  async function tryLocalePaths(loc: string) {
    const paths = [
      buildPath(loc, segments),
      buildIndexPath(loc, segments),
    ];
    if (Array.isArray(segments) && segments.length > 0) {
      paths.push(`/data/locales/${loc}/vedas/${segments.join('/')}/${segments[segments.length - 1]}.json`);
    }
    for (const p of paths) {
      try {
        const r = await fetch(p, { cache: 'force-cache' } as any);
        if (!r.ok) continue;
        try { const parsed = await r.json(); if (parsed) { data = parsed; return true; } } catch (e) { data = null; }
      } catch (e) {
        // ignore network/parse errors and try next
      }
    }
    return false;
  }

  // First try detected locale
  await tryLocalePaths(locale);
  // Fallback to default locale if not found
  if (!data && locale !== DEFAULT_LOCALE) {
    await tryLocalePaths(DEFAULT_LOCALE);
  }

  if (!data) return notFound();

  // Determine a metaKey for StructuredData (best-effort)
  let metaKey = 'vedas';
  if (segments.length === 1) metaKey = `vedas/${segments[0]}/${segments[0]}`;
  else if (segments.length > 0) metaKey = `vedas/${segments.join('/')}/index`;

  return (
    <main className="max-w-3xl mx-auto p-4">
      <StructuredData metaKey={metaKey} locale={locale} params={{ segments }} />
      <VedasClientRenderer initialData={data} initialLocale={locale} segments={segments} />
    </main>
  );
}