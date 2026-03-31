"use client";

/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { useEffect, useMemo, useState } from 'react';
import { getLocaleNamespaceObject, DEFAULT_LOCALE } from '@lib/i18n';

type Props = {
  metakey: string;
  params?: unknown;
  locale?: string;
};

type MetaLike = {
  title?: string;
  description?: string;
  url?: string;
  ogImage?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  [key: string]: unknown;
};

function asObject(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object') {
    return value as Record<string, unknown>;
  }
  return {};
}

function unwrapNamespaceObject(namespaceData: unknown, metakey: string): Record<string, unknown> {
  const root = asObject(namespaceData);
  if (!Object.keys(root).length) return {};

  const direct = asObject(root[metakey]);
  if (Object.keys(direct).length > 0) return direct;

  const keys = Object.keys(root);
  if (keys.length === 1) {
    const nested = asObject(root[keys[0]]);
    if (Object.keys(nested).length > 0) return nested;
  }

  return root;
}

function extractMeta(namespaceData: unknown, metakey: string): MetaLike {
  const source = unwrapNamespaceObject(namespaceData, metakey);
  return source as MetaLike;
}

export default function StructuredData({ metakey, params, locale }: Props) {
  const loc = String(locale ?? DEFAULT_LOCALE);
  const [meta, setMeta] = useState<MetaLike>({});
  const [pageSchema, setPageSchema] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const nsMaybe = await Promise.resolve(getLocaleNamespaceObject(loc, metakey));
        if (!isMounted) return;

        const extractedMeta = extractMeta(nsMaybe, metakey);
        setMeta(extractedMeta);

        const nested = unwrapNamespaceObject(nsMaybe, metakey);
        const schema =
          (nested.schema as Record<string, unknown> | null | undefined) ??
          (asObject(nsMaybe).schema as Record<string, unknown> | null | undefined) ??
          null;
        setPageSchema(schema);
      } catch (_error) {
        if (!isMounted) return;
        setMeta({});
        setPageSchema(null);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [loc, metakey]);

  const webpage = useMemo(() => {
    const data: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: meta.title || undefined,
      description: meta.description || undefined,
      url: meta.url || undefined,
    };
    Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);
    return data;
  }, [meta.description, meta.title, meta.url]);

  const article = useMemo(() => {
    const articlePattern = /(purans_|upanishads_|itihasa_|_ramyana|_mahabharata|_bhagavdgita|chapter|parts)/i;
    const hasArticleDates = Boolean(meta.datePublished || meta.dateModified);
    const isArticle = (articlePattern.test(metakey) || (meta.description && String(meta.description).length > 80)) && hasArticleDates;
    if (!isArticle) return null;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in';
    const img = meta.ogImage
      ? (String(meta.ogImage).startsWith('/') ? `${siteUrl}${String(meta.ogImage)}` : String(meta.ogImage))
      : undefined;

    const data: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      mainEntityOfPage: { '@type': 'WebPage', '@id': meta.url || siteUrl },
      headline: meta.title || undefined,
      description: meta.description || undefined,
      image: img ? [img] : undefined,
      author: { '@type': 'Person', name: meta.author || 'Sanātana Dharma' },
      publisher: {
        '@type': 'Organization',
        name: 'Sanātana Dharma',
        logo: { '@type': 'ImageObject', url: `${siteUrl}/images/logo.png` },
      },
      datePublished: meta.datePublished || undefined,
      dateModified: meta.dateModified || undefined,
    };
    Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);
    return data;
  }, [meta, metakey]);

  void params;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpage).replace(/</g, '\\u003c') }} />
      {article && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article).replace(/</g, '\\u003c') }} />}
      {pageSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema).replace(/</g, '\\u003c') }} />}
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */