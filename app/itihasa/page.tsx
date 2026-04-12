/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@/lib/pageUtils';
import { DEFAULT_LOCALE, detectLocale, loadLocaleData } from '@lib/i18n';
export const generateMetadata = createGenerateMetadata('itihasa');

import ItihasaClient from './ItihasaClient';

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const resolvedSearchParams = await searchParams;
  const locale = detectLocale((resolvedSearchParams || {}) as Record<string, any>) || DEFAULT_LOCALE;
  const raw = await loadLocaleData(locale, 'itihasa/index');
  const initialData =
    raw && typeof raw === 'object' && (raw as Record<string, unknown>).itihasa && typeof (raw as Record<string, unknown>).itihasa === 'object'
      ? ((raw as Record<string, unknown>).itihasa as Record<string, unknown>)
      : raw;

  return (
    <ItihasaClient initialData={initialData as Record<string, unknown>} initialLocale={locale} />
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
