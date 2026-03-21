"use client";

import Link from 'next/link';
import PageLayout from '@components/common/PageLayout';
import Loader from '@components/loader';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { parseNumericSuffix, toTitleFromSlug } from '@lib/siteUtils';

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split('\n\n').map((p, i) => (
        <p key={i} className="mb-4 last:mb-0">{p}</p>
      ))}
    </>
  );
}

function buildNamespace(slug: string, parts: string[]): string {
  if (slug === 'bhagavata') {
    const skanda = parseNumericSuffix(parts[0] || 'skanda-1');
    if (parts.length === 1) return `puranas_bhagavata_skanda${skanda}`;
    const chapter = parseNumericSuffix(parts[1] || 'chapter-1');
    if (parts.length === 2) return `puranas_bhagavata_skanda${skanda}_chapter${chapter}`;
    const verse = parseNumericSuffix(parts[2] || 'verse-1');
    return `puranas_bhagavata_skanda${skanda}_chapter${chapter}_verse${verse}`;
  }

  const chapter = parseNumericSuffix(parts[0] || 'chapter-1');
  if (parts.length === 1) return `puranas_${slug}_chapter${chapter}`;
  const verse = parseNumericSuffix(parts[1] || 'verse-1');
  return `puranas_${slug}_chapter${chapter}_verse${verse}`;
}

export default function PartsClient({ slug, parts }: { slug: string; parts: string[] }) {
  const { isLoading } = useLocale();
  const namespace = buildNamespace(slug, parts);
  const data = useLocaleSection(namespace);

  const title = typeof data?.title === 'string' ? data.title : toTitleFromSlug(slug);
  const description = typeof data?.description === 'string' ? data.description : '';
  const introduction = typeof data?.introduction === 'string' ? data.introduction : '';
  const scriptureText = typeof data?.scripture_text === 'string' ? data.scripture_text : '';
  const scriptureSections = Array.isArray(data?.scripture_text) ? (data?.scripture_text as unknown[]) : null;
  const philosophical = typeof data?.philosophical_explanation === 'string' ? data.philosophical_explanation : '';

  const skandaNum = slug === 'bhagavata' ? parseNumericSuffix(parts[0] || 'skanda-1') : null;
  const chapterNum = slug === 'bhagavata' ? parseNumericSuffix(parts[1] || 'chapter-1') : parseNumericSuffix(parts[0] || 'chapter-1');
  const verseNum = slug === 'bhagavata'
    ? (parts.length > 2 ? parseNumericSuffix(parts[2]) : null)
    : (parts.length > 1 ? parseNumericSuffix(parts[1]) : null);

  const breadcrumbs: { label: string; href?: string }[] = [
    { label: 'Home', href: '/' },
    { label: 'Puranas', href: '/puranas' },
    { label: toTitleFromSlug(slug), href: `/puranas/${slug}` },
  ];

  if (slug === 'bhagavata' && skandaNum !== null) {
    breadcrumbs.push({ label: `Skanda ${skandaNum}`, href: `/puranas/${slug}/skanda-${skandaNum}` });
  }
  if (chapterNum !== null) {
    breadcrumbs.push({
      label: `Chapter ${chapterNum}`,
      href: slug === 'bhagavata'
        ? `/puranas/${slug}/skanda-${skandaNum}/chapter-${chapterNum}`
        : `/puranas/${slug}/chapter-${chapterNum}`,
    });
  }
  if (verseNum !== null) {
    breadcrumbs.push({ label: `Verse ${verseNum}` });
  }

  if (isLoading && !title) {
    return (
      <PageLayout metaKey={namespace} title="" breadcrumbs={breadcrumbs} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey={namespace} title={title} breadcrumbs={breadcrumbs} className="layout-md">
      <section className="rounded-3xl border border-amber-200/30 bg-amber-50 p-6 md:p-10">
        <h1 className="page-title mb-2">{title}</h1>
        {description && <p className="body-text">{description}</p>}
      </section>

      {introduction && (
        <section className="mt-6 rounded-2xl border border-amber-200/30 bg-amber-50 p-5 md:p-6">
          <h2 className="section-title">Introduction</h2>
          <div className="body-text"><Paragraphs text={introduction} /></div>
        </section>
      )}

      {scriptureText && (
        <section className="mt-6 rounded-2xl border border-amber-200/50 bg-amber-50 p-5 md:p-6">
          <h2 className="section-title">Text</h2>
          <div className="body-text"><Paragraphs text={scriptureText} /></div>
        </section>
      )}

      {scriptureSections && scriptureSections.length > 0 && (
        <section className="mt-6">
          <h2 className="section-title">Text</h2>
          <div className="space-y-6">
            {scriptureSections.map((item, idx) => {
              if (!item) return null;
              if (typeof item === 'string') return <div key={idx} className="body-text"><Paragraphs text={item} /></div>;
              const obj = item as Record<string, any>;
              const sectionTitle = typeof obj.section === 'string' ? obj.section : '';
              const content = typeof obj.content === 'string' ? obj.content : (typeof obj.text === 'string' ? obj.text : '');
              return (
                <div key={idx} className="rounded-2xl border border-amber-200/50 bg-amber-50 p-5 md:p-6">
                  {sectionTitle && <h3 className="text-base font-semibold text-gray-900 mb-2">{sectionTitle}</h3>}
                  {content && <div className="body-text"><Paragraphs text={content} /></div>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {philosophical && (
        <section className="mt-6 rounded-2xl border border-amber-200/30 bg-amber-50 p-5 md:p-6">
          <h2 className="section-title">Philosophical Explanation</h2>
          <div className="body-text"><Paragraphs text={philosophical} /></div>
        </section>
      )}

      {verseNum === null && (
        <nav className="mt-8 flex justify-end">
          <Link
            href={slug === 'bhagavata'
              ? `/puranas/${slug}/skanda-${skandaNum}/chapter-${chapterNum}/verse-1`
              : `/puranas/${slug}/chapter-${chapterNum}/verse-1`}
            className="text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            Open Verse 1 →
          </Link>
        </nav>
      )}
    </PageLayout>
  );
}
