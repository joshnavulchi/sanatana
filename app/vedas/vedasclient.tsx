"use client";
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import SimilarCategories from '@components/similar-categories/SimilarCategories';
import Link from 'next/link';

interface NavLink { href: string; label: string; description?: string }

function normalizeNav(nav: unknown, basePath: string): NavLink[] {
  if (Array.isArray(nav)) {
    return nav
      .filter((item: Record<string, unknown>) => item?.name && typeof item.name === 'string')
      .map((item: Record<string, unknown>) => ({
        href: `${basePath}/${(item.name as string).toLowerCase().replace(/\s+/g, '')}`,
        label: item.name as string,
        description: typeof item.description === 'string' ? item.description : undefined,
      }));
  }
  if (nav && typeof nav === 'object') {
    return Object.entries(nav as Record<string, unknown>)
      .filter(([, val]) => typeof val === 'string')
      .map(([key, val]) => ({
        href: `${basePath}/${key}`,
        label: val as string,
      }));
  }
  return [];
}

export default function VedasClient() {
  const { isLoading } = useLocale();
  const shared = useLocaleSection('sharable_strings');
  const section = shared?.footer?.vedas;
  const title = section?.title || 'Vedas';
  const links = normalizeNav(section?.nav, '/vedas');

  if (isLoading && !section) {
    return (
      <PageLayout metaKey="vedas" title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Vedas' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey="vedas" title={title} breadcrumbs={[{ label: 'Home', href: '/' }, { label: title }]} className="layout-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="group block">
            <div className="relative overflow-hidden rounded-2xl border border-[#d8a25a]/50 bg-[#fffaf0] p-6 shadow-[0_8px_30px_rgba(146,64,14,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(166,61,23,0.18)]">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#7c2d12] via-[#d97706] to-[#f59e0b]" />
              <div className="flex items-center gap-3 mt-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#9a3412]/10 text-sm">📕</span>
                <h3 className="text-lg font-bold text-[#3d2e22] group-hover:text-[#9a3412] transition-colors">{link.label}</h3>
              </div>
              {link.description && <p className="text-sm text-[#6b5d4f] mt-3 line-clamp-2">{link.description}</p>}
            </div>
          </Link>
        ))}
      </div>
      <SimilarCategories />
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
