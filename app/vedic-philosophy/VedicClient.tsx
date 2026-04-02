"use client";

import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import Link from 'next/link';
import PageLayout from '@components/common/PageLayout';

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
        <p
          key={i}
          className={`mb-4 last:mb-0 ${className} transition-all duration-500 ease-in-out bg-gradient-to-r from-indigo-50/80 to-purple-100/60 rounded-xl px-3 py-2 shadow-sm hover:shadow-lg`}
        >
          {p}
        </p>
      ))}
    </>
  );
}

function SectionCard({ item, index }: { item: Record<string, unknown>; index: number }) {
  const section = typeof item.section === 'string' ? item.section : '';
  const content = typeof item.content === 'string' ? item.content : '';
  const shells = [
    'bg-gradient-to-br from-purple-100 via-indigo-100 to-indigo-200/80',
    'bg-gradient-to-br from-indigo-50 via-purple-100 to-purple-200/80',
    'bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-200/80',
  ];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-purple-300/40 p-4 md:p-8 ${shells[index % 3]} shadow-xl hover:shadow-2xl transition-all duration-500 motion-safe:animate-fadeIn`}
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-200/60 to-indigo-100/0 animate-pulse" />
      <div className="absolute left-0 top-1 bottom-0 w-1 bg-gradient-to-b from-purple-200/60 to-indigo-100/0 animate-pulse" />
      <div className="flex items-center gap-3 mb-5 pl-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-purple-50 bg-purple-500/80 shadow-lg">
          {index + 1}
        </span>
        <h3 className="text-xl md:text-2xl font-extrabold text-purple-900 drop-shadow">{section}</h3>
      </div>
      <div className="text-lg sm:text-base text-purple-800 leading-relaxed pl-2">
        <Paragraphs text={content} />
      </div>
    </div>
  );
}

type Props = {
  initialStructure?: Record<string, unknown>;
  initialFolderLinks?: { href: string; label: string; description?: string }[];
};

export default function VedicClient({ initialStructure, initialFolderLinks }: Props) {
  const { isLoading } = useLocale();
  const clientStructureRaw = useLocaleSection('vedic-philosophy');
  const clientStructure = (clientStructureRaw && typeof clientStructureRaw === 'object' && (clientStructureRaw as any).vedic_philosophy)
    ? (clientStructureRaw as any).vedic_philosophy
    : clientStructureRaw;

  const structure = (initialStructure && typeof initialStructure === 'object' && Object.keys(initialStructure).length > 0)
    ? initialStructure
    : clientStructure;

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

  const discoveredLinks = (initialFolderLinks || []).slice();

  const discoveredMap: Record<string, { href: string; label: string; description?: string }> = {};
  for (const l of discoveredLinks) {
    try {
      const parts = l.href.split('/').filter(Boolean);
      const slug = parts[parts.length - 1];
      discoveredMap[slug] = l;
    } catch (_) {
      // ignore
    }
  }

  const desiredTopics = [
    'advaita', 'astronomy', 'bhakti', 'dharma', 'karma', 'mathematics', 'medicine',
    'moksha', 'purushartha', 'samsara', 'yoga'
  ];

  const finalFolderLinks = desiredTopics.map((slug) => {
    if (discoveredMap[slug]) return discoveredMap[slug];
    // fallback placeholder
    const label = slug.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
    return { href: `/vedic-philosophy/${slug}`, label, description: undefined };
  });

  if (isLoading && links.length === 0) {
    return (
      <PageLayout
        metaKey="vedic-philosophy"
        title=""
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Vedic Philosophy' }]}
        className="layout-md"
      >
        <div className="flex items-center justify-center py-4"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="vedic-philosophy"
      title={title}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: title }]}
      className="layout-md"
    >
      {introduction && (
        <div className="relative px-4 md:px-6 py-4 md:py-10 bg-amber-50 rounded-2xl border-amber-200/30 overflow-hidden mb-6 shadow-[0_8px_30px_rgba(146,64,14,0.06)]">
          <h4 className="section-title mb-4">Introduction</h4>
          <div className="body-text">
            <Paragraphs text={introduction} />
          </div>
        </div>
      )}

      {scriptureSections.length > 0 && (
        <div className="mt-8">
          <h5 className="section-title mb-4">Overview</h5>
          <div className="grid grid-cols-1 gap-6">
            {scriptureSections.map((item, idx) => (
              <SectionCard key={idx} item={item} index={idx} />
            ))}
          </div>
        </div>
      )}

      {philosophical && (
        <div className="mt-10 relative overflow-hidden rounded-3xl border-amber-200/30 p-4 md:p-8 bg-amber-50 shadow-[0_8px_30px_rgba(146,64,14,0.06)]">
          <div className="absolute top-0 left-0 right-0 h-1" />
          <h6 className="section-title mb-4">Philosophical Explanation</h6>
          <div className="body-text">
            <Paragraphs text={philosophical} />
          </div>
        </div>
      )}

      {finalFolderLinks && finalFolderLinks.length > 0 && (
        <div className="mt-6">
          <h4 className="section-title mb-4">Explore Topics</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {finalFolderLinks.map((link) => (
              <Link key={link.href} href={link.href} className="group block">
                <article className="relative overflow-hidden rounded-2xl border-amber-200/40 bg-amber-50 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{link.label}</h4>
                  {link.description && <p className="text-lg sm:text-base text-gray-700">{link.description}</p>}
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="group block">
            <div className="relative overflow-hidden rounded-2xl border-amber-200/50 bg-amber-50 p-4 md:p-6 shadow-[0_8px_30px_rgba(146,64,14,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(166,61,23,0.18)]">
              <div className="absolute top-0 left-0 right-0 h-1" />
              <div className="flex items-center gap-3 mt-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-700/10 text-lg sm:text-base">🔬</span>
                <h5 className="text-lg sm:text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{link.label}</h5>
              </div>
              {link.description && <p className="meta-text mt-3">{link.description}</p>}
              {typeof link.totalSubtopics === 'number' && link.totalSubtopics > 0 && (
                <p className="text-sm text-amber-600 mt-2">{link.totalSubtopics} subtopics</p>
              )}
            </div>
          </Link>
        ))}
      </div>

    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
