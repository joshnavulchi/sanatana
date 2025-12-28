import { t, getMeta, detectLocale, DEFAULT_LOCALE, detectServerLocaleFromHeaders } from './i18n';
import { headers } from 'next/headers';
import { secrets } from './secrets';

export function resolveLocaleFromHeaders() {
  try {
    const h = headers() as unknown;
    return detectServerLocaleFromHeaders(h as Record<string, unknown>);
  } catch (e) {
    return DEFAULT_LOCALE;
  }
}

export function createcreateGenerateMetadata(metaKey: string, titleKey?: string, descriptionKey?: string) {
  return async function createGenerateMetadata(props: Record<string, unknown> | undefined) {
    const { searchParams } = (props || {}) as { searchParams?: unknown };
    // `searchParams` can be a Promise in newer Next.js versions — unwrap it first
    let resolvedSearchParams: unknown = searchParams;
    try {
      if (resolvedSearchParams && typeof (resolvedSearchParams as any).then === 'function') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - resolvedSearchParams may be a Promise here
        resolvedSearchParams = await (resolvedSearchParams as any);
      }
    } catch (e) {
      resolvedSearchParams = undefined;
    }

    let locale = detectLocale(resolvedSearchParams);
    if (!locale) locale = resolveLocaleFromHeaders();
    const meta = getMeta(metaKey, {}, locale) || {};
    // Prefer explicit titleKey/descriptionKey -> translation, otherwise fall back to meta values.
    // The `t()` function returns the key string when a translation is missing, so
    // treat that case as "not found" and use `meta` as the fallback.
    let title: string | undefined;
    if (titleKey) {
      const tv = t(titleKey, locale);
      title = (typeof tv === 'string' && tv !== titleKey) ? tv : (typeof meta.title === 'string' ? meta.title : undefined);
    } else {
      title = typeof meta.title === 'string' ? meta.title : undefined;
    }

    let description: string | undefined;
    if (descriptionKey) {
      const dv = t(descriptionKey, locale);
      description = (typeof dv === 'string' && dv !== descriptionKey) ? dv : (typeof meta.description === 'string' ? meta.description : undefined);
    } else {
      description = typeof meta.description === 'string' ? meta.description : undefined;
    }

    // Build absolute OG image URL when a relative path is provided in meta.ogImage
    let ogImages: Array<{ url: string } | string> | undefined = undefined;
    if (meta.ogImage) {
      try {
        const og = String(meta.ogImage);
        const base = meta.url || secrets.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in';
        const host = String(base).replace(/\/$/, '');
        const imgUrl = og.startsWith('http://') || og.startsWith('https://') ? og : `${host}${og.startsWith('/') ? '' : '/'}${og}`;
        ogImages = [{ url: imgUrl }];
      } catch (e) {
        // Ensure we produce a string image URL for TypeScript compatibility
        ogImages = [String((meta as any).ogImage)];
      }
    }

    return {
      title,
      description,
      keywords: meta.keywords || undefined,
      openGraph: { title: title || meta.title, description, images: ogImages },
      alternates: { canonical: meta.canonical || meta.url || secrets.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in' }
    };
  };
}
