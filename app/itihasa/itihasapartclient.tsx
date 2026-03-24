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
        <p key={index} className="last:mb-0 text-base leading-relaxed mb-4 font-normal">
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
        <div className="flex items-center justify-center py-12 text-base leading-relaxed font-normal">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey={namespace} title={title} breadcrumbs={breadcrumbs} className="layout-md">
      <section className="rounded-3xl border border-amber-200/30 bg-amber-50 p-6 md:p-10">
        <h1 className="page-title text-3xl font-semibold leading-tight tracking-tight mb-4 md:text-4xl">{title}</h1>
        {description && <p className="body-text text-base leading-relaxed mb-4 font-normal">{description}</p>}
      </section>

      {introduction && (
        <section className="mt-6 rounded-2xl border border-amber-200/30 bg-amber-50 p-5 md:p-6">
          <h2 className="section-title text-2xl font-semibold leading-snug mb-3">Introduction</h2>
          <div className="body-text text-base leading-relaxed font-normal">
            <Paragraphs text={introduction} />
          </div>
        </section>
      )}

      {scriptureText && (
        <section className="mt-6 rounded-2xl border border-amber-200/50 bg-amber-50 p-5 md:p-6">
          <h2 className="section-title text-2xl font-semibold leading-snug mb-3">Text</h2>
          <div className="body-text text-base leading-relaxed font-normal">
            <Paragraphs text={scriptureText} />
          </div>
        </section>
      )}

      {philosophical && (
        <section className="mt-6 rounded-2xl border border-amber-200/30 bg-amber-50 p-5 md:p-6">
          <h2 className="section-title text-2xl font-semibold leading-snug mb-3">Philosophical Explanation</h2>
          <div className="body-text text-base leading-relaxed font-normal">
            <Paragraphs text={philosophical} />
          </div>
        </section>
      )}

      {nextHref && (
        <nav className="mt-8 flex justify-end">
          <Link href={nextHref} className="text-sm font-semibold text-primary-600 hover:text-primary-700">
            {nextLabel || 'Open next'} →
          </Link>
        </nav>
      )}
    </PageLayout>
  );
}
