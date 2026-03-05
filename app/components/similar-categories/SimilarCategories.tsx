'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
// removed useT usage; translations read directly from runtime locale object
import { loadLocaleNamespace } from '@lib/i18n';
import { useLocale } from '@app/context/locale-context';

interface SimilarCategoriesProps {
  title?: string;
  maxItems?: number;
  excludeCurrent?: boolean;
}

export default function SimilarCategories({
  title = 'Explore More',
  maxItems = 100,
  excludeCurrent = true
}: SimilarCategoriesProps) {
  function normalizeHref(href?: string) {
    if (!href) return '#';
    let out = String(href);
    if (!out.startsWith('/')) out = '/' + out;
    // Replace any /others/ segment with single slash
    out = out.replace(/\/others\//g, '/');
    // Collapse multiple slashes
    out = out.replace(/\/+/g, '/');
    // Avoid returning empty
    return out === '/' ? '/' : out;
  }
  const { locale } = useLocale();
  const [categories, setCategories] = useState<Array<{ key: string; title: string; links: Array<{ key: string; label: string; href: string }> }>>([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const ns = await loadLocaleNamespace(locale, 'sharable_strings');
        if (!mounted) return;
        const locObj = (ns && typeof ns === 'object') ? ns : {};
        // The navigation data is under sharable_strings.header or sharable_strings.footer
        const sharableStrings = (locObj as any)?.sharable_strings;
        // Prefer footer nav when available, fall back to header
        const navData = sharableStrings?.similar_categories || (locObj as any)?.similar_categories || {};
        // Extract categories with their navigation items
        const extractedCategories: Array<{ key: string; title: string; links: Array<{ key: string; label: string; href: string }> }> = [];
        // Define all known categories to ensure they're included
        const knownCategories = ['philosophy', 'scriptures', 'kidszone', 'practices', 'stories', 'stotras', 'others'];

        // navData can be an object of categories or an array of links
        if (Array.isArray(navData)) {
          // footer as an array of link objects? try to group under 'footer'
          const links = navData.slice(0, 6).map((l: any, i: number) => ({ key: l.key || `f${i}`, label: l.label || l.title || l, href: l.href || l.url || '#' }));
          if (links.length) {
            extractedCategories.push({ key: 'footer', title: 'Footer', links });
          }
        } else {
          Object.entries(navData).forEach(([key, value]: [string, any]) => {
            // If value has a 'nav' object, use that
            const navObj = value?.nav || value?.links || (typeof value === 'object' && value ? value : null);
            if (!navObj || typeof navObj !== 'object') return;
            const categoryTitle = (value && value.title) ? value.title : key;
            const links: Array<{ key: string; label: string; href: string }> = [];
            Object.entries(navObj).forEach(([navKey, navLabel]: [string, any]) => {
              if (typeof navLabel === 'string') {
                links.push({ key: navKey, label: navLabel, href: normalizeHref(`/${key}/${navKey}`) });
              } else if (typeof navLabel === 'object' && navLabel) {
                const label = navLabel.label || navLabel.title || JSON.stringify(navLabel);
                const href = normalizeHref(navLabel.href || navLabel.url || `/${key}/${navKey}`);
                links.push({ key: navKey, label, href });
              }
            });
            if (links.length > 0) extractedCategories.push({ key, title: categoryTitle, links: links.slice(0, maxItems) });
          });
        }
        // Ensure philosophy is always included if it exists and not excluded
        const priorityCategories = knownCategories;
        extractedCategories.sort((a, b) => {
          const aPriority = priorityCategories.indexOf(a.key);
          const bPriority = priorityCategories.indexOf(b.key);
          if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
          if (aPriority !== -1) return -1;
          if (bPriority !== -1) return 1;
          return 0;
        });
        // Limit total categories
        const finalCategories = extractedCategories.slice(0, maxItems);
        setCategories(finalCategories);
      } catch (e) {
        console.error('Error loading categories:', e);
      }
    })();
    return () => { mounted = false; };
  }, [locale, maxItems]);
  if (categories.length === 0) {
    return (
      <aside className="relative overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 via-orange-50 to-stone-50 p-5 shadow-[0_10px_30px_rgba(120,53,15,0.12)]">
        <div className="pointer-events-none absolute inset-x-5 top-4 h-px bg-gradient-to-r from-transparent via-amber-500/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-5 bottom-4 h-px bg-gradient-to-r from-transparent via-amber-500/70 to-transparent" />
        <h5 className="mb-2 text-md font-bold tracking-wide text-amber-900">{title}</h5>
        <p className="text-base leading-relaxed text-amber-800/90">
          Loading categories or no categories available...
        </p>
      </aside>
    );
  }
  return (
    <aside className="relative overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 via-orange-50 to-stone-50 p-5 shadow-[0_10px_30px_rgba(120,53,15,0.12)]">
      <div className="pointer-events-none absolute inset-x-5 top-4 h-px bg-gradient-to-r from-transparent via-amber-500/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-5 bottom-4 h-px bg-gradient-to-r from-transparent via-amber-500/70 to-transparent" />
      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-100/70 px-4 py-3">
        <h5 className="text-md font-bold tracking-wide text-amber-900">{title}</h5>
        <p className="mt-1 text-xs md:base-sm text-amber-800">Sacred pathways to explore related wisdom.</p>
      </div>
      <div className="space-y-4">
        {categories.map((category) => {
          return (
            <div
              key={category.key}
              className="rounded-xl border border-orange-200 bg-white/80 p-4 shadow-[0_6px_16px_rgba(120,53,15,0.08)]"
            >
              <h6 className="mb-3 border-b border-amber-200 pb-2 text-md font-semibold text-amber-900">
                <Link
                  href={normalizeHref(`/${category.key}`)}
                  className="decoration-amber-500 underline-offset-4 transition-colors hover:text-orange-700 hover:underline"
                >
                  {category.title}
                </Link>
              </h6>
              <ul className="space-y-2">
                {category.links.map((link) => (
                  <li key={link.key} className="text-base leading-relaxed">
                    <Link
                      href={normalizeHref(link.href)}
                      className="inline-flex items-start gap-2 text-amber-800 transition-colors hover:text-orange-700"
                    >
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </aside>
  );
}