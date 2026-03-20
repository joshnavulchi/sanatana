"use client";
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import Link from 'next/link';

interface TopicLink {
  href: string;
  label: string;
  description?: string;
  totalSubtopics?: number;
}

function Paragraphs({ text, className = '' }: { text: string; className?: string }) {
  return (
    <>
      {text.split('\n\n').map((p, i) => (
        <p key={i} className={`mb-4 last:mb-0 ${className}`}>{p}</p>
      ))}
    </>
  );
}

function SectionCard({ item, index }: { item: Record<string, unknown>; index: number }) {
  const section = typeof item.section === 'string' ? item.section : '';
  const content = typeof item.content === 'string' ? item.content : '';
  const shells = [
    'bg-linear-to-br from-[#fffaf3] via-[#fef3e2] to-[#fbe8c8]',
    'bg-linear-to-br from-[#fffbf5] via-[#fdf1dc] to-[#f8e4c0]',
    'bg-linear-to-br from-[#fff9f0] via-[#fce9ce] to-[#f5d9ae]',
  ];

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-[#d8a25a]/30 p-4 md:p-8 ${shells[index % 3]} shadow-[0_8px_30px_rgba(146,64,14,0.06)]`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#1a6e5c] via-[#d97706] to-[#f59e0b]" />
      <div className="absolute left-0 top-1 bottom-0 w-1 bg-linear-to-b from-[#1a6e5c] to-[#f59e0b]" />
      <div className="flex items-center gap-3 mb-5 pl-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#1a6e5c] to-[#f59e0b] text-xs font-extrabold text-[#fffaf0] shadow-[0_4px_20px_rgba(122,46,31,0.25)]">
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

export default function VedicPhilosophyClient() {
  const { isLoading } = useLocale();
  const structure = useLocaleSection('vedic_philosophy_structure');

  const title = typeof structure?.title === 'string' ? structure.title : 'Vedic Philosophy';
  const introduction = typeof structure?.introduction === 'string' ? structure.introduction : '';
  const philosophical =
    typeof structure?.philosophical_explanation === 'string'
      ? structure.philosophical_explanation
      : '';
  const scriptureSections = Array.isArray(structure?.scripture_text)
    ? (structure.scripture_text as unknown[]).filter((v) => v && typeof v === 'object') as Record<string, unknown>[]
    : [];

  const topics = Array.isArray(structure?.topics) ? (structure.topics as unknown[]) : [];
  const links: TopicLink[] = topics
    .map((topic) => {
      if (!topic || typeof topic !== 'object') return null;
      const slug = String((topic as Record<string, unknown>).slug || '');
      const topicTitle = String((topic as Record<string, unknown>).title || '');
      if (!slug || !topicTitle) return null;
      return {
        href: `/vedic-philosophy/${slug}`,
        label: topicTitle,
        description:
          typeof (topic as Record<string, unknown>).description === 'string'
            ? ((topic as Record<string, unknown>).description as string)
            : undefined,
        totalSubtopics: Number((topic as Record<string, unknown>).total_subtopics || 0),
      };
    })
    .filter(Boolean) as TopicLink[];

  if (isLoading && links.length === 0) {
    return (
      <PageLayout
        metaKey="vedic_philosophy_structure"
        title=""
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Vedic Philosophy' }]}
        className="layout-md"
      >
        <div className="flex items-center justify-center py-6"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="vedic_philosophy_structure"
      title={title}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: title }]}
      className="layout-md"
    >
      {introduction && (
        <div className="relative px-4 md:px-6 py-4 md:py-10 bg-[#fffaf0] rounded-2xl border border-[#d8a25a]/30 overflow-hidden mb-6 shadow-[0_8px_30px_rgba(146,64,14,0.06)]">
          <h2 className="text-2xl font-extrabold text-[#3d2e22] mb-4">Introduction</h2>
          <div className="text-base md:text-lg text-[#5b2d12] leading-relaxed">
            <Paragraphs text={introduction} />
          </div>
        </div>
      )}

      {scriptureSections.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-extrabold text-[#3d2e22] mb-4">Overview</h2>
          <div className="grid grid-cols-1 gap-6">
            {scriptureSections.map((item, idx) => (
              <SectionCard key={idx} item={item} index={idx} />
            ))}
          </div>
        </div>
      )}

      {philosophical && (
        <div className="mt-10 relative overflow-hidden rounded-3xl border border-[#d8a25a]/30 p-4 md:p-8 bg-linear-to-br from-[#fffaf3] via-[#fdf1dc] to-[#f8e4c0] shadow-[0_8px_30px_rgba(146,64,14,0.06)]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#1a6e5c] via-[#d97706] to-[#f59e0b]" />
          <h2 className="text-2xl font-extrabold text-[#3d2e22] mb-4">Philosophical Explanation</h2>
          <div className="text-base md:text-lg text-[#5b2d12] leading-relaxed">
            <Paragraphs text={philosophical} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="group block">
            <div className="relative overflow-hidden rounded-2xl border border-[#d8a25a]/50 bg-[#fffaf0] p-4 md:p-6 shadow-[0_8px_30px_rgba(146,64,14,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(166,61,23,0.18)]">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#1a6e5c] via-[#d97706] to-[#f59e0b]" />
              <div className="flex items-center gap-3 mt-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1a6e5c]/10 text-sm">🔬</span>
                <h3 className="text-lg font-bold text-[#3d2e22] group-hover:text-[#1a6e5c] transition-colors">{link.label}</h3>
              </div>
              {link.description && <p className="text-sm text-[#6b5d4f] mt-3">{link.description}</p>}
              {typeof link.totalSubtopics === 'number' && link.totalSubtopics > 0 && (
                <p className="text-xs text-[#a89278] mt-2">{link.totalSubtopics} subtopics</p>
              )}
            </div>
          </Link>
        ))}
      </div>

    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
