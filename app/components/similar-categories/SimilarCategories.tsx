'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// removed useT usage; translations read directly from runtime locale object
import { loadLocaleNamespace } from '@lib/i18n';
import { useLocale } from '@app/context/locale-context';

interface SimilarCategoriesProps {
  title?: string;
  maxItems?: number;
  excludeCurrent?: boolean;
}

const INITIAL_VISIBLE_LINKS = 5;
const MAX_LINKS_PER_CATEGORY = 8;

const CATEGORY_ALIASES: Record<string, string> = {
  others: 'sanatanadharma',
  stotras: 'stotrasmantras'
};

const NAV_KEY_ALIASES: Record<string, string> = {
  adishankaracharya: 'adishankar',
  dailypoojas: 'dailypuja',
  parashurama: 'parasuram',
  parvathi: 'parvati',
  purans: 'puranas',
  vasistamaharshi: 'vasistamhari',
  vastushastra: 'vastu',
  vishwamitra: 'visvamitra',
  yogasanas: 'yoga'
};

const STATIC_ROUTE_PATHS = new Set<string>([
  '/',
  '/about',
  '/contact',
  '/cosmictime',
  '/diseases-curing-temples',
  '/donate',
  '/drip-irrigation-process',
  '/historical-timeline',
  '/horoscope',
  '/indian-constitution',
  '/jyotirlings',
  '/kidszone',
  '/kidszone/easymantras',
  '/kidszone/illustratedstories',
  '/kidszone/mythologicalquizzes',
  '/philosophy',
  '/philosophy/advaita',
  '/philosophy/ahimsa',
  '/philosophy/dharma',
  '/philosophy/karma',
  '/philosophy/moksha',
  '/philosophy/purushartha',
  '/philosophy/samsara',
  '/philosophy/satya',
  '/philosophy/yoga',
  '/practices',
  '/practices/dailypuja',
  '/practices/festivals',
  '/practices/rituals',
  '/practices/vastu',
  '/privacy-policy',
  '/religion-conversion',
  '/rivers-connecting',
  '/sanatanadharma',
  '/scriptures',
  '/scriptures/bhagavadgita',
  '/scriptures/itihasas',
  '/scriptures/mahabharata',
  '/scriptures/puranas',
  '/scriptures/puranas/garuda',
  '/scriptures/puranas/karma',
  '/scriptures/ramayana',
  '/scriptures/sanksheparamayanam',
  '/scriptures/upanishads',
  '/scriptures/vedas',
  '/shakti-peethas',
  '/stotrasmantras',
  '/stotrasmantras/dailyPrayers',
  '/stotrasmantras/devi',
  '/stotrasmantras/ganesh',
  '/stotrasmantras/hanuman',
  '/stotrasmantras/shiva',
  '/stotrasmantras/vishnu',
  '/stories',
  '/stories/adishankar',
  '/stories/bhishma',
  '/stories/bramha',
  '/stories/karna',
  '/stories/krishna',
  '/stories/lakshmi',
  '/stories/parasuram',
  '/stories/parvati',
  '/stories/puranic',
  '/stories/ramanamaharshi',
  '/stories/saraswati',
  '/stories/shiva',
  '/stories/vasistamhari',
  '/stories/visvamitra',
  '/stories/vishnu',
  '/temples-destroyed',
  '/temples-in-india',
  '/terms-of-service',
  '/timelapse',
  '/usa-strategies',
  '/world-transformation'
]);

const DYNAMIC_ROUTE_PATTERNS = [
  /^\/scriptures\/bhagavadgita\/part\/[^/]+$/,
  /^\/scriptures\/mahabharata\/parva\/[^/]+$/,
  /^\/scriptures\/ramayana\/kandas\/[^/]+$/
];

