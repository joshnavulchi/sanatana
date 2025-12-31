import React from 'react';
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
  const wrapper = `content-wrapper ${className || 'lg'} page-space-xl`;
  return (
    <>
      {metaKey ? <StructuredData metaKey={metaKey} /> : null}
      <main className={wrapper}>
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        {title ? <h1>{title}</h1> : null}
        {children}
      </main>
    </>
  );
}
