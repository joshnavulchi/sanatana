"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@/app/components/common/PageLayout';
import SimilarCategories from '@/app/components/similar-categories/SimilarCategories';
import { useLocale } from '@/app/context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import { parseSections, parseMaybeObject } from 'lib/parseContent';

export default function BhishmaClient({ searchParams }: any) {
  const { locale } = useLocale();
  const ns = useLocaleSection('stories_bhishma');

  const title = ns?.title || 'stories_bhishma';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for Bhishma';

  return (
    <PageLayout
      metaKey="stories_bhishma"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className="layout-sm"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/4">
          <p>{placeholder}</p>
        </div>
        <div className="w-full lg:w-1/4">
          <div className="sticky top-24">
            <SimilarCategories currentCategory="stories" />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
