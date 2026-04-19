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
        <p
          key={i}
          className={`mb-4 last:mb-0 ${className} transition-all duration-500 ease-in-out bg-gradient-to-r from-emerald-50/80 to-green-100/60 rounded-xl px-3 py-2 shadow-sm hover:shadow-lg`}
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
    'bg-gradient-to-br from-green-100 via-emerald-100 to-emerald-200/80',
    'bg-gradient-to-br from-emerald-50 via-green-100 to-green-200/80',
    'bg-gradient-to-br from-emerald-100 via-green-50 to-emerald-200/80',
  ];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-emerald-300/40 p-6 md:p-8 ${shells[index % 3]} shadow-xl hover:shadow-2xl transition-all duration-500 motion-safe:animate-fadeIn`}
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-200/60 to-green-100/0 animate-pulse" />
      <div className="absolute left-0 top-1 bottom-0 w-1 bg-gradient-to-b from-emerald-200/60 to-green-100/0 animate-pulse" />
      <div className="flex items-center gap-3 mb-5 pl-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-emerald-50 bg-emerald-500/80 shadow-lg">
          {index + 1}
        </span>
        <h3 className="section-title font-semibold text-emerald-900 drop-shadow">{section}</h3>
      </div>
      <div className="body-text leading-relaxed pl-2 text-emerald-800">
        <Paragraphs text={content} />
      </div>
    </div>
  );
}

export default function BhagavadGitaClient() {
  const { isLoading } = useLocale();
  const ns = useLocaleSection('scriptures_bhagavadgita');
  const META_KEY = 'itihasa/bhagavadgita/index';
  const shared = useLocaleSection('sharable-strings');

  // Extract chapter links from sharable-strings footer itihasa data
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
      <PageLayout metaKey={META_KEY} title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Itihasa', href: '/itihasa' }, { label: 'Bhagavad Gita' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey={META_KEY} title={title} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Itihasa', href: '/itihasa' }, { label: title }]} className="layout-md">
      {description && (
        <div className="relative px-4 md:px-6 py-8 md:py-12 rounded-2xl border-emerald-200/30 bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-100 overflow-hidden mb-8 shadow-lg animate-fadeIn">
          <p className="text-md sm:text-base body-text text-emerald-900 drop-shadow">{description}</p>
        </div>
      )}

      {introduction && (
        <div className="relative px-4 md:px-6 py-8 md:py-10 rounded-2xl border-emerald-200/30 bg-gradient-to-br from-green-100 via-emerald-50 to-emerald-100 overflow-hidden mb-8 shadow-xl animate-fadeIn">
          <h4 className="section-title mb-4 text-emerald-800">Introduction</h4>
          <div className="body-text md:text-md sm:text-base leading-relaxed">
            <Paragraphs text={introduction} />
          </div>
        </div>
      )}

      {scriptureSections.length > 0 && (
        <div className="mt-8">
          <h5 className="section-title mb-4 text-emerald-900">Overview</h5>
          <div className="grid grid-cols-1 gap-6">
            {scriptureSections.map((item, idx) => (
              <SectionCard key={idx} item={item} index={idx} />
            ))}
          </div>
        </div>
      )}

      {philosophical && (
        <div className="mt-10 relative overflow-hidden rounded-3xl border-emerald-200/30 p-6 md:p-8 bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-200 shadow-xl animate-fadeIn">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-200/60 to-green-100/0 animate-pulse" />
          <h6 className="section-title mb-4 text-emerald-900">Philosophical Explanation</h6>
          <div className="body-text md:text-md sm:text-base leading-relaxed">
            <Paragraphs text={philosophical} />
          </div>
        </div>
      )}

      {chapters.length > 0 && (
        <div className="mt-8">
          <h6 className="section-title mb-6 text-emerald-900">Chapters</h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((link, idx) => (
              <Link key={link.href} href={link.href} className="group block">
                <div className="relative overflow-hidden rounded-2xl border-emerald-200/50 bg-gradient-to-r from-green-100/80 to-emerald-50/60 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:bg-emerald-100/80 animate-fadeIn">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-200/60 to-green-100/0 animate-pulse" />
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-700/15 text-md sm:text-base font-semibold text-emerald-700 shadow-md">{idx + 1}</span>
                    <h6 className="text-md sm:text-base font-semibold text-emerald-900 group-hover:text-emerald-700 transition-colors">{link.label}</h6>
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

