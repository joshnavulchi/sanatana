'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
// removed useT usage; translations read directly from runtime locale object
import { loadLocaleNamespace } from '../../../lib/i18n';
import { useLocale } from '../../context/locale-context';

interface SimilarCategoriesProps {
  currentCategory?: string; // e.g., 'philosophy', 'scriptures', 'kidszone'
  title?: string;
  maxItems?: number;
  excludeCurrent?: boolean;
}

export default function SimilarCategories({
  currentCategory,
  title = 'Explore More',
  maxItems = 6,
  excludeCurrent = true
}: SimilarCategoriesProps) {
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
        const navData = sharableStrings?.header || sharableStrings?.footer || (locObj as any)?.header || {};
        // Extract categories with their navigation items
        const extractedCategories: Array<{ key: string; title: string; links: Array<{ key: string; label: string; href: string }> }> = [];
        // Define all known categories to ensure they're included
        const knownCategories = ['philosophy', 'scriptures', 'kidszone', 'practices', 'stories'];

        Object.entries(navData).forEach(([key, value]: [string, any]) => {
          console.log(`Checking key: ${key}, type: ${typeof value}, has nav: ${value?.nav ? 'YES' : 'NO'}`);

          // Include ALL categories with nav property - not just specific ones
          if (typeof value === 'object' && value !== null && value.nav && typeof value.nav === 'object') {
            // Skip current category if excludeCurrent is true
            if (excludeCurrent && key === currentCategory) {
              console.log(`❌ Skipping current category: ${key}`);
              return;
            }
            const categoryTitle = value.title || key;
            const links: Array<{ key: string; label: string; href: string }> = [];
            // Extract navigation items from the category
            Object.entries(value.nav).forEach(([navKey, navLabel]: [string, any]) => {
              if (typeof navLabel === 'string') {
                links.push({
                  key: navKey,
                  label: navLabel,
                  href: `/${key}/${navKey}`
                });
              }
            });
            if (links.length > 0) {
              extractedCategories.push({
                key,
                title: categoryTitle,
                links: links.slice(0, 4) // Limit to 4 links per category
              });
            }
          }
        });
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
  }, [locale, currentCategory, maxItems, excludeCurrent]);
  if (categories.length === 0) {
    return (
      <aside className="p-4">
        <h5>{title}</h5>
        <p>Loading categories or no categories available...</p>
      </aside>
    );
  }
  return (
    <aside>
      <h5 className="text-2xl text-gray-900 dark:text-amber-100">{title}</h5>
      <div>
        {categories.map((category) => {
          return (
            <div key={category.key} className="shadown-sm p-4">
              <h6 className="text-lg mb-3 text-gray-800 dark:text-amber-100">
                <Link href={`/${category.key}`} className="hover:underline">
                  {category.title}
                </Link>
              </h6>
              <ul>
                {category.links.map((link) => (
                  <li key={link.key} className="text-gray-700 dark:text-amber-100">
                    <Link href={link.href} className="hover:underline">
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