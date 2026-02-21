'use client';
import React from 'react';
import WordCount from '@components/wordcount/wordcount';
import Breadcrumbs from '@components/breadcrumbs';
type BreadcrumbItem = { label?: string; labelKey?: string; href?: string };
type Props = {
  metaKey?: string;
  title?: React.ReactNode;
  titleColor?: string;
  titleBorder?: string;
  description?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  locale?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function PageLayout({ metaKey, title, titleColor, titleBorder, description, breadcrumbs, className, children, locale }: Props) {
  const wrapper = `${className || ' content-wrapper'}`;
  const h2Color = `${titleColor || 'from-orange-600 via-red-600 to-amber-700'}`;
  const h2Border = `${titleBorder || 'border-amber-500'}`;
  return (
    <>
      {/* `metaKey` is accepted for compatibility; render structured data from server pages to avoid
          importing server-only modules into client bundles. */}
      <main className={`px-3 ${wrapper}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          {/* Breadcrumbs will auto-generate from path if items not provided */}
          <Breadcrumbs items={breadcrumbs} locale={locale} />
          {/* WordCount is a client component; render it (Next will hydrate on the client) */}
          <WordCount />
        </div>
        {/* Hero Header Section */}
        <div className="relative my-6 overflow-hidden">
          <div className="px-4 py-5">
            <div className="text-center">
              <div className="inline-block relative mb-10">
                {title && (<h2 className={`text-3xl/10 font-semibold text-transparent bg-clip-text bg-gradient-to-r ${h2Color} px-3 py-3 mb-3`}>
                  {title}
                </h2>)}
                <div className={`absolute -top-4 -left-4 w-16 h-16 border-t-3 border-l-3 ${h2Border} rounded-tl-2xl`}></div>
                <div className={`absolute -bottom-4 -right-4 w-16 h-16 border-b-3 border-r-3 ${h2Border} rounded-br-2xl`}></div>
              </div>
            </div>
            {description && (
              <div className="max-w-4xl mx-auto">
                <p className="text-center text-lg text-amber-800 leading-relaxed italic font-medium px-4">
                  &ldquo;{description}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
        {children}
      </main>
    </>
  );
}
