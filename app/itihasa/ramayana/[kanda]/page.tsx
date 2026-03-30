/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { DEFAULT_LOCALE, loadLocaleData } from '@lib/i18n';
import { createGenerateMetadata } from '@lib/pageUtils';

export async function generateStaticParams() {
  const data = await loadLocaleData(DEFAULT_LOCALE, 'itihasa/ramayana/index');
  const root = (data.ramayana ?? data) as Record<string, unknown>;
  const kandas = Array.isArray(root.kandas) ? root.kandas : [];

  return kandas
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map((item) => ({ kanda: typeof item.slug === 'string' ? item.slug : '' }))
    .filter((item) => item.kanda);
}

export async function generateMetadata({ params, searchParams }: { params?: any; searchParams?: any }) {
  const p = params && typeof (params as any).then === 'function' ? await (params as any) : params;
  const kanda = typeof p?.kanda === 'string' ? p.kanda : '';
  const folder = kanda.replace(/-kanda$/, '') || kanda;
  return createGenerateMetadata(`itihasa/ramayana/${folder}/index`)({ searchParams });
}

import KandaClient from './kandaClient';

export default function Page() {
  return (
    <KandaClient />
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
