"use client";
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import SimilarCategories from '@components/similar-categories/SimilarCategories';
import Link from 'next/link';

interface NavLink { href: string; label: string }

export default function BhagavadGitaClient() {
  const { isLoading } = useLocale();
  const ns = useLocaleSection('scriptures_bhagavadgita');
  const shared = useLocaleSection('sharable_strings');

  // Extract chapter links from sharable_strings footer itihasa data
  const itihasaNav = shared?.footer?.itihasa?.nav;
  const bgEntry = Array.isArray(itihasaNav)
    ? itihasaNav.find((item: Record<string, unknown>) => item?.chapters_list && !item?.name)
    : null;
  const chapters: NavLink[] = bgEntry?.chapters_list
    ? Object.entries(bgEntry.chapters_list as Record<string, string>).map(([key, val]) => ({
      href: `/itihasa/bhagavadgita/${key}`,
      label: val,
    }))
    : [];

  const title = ns?.title || 'Bhagavad Gita';
  const description = typeof ns?.description === 'string' ? ns.description : '';

  if (isLoading && !ns?.title && !bgEntry) {
    return (
      <PageLayout metaKey="scriptures_bhagavadgita" title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Itihasa', href: '/itihasa' }, { label: 'Bhagavad Gita' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey="scriptures_bhagavadgita" title={title} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Itihasa', href: '/itihasa' }, { label: title }]} className="layout-md">
      {description && (
        <div className="relative px-4 md:px-6 py-8 md:py-12 bg-linear-to-br from-[#fffaf3] via-[#fef3e2] to-[#fbe8c8] rounded-2xl border border-[#d8a25a]/30 overflow-hidden mb-8">
          <p className="text-lg text-[#5b2d12]">{description}</p>
        </div>
      )}

      {chapters.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-[#3d2e22] mb-6">Chapters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {chapters.map((link, idx) => (
              <Link key={link.href} href={link.href} className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-[#d8a25a]/50 bg-[#fffaf0] p-5 shadow-[0_8px_30px_rgba(146,64,14,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(166,61,23,0.18)]">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#7a2e1f] via-[#c2410c] to-[#f59e0b]" />
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#7a2e1f]/15 text-sm font-bold text-[#7a2e1f]">{idx + 1}</span>
                    <h3 className="text-base font-bold text-[#3d2e22] group-hover:text-[#7a2e1f] transition-colors">{link.label}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
