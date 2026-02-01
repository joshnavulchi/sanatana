/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Link from 'next/link';
import PageLayout from '@/app/components/common/PageLayout';
import LazyImage from '@/app/components/lazy-image/LazyImage';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import { parseList } from 'lib/parseList';
import { t, detectLocale, getLocaleNamespaceObject } from '../../../lib/i18n';

const _localeObj = getLocaleNamespaceObject('en', 'scriptures_bhagavathgita');
const ns = (_localeObj && ((_localeObj as any)['scriptures_bhagavathgita'] || _localeObj)) || {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  if (parts[0] === 'scriptures_bhagavathgita') parts.shift();
  let cur: any = ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
export const generateMetadata = createGenerateMetadata('scriptures_bhagavathgita');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const page: any = (() => {
    const chapters = parseList(__getLoc('scriptures_bhagavathgita.chapters'));
    return {
      title: String(__getLoc('scriptures_bhagavathgita.title') || ''),
      chapters
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="scriptures_bhagavathgita"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title }]}
        className={`layout-md`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-6">
          {(page.chapters || []).map((item: any, i: number) => {
            // Determine chapter number robustly: prefer explicit numeric fields, else fallback to index+1
            const chapRaw = item?.chapter ?? item?.chapter_number;
            let chapNumVal = Number(chapRaw);
            if (!Number.isFinite(chapNumVal) || chapNumVal < 1) {
              chapNumVal = i + 1;
            }
            const chapNum = String(Math.trunc(chapNumVal));
            const chapTitle = item.name || item.title || `Chapter ${chapNum}`;
            const excerpt = item.introduction?.summary || item.summary || '';
            // Prefer the chapter's localized ai_images[0], otherwise fall back to English canonical ai_images[0]
            const enChapter = (locale as any)?.bhagavathgita?.chapters?.[Number(chapNum) - 1];
            const enAi0 = enChapter?.ai_images && enChapter.ai_images[0] ? enChapter.ai_images[0] : undefined;
            const imgSrc = item?.ai_images?.[0]?.imagesrc || enAi0?.imagesrc || '/og/bhagavathgita.png';
            const imgAlt = item?.ai_images?.[0]?.alt || enAi0?.alt || `${chapTitle}`;
            return (
              <Link key={i} href={`/scriptures/bhagavathgita/chapter/${chapNum}`} className="card mt-0! mb-0! no-padding shadow hover:shadow-lg transform hover:-translate-y-1 transition no-underline">
                <article className="flex flex-col">
                  <div className="relative w-full h-44 rounded-tl-md rounded-tr-md overflow-hidden">
                    <LazyImage src={imgSrc} alt={imgAlt} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="card-details flex-1">
                    <p className="subtitle line-clamp-2">{`Chapter ${chapNum}: ${chapTitle}`}</p>
                    {excerpt ? <p className="description line-clamp-3">{excerpt}</p> : null}
                    <small className="inline-block font-medium underline">Read chapter</small>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */