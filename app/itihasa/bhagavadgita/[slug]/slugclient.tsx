"use client";
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';

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

function toTitle(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function SlugClient({ slug }: { slug: string }) {
  const { isLoading } = useLocale();
  const ns = useLocaleSection(`bhagavadgita_${slug}`);
  const displayTitle = toTitle(slug);
  const description = typeof ns?.description === 'string' ? ns.description : '';
  const introduction = typeof ns?.introduction === 'string' ? ns.introduction : '';
  const philosophical = typeof ns?.philosophical_explanation === 'string' ? ns.philosophical_explanation : '';
  const scriptureSections = Array.isArray(ns?.scripture_text)
    ? (ns.scripture_text as unknown[]).filter((v) => v && typeof v === 'object') as Record<string, unknown>[]
    : [];

  if (isLoading) {
    return (
      <PageLayout metaKey={`bhagavadgita_${slug}`} title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Itihasa', href: '/itihasa' }, { label: 'Bhagavad Gita', href: '/itihasa/bhagavadgita' }, { label: displayTitle }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey={`bhagavadgita_${slug}`} title={displayTitle} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Itihasa', href: '/itihasa' }, { label: 'Bhagavad Gita', href: '/itihasa/bhagavadgita' }, { label: displayTitle }]} className="layout-md">
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
                accentFrom="from-[#7a2e1f]"
                accentVia="via-[#c2410c]"
                accentTo="to-[#f59e0b]"
              />
            ))}
          </div>
        </div>
      )}

      {philosophical && (
        <div className="mt-10 relative overflow-hidden rounded-3xl border border-[#d8a25a]/30 p-6 md:p-8 bg-linear-to-br from-[#fffaf3] via-[#fdf1dc] to-[#f8e4c0] shadow-[0_8px_30px_rgba(146,64,14,0.06)]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#7a2e1f] via-[#d97706] to-[#f59e0b]" />
          <h2 className="text-2xl font-extrabold text-[#3d2e22] mb-4">Philosophical Explanation</h2>
          <div className="text-base md:text-lg text-[#5b2d12] leading-relaxed">
            <Paragraphs text={philosophical} />
          </div>
        </div>
      )}
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
