/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

const ns = useLocaleSection('kidszone_illustratedstories');
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  if (parts[0] === 'kidszone_illustratedstories') parts.shift();
  let cur: any = ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { detectLocale, t } from '../../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@/app/components/common/PageLayout';
import LazyImage from '@/app/components/lazy-image/LazyImage';
import useLocaleSection from '../../hooks/useLocaleSection';
import Link from 'next/link';
export const generateMetadata = createGenerateMetadata('kidszone_illustratedstories');

export default async function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string, l?: any) => String(t(k, l ?? locale));
  // Load stories from locale translations; fall back to English or empty array
  const rawStories = __getLoc('kidszone_illustratedstories.kids_indian_stories');
  let stories: any[] = [];
  if (Array.isArray(rawStories)) {
    stories = rawStories as any[];
  } else {
    const enStories = __getLoc('kidszone_illustratedstories.kids_indian_stories');
    stories = Array.isArray(enStories) ? (enStories as any[]) : [];
  }
  return (
    <>
      <PageLayout
        metaKey="illustrated_stories"
        title={S('kidszone_illustratedstories.title')}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: S('kidszone_illustratedstories.title') }]}
        className="layout-md"
      >
        <p>{S('kidszone_illustratedstories.description')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-6">
          {stories.map((s: any) => (
            <Link key={s.id} href={`/kidszone/illustratedstories/${s.id}`} className="card no-padding shadow hover:shadow-lg transform hover:-translate-y-1 transition no-underline">
              <article key={s.id} className="flex flex-col">
                <div className="relative w-full h-44 rounded-tl-md rounded-tr-md overflow-hidden">
                  <LazyImage src={s.imgsrc} alt={s.imgalt} fill style={{ objectFit: 'cover' }} />
                </div>
                <div className="card-details flex-1">
                  <p className="subtitle line-clamp-2">{s.title}</p>
                  {/* <div>{s.origin}</div> */}
                  <p className="description line-clamp-3">{s.summary}</p>
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
