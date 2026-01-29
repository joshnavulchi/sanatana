/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { t } from '../../../lib/i18n';

import styles from './breadcrumbs.module.scss';

type Crumb = { label: React.ReactNode; href?: string };
type CrumbInput = { label?: unknown; labelKey?: string; href?: string };

function normalizeBreadcrumbs(items: CrumbInput[], locale?: string): Crumb[] {
  return items.map((it) => {
    // Resolve label from i18n if labelKey provided, otherwise use provided label.
    let raw: unknown = it.labelKey ? (t(it.labelKey, locale) || it.labelKey) : (it.label ?? '');
    // Ensure label is a renderable ReactNode. Convert plain objects to string
    // to avoid TypeScript/React complaining about '{}' not being a valid node.
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
  const breadcrumbs: CrumbInput[] = [{ labelKey: 'nav.home', href: '/' }];
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
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      <ol className="breadcrumb-wrapper flex items-center">
        {normalized.map((it, idx) => {
          const isLast = idx === normalized.length - 1;
          return (
            <li key={idx} className="flex items-center" aria-current={isLast ? 'page' : undefined}>
              {it.href && !isLast ? (
                <Link href={it.href}>
                  {it.label}
                </Link>
              ) : (
                <span className={`text-sm`}>{it.label}</span>
              )}
              {idx < normalized.length - 1 && (
                <span className="inline-block mx-2" aria-hidden="true">/</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
