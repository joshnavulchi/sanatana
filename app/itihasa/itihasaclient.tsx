"use client";

import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import Link from 'next/link';
import PageLayout from '@components/common/PageLayout';

interface NavLink { href: string; label: string; description?: string }

export default function ItihasaClient() {
  const { isLoading } = useLocale();
  const shared = useLocaleSection('sharable_strings');
  const section = shared?.footer?.itihasa;
  const title = section?.title || 'Itihasa';

  // Build links from array nav (Ramayana, Mahabharata) + add Bhagavad Gita
  const links: NavLink[] = [];
  const toRouteSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');
  if (Array.isArray(section?.nav)) {
    for (const item of section.nav) {
      if (item?.name && typeof item.name === 'string') {
        links.push({
          href: `/itihasa/${toRouteSlug(item.name as string)}`,
          label: item.name,
          description: typeof item.description === 'string' ? item.description : undefined,
        });
      }
      // Bhagavad Gita has no "name" field — detect by chapters_list
      if (item?.chapters_list && !item?.name) {
        links.push({
          href: '/itihasa/bhagavadgita',
          label: 'Bhagavad Gita',
          description: typeof item.description === 'string' ? item.description : undefined,
        });
      }
    }
  }

  if (isLoading && !section) {
    return (
      <PageLayout metaKey="itihasa" title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Itihasa' }]} className="layout-md">
        <div className="flex items-center justify-center py-6"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey="itihasa" title={title} breadcrumbs={[{ label: 'Home', href: '/' }, { label: title }]} className="layout-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="group block">
            <div className="relative overflow-hidden rounded-2xl border border-amber-200/50 bg-amber-50 p-4 shadow-[0_8px_30px_rgba(146,64,14,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(166,61,23,0.18)]">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-300" />
              <div className="flex items-center gap-3 mt-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-700/10 text-sm">⚔️</span>
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{link.label}</h3>
              </div>
              {link.description && <p className="meta-text mt-3 line-clamp-2">{link.description}</p>}
            </div>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
