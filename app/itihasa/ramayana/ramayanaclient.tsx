"use client";
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import Link from 'next/link';

interface NavLink { href: string; label: string }

function Paragraphs({ text, className = '' }: { text: string; className?: string }) {
  return (
    <>
      {text.split('\n\n').map((p, i) => (
        <p
          key={i}
          className={`mb-4 last:mb-0 ${className} transition-all duration-500 ease-in-out bg-gradient-to-r from-amber-50/80 to-amber-100/60 rounded-xl px-3 py-2 shadow-sm hover:shadow-lg`}
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
    'bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300/80',
    'bg-gradient-to-br from-amber-50 via-amber-100 to-yellow-200/80',
    'bg-gradient-to-br from-yellow-50 via-amber-100 to-amber-200/80',
  ];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-amber-300/40 p-6 md:p-8 ${shells[index % 3]} shadow-xl hover:shadow-2xl transition-all duration-500 motion-safe:animate-fadeIn`}
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-200/60 to-amber-100/0 animate-pulse" />
      <div className="absolute left-0 top-1 bottom-0 w-1 bg-gradient-to-b from-amber-200/60 to-amber-100/0 animate-pulse" />
      <div className="flex items-center gap-3 mb-5 pl-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold text-amber-50 bg-amber-500/80 shadow-lg">
          {index + 1}
        </span>
        <h3 className="text-xl md:text-2xl font-extrabold text-amber-900 drop-shadow">{section}</h3>
      </div>
      <div className="text-base text-amber-800 leading-relaxed pl-2">
        <Paragraphs text={content} />
      </div>
    </div>
  );
}

export default function RamayanaClient() {
  const { isLoading } = useLocale();
  const ns = useLocaleSection('scriptures_ramayana');
  const shared = useLocaleSection('sharable_strings');

  // Extract kanda links from sharable_strings footer itihasa data
  const itihasaNav = shared?.footer?.itihasa?.nav;
  const ramayanaEntry = Array.isArray(itihasaNav)
    ? itihasaNav.find((item: Record<string, unknown>) => item?.name === 'Ramayana')
    : null;
  const kandas: NavLink[] = ramayanaEntry?.kandas
    ? Object.entries(ramayanaEntry.kandas as Record<string, string>).map(([key, val]) => ({
      href: `/itihasa/ramayana/${key}`,
      label: val,
    }))
    : [];

  const title = ns?.title || 'Ramayana';
  const description = typeof ns?.description === 'string' ? ns.description : '';
  const introduction = typeof ns?.introduction === 'string' ? ns.introduction : '';
  const philosophical = typeof ns?.philosophical_explanation === 'string' ? ns.philosophical_explanation : '';
  const scriptureSections = Array.isArray(ns?.scripture_text)
    ? (ns.scripture_text as unknown[]).filter((v) => v && typeof v === 'object') as Record<string, unknown>[]
    : [];

  if (isLoading && !ns?.title && !ramayanaEntry) {
    return (
      <PageLayout metaKey="scriptures_ramayana" title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Itihasa', href: '/itihasa' }, { label: 'Ramayana' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey="scriptures_ramayana" title={title} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Itihasa', href: '/itihasa' }, { label: title }]} className="layout-md">
      {description && (
        <div className="relative px-4 md:px-6 py-8 md:py-12 bg-gradient-to-br from-amber-50 via-amber-100 to-yellow-50 rounded-2xl border-amber-200/30 overflow-hidden mb-8 shadow-lg animate-fadeIn">
          <p className="text-base body-text text-amber-900 drop-shadow">{description}</p>
        </div>
      )}

      {introduction && (
        <div className="relative px-4 md:px-6 py-8 md:py-10 bg-gradient-to-br from-amber-100 via-amber-50 to-yellow-100 rounded-2xl border-amber-200/30 overflow-hidden mb-8 shadow-xl animate-fadeIn">
          <h3 className="section-title mb-4 text-amber-800">Introduction</h3>
          <div className="body-text">
            <Paragraphs text={introduction} />
          </div>
        </div>
      )}

      {scriptureSections.length > 0 && (
        <div className="mt-8">
          <h3 className="section-title mb-6 text-amber-900">Overview</h3>
          <div className="grid grid-cols-1 gap-6">
            {scriptureSections.map((item, idx) => (
              <SectionCard key={idx} item={item} index={idx} />
            ))}
          </div>
        </div>
      )}

      {philosophical && (
        <div className="mt-10 relative overflow-hidden rounded-3xl border-amber-200/30 p-6 md:p-8 bg-gradient-to-br from-yellow-50 via-amber-100 to-amber-200 shadow-xl animate-fadeIn">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-200/60 to-amber-100/0 animate-pulse" />
          <h3 className="section-title mb-4 text-amber-900">Philosophical Explanation</h3>
          <div className="body-text">
            <Paragraphs text={philosophical} />
          </div>
        </div>
      )}

      {kandas.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-amber-900 mb-6">Kandas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kandas.map((link, idx) => (
              <Link key={link.href} href={link.href} className="group block">
                <div className="relative overflow-hidden rounded-2xl border-amber-200/50 bg-gradient-to-br from-amber-50 via-amber-100 to-yellow-50 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:bg-amber-100/80 animate-fadeIn">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-200/60 to-amber-100/0 animate-pulse" />
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-700/15 text-sm font-semibold text-amber-700 shadow-md">{idx + 1}</span>
                    <h3 className="text-base font-semibold text-amber-900 group-hover:text-amber-700 transition-colors">{link.label}</h3>
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
