/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, DEFAULT_LOCALE, detectServerLocaleFromHeaders } from '@lib/i18n';
import { headers } from 'next/headers';
import PageLayout from '@components/common/PageLayout';
import fs from 'fs/promises';
import path from 'path';
import LazyImage from '@components/lazyimage';
import Link from 'next/link';

interface Story {
  id: string;
  title: string;
  origin?: string;
  imgSrc?: string;
  imgAlt?: string;
  summary?: string;
  moral?: string;
  characters?: string[];
  themes?: string[];
}

function resolveLocaleFromHeaders(): string {
  try {
    const h = headers();
    return detectServerLocaleFromHeaders(h as any);
  } catch {
    return DEFAULT_LOCALE;
  }
}

export async function generateStaticParams() {
  try {
    const file = path.join(process.cwd(), 'public', 'locales', 'en', 'illustrated_stories.json');
    const raw = await fs.readFile(file, 'utf8');
    const doc = JSON.parse(raw);

    const stories =
      doc?.illustrated_stories?.kids_indian_stories ??
      doc?.illustratedstories?.kids_indian_stories ??
      [];

    if (!Array.isArray(stories)) return [{ id: 'placeholder' }];

    return stories
      .filter((s: any) => s?.id !== undefined && s?.id !== null)
      .map((s: any) => ({ id: String(s.id) }));
  } catch {
    return [{ id: 'placeholder' }];
  }
}

async function loadStories(locale: string): Promise<Story[]> {
  const file = path.join(process.cwd(), 'public', 'locales', locale, 'illustrated_stories.json');

  try {
    const raw = await fs.readFile(file, 'utf8');
    const doc = JSON.parse(raw);

    return doc?.illustratedstories?.kids_indian_stories ?? [];
  } catch {
    if (locale !== 'en') return loadStories('en');
    return [];
  }
}

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const locale = resolveLocaleFromHeaders();
  const stories = await loadStories(locale);

  const S = (k: string, l?: any) => String(t(k, l));

  const id = String(params.id);

  const idx = stories.findIndex((s) => String(s.id) === id);
  const item = idx >= 0 ? stories[idx] : null;

  if (!item) {
    return (
      <PageLayout
        metaKey="illustrated_stories"
        title={S('illustrated_stories.title')}
        breadcrumbs={[
          { labelKey: 'Home', href: '/' },
          { label: S('illustrated_stories.title') },
        ]}
      >
        <p>{S('illustrated_stories.description')}</p>
      </PageLayout>
    );
  }

  const prev = idx > 0 ? stories[idx - 1] : null;
  const next = idx < stories.length - 1 ? stories[idx + 1] : null;

  return (
    <PageLayout
      metaKey="illustrated_stories"
      title={item.title}
      breadcrumbs={[
        { labelKey: 'Home', href: '/' },
        { label: item.title },
      ]}
    >
      <div>{item.origin}</div>
      <div className="relative h-100 w-full">
        <LazyImage
          src={item.imgSrc || `/images/stories/${item.id}.webp`}
          alt={item.imgAlt || item.title}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>

      <p>{item.summary}</p>

      {item.moral && (
        <p>
          <strong>{S('illustrated_stories.moralLabel')}</strong> {item.moral}
        </p>
      )}

      {item.characters?.length && (
        <div>
          <strong>{S('illustrated_stories.charactersLabel')}</strong>{' '}
          {item.characters.join(', ')}
        </div>
      )}

      {item.themes?.length && (
        <div>
          <strong>{S('illustrated_stories.themesLabel')}</strong>{' '}
          {item.themes.join(', ')}
        </div>
      )}

      <div className="flex justify-between mt-8">
        {prev ? (
          <Link href={`/kidszone/illustratedstories/${prev.id}`}>
            ← {prev.title}
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link href={`/kidszone/illustratedstories/${next.id}`}>
            {next.title} →
          </Link>
        ) : (
          <div />
        )}
      </div>
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */