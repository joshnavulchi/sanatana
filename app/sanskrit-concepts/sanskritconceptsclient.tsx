"use client";
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import SimilarCategories from '@components/similar-categories/SimilarCategories';

export default function SanskritConceptsClient() {
  const { isLoading } = useLocale();
  const ns = useLocaleSection('sanskrit_concepts');
  const title = ns?.title || 'Sanskrit Concepts';

  if (isLoading && !ns?.title) {
    return (
      <PageLayout metaKey="sanskrit_concepts" title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Sanskrit Concepts' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  const concepts = Array.isArray(ns?.concepts) ? ns.concepts : [];

  return (
    <PageLayout metaKey="sanskrit_concepts" title={title} breadcrumbs={[{ label: 'Home', href: '/' }, { label: title }]} className="layout-md">
      {concepts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {concepts.map((item: Record<string, unknown>, idx: number) => {
            const name = String(item?.name || item?.title || `Concept ${idx + 1}`);
            const desc = typeof item?.description === 'string' ? item.description : '';
            return (
              <div key={idx} className="relative overflow-hidden rounded-2xl border border-[#d8a25a]/50 bg-[#fffaf0] p-6 shadow-[0_8px_30px_rgba(146,64,14,0.08)]">
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#3b3270] via-[#8b6914] to-[#f59e0b]" />
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#3b3270]/10 text-sm">🕉️</span>
                  <h3 className="text-lg font-bold text-[#3d2e22]">{name}</h3>
                </div>
                {desc && <p className="text-sm text-[#6b5d4f] mt-3 line-clamp-2">{desc}</p>}
              </div>
            );
          })}
        </div>
      )}
      <SimilarCategories />
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
