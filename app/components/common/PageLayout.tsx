import React from 'react';

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

export default function PageLayout({
  title,
  titleColor,
  titleBorder,
  description,
  className,
  children,
}: Props) {
  const wrapper = `${className || 'content-wrapper'}`;
  const h2Color = `${titleColor || 'from-[#a63d17] via-[#d97706] to-[#f59e0b]'}`;
  const h2Border = `${titleBorder || 'border-[#d8a25a]'}`;

  return (
    <main className={`px-3 ${wrapper}`}>
      <div className="w-full">
        <div className="relative my-6 overflow-hidden">
          <div className="px-4 py-5">
            {title && (
              <div className="text-center mb-6">
                <div className="inline-block relative">
                  <h2 className={`text-4xl/10 font-semibold text-transparent bg-clip-text bg-linear-to-r ${h2Color} px-8 py-2 mb-3`}>
                    {title}
                  </h2>
                  <div className={`absolute -top-4 -left-4 w-16 h-16 border-t-4 border-l-4 ${h2Border} rounded-tl-3xl`} />
                  <div className={`absolute -bottom-4 -right-4 w-16 h-16 border-b-4 border-r-4 ${h2Border} rounded-br-3xl`} />
                </div>
              </div>
            )}
            {description && (
              <div className="max-w-3xl mx-auto">
                <p className="text-center text-xl md:text-lg text-[#5b2d12] leading-relaxed italic font-medium px-4">
                  &ldquo;{description}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
