'use client';
import React from 'react';
import WordCount from '@/app/components/wordcount/wordcount';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
type BreadcrumbItem = { label?: string; labelKey?: string; href?: string };
type Props = {
  metaKey?: string;
  title?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  locale?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function PageLayout({ metaKey, title, breadcrumbs, className, children, locale }: Props) {
  const wrapper = `${className || ' content-wrapper '}`;
  return (
    <>
      {/* `metaKey` is accepted for compatibility; render structured data from server pages to avoid
          importing server-only modules into client bundles. */}
      <main className={wrapper}>
        <div className="flex items-start justify-between">
          {/* Breadcrumbs will auto-generate from path if items not provided */}
          <Breadcrumbs items={breadcrumbs} locale={locale} />
          {/* WordCount is a client component; render it (Next will hydrate on the client) */}
          <WordCount />
        </div>
        {title ? <h1 className="h2">{title}</h1> : null}
        {children}
      </main>
    </>
  );
}
