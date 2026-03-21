/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import PageLayout from '@components/common/PageLayout';
import Link from 'next/link';
import { headers } from 'next/headers';
import { detectServerLocaleFromHeaders } from '@lib/i18n';
import fetchContent from '@lib/fetchContent';
import { notFound } from 'next/navigation';

export const generateMetadata = createGenerateMetadata('puranas');

export default async function Page() {
  const locale = detectServerLocaleFromHeaders(headers());
  const { data } = await fetchContent(locale, ['puranas']);
  if (!data) return notFound();

  const title = (data as any)?.title ?? 'Puranas';
  const description = (data as any)?.description ?? '';
  const body = (data as any)?.content ?? (data as any)?.body ?? '';
  const children = Array.isArray((data as any).items) ? (data as any).items : Array.isArray((data as any).children) ? (data as any).children : [];

  return (
    <>
      <StructuredData metaKey="puranas" />
      <PageLayout metaKey="puranas" title={title} breadcrumbs={[{ label: 'Home', href: '/' }, { label: title }]} className="layout-md">

        <header className="mb-6">
          <h1 className="text-3xl font-extrabold">{title}</h1>
          {description && <p className="text-md text-muted mt-2">{description}</p>}
        </header>

        {body && (
          <article className="prose max-w-none mb-8">
            {typeof body === 'string' ? <div>{body.split('\n\n').map((p: string, i: number) => <p key={i}>{p}</p>)}</div> : <pre>{JSON.stringify(body)}</pre>}
          </article>
        )}

        {children.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">Contents</h2>
            <ul className="space-y-2">
              {children.map((c: any, i: number) => {
                const slug = typeof c === 'string' ? c : c?.slug || c?.id || c?.name;
                const label = (typeof c === 'string' ? c : c?.title || c?.name || String(slug)) || `Item ${i + 1}`;
                const href = `/puranas/${String(slug)}`;
                return (
                  <li key={i}>
                    <Link href={href} className="text-primary-600 hover:underline">{label}</Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
