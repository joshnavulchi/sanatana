/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { notFound } from 'next/navigation';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@lib/i18n';
import { createGenerateMetadata } from '@lib/pageUtils';
import { fetchVedasContent } from '@lib/siteUtils';
import StructuredData from '@components/structured-data/StructuredData';
import VedasClientRenderer from './VedasClientRenderer';

type VedasData = {
  title?: string;
  description?: string;
  content?: string | Record<string, any>;
  children?: string[];
};

export async function generateStaticParams() {
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
    if (params && typeof (params as any).then === 'function') params = await params;
  } catch (e) {
    params = undefined;
  }
  const segments = Array.isArray(params?.segments) ? params.segments : [];
  const candidates: string[] = [];
  if (segments.length === 1) candidates.push(`vedas/${segments[0]}/${segments[0]}`);
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
    } catch (_) {
      // ignore
    }
  }

  return createGenerateMetadata('vedas')(props);
}

export default async function Page({ params }: { params: { segments?: string[] } | Promise<{ segments?: string[] }> }) {
  let resolvedParams: { segments?: string[] } | undefined = params as any;
  try {
    if (resolvedParams && typeof (resolvedParams as any).then === 'function') {
      resolvedParams = await (resolvedParams as any);
    }
  } catch (e) {
    resolvedParams = undefined;
  }
  const segments = Array.isArray(resolvedParams?.segments) ? resolvedParams.segments : [];
  if (!segments || segments.length === 0) return notFound();

  const locale = DEFAULT_LOCALE;

  const fetched = await fetchVedasContent(locale, segments);
  // Normalize JSON shape: many vedas files wrap content under a top-level key
  let data: VedasData | null = fetched && fetched.data ? (fetched.data as any) : null;
  if (data && typeof data === 'object' && segments.length > 0) {
    const rootKey = segments[0];
    if ((data as any)[rootKey]) {
      data = (data as any)[rootKey] as VedasData;
    }
  }
  if (!data) return notFound();

  let metaKey = 'vedas';
  if (segments.length === 1) metaKey = `vedas/${segments[0]}/${segments[0]}`;
  else if (segments.length > 0) metaKey = `vedas/${segments.join('/')}/index`;

  return (
    <>
      <StructuredData metaKey={metaKey} locale={locale} params={{ segments }} />
      <VedasClientRenderer initialData={data} initialLocale={locale} segments={segments} />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */