/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { notFound } from 'next/navigation';
import { DEFAULT_LOCALE } from '@lib/i18n';
import { fetchContentByRoute } from '@lib/siteUtils';
import { createGenerateMetadata, resolveParams } from '@lib/pageUtils';

import PhilosophyClient from './PhilosophyClient';

type pageData = {
  title?: string;
  description?: string;
  content?: string | Record<string, any>;
  children?: string[];
  meta?: Record<string, any>;
  [key: string]: any;
};

export async function generateStaticParams() {
  // Read available slugs from public/data/locales/<locale>/vedic-philosophy
  const fs = await Promise.resolve().then(() => require('fs').promises) as typeof import('fs').promises;
  const path = await Promise.resolve().then(() => require('path')) as typeof import('path');
  const dir = path.join(process.cwd(), 'public', 'data', 'locales', DEFAULT_LOCALE, 'vedic-philosophy');
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const slugs: string[] = [];
    for (const ent of entries) {
      if (ent.isDirectory()) slugs.push(ent.name);
      else if (ent.isFile() && ent.name.endsWith('.json')) slugs.push(ent.name.replace(/\.json$/, ''));
    }
    return slugs.map((s) => ({ philosophy: s }));
  } catch (_) {
    return [];
  }
}

export async function generateMetadata({ params, searchParams }: { params?: { philosophy?: string }; searchParams?: any }) {
  const slug = params?.philosophy;
  const key = slug ? `vedic-philosophy/${slug}/index` : 'vedic-philosophy';
  return await createGenerateMetadata(key)({ searchParams });
}

export default async function Page({ params }: { params: { philosophy?: string } | Promise<{ philosophy?: string }> }) {
  const resolvedParams = await resolveParams(params);
  const slug = typeof resolvedParams?.philosophy === 'string' ? resolvedParams.philosophy : undefined;
  if (!slug) return notFound();

  const locale = DEFAULT_LOCALE;
  const fetched = await fetchContentByRoute(locale, ['vedic-philosophy', slug]);
  let data: pageData | null = fetched && fetched.data ? (fetched.data as any) : null;

  if (data && typeof data === 'object') {
    // If wrapped under slug key, unwrap
    if ((data as any)[slug] && typeof (data as any)[slug] === 'object') data = (data as any)[slug] as pageData;
    else {
      const keys = Object.keys(data);
      if (keys.length === 1 && typeof (data as any)[keys[0]] === 'object') data = (data as any)[keys[0]] as pageData;
    }
  }

  if (!data) return notFound();

  return <PhilosophyClient initialData={data} initialLocale={locale} slug={slug} />;
}

/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
