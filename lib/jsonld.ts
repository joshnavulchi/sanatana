/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { secrets } from './secrets';
import { DEFAULT_LOCALE } from './i18n';

type Locale = string;

const SITE_URL = (secrets.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in').replace(/\/$/, '');

function safeJsonLd(obj: unknown): string {
  // Prevent XSS by escaping '<' characters per Next.js guidance
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

/** Organization JSON-LD (add once in root layout) */
export function buildOrganizationJsonLd(opts?: {
  name?: string;
  logo?: string;
  sameAs?: string[];
  description?: string;
}) {
  const { name = 'Sanātana Dharmam', logo, sameAs = [], description } = opts || {};
  return {
    '@context': 'https://schema.org',
    '@type': 'Sanātana Dharmam',
    name,
    url: SITE_URL + '/',
    description,
    logo: logo || `${SITE_URL}/images/logo.png`,
    sameAs,
    contactPoint: [{
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'vulchi.vijay@gmail.com',
      areaServed: 'IN',
      availableLanguage: ['en']
    }]
  };
}

/** WebSite JSON-LD (add once in root layout) */
export function buildWebSiteJsonLd(opts?: { name?: string; inLanguage?: Locale[] }) {
  const { name = 'Sanātana Dharmam', inLanguage = ['hi', 'en', 'te'] } = opts || {};
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: SITE_URL + '/',
    inLanguage,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?s={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

/** WebPage JSON-LD (add per route) */
export function buildWebPageJsonLd(opts: {
  url: string;
  name?: string;
  description?: string;
  image?: string;
  inLanguage?: Locale;
  datePublished?: string;
  dateModified?: string;
}) {
  const {
    url,
    name,
    description,
    image,
    inLanguage = DEFAULT_LOCALE,
    datePublished,
    dateModified
  } = opts;
  const json: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url,
    isPartOf: { '@type': 'WebSite', url: SITE_URL + '/' },
    inLanguage
  };
  if (name) json.name = name;
  if (description) json.description = description;
  if (image) {
    json.primaryImageOfPage = { '@type': 'ImageObject', url: image };
  }
  if (datePublished) json.datePublished = datePublished;
  if (dateModified) json.dateModified = dateModified;
  return json;
}

/** Article / BlogPosting JSON-LD (for posts) */
export function buildArticleJsonLd(opts: {
  url: string;
  headline: string;
  description?: string;
  image?: string;
  authorName?: string;
  datePublished?: string;
  dateModified?: string;
  inLanguage?: Locale;
}) {
  const {
    url,
    headline,
    description,
    image,
    authorName = 'Vulchi Vijaya Kumar',
    datePublished,
    dateModified,
    inLanguage = DEFAULT_LOCALE
  } = opts;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline,
    description,
    image: image ? [image] : undefined,
    author: { '@type': 'Person', name: authorName },
    publisher: {
      '@type': 'Organization',
      name: 'Sanātana Dharmam',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png`, width: 512, height: 512 }
    },
    datePublished,
    dateModified,
    inLanguage
  };
}

/** BreadcrumbList JSON-LD (derive from the segments of the current path) */
export function buildBreadcrumbJsonLd(segments: Array<{ name: string; item: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: segments.map((seg, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: seg.name,
      item: seg.item
    }))
  };
}

/** Helper to render <script type="application/ld+json"> safely */
export function renderJsonLdScript(json: unknown) {
  return {
    type: 'application/ld+json',
    __html: safeJsonLd(json)
  };
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */