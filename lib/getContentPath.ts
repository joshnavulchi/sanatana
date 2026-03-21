import { LOCALES_PUBLIC_PATH } from './i18n';

export function getContentPath(locale: string, segments: string[]) {
  const loc = String(locale || 'en').replace(/\/$/, '');
  const seg = Array.isArray(segments) ? segments.map(s => String(s).replace(/^\/+|\/+$/g, '')).filter(Boolean).join('/') : '';
  return `${LOCALES_PUBLIC_PATH}/${loc}/${seg}.json`;
}

export default getContentPath;
