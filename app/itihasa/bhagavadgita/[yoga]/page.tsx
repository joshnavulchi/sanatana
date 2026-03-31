/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { DEFAULT_LOCALE, loadLocaleData } from '@lib/i18n';
import { createGenerateMetadata } from '@lib/pageUtils';

export async function generateStaticParams() {
  const shared = await loadLocaleData(DEFAULT_LOCALE, 'sharable_strings');
  const footer = (shared.footer ?? {}) as Record<string, unknown>;
  const itihasa = (footer.itihasa ?? {}) as Record<string, unknown>;
  const nav = Array.isArray(itihasa.nav) ? itihasa.nav : [];

  const bhagavadGitaEntry = nav.find((item) => {
    if (!item || typeof item !== 'object') return false;
    return 'chapters_list' in item;
  }) as Record<string, unknown> | undefined;

  const chapters = bhagavadGitaEntry?.chapters_list;
  if (!chapters || typeof chapters !== 'object' || Array.isArray(chapters)) {
    return [];
  }

  return Object.keys(chapters).map((_, index) => ({ yoga: `chapter${index + 1}` }));
}

export async function generateMetadata({ params, searchParams }: { params?: any; searchParams?: any }) {
  const p = params && typeof (params as any).then === 'function' ? await (params as any) : params;
  const yoga = typeof p?.yoga === 'string' ? p.yoga : '';
  return createGenerateMetadata(`itihasa/bhagavadgita/${yoga}/index`)({ searchParams });
}

import YogaClient from './yogaClient';

export default function Page() {
  return (
    <YogaClient />
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
