/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getLocaleNamespaceObject, DEFAULT_LOCALE } from '@lib/i18n';

type Props = {
  metaKey: string;
  params?: any;
  locale?: string;
  author?: { name: string } | string;
  datePublished?: string;
  image?: string;
  articleType?: 'Article' | 'NewsArticle' | 'BlogPosting' | 'CreativeWork';
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in';

export default async function PageArticleJsonLd({ metaKey, params, locale, author, datePublished, image, articleType = 'Article' }: Props) {
  const loc = locale ?? DEFAULT_LOCALE;
  await getLocaleNamespaceObject(String(loc), metaKey);
  const meta = t(metaKey, loc) || {};

  const headline = meta.title || undefined;
  const description = meta.description || undefined;
  const url = meta.url || SITE_URL;
  const img = image || (typeof meta.ogImage === 'string' ? (meta.ogImage.startsWith('/') ? `${SITE_URL}${meta.ogImage}` : meta.ogImage) : undefined);

  const authorObj = typeof author === 'string' ? { name: author } : author;

  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': articleType,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline,
    description,
    image: img ? [img] : undefined,
    author: authorObj || { name: 'Sanātana Dharma' },
    publisher: {
      '@type': 'Organization',
      name: 'Sanātana Dharma',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`
      }
    },
    datePublished: datePublished || undefined,
  };

  Object.keys(jsonLd).forEach((k) => jsonLd[k] === undefined && delete jsonLd[k]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */