"use client";

import Link from 'next/link';
import Loader from '@components/loader';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import PageLayout from '@components/common/PageLayout';

interface Breadcrumb {
  label: string;
  href?: string;
}

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split('\n\n').map((paragraph, index) => (
        <p
          key={index}
          className="last:mb-0 text-base sm:text-lg leading-relaxed mb-4 font-normal bg-gradient-to-r from-orange-50/80 to-amber-100/60 rounded-xl px-3 py-2 shadow-sm hover:shadow-lg transition-all duration-500"
        >
          {paragraph}
        </p>
      ))}
    </>
  );
}

export default function ItihasaPartClient({
  namespace,
  titleFallback,
  breadcrumbs,
  nextHref,
  nextLabel,
}: {
  namespace: string;
  titleFallback: string;
  breadcrumbs: Breadcrumb[];
  nextHref?: string;
  nextLabel?: string;
}) {
  const { isLoading } = useLocale();
  const data = useLocaleSection(namespace);

  const title = typeof data?.title === 'string' ? data.title : titleFallback;
  const description = typeof data?.description === 'string' ? data.description : '';
  const introduction = typeof data?.introduction === 'string' ? data.introduction : '';
  const scriptureText = typeof data?.scripture_text === 'string' ? data.scripture_text : '';
  const philosophical =
    typeof data?.philosophical_explanation === 'string' ? data.philosophical_explanation : '';

  if (isLoading && !title) {
    return (
      <PageLayout metaKey={namespace} title="" breadcrumbs={breadcrumbs} className="layout-md">
        <div className="flex items-center justify-center py-12 text-base sm:text-lg leading-relaxed font-normal">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey={namespace} title={title} breadcrumbs={breadcrumbs} className="layout-md">
      <section className="rounded-3xl border-orange-200/30 bg-gradient-to-br from-orange-50 via-amber-100 to-yellow-50 p-8 md:p-12 shadow-xl animate-fadeIn">
        <h3 className="page-title text-3xl font-semibold leading-tight tracking-tight mb-4 md:text-4xl text-orange-900 drop-shadow">{title}</h3>
        {description && <p className="body-text text-base sm:text-lg leading-relaxed mb-4 font-normal text-orange-800/90 bg-gradient-to-r from-orange-100/60 to-amber-50/40 rounded-xl px-4 py-2 shadow-sm">{description}</p>}
      </section>

      {introduction && (
        <section className="mt-6 rounded-2xl border-orange-200/30 bg-gradient-to-r from-orange-50/80 to-amber-100/60 p-6 shadow-lg animate-fadeIn">
          <h4 className="section-title text-2xl font-semibold leading-snug mb-3 text-orange-800">Introduction</h4>
          <div className="body-text text-base sm:text-lg leading-relaxed font-normal">
            <Paragraphs text={introduction} />
          </div>
        </section>
      )}

      {scriptureText && (
        <section className="mt-6 rounded-2xl border-orange-200/50 bg-gradient-to-r from-amber-50/80 to-orange-100/60 p-6 shadow-lg animate-fadeIn">
          <h5 className="section-title text-2xl font-semibold leading-snug mb-3 text-orange-800">Text</h5>
          <div className="body-text text-base sm:text-lg leading-relaxed font-normal">
            <Paragraphs text={scriptureText} />
          </div>
        </section>
      )}

      {philosophical && (
        <section className="mt-6 rounded-2xl border-orange-200/30 bg-gradient-to-r from-orange-50/80 to-amber-100/60 p-6 shadow-lg animate-fadeIn">
          <h6 className="section-title text-2xl font-semibold leading-snug mb-3 text-orange-800">Philosophical Explanation</h6>
          <div className="body-text text-base sm:text-lg leading-relaxed font-normal">
            <Paragraphs text={philosophical} />
          </div>
        </section>
      )}

      {nextHref && (
        <nav className="mt-8 flex justify-end">
          <Link href={nextHref} className="text-base sm:text-lg font-semibold text-orange-600 hover:text-orange-700 transition-colors">
            {nextLabel || 'Open next'} →
          </Link>
        </nav>
      )}
    </PageLayout>
  );
}
