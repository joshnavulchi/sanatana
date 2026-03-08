"use client";
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import SimilarCategories from '@components/similar-categories/SimilarCategories';

function toTitle(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function SlugClient({ slug }: { slug: string }) {
  const { isLoading } = useLocale();
  const ns = useLocaleSection('scriptures_vedas');
  const displayTitle = toTitle(slug);
  const title = ns?.title || displayTitle;
  const description = typeof ns?.description === 'string' ? ns.description : '';

  if (isLoading) {
    return (
      <PageLayout metaKey={`vedas_${slug}`} title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Vedas', href: '/vedas' }, { label: displayTitle }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey={`vedas_${slug}`} title={displayTitle} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Vedas', href: '/vedas' }, { label: displayTitle }]} className="layout-md">
      {description && (
        <div className="relative px-4 md:px-6 py-8 md:py-12 bg-linear-to-br from-[#fffaf3] via-[#fef3e2] to-[#fbe8c8] rounded-2xl border border-[#d8a25a]/30 overflow-hidden mb-8">
          <p className="text-lg text-[#5b2d12]">{description}</p>
        </div>
      )}
      <SimilarCategories />
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
