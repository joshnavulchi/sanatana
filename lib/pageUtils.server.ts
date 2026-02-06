import { detectServerLocaleFromHeaders, DEFAULT_LOCALE } from './i18n';
import { headers } from 'next/headers';

export function resolveLocaleFromHeaders() {
  try {
    const h = headers() as unknown;
    return detectServerLocaleFromHeaders(h as Record<string, unknown>);
  } catch (e) {
    return DEFAULT_LOCALE;
  }
}

// Add any other server-only utilities here as needed.
