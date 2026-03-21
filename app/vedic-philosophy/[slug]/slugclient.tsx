"use client";
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { safeString } from '@lib/i18n';
import Loader from '@components/loader';
import Link from 'next/link';
import { toTitleFromSlug } from '../philosophy-utils';

function Paragraphs({ text, className = '' }: { text: string; className?: string }) {
  return (
    <>
      {text.split('\n\n').map((p, i) => (
        <p key={i} className={`mb-4 last:mb-0 ${className}`}>{p}</p>
      ))}
    </>
  );
}

function SectionCard({
  item,
  index,
  accentFrom,
  accentVia,
  accentTo,
}: {
  item: Record<string, unknown>;
  index: number;
  accentFrom: string;
  accentVia: string;
  accentTo: string;
}) {
  const section = typeof item.section === 'string' ? item.section : '';
  const content = typeof item.content === 'string' ? item.content : '';

  const shells = [
    'bg-linear-to-br from-[#fffaf3] via-[#fef3e2] to-[#fbe8c8]',
    'bg-linear-to-br from-[#fffbf5] via-[#fdf1dc] to-[#f8e4c0]',
    'bg-linear-to-br from-[#fff9f0] via-[#fce9ce] to-[#f5d9ae]',
  ];

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-[#d8a25a]/30 p-6 md:p-8 ${shells[index % 3]} shadow-[0_8px_30px_rgba(146,64,14,0.06)]`}>
      <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${accentFrom} ${accentVia} ${accentTo}`} />
      <div className={`absolute left-0 top-1 bottom-0 w-1 bg-linear-to-b ${accentFrom} ${accentTo}`} />

      <div className="flex items-center gap-3 mb-5 pl-2">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${accentFrom} ${accentTo} text-xs font-extrabold text-[#fffaf0] shadow-[0_4px_20px_rgba(122,46,31,0.25)]`}>
          {index + 1}
        </span>
        <h3 className="text-xl md:text-2xl font-extrabold text-[#3d2e22]">{section}</h3>
      </div>

      <div className="text-base text-[#5b2d12] leading-relaxed pl-2">
        <Paragraphs text={content} />
      </div>
    </div>
  );
}

export default function SlugClient({ slug }: { slug: string }) {
  const { isLoading } = useLocale();
  const ns = useLocaleSection(`vedic_philosophy_topic_${slug}`);
  const displayTitle = toTitleFromSlug(slug);
  const description = safeString(ns?.description, '');
  const introduction = safeString(ns?.introduction, '');
  const philosophical = safeString(ns?.philosophical_explanation, '');
  const scriptureSections = Array.isArray(ns?.scripture_text)
    ? (ns.scripture_text as unknown[]).filter((v) => v && typeof v === 'object') as Record<string, unknown>[]
    : [];
  const subtopics = Array.isArray(ns?.subtopics) ? (ns.subtopics as unknown[]) : [];

  if (isLoading) {
    return (
      <PageLayout metaKey={`vedic_philosophy_topic_${slug}`} title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Vedic Philosophy', href: '/vedic-philosophy' }, { label: displayTitle }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey={`vedic_philosophy_topic_${slug}`} title={displayTitle} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Vedic Philosophy', href: '/vedic-philosophy' }, { label: displayTitle }]} className="layout-md">
      {description && (
        <div className="relative px-4 md:px-6 py-8 md:py-12 bg-linear-to-br from-[#fffaf3] via-[#fef3e2] to-[#fbe8c8] rounded-2xl border border-[#d8a25a]/30 overflow-hidden mb-8">
          <p className="text-lg text-[#5b2d12]">{description}</p>
        </div>
      )}

      {introduction && (
        <div className="relative px-4 md:px-6 py-8 md:py-10 bg-[#fffaf0] rounded-2xl border border-[#d8a25a]/30 overflow-hidden mb-8 shadow-[0_8px_30px_rgba(146,64,14,0.06)]">
          <h2 className="text-2xl font-extrabold text-[#3d2e22] mb-4">Introduction</h2>
          <div className="text-base md:text-lg text-[#5b2d12] leading-relaxed">
            <Paragraphs text={introduction} />
          </div>
        </div>
      )}

      {scriptureSections.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-extrabold text-[#3d2e22] mb-6">Key Sections</h2>
          <div className="grid grid-cols-1 gap-6">
            {scriptureSections.map((item, idx) => (
              <SectionCard
                key={idx}
                item={item}
                index={idx}
                accentFrom="from-[#1a6e5c]"
                accentVia="via-[#d97706]"
                accentTo="to-[#f59e0b]"
              />
            ))}
          </div>
        </div>
      )}

      {philosophical && (
        <div className="mt-10 relative overflow-hidden rounded-3xl border border-[#d8a25a]/30 p-6 md:p-8 bg-linear-to-br from-[#fffaf3] via-[#fdf1dc] to-[#f8e4c0] shadow-[0_8px_30px_rgba(146,64,14,0.06)]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#1a6e5c] via-[#d97706] to-[#f59e0b]" />
          <h2 className="text-2xl font-extrabold text-[#3d2e22] mb-4">Philosophical Explanation</h2>
          <div className="text-base md:text-lg text-[#5b2d12] leading-relaxed">
            <Paragraphs text={philosophical} />
          </div>
        </div>
      )}

      {subtopics.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-[#3d2e22] mb-6">Subtopics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {subtopics.map((item, index) => {
              if (!item || typeof item !== 'object') return null;
              const subtopicSlug = String((item as Record<string, unknown>).slug || '');
              const subtopicTitle = safeString((item as Record<string, unknown>).title, '');
              if (!subtopicSlug || !subtopicTitle) return null;

              return (
                <Link
                  key={subtopicSlug}
                  href={`/vedic-philosophy/${slug}/${subtopicSlug}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-[#d8a25a]/50 bg-[#fffaf0] p-5 shadow-[0_8px_30px_rgba(146,64,14,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(166,61,23,0.18)]">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#1a6e5c] via-[#d97706] to-[#f59e0b]" />
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1a6e5c]/15 text-sm font-bold text-[#1a6e5c]">
                        {index + 1}
                      </span>
                      <h3 className="text-base font-bold text-[#3d2e22] group-hover:text-[#1a6e5c] transition-colors">
                        {subtopicTitle}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
