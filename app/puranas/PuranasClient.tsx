"use client";

import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import Link from 'next/link';
import PageLayout from '@components/common/PageLayout';

interface NavLink { href: string; label: string }

function normalizePuranaPathPart(part: string): string {
  return part.replace(/-purana$/, '');
}

function Paragraphs({ text, className = '' }: { text: string; className?: string }) {
  return (
    <>
      {text.split('\n\n').map((p, i) => (
        <p key={i} className={`mb-4 last:mb-0 ${className}`}>{p}</p>
      ))}
    </>
  );
}

function SectionCard({ item, index }: { item: Record<string, unknown>; index: number }) {
  const section = typeof item.section === 'string' ? item.section : '';
  const content = typeof item.content === 'string' ? item.content : '';
  const shells = [
    'bg-linear-to-br from-[#fffaf3] via-[#fef3e2] to-[#fbe8c8]',
    'bg-linear-to-br from-[#fffbf5] via-[#fdf1dc] to-[#f8e4c0]',
    'bg-linear-to-br from-[#fff9f0] via-[#fce9ce] to-[#f5d9ae]',
  ];

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-[#d8a25a]/30 p-6 md:p-8 ${shells[index % 3]} shadow-[0_8px_30px_rgba(146,64,14,0.06)]`}>
      <div className="absolute top-0 left-0 right-0 h-1" />
      <div className="absolute left-0 top-1 bottom-0 w-1" />
      <div className="flex items-center gap-3 mb-5 pl-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-[#fffaf0] shadow-[0_4px_20px_rgba(122,46,31,0.25)]">
          {index + 1}
        </span>
        <h3 className="text-xl md:text-2xl font-extrabold text-[#3d2e22]">{section}</h3>
      </div>
      <div className="text-md sm:text-base text-[#5b2d12] leading-relaxed pl-2">
        <Paragraphs text={content} />
      </div>
    </div>
  );
}

function normalizeNav(nav: unknown, basePath: string): NavLink[] {
  if (nav && typeof nav === 'object' && !Array.isArray(nav)) {
    return Object.entries(nav as Record<string, unknown>)
      .filter(([, val]) => typeof val === 'string')
      .map(([key, val]) => ({
        href: `${basePath}/${normalizePuranaPathPart(key)}`,
        label: val as string,
      }));
  }
  return [];
}

export default function PuranasClient() {
  const { isLoading } = useLocale();
  const shared = useLocaleSection('sharable-strings');
  const pageNs = useLocaleSection('puranas');
  const section = shared?.footer?.puranas;
  const title = section?.title || 'Puranas';
  const links = normalizeNav(section?.nav, '/puranas');
  const introduction = typeof pageNs?.introduction === 'string' ? pageNs.introduction : '';
  const philosophical = typeof pageNs?.philosophical_explanation === 'string' ? pageNs.philosophical_explanation : '';
  const scriptureSections = Array.isArray(pageNs?.scripture_text)
    ? (pageNs.scripture_text as unknown[]).filter((v) => v && typeof v === 'object') as Record<string, unknown>[]
    : [];

  if (isLoading && !section) {
    return (
      <PageLayout metaKey="puranas" title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Puranas' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey="puranas" title={title} breadcrumbs={[{ label: 'Home', href: '/' }, { label: title }]} className="layout-md">
      {introduction && (
        <div className="relative px-4 md:px-6 py-8 md:py-10 bg-amber-50 rounded-2xl border-amber-200/30 overflow-hidden mb-8 shadow-[0_8px_30px_rgba(146,64,14,0.06)]">
          <h4 className="section-title mb-4">Introduction</h4>
          <div className="body-text">
            <Paragraphs text={introduction} />
          </div>
        </div>
      )}

      {scriptureSections.length > 0 && (
        <div className="mt-8">
          <h5 className="section-title mb-6">Overview</h5>
          <div className="grid grid-cols-1 gap-6">
            {scriptureSections.map((item, idx) => (
              <SectionCard key={idx} item={item} index={idx} />
            ))}
          </div>
        </div>
      )}

      {philosophical && (
        <div className="mt-10 relative overflow-hidden rounded-3xl border-amber-200/30 p-6 md:p-8 bg-amber-50 shadow-[0_8px_30px_rgba(146,64,14,0.06)]">
          <div className="absolute top-0 left-0 right-0 h-1" />
          <h6 className="section-title mb-4">Philosophical Explanation</h6>
          <div className="body-text">
            <Paragraphs text={philosophical} />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="group block">
            <div className="relative overflow-hidden rounded-2xl border-amber-200/50 bg-amber-50 p-6 shadow-[0_8px_30px_rgba(146,64,14,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(166,61,23,0.18)]">
              <div className="absolute top-0 left-0 right-0 h-1" />
              <div className="flex items-center gap-3 mt-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-700/10 text-md sm:text-base">📖</span>
                <h6 className="text-md sm:text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{link.label}</h6>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}

