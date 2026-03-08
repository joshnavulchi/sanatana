"use client";
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import SimilarCategories from '@components/similar-categories/SimilarCategories';

export default function FestivalsClient() {
  const { isLoading } = useLocale();
  const ns = useLocaleSection('practices_festivals');
  const title = ns?.title || 'Festivals';

  if (isLoading && !ns?.title) {
    return (
      <PageLayout metaKey="festivals" title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Festivals' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  const sections = Array.isArray(ns?.sections) ? ns.sections : [];
  const festivals = Array.isArray(ns?.festivals) ? ns.festivals : [];
  const items = sections.length > 0 ? sections : festivals;

  return (
    <PageLayout metaKey="festivals" title={title} breadcrumbs={[{ label: 'Home', href: '/' }, { label: title }]} className="layout-md">
      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {items.map((item: Record<string, unknown>, idx: number) => {
            const name = String(item?.name || item?.title || `Festival ${idx + 1}`);
            const desc = typeof item?.description === 'string' ? item.description : '';
            return (
              <div key={idx} className="relative overflow-hidden rounded-2xl border border-[#d8a25a]/50 bg-[#fffaf0] p-6 shadow-[0_8px_30px_rgba(146,64,14,0.08)]">
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#d97706] via-[#f59e0b] to-[#fde7c7]" />
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#d97706]/10 text-sm">🎉</span>
                  <h3 className="text-lg font-bold text-[#3d2e22]">{name}</h3>
                </div>
                {desc && <p className="text-sm text-[#6b5d4f] mt-3 line-clamp-2">{desc}</p>}
              </div>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
