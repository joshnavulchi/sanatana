/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

import { getLocaleNamespaceObject } from '@lib/i18n';
import { t, DEFAULT_LOCALE } from '@lib/i18n';
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import PageLayout from '@components/common/PageLayout';
import LazyImage from '@components/lazyimage';
import Link from 'next/link';
export const generateMetadata = createGenerateMetadata('illustrated_stories');

export default function Page({ searchParams }: any) {
  const locale = DEFAULT_LOCALE;
  const S = (k: string, l?: any) => String(t(k, l ?? locale));
  // Load stories from locale translations; fall back to English or empty array
  const nsObj: any = getLocaleNamespaceObject(locale, 'illustrated_stories')?.illustrated_stories || {};
  const stories: any[] = Array.isArray(nsObj.kids_indian_stories) ? nsObj.kids_indian_stories : [];
  return (
    <>
      <StructuredData metaKey="illustrated_stories" />
      <PageLayout
        metaKey="illustrated_stories"
        title={nsObj.title || S('illustrated_stories.title')}
        description={nsObj.description || S('illustrated_stories.description')}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: nsObj.title || S('illustrated_stories.title') }]}
        className="layout-md"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {stories.map((s: any) => (
            <Link key={s.id} href={`/kidszone/illustratedstories/${s.id}`} className="group block rounded-xl overflow-hidden shadow-lg border border-pink-200 bg-gradient-to-br from-pink-50 to-yellow-50 hover:shadow-2xl transition-transform hover:-translate-y-1">
              <article className="flex flex-col h-full">
                <div className="relative w-full h-48 bg-pink-100 flex items-center justify-center">
                  <LazyImage src={s.imgsrc} alt={s.imgalt} fill style={{ objectFit: 'cover' }} className="transition-transform group-hover:scale-105 duration-300" />
                </div>
                <div className="flex-1 flex flex-col p-4">
                  <h3 className="text-xl md:text-lg font-bold text-pink-700 mb-1 line-clamp-2">{s.title}</h3>
                  <div className="text-xl md:text-lg text-pink-500 mb-2">{s.origin}</div>
                  <p className="text-xl md:text-lg text-gray-700 mb-2 line-clamp-3">{s.summary}</p>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {Array.isArray(s.themes) && s.themes.map((theme: string, idx: number) => (
                      <span key={idx} className="bg-yellow-200 text-yellow-900 rounded-full px-3 py-1 text-base md:text-md font-semibold">{theme}</span>
                    ))}
                  </div>
                  <div className="mt-2 text-xl md:text-lg text-green-700 italic">Moral: {s.moral}</div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
