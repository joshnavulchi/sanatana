"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import SimilarCategories from '@components/similar-categories/SimilarCategories';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { parseSections, parseMaybeObject } from '@lib/parseContent';

export default function AdvishankarClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('stories_adhishankaracharya');

  const title = ns?.title || 'stories_adhishankaracharya';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for AdiShankaracharya';

  return (
    <PageLayout
      metaKey="stories_adhishankaracharya"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className="layout-md"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/4">
          <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 rounded-2xl border-l-4 border-emerald-500 shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-400/8 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-500" />
                <span className="text-3xl animate-pulse">📖</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-500" />
              </div>
              <p className="text-lg md:text-xl leading-relaxed">{placeholder}</p>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/4">
          <SimilarCategories />
        </div>
      </div>
    </PageLayout>
  );
}