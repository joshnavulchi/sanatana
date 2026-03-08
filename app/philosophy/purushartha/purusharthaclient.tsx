"use client";
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import SimilarCategories from '@components/similar-categories/SimilarCategories';

export default function PurusharthaClient() {
  const { isLoading } = useLocale();
  const ns = useLocaleSection('philosophy_purushartha');

  const title = ns?.title || 'Purushartha';
  const definition = typeof ns?.definition === 'string' ? ns.definition : (Array.isArray(ns?.definition) ? ns.definition.join(' ') : '');
  const purpose = typeof ns?.purpose === 'string' ? ns.purpose : '';
  const concepts = Array.isArray(ns?.core_principles) ? ns.core_principles : [];
  const benefits = Array.isArray(ns?.benefits) ? ns.benefits : [];

  if (isLoading && !ns?.title) {
    return (
      <PageLayout metaKey="philosophy_purushartha" title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Philosophy', href: '/philosophy' }, { label: 'Purushartha' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey="philosophy_purushartha" title={title} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Philosophy', href: '/philosophy' }, { label: title }]} className="layout-md">
      <div className="relative px-3 md:px-6 py-12 md:py-16 bg-linear-to-br from-[#fffaf3] via-[#fef3e2] to-[#fbe8c8] rounded-2xl border border-[#d8a25a]/30 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f59e0b]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#c2410c]/8 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h3 className="text-3xl font-bold text-[#3d2e22] mb-4">{title}</h3>
          {definition && <p className="text-lg text-[#5b2d12] mb-6 italic">{definition}</p>}
          {purpose && (
            <div className="mt-4 p-4 bg-[#fffaf0] border-l-4 border-[#d97706] rounded-lg">
              <strong className="text-[#92400e]">Purpose:</strong> <span className="text-[#5b2d12]">{purpose}</span>
            </div>
          )}
        </div>
      </div>

      {concepts.length > 0 && (
        <div className="mt-12 p-6 md:p-8 bg-[#fffaf0] border border-[#d8a25a]/30 rounded-2xl">
          <h3 className="text-2xl font-bold mb-4 text-[#3d2e22]">Core Principles</h3>
          <ul className="list-disc pl-6 space-y-2 text-[#5b2d12]">
            {concepts.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {benefits.length > 0 && (
        <div className="mt-8 p-6 md:p-8 bg-[#fffaf0] border border-[#d8a25a]/30 rounded-2xl">
          <h3 className="text-2xl font-bold mb-4 text-[#3d2e22]">Benefits</h3>
          <ul className="list-disc pl-6 space-y-2 text-[#5b2d12]">
            {benefits.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
