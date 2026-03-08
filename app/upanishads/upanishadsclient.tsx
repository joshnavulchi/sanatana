"use client";
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import SimilarCategories from '@components/similar-categories/SimilarCategories';
import Link from 'next/link';

interface NavLink { href: string; label: string }

function normalizeNav(nav: unknown, basePath: string): NavLink[] {
  if (nav && typeof nav === 'object' && !Array.isArray(nav)) {
    return Object.entries(nav as Record<string, unknown>)
      .filter(([, val]) => typeof val === 'string')
      .map(([key, val]) => ({
        href: `${basePath}/${key}`,
        label: val as string,
      }));
  }
  return [];
}

export default function UpanishadsClient() {
  const { isLoading } = useLocale();
  const shared = useLocaleSection('sharable_strings');
  const section = shared?.footer?.upanishads;
  const title = section?.title || 'Upanishads';
  const links = normalizeNav(section?.nav, '/upanishads');

  if (isLoading && !section) {
    return (
      <PageLayout metaKey="upanishads" title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Upanishads' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey="upanishads" title={title} breadcrumbs={[{ label: 'Home', href: '/' }, { label: title }]} className="layout-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="group block">
            <div className="relative overflow-hidden rounded-2xl border border-[#d8a25a]/50 bg-[#fffaf0] p-6 shadow-[0_8px_30px_rgba(146,64,14,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(166,61,23,0.18)]">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#92400e] via-[#c2410c] to-[#ea580c]" />
              <div className="flex items-center gap-3 mt-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#92400e]/10 text-sm">📜</span>
                <h3 className="text-lg font-bold text-[#3d2e22] group-hover:text-[#92400e] transition-colors">{link.label}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
