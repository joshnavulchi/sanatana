import React from 'react';
import dynamic from 'next/dynamic';
import WordCount from '@components/common/WordCount';
import StructuredData from '@components/structured-data/StructuredData';
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

export default function PageLayout({ metaKey, title, breadcrumbs, className, children }: Props) {
  const wrapper = `${className || ' content-wrapper '}`;
  return (
    <>
      {metaKey ? <StructuredData metaKey={metaKey} /> : null}
      <main className={wrapper}>
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        {/* WordCount is a client component; render it (Next will hydrate on the client) */}
        <WordCount />
        {title ? <h1 className="title">{title}</h1> : null}
        {children}
      </main>
    </>
  );
}
