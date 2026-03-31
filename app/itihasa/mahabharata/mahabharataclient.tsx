"use client";
import { useEffect, useState } from 'react';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Link from 'next/link';
import Loader from '@components/loader';
import PageLayout from '@components/common/PageLayout';
import { MAHABHARATA_PARVAS, toTitleFromSlug, fetchContentByRoute } from '@lib/siteUtils';

function Paragraphs({ text, className = '' }: { text: string; className?: string }) {
  return (
    <>
      {text.split('\n\n').map((p, i) => (
        <p
          key={i}
          className={`mb-4 last:mb-0 ${className} transition-all duration-500 ease-in-out bg-gradient-to-r from-indigo-50/80 to-blue-100/60 rounded-xl px-3 py-2 shadow-sm hover:shadow-lg`}
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
    'bg-gradient-to-br from-blue-100 via-indigo-100 to-indigo-200/80',
    'bg-gradient-to-br from-indigo-50 via-blue-100 to-blue-200/80',
    'bg-gradient-to-br from-indigo-100 via-blue-50 to-indigo-200/80',
  ];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-blue-300/40 p-6 md:p-8 ${shells[index % 3]} shadow-xl hover:shadow-2xl transition-all duration-500 motion-safe:animate-fadeIn`}
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-200/60 to-indigo-100/0 animate-pulse" />
      <div className="absolute left-0 top-1 bottom-0 w-1 bg-gradient-to-b from-blue-200/60 to-indigo-100/0 animate-pulse" />
      <div className="flex items-center gap-3 mb-5 pl-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold text-blue-50 bg-blue-500/80 shadow-lg">
          {index + 1}
        </span>
        <h3 className="section-title font-extrabold text-blue-900 drop-shadow">{section}</h3>
      </div>
      <div className="body-text leading-relaxed pl-2 text-blue-800">
        <Paragraphs text={content} />
      </div>
    </div>
  );
}

export default function MahabharataClient() {
  const { isLoading, locale } = useLocale();
  const ns = useLocaleSection('scriptures_mahabharata');
  const title = ns?.title || 'Mahabharata';
  const description = typeof ns?.description === 'string' ? ns.description : '';
  const introduction = typeof ns?.introduction === 'string' ? ns.introduction : '';
  const philosophical = typeof ns?.philosophical_explanation === 'string' ? ns.philosophical_explanation : '';
  const scriptureSections = Array.isArray(ns?.scripture_text)
    ? (ns.scripture_text as unknown[]).filter((v) => v && typeof v === 'object') as Record<string, unknown>[]
    : [];

  const [parvas, setParvas] = useState<string[]>(MAHABHARATA_PARVAS || []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (!locale) return;
        const res = await fetchContentByRoute(locale, ['itihasa', 'mahabharata']);
        const data = res && res.data ? res.data : null;
        const root = data && (data.mahabharata || data);
        if (root && Array.isArray(root.parvas) && root.parvas.length > 0) {
          const derived = root.parvas
            .map((p: any) => {
              const slug = String(p?.slug || (p?.path || '').split('/').pop() || '')
                .replace(/\/+$/g, '');
              // Normalize: remove trailing '-parva' or '-kanda' and hyphens
              let s = slug.replace(/-(parva|kanda)$/i, '');
              s = s.replace(/-/g, '');
              return s;
            })
            .filter(Boolean);
          if (!cancelled && Array.isArray(derived) && derived.length > 0) setParvas(derived);
        }
      } catch (e) {
        // ignore and keep defaults
      }
    }
    load();
    return () => { cancelled = true; };
  }, [locale]);

  if (isLoading && !ns?.title) {
    return (
      <PageLayout metaKey="scriptures_mahabharata" title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Itihasa', href: '/itihasa' }, { label: 'Mahabharata' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey="itihasa_mahabharata" title={title} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Itihasa', href: '/itihasa' }, { label: title }]} className="layout-md">
      {description && (
        <div className="relative px-4 md:px-6 py-8 md:py-12 rounded-2xl border-blue-200/30 bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-100 overflow-hidden mb-8 shadow-lg animate-fadeIn">
          <p className="text-base body-text text-blue-900 drop-shadow">{description}</p>
        </div>
      )}

      {introduction && (
        <div className="relative px-4 md:px-6 py-8 md:py-10 rounded-2xl border-blue-200/30 bg-gradient-to-br from-indigo-100 via-blue-50 to-blue-100 overflow-hidden mb-8 shadow-xl animate-fadeIn">
          <h3 className="section-title mb-4 text-blue-800">Introduction</h3>
          <div className="body-text md:text-base leading-relaxed">
            <Paragraphs text={introduction} />
          </div>
        </div>
      )}

      {scriptureSections.length > 0 && (
        <div className="mt-8">
          <h3 className="section-title mb-6 text-blue-900">Overview</h3>
          <div className="grid grid-cols-1 gap-6">
            {scriptureSections.map((item, idx) => (
              <SectionCard key={idx} item={item} index={idx} />
            ))}
          </div>
        </div>
      )}

      {philosophical && (
        <div className="mt-10 relative overflow-hidden rounded-3xl border-blue-200/30 p-6 md:p-8 bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 shadow-xl animate-fadeIn">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-200/60 to-indigo-100/0 animate-pulse" />
          <h3 className="section-title mb-4 text-blue-900">Philosophical Explanation</h3>
          <div className="body-text md:text-base leading-relaxed">
            <Paragraphs text={philosophical} />
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="section-title mb-6 text-blue-900">Parvas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {parvas.map((parva: string, idx: number) => (
            <Link key={parva} href={`/itihasa/mahabharata/${parva}`} className="group block">
              <div className="relative overflow-hidden rounded-2xl border-blue-200/50 bg-gradient-to-r from-blue-100/80 to-indigo-50/60 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:bg-blue-100/80 animate-fadeIn">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-200/60 to-indigo-100/0 animate-pulse" />
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-700/15 text-sm font-semibold text-blue-700 shadow-md">
                    {idx + 1}
                  </span>
                  <h3 className="text-base font-semibold text-blue-900 group-hover:text-blue-700 transition-colors">
                    {toTitleFromSlug(parva)}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
