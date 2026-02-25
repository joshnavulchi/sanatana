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
          <div className="px-8 py-10">
            <div className="text-center mb-6">
              <div className="inline-block relative">
                {title && (<h2 className={`text-4xl/10 font-semibold text-transparent bg-clip-text bg-gradient-to-r ${h2Color} px-8 py-2 mb-3`}>
                  {title}
                </h2>)}
                <div className={`absolute -top-4 -left-4 w-16 h-16 border-t-4 border-l-6 ${h2Border} rounded-tl-3xl`}></div>
                <div className={`absolute -bottom-4 -right-4 w-16 h-16 border-b-4 border-r-6 ${h2Border} rounded-br-3xl`}></div>
              </div>
            </div>
            {description && (
              <div className="max-w-3xl mx-auto">
                <p className="text-center text-lg text-amber-800 leading-relaxed italic font-medium px-4">
                  &ldquo;{description}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="px-3">
          {children}
        </div>
      </main>
    </>
  );
}
