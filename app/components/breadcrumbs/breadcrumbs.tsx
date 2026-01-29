/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import React from 'react';
import Link from 'next/link';
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

export default function Breadcrumbs({ items, locale }: { items: CrumbInput[]; locale?: string }) {
  const normalized = normalizeBreadcrumbs(items, locale);
  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      <ol className="breadcrumb-wrapper flex items-center">
        {normalized.map((it, idx) => {
          const isLast = idx === normalized.length - 1;
          return (
            <li key={idx} className="flex items-center" aria-current={isLast ? 'page' : undefined}>
              {it.href && !isLast ? (
                <Link href="/">
                  Home
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
