/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { DEFAULT_LOCALE, detectLocale } from '@lib/i18n';
import { fetchContentByRoute } from '@lib/siteUtils';
import { createGenerateMetadata, resolveParams } from '@lib/pageUtils';
import { notFound } from 'next/navigation';

import KandaClient from './KandaClient';

export async function generateStaticParams() {
  // Attempt to read the canonical kandas slugs from the locale's index.json
  try {
    const fs = await Promise.resolve().then(() => require('fs').promises) as typeof import('fs').promises;
    const path = await Promise.resolve().then(() => require('path')) as typeof import('path');
    const filePath = path.join(process.cwd(), 'public', 'data', 'locales', DEFAULT_LOCALE, 'itihasa', 'ramayana', 'index.json');
    const txt = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(txt as string);
    const kandas = (parsed && parsed.ramayana && Array.isArray(parsed.ramayana.kandas)) ? parsed.ramayana.kandas : [];
    return kandas.map((k: any) => ({ kanda: String(k.slug || k).replace(/^\/+|\/+$/g, '') }));
  } catch (e) {
    // Fallback: if we cannot read the index, return a minimal set to avoid export failure
    return [{ kanda: 'bala-kanda' }, { kanda: 'ayodhya-kanda' }];
  }
}

export async function generateMetadata({ params, searchParams }: { params?: { kanda?: string } | Promise<{ kanda?: string }>; searchParams?: any }) {
  const resolvedParams = await resolveParams(params);
  const v = resolvedParams?.kanda;
  // Determine locale from searchParams (fallback to DEFAULT_LOCALE)
  let locale = detectLocale(typeof searchParams === 'object' && searchParams ? (searchParams as any) : undefined);
  if (!locale) locale = DEFAULT_LOCALE;

  let key = 'itihasa/ramayana';
  if (v) {
    try {
      const found = await fetchContentByRoute(locale, ['itihasa', 'ramayana', v]);
      if (found && found.path) {
        const p: string = String(found.path);
        // Normalize paths that may be absolute URLs or filesystem paths
        const marker = `/data/locales/${locale}/`;
        const idx = p.indexOf(marker);
        if (idx !== -1) {
          const rel = p.slice(idx + marker.length).replace(/\\\\/g, '/');
          // remove trailing /index.json or .json
          const cleaned = rel.replace(/(?:index)?\.json$/i, '').replace(/\/$/, '');
          key = cleaned || key;
        }
      } else {
        key = `itihasa/ramayana/${v}/index`;
      }
    } catch (_) {
      key = `itihasa/ramayana/${v}/index`;
    }
  }
  return await createGenerateMetadata(key)({ searchParams });
}

export default async function Page({ params }: { params: { kanda?: string } | Promise<{ kanda?: string }> }) {
  const resolvedParams = await resolveParams(params);
  const kandaParam = typeof resolvedParams?.kanda === 'string' ? resolvedParams.kanda : undefined;
  if (!kandaParam) return notFound();

  const kanda = [kandaParam];
  const locale = DEFAULT_LOCALE;
  const fetched = await fetchContentByRoute(locale, ['itihasa', 'ramayana', ...kanda]);
  let data: any = fetched && fetched.data ? (fetched.data as any) : null;
  if (data && typeof data === 'object' && kanda.length > 0) {
    const rootKey = kanda[0];
    if ((data as any)[rootKey]) {
      data = (data as any)[rootKey];
    }
  }
  if (!data) return notFound();

  return <KandaClient initialData={data} initialLocale={locale} kanda={kanda} />;
}

/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
