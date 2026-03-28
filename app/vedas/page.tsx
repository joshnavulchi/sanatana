/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import { DEFAULT_LOCALE } from '@lib/i18n';
import { fetchContentByRoute } from '@lib/siteUtils';
import VedasClient from './vedasclient';

export const generateMetadata = createGenerateMetadata('vedas');

export default async function Page() {
  const locale = DEFAULT_LOCALE;
  const names = ['rigveda', 'yajurveda', 'samaveda', 'atharvaveda'];
  const initialVedas: Record<string, unknown>[] = [];

  for (const name of names) {
    try {
      const fetched = await fetchContentByRoute(locale, ['vedas', name]);
      let data = fetched && fetched.data ? (fetched.data as any) : null;
      if (data && typeof data === 'object') {
        const key = Object.keys(data)[0];
        const obj = (data[key] && typeof data[key] === 'object') ? data[key] : data;
        if (obj) {
          if (!(obj as any).veda) (obj as any).veda = name.charAt(0).toUpperCase() + name.slice(1);
          initialVedas.push(obj as Record<string, unknown>);
        }
      }
    } catch (e) {
      // continue on errors
    }
  }

  return <VedasClient initialVedas={initialVedas} />;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */