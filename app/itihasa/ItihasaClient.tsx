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
        <div className="flex items-center justify-center py-6 text-md leading-relaxed font-normal"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey="itihasa" title={title} breadcrumbs={[{ label: 'Home', href: '/' }, { label: title }]} className="layout-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-md leading-relaxed font-normal bg-gradient-to-br from-orange-50 via-amber-100 to-yellow-50 rounded-3xl border border-orange-200/30 shadow-xl p-8 md:p-12 animate-fadeIn">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="group block">
            <div className="relative overflow-hidden rounded-2xl border-orange-200/50 bg-gradient-to-r from-orange-100/80 to-amber-50/60 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:bg-orange-100/80 animate-fadeIn">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-200/60 to-amber-100/0 animate-pulse" />
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-700/10 text-xl">⚔️</span>
                <h3 className="group-hover:text-orange-700 transition-colors text-xl font-semibold leading-snug mb-2 text-orange-900 drop-shadow">{link.label}</h3>
              </div>
              {link.description && <p className="meta-text line-clamp-2 text-md leading-relaxed mb-4 font-normal text-orange-800/90 bg-gradient-to-r from-orange-50/80 to-amber-100/60 rounded-lg px-3 py-2 shadow-sm">{link.description}</p>}
            </div>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
