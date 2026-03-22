"use client";
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import Link from 'next/link';
import PageLayout from '@components/common/PageLayout';

interface NavLink { href: string; label: string }

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
    'bg-linear-to-br from-primary-50 via-primary-100 to-primary-200',
    'bg-linear-to-br from-primary-50 via-primary-100 to-primary-200',
    'bg-linear-to-br from-primary-50 via-primary-100 to-primary-200',
  ];

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-amber-200/30 p-6 md:p-8 ${shells[index % 3]} shadow-[0_8px_30px_rgba(146,64,14,0.06)]`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary-700 via-primary-500 to-primary-400" />
      <div className="absolute left-0 top-1 bottom-0 w-1 bg-linear-to-b from-primary-700 to-primary-400" />
      <div className="flex items-center gap-3 mb-5 pl-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary-700 to-primary-400 text-xs font-extrabold text-white shadow-[0_4px_20px_rgba(122,46,31,0.25)]">
          {index + 1}
        </span>
        <h3 className="section-title font-extrabold">{section}</h3>
      </div>
      <div className="body-text leading-relaxed pl-2">
        <Paragraphs text={content} />
      </div>
    </div>
  );
}

export default function BhagavadGitaClient() {
  const { isLoading } = useLocale();
  const ns = useLocaleSection('scriptures_bhagavadgita');
  const shared = useLocaleSection('sharable_strings');

  // Extract chapter links from sharable_strings footer itihasa data
  const itihasaNav = shared?.footer?.itihasa?.nav;
  const bgEntry = Array.isArray(itihasaNav)
    ? itihasaNav.find((item: Record<string, unknown>) => item?.chapters_list && !item?.name)
    : null;
  const chapters: NavLink[] = bgEntry?.chapters_list
    ? Object.entries(bgEntry.chapters_list as Record<string, string>).map(([key, val]) => ({
      href: `/itihasa/bhagavadgita/${key}`,
      label: val,
    }))
    : [];

  const title = ns?.title || 'Bhagavad Gita';
  const description = typeof ns?.description === 'string' ? ns.description : '';
  const introduction = typeof ns?.introduction === 'string' ? ns.introduction : '';
  const philosophical = typeof ns?.philosophical_explanation === 'string' ? ns.philosophical_explanation : '';
  const scriptureSections = Array.isArray(ns?.scripture_text)
    ? (ns.scripture_text as unknown[]).filter((v) => v && typeof v === 'object') as Record<string, unknown>[]
    : [];

  if (isLoading && !ns?.title && !bgEntry) {
    return (
      <PageLayout metaKey="scriptures_bhagavadgita" title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Itihasa', href: '/itihasa' }, { label: 'Bhagavad Gita' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey="itihasa_bhagavadgita" title={title} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Itihasa', href: '/itihasa' }, { label: title }]} className="layout-md">
      {description && (
        <div className="relative px-4 md:px-6 py-4 md:py-12 rounded-2xl border border-amber-200/30 bg-amber-50 overflow-hidden mb-6">
          <p className="text-lg body-text">{description}</p>
        </div>
      )}

      {introduction && (
        <div className="relative px-4 md:px-6 py-4 md:py-10 rounded-2xl border border-amber-200/30 bg-amber-50 overflow-hidden mb-6 shadow-[0_8px_30px_rgba(146,64,14,0.06)]">
          <h2 className="section-title mb-4">Introduction</h2>
          <div className="body-text md:text-lg leading-relaxed">
            <Paragraphs text={introduction} />
          </div>
        </div>
      )}

      {scriptureSections.length > 0 && (
        <div className="mt-8">
          <h2 className="section-title mb-4">Overview</h2>
          <div className="grid grid-cols-1 gap-4">
            {scriptureSections.map((item, idx) => (
              <SectionCard key={idx} item={item} index={idx} />
            ))}
          </div>
        </div>
      )}

      {philosophical && (
        <div className="mt-10 relative overflow-hidden rounded-3xl border border-amber-200/30 p-4 md:p-8 bg-amber-50 shadow-[0_8px_30px_rgba(146,64,14,0.06)]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary-700 via-primary-500 to-primary-400" />
          <h2 className="section-title mb-4">Philosophical Explanation</h2>
          <div className="body-text md:text-lg leading-relaxed">
            <Paragraphs text={philosophical} />
          </div>
        </div>
      )}

      {chapters.length > 0 && (
        <div className="mt-8">
          <h2 className="section-title mb-6">Chapters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapters.map((link, idx) => (
              <Link key={link.href} href={link.href} className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-amber-200/50 bg-amber-50 p-4 shadow-[0_8px_30px_rgba(146,64,14,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(166,61,23,0.18)]">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary-700 via-primary-500 to-primary-400" />
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-700/15 text-sm font-bold text-primary-700">{idx + 1}</span>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{link.label}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
