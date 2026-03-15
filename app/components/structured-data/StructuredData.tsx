/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, getLocaleNamespaceObject, loadLocaleNamespace } from '@lib/i18n';
type Props = {
  metaKey: string;
  params?: any;
  locale?: string;
};
// Server component that renders JSON-LD for a given metaKey.
export default async function StructuredData({ metaKey, params, locale }: Props) {
  const loc = String(locale ?? detectLocale(params) ?? 'en');
  await loadLocaleNamespace(loc, metaKey);
  const meta = getMeta(metaKey, params, loc) || {};
  const webpage: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: meta.title || undefined,
    description: meta.description || undefined,
    url: meta.url || undefined,
  };
  // Detect if this metaKey likely represents an article-like page (stories, scriptures, stotras, chapters)
  const articlePattern = /(purans_|upanishads_|itihasa_|_ramyana|_mahabharata|_bhagavdgita|chapter|parts|)/i;
  const hasArticleDates = Boolean(meta.datePublished || meta.dateModified);
  const isArticle = (articlePattern.test(metaKey) || (meta.description && String(meta.description).length > 80)) && hasArticleDates;
  // Build Article JSON-LD when appropriate
  let article: Record<string, any> | null = null;
  if (isArticle) {
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in';
    const img = meta.ogImage ? (String(meta.ogImage).startsWith('/') ? `${SITE_URL}${meta.ogImage}` : meta.ogImage) : undefined;
    article = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      mainEntityOfPage: { '@type': 'WebPage', '@id': meta.url || SITE_URL },
      headline: meta.title || undefined,
      description: meta.description || undefined,
      image: img ? [img] : undefined,
      author: { '@type': 'Person', name: (meta.author || 'Sanātana Dharma') },
      publisher: { '@type': 'Organization', name: 'Sanātana Dharma', logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` } },
      datePublished: meta.datePublished || undefined,
      dateModified: meta.dateModified || undefined,
    };
    Object.keys(article).forEach((k) => article && article[k] === undefined && delete article[k]);
  }
  // Clean webpage
  Object.keys(webpage).forEach((k) => webpage[k] === undefined && delete webpage[k]);
  // Attempt to load a full per-page locale file and extract a `schema` object if present.
  let pageSchema: Record<string, unknown> | null = null;
  try {
    const obj = getLocaleNamespaceObject(loc, metaKey) as Record<string, unknown>;
    const pageObj =
      (obj?.[metaKey] as Record<string, unknown> | undefined) ??
      obj;
    if (pageObj && typeof pageObj === 'object') {
      pageSchema =
        (pageObj.schema as Record<string, unknown> | null | undefined) ??
        (obj?.schema as Record<string, unknown> | null | undefined) ??
        null;
    }
  } catch (_error) {
    // ignore and continue — no schema will be rendered
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpage).replace(/</g, '\\u003c') }} />
      {article && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article).replace(/</g, '\\u003c') }} />}
      {pageSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema).replace(/</g, '\\u003c') }} />}
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */