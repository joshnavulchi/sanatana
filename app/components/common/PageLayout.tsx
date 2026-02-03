'use client';
import React from 'react';
import WordCount from '@/app/components/wordcount/wordcount';
import Breadcrumbs from '@/app/components/breadcrumbs/breadcrumbs';
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
        <div className="text-right">
          {/* WordCount is a client component; render it (Next will hydrate on the client) */}
          <WordCount />
        </div>
        {/* Breadcrumbs will auto-generate from path if items not provided */}
        <Breadcrumbs items={breadcrumbs} locale={locale} />
        {title ? <h2 className="text-2xl md:text-3xl lg:text-4xl my-6 font-bold
                bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700
                bg-clip-text text-transparent tracking-tight leading-tight">{title}</h2> : null}
        {children}
      </main>
    </>
  );
}
