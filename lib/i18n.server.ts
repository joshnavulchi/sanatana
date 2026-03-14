import 'server-only';

import fs from 'fs/promises';
import path from 'path';

import { normalizeLocale, setCachedLocaleNamespace } from './i18n';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export async function readLocaleNamespaceFromDisk(
  locale: string,
  namespace: string
): Promise<Record<string, unknown> | null> {
  if (!locale || !namespace) return null;

  const filePath = path.join(process.cwd(), 'public', 'locales', locale, `${namespace}.json`);

  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    if (isPlainObject(parsed)) return parsed;
    if (parsed && typeof parsed === 'object') return parsed as Record<string, unknown>;
    return null;
  } catch (_) {
    return null;
  }
}

export async function loadLocaleNamespace(locale: string, namespace: string) {
  if (!locale || !namespace) return {};

  const normalizedLocale = normalizeLocale(locale);
  const candidates = [
    namespace,
    namespace.replace(/-/g, '_'),
    namespace.replace(/_/g, '-'),
  ];

  for (const candidate of candidates) {
    const parsed = await readLocaleNamespaceFromDisk(normalizedLocale, candidate);
    if (parsed) {
      setCachedLocaleNamespace(normalizedLocale, namespace, parsed);
      setCachedLocaleNamespace(normalizedLocale, candidate, parsed);
      return parsed;
    }
  }

  return {};
}