function normalizeHref(href?: string) {
  if (!href) return '#';
  let out = String(href);
  if (!out.startsWith('/')) out = '/' + out;
  out = out.replace(/\/others\//g, '/');
  out = out.replace(/\/+/g, '/');
  return out === '/' ? '/' : out;
}

function isKnownRoute(pathname: string) {
  return STATIC_ROUTE_PATHS.has(pathname) || DYNAMIC_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));
}

function normalizeNavKey(value: string) {
  return NAV_KEY_ALIASES[value] || value;
}

function resolveCategoryHref(categoryKey: string) {
  const category = CATEGORY_ALIASES[categoryKey] || categoryKey;
  const direct = normalizeHref(`/${category}`);
  return isKnownRoute(direct) ? direct : '/';
}

function resolveSimilarHref(categoryKey: string, navKey: string, rawHref?: string) {
  const category = CATEGORY_ALIASES[categoryKey] || categoryKey;
  const normalizedNavKey = normalizeNavKey(navKey);
  const candidates: string[] = [];

  if (rawHref && typeof rawHref === 'string') {
    const trimmed = rawHref.trim();
    if (trimmed.startsWith('/')) {
      candidates.push(trimmed);
    } else if (trimmed && trimmed !== '#') {
      const normalizedRaw = normalizeNavKey(trimmed);
      candidates.push(`/${category}/${normalizedRaw}`);
      candidates.push(`/${normalizedRaw}`);
    }
  }

  if (category === 'scriptures') {
    if (/^bhagavadgita_part_\d+$/i.test(normalizedNavKey)) {
      candidates.push(`/scriptures/bhagavadgita/part/${normalizedNavKey}`);
    }
    if (/_kanda$/i.test(normalizedNavKey)) {
      candidates.push(`/scriptures/ramayana/kandas/${normalizedNavKey}`);
    }
    if (/_parva_/i.test(normalizedNavKey) || /_parva$/i.test(normalizedNavKey)) {
      candidates.push(`/scriptures/mahabharata/parva/${normalizedNavKey}`);
    }
  }

  candidates.push(`/${category}/${normalizedNavKey}`);
  candidates.push(`/${normalizedNavKey}`);

  const uniqueCandidates = Array.from(new Set(candidates.map((candidate) => normalizeHref(candidate))));
  const matched = uniqueCandidates.find((candidate) => isKnownRoute(candidate));
  return matched || uniqueCandidates[0] || '/';
}

function pathSegments(pathname: string) {
  return pathname.split('/').filter(Boolean);
}

function getSimilarityScore(linkHref: string, currentPath: string) {
  const normalizedLink = normalizeHref(linkHref);
  const normalizedCurrent = normalizeHref(currentPath);

  if (normalizedLink === normalizedCurrent) return -1000;

  const linkSegs = pathSegments(normalizedLink);
  const currentSegs = pathSegments(normalizedCurrent);

  let commonPrefix = 0;
  const minLength = Math.min(linkSegs.length, currentSegs.length);
  for (let index = 0; index < minLength; index += 1) {
    if (linkSegs[index] !== currentSegs[index]) break;
    commonPrefix += 1;
  }

  const sameSection = linkSegs[0] && currentSegs[0] && linkSegs[0] === currentSegs[0] ? 15 : 0;
  const depthPenalty = Math.abs(linkSegs.length - currentSegs.length);
  const ancestryBoost =
    normalizedLink.startsWith(`${normalizedCurrent}/`) || normalizedCurrent.startsWith(`${normalizedLink}/`) ? 8 : 0;

  return commonPrefix * 20 + sameSection + ancestryBoost - depthPenalty;
}

