/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import { DEFAULT_LOCALE, loadLocaleData } from '@lib/i18n';
import VedasClient from './VedasClient';

export const generateMetadata = createGenerateMetadata('vedas/index');

export default async function Page() {
  const locale = DEFAULT_LOCALE;
  // Prefer reading the locale namespace directly from public/data/locales
  const parsedRoot = await loadLocaleData(locale, 'vedas/index');
  let parsed = (parsedRoot && Object.keys(parsedRoot).length > 0) ? parsedRoot : {} as Record<string, any>;
  if (parsed.vedas && typeof parsed.vedas === 'object') parsed = parsed.vedas as Record<string, any>;

  const initialVedas: Record<string, unknown>[] = Array.isArray(parsed.scripture_text)
    ? parsed.scripture_text as Record<string, unknown>[]
    : [];

  return <VedasClient initialData={parsed} initialVedas={initialVedas} />;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
