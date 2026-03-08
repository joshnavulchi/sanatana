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
  const ns = useLocaleSection('scriptures_ramayana');
  const displayTitle = toTitle(slug);

  if (isLoading) {
    return (
      <PageLayout metaKey={`ramayana_${slug}`} title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Itihasa', href: '/itihasa' }, { label: 'Ramayana', href: '/itihasa/ramayana' }, { label: displayTitle }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey={`ramayana_${slug}`} title={displayTitle} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Itihasa', href: '/itihasa' }, { label: 'Ramayana', href: '/itihasa/ramayana' }, { label: displayTitle }]} className="layout-md">
      <SimilarCategories />
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