export default function SimilarCategories({
  title = 'Explore More',
  maxItems = 100,
  excludeCurrent = true
}: SimilarCategoriesProps) {
  const { locale } = useLocale();
  const pathname = normalizeHref(usePathname() || '/');
  const [categories, setCategories] = useState<Array<{ key: string; title: string; links: Array<{ key: string; label: string; href: string }> }>>([]);
  const [expandedByCategory, setExpandedByCategory] = useState<Record<string, boolean>>({});
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
                links.push({ key: navKey, label: navLabel, href: resolveSimilarHref(key, navKey) });
              } else if (typeof navLabel === 'object' && navLabel) {
                const label = navLabel.label || navLabel.title || JSON.stringify(navLabel);
                const href = resolveSimilarHref(key, navKey, navLabel.href || navLabel.url);
                links.push({ key: navKey, label, href });
              }
            });
            if (links.length > 0) {
              extractedCategories.push({
                key,
                title: categoryTitle,
                links: links
                  .sort((first, second) => getSimilarityScore(second.href, pathname) - getSimilarityScore(first.href, pathname))
                  .slice(0, Math.min(MAX_LINKS_PER_CATEGORY, maxItems))
              });
            }
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
        const filteredCategories = excludeCurrent
          ? extractedCategories
            .map((category) => ({
              ...category,
              links: category.links.filter((link) => normalizeHref(link.href) !== pathname)
            }))
            .filter((category) => category.links.length > 0)
          : extractedCategories;
        const finalCategories = filteredCategories.slice(0, maxItems);
        setCategories(finalCategories);
      } catch (e) {
        console.error('Error loading categories:', e);
      }
    })();
    return () => { mounted = false; };
  }, [excludeCurrent, locale, maxItems, pathname]);
  if (categories.length === 0) {
    return (
      <aside className="relative overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 via-orange-50 to-stone-50 p-5 shadow-[0_10px_30px_rgba(120,53,15,0.12)]">
        <div className="pointer-events-none absolute inset-x-5 top-4 h-px bg-gradient-to-r from-transparent via-amber-500/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-5 bottom-4 h-px bg-gradient-to-r from-transparent via-amber-500/70 to-transparent" />
        <h5 className="mb-2 text-xl md:text-lg font-bold tracking-wide text-amber-900">{title}</h5>
        <p className="text-base md:text-md leading-relaxed text-amber-800/90">
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
        <h5 className="text-xl md:text-lg font-bold tracking-wide text-amber-900">{title}</h5>
        <p className="mt-1 text-base md:text-md md:text-sm text-amber-800">Sacred pathways to explore related wisdom.</p>
      </div>
      <div className="space-y-4">
        {categories.map((category) => {
          return (
            <div
              key={category.key}
              className="rounded-xl border border-orange-200 bg-white/80 p-4 shadow-[0_6px_16px_rgba(120,53,15,0.08)]"
            >
              <h6 className="mb-3 border-b border-amber-200 pb-2 text-lg md:text-md font-semibold text-amber-900">
                <Link
                  href={resolveCategoryHref(category.key)}
                  className="decoration-amber-500 underline-offset-4 transition-colors hover:text-orange-700 hover:underline"
                >
                  {category.title}
                </Link>
              </h6>
              <ul className="space-y-2">
                {(expandedByCategory[category.key] ? category.links : category.links.slice(0, INITIAL_VISIBLE_LINKS)).map((link) => (
                  <li key={link.key} className="text-base md:text-md leading-relaxed">
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
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-amber-200/80 pt-3">
                {category.links.length > INITIAL_VISIBLE_LINKS && (
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedByCategory((previous) => ({
                        ...previous,
                        [category.key]: !previous[category.key]
                      }));
                    }}
                    aria-expanded={Boolean(expandedByCategory[category.key])}
                    className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-semibold tracking-wide text-amber-900 transition-colors hover:bg-amber-100"
                  >
                    <span aria-hidden="true">{expandedByCategory[category.key] ? '−' : '+'}</span>
                    {expandedByCategory[category.key] ? 'Show less' : `More (${category.links.length - INITIAL_VISIBLE_LINKS})`}
                  </button>
                )}
                <Link
                  href={resolveCategoryHref(category.key)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-orange-300 bg-orange-100 px-3 py-1.5 text-sm font-semibold tracking-wide text-orange-900 transition-colors hover:bg-orange-200"
                >
                  View all
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}