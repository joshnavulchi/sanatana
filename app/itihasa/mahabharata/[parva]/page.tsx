/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { DEFAULT_LOCALE, loadLocaleData } from '@lib/i18n';
import { createGenerateMetadata } from '@lib/pageUtils';

export async function generateStaticParams() {
  const data = await loadLocaleData(DEFAULT_LOCALE, 'itihasa/mahabharata/index');
  const root = (data.mahabharata ?? data) as Record<string, unknown>;
  const parvas = Array.isArray(root.parvas) ? root.parvas : [];

  return parvas
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map((item) => ({ parva: typeof item.slug === 'string' ? item.slug : '' }))
    .filter((item) => item.parva);
}

export async function generateMetadata({ params, searchParams }: { params?: any; searchParams?: any }) {
  const p = params && typeof (params as any).then === 'function' ? await (params as any) : params;
  const parva = typeof p?.parva === 'string' ? p.parva : '';
  const folder = parva.replace(/-parva$/, '') || parva;
  return createGenerateMetadata(`itihasa/mahabharata/${folder}/index`)({ searchParams });
}

import ParvaClient from './parvaClient';

export default function Page() {
  return (
    <ParvaClient />
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
