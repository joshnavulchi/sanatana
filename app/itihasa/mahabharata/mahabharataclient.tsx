"use client";
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import Loader from '@components/loader';
import Link from 'next/link';
import { MAHABHARATA_PARVAS, toTitleFromSlug } from '../itihasa-utils';

export const generateMetadata = createGenerateMetadata('itihasa_mahabharata');

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

export default function MahabharataClient() {
  const { isLoading } = useLocale();
  const ns = useLocaleSection('scriptures_mahabharata');
  const title = ns?.title || 'Mahabharata';
  const description = typeof ns?.description === 'string' ? ns.description : '';
  const introduction = typeof ns?.introduction === 'string' ? ns.introduction : '';
  const philosophical = typeof ns?.philosophical_explanation === 'string' ? ns.philosophical_explanation : '';
  const scriptureSections = Array.isArray(ns?.scripture_text)
    ? (ns.scripture_text as unknown[]).filter((v) => v && typeof v === 'object') as Record<string, unknown>[]
    : [];

  if (isLoading && !ns?.title) {
    return (
      <PageLayout metaKey="scriptures_mahabharata" title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Itihasa', href: '/itihasa' }, { label: 'Mahabharata' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <>
      <StructuredData metaKey="itihasa_mahabharata" />
      <PageLayout metaKey="itihasa_mahabharata" title={title} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Itihasa', href: '/itihasa' }, { label: title }]} className="layout-md">
        {description && (
          <div className="relative px-4 md:px-6 py-8 md:py-12 rounded-2xl border border-amber-200/30 bg-amber-50 overflow-hidden mb-8">
            <p className="text-lg body-text">{description}</p>
          </div>
        )}

        {introduction && (
          <div className="relative px-4 md:px-6 py-8 md:py-10 rounded-2xl border border-amber-200/30 bg-amber-50 overflow-hidden mb-8 shadow-[0_8px_30px_rgba(146,64,14,0.06)]">
            <h2 className="section-title mb-4">Introduction</h2>
            <div className="body-text md:text-lg leading-relaxed">
              <Paragraphs text={introduction} />
            </div>
          </div>
        )}

        {scriptureSections.length > 0 && (
          <div className="mt-8">
            <h2 className="section-title mb-6">Overview</h2>
            <div className="grid grid-cols-1 gap-6">
              {scriptureSections.map((item, idx) => (
                <SectionCard key={idx} item={item} index={idx} />
              ))}
            </div>
          </div>
        )}

        {philosophical && (
          <div className="mt-10 relative overflow-hidden rounded-3xl border border-amber-200/30 p-6 md:p-8 bg-amber-50 shadow-[0_8px_30px_rgba(146,64,14,0.06)]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary-700 via-primary-500 to-primary-400" />
            <h2 className="section-title mb-4">Philosophical Explanation</h2>
            <div className="body-text md:text-lg leading-relaxed">
              <Paragraphs text={philosophical} />
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="section-title mb-6">Parvas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MAHABHARATA_PARVAS.map((parva, idx) => (
              <Link key={parva} href={`/itihasa/mahabharata/${parva}`} className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-amber-200/50 bg-amber-50 p-5 shadow-[0_8px_30px_rgba(146,64,14,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(166,61,23,0.18)]">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary-700 via-primary-500 to-primary-400" />
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-700/15 text-sm font-bold text-primary-700">
                      {idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                      {toTitleFromSlug(parva)}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
