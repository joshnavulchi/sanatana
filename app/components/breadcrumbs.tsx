/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { t } from '@lib/i18n';

type Crumb = { label: React.ReactNode; href?: string };
type CrumbInput = { label?: unknown; labelKey?: string; href?: string };

function normalizeBreadcrumbs(items: CrumbInput[], locale?: string): Crumb[] {
  return items.map((it, idx) => {
    // Special case: always display 'Home' for the first breadcrumb
    if (idx === 0) {
      return { label: '', href: it.href };
    }
    // Resolve label from i18n if labelKey provided, otherwise use provided label.
    let raw: unknown = it.labelKey ? (t(it.labelKey, locale) || it.labelKey) : (it.label ?? '');
    if (raw !== null && typeof raw === 'object') {
      try {
        raw = String(raw);
      } catch (_) {
        raw = '';
      }
    }
    return { label: raw as React.ReactNode, href: it.href };
  });
}

// Generate breadcrumbs from current path
function generateBreadcrumbsFromPath(pathname: string, locale?: string): CrumbInput[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: CrumbInput[] = [{ labelKey: 'Home', href: '/' }];
  let accumulatedPath = '';
  segments.forEach((segment, index) => {
    accumulatedPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    // Format segment: replace hyphens with spaces and capitalize
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbs.push({
      label,
      href: isLast ? undefined : accumulatedPath
    });
  });
  return breadcrumbs;
}

export default function Breadcrumbs({ items, locale }: { items?: CrumbInput[]; locale?: string }) {
  const pathname = usePathname();
  // Use provided items if available, otherwise generate from path
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname || '/', locale);
  const normalized = normalizeBreadcrumbs(breadcrumbItems, locale);
  return (
    <nav aria-label="Breadcrumb" className="inline-flex relative">
      <div className="flex bg-gradient-to-r from-amber-50 via-pink-50 to-rose-50 items-center rounded-sm px-3 py-2 shadow-sm border-2 border-amber-200/50 text-amber-800 text-sm leading-relaxed">
        <svg className="w-5 h-5 text-amber-800 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        <ol className="flex items-center pl-0! mb-0!">
          {normalized.map((it, idx) => {
            const isLast = idx === normalized.length - 1;
            return (
              <li key={idx} className="inline-flex items-center" aria-current={isLast ? 'page' : undefined}>
                {it.href && !isLast ? (
                  <Link
                    href={it.href}
                    className="text-sm hover:text-pink-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-pink-600 hover:after:w-full after:transition-all after:duration-300 hover:bg-pink-50"
                  >
                    {it.label}
                  </Link>
                ) : (
                  <span className="text-pink-700 bg-pink-100/60 text-sm leading-relaxed">{it.label}</span>
                )}
                {idx < normalized.length - 1 && (
                  <svg className="w-4 h-4 mx-1 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
