import { t, getMeta, detectLocale, DEFAULT_LOCALE, detectServerLocaleFromHeaders } from './i18n';
import { headers } from 'next/headers';

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
    // Prefer explicit titleKey -> translation, otherwise fall back to meta.title
    const title = titleKey ? t(titleKey, locale) : (meta.title || undefined);
    const description = descriptionKey ? (t(descriptionKey, locale) || meta.description) : meta.description;

    // Build absolute OG image URL when a relative path is provided in meta.ogImage
    let ogImages: Array<{ url: string } | string> | undefined = undefined;
    if (meta.ogImage) {
      try {
        const og = String(meta.ogImage);
        const base = meta.url || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in';
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
      alternates: { canonical: meta.canonical || meta.url || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in' }
    };
  };
}
