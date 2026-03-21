"use client";

import PageLayout from '@components/common/PageLayout';
import Loader from '@components/loader';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { toTitleFromSlug } from '../../philosophy-utils';

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split('\n\n').map((paragraph, index) => (
        <p key={index} className="mb-4 last:mb-0">
          {paragraph}
        </p>
      ))}
    </>
  );
}

export default function PartsClient({ topic, subtopic }: { topic: string; subtopic: string }) {
  const { isLoading } = useLocale();
  const namespace = `vedic_philosophy_${topic}_${subtopic}`;
  const data = useLocaleSection(namespace);

  const title =
    typeof data?.title === 'string'
      ? data.title
      : `${toTitleFromSlug(topic)} - ${toTitleFromSlug(subtopic)}`;
  const description = typeof data?.description === 'string' ? data.description : '';
  const introduction = typeof data?.introduction === 'string' ? data.introduction : '';
  const scriptureText = typeof data?.scripture_text === 'string' ? data.scripture_text : '';
  const philosophical =
    typeof data?.philosophical_explanation === 'string' ? data.philosophical_explanation : '';

  if (isLoading && !title) {
    return (
      <PageLayout
        metaKey={namespace}
        title=""
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Vedic Philosophy', href: '/vedic-philosophy' },
          { label: toTitleFromSlug(topic), href: `/vedic-philosophy/${topic}` },
          { label: toTitleFromSlug(subtopic) },
        ]}
        className="layout-md"
      >
        <div className="flex items-center justify-center py-6">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey={namespace}
      title={title}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Vedic Philosophy', href: '/vedic-philosophy' },
        { label: toTitleFromSlug(topic), href: `/vedic-philosophy/${topic}` },
        { label: toTitleFromSlug(subtopic) },
      ]}
      className="layout-md"
    >
      <section className="rounded-3xl border border-amber-200/30 bg-amber-50 p-4 md:p-10">
        <h1 className="page-title mb-2">{title}</h1>
        {description && <p className="body-text">{description}</p>}
      </section>

      {introduction && (
        <section className="mt-6 rounded-2xl border border-amber-200/30 bg-amber-50 p-4 md:p-6">
          <h2 className="section-title">Introduction</h2>
          <div className="body-text">
            <Paragraphs text={introduction} />
          </div>
        </section>
      )}

      {scriptureText && (
        <section className="mt-6 rounded-2xl border border-amber-200/50 bg-amber-50 p-4 md:p-6">
          <h2 className="section-title">Text</h2>
          <div className="body-text">
            <Paragraphs text={scriptureText} />
          </div>
        </section>
      )}

      {philosophical && (
        <section className="mt-6 rounded-2xl border border-amber-200/30 bg-amber-50 p-4 md:p-6">
          <h2 className="section-title">Philosophical Explanation</h2>
          <div className="body-text">
            <Paragraphs text={philosophical} />
          </div>
        </section>
      )}
    </PageLayout>
  );
}
