/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Link from 'next/link';
import PageLayout from '@/app/components/common/PageLayout';
import styles from '../../styles.module.scss';
import LazyImage from '@/app/components/lazy-image/LazyImage';
import { createGenerateMetadata } from 'lib/pageUtils';
import { parseList } from 'lib/parseList';
import { t, detectLocale, getLocaleNamespaceObject, DEFAULT_LOCALE } from '../../../lib/i18n';

const _localeObj = getLocaleNamespaceObject('en', 'scriptures_bhagavathgita');
const ns = (_localeObj && ((_localeObj as any)['scriptures_bhagavathgita'] || _localeObj)) || {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'scriptures_bhagavathgita' ? parts.shift() : 'scriptures_bhagavathgita';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
export const generateMetadata = createGenerateMetadata('scriptures_bhagavathgita');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || DEFAULT_LOCALE;
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
        className="layout-md"
      >
        {/* Hero Section */}
        <div className="relative mb-16 px-6 md:px-8 py-12 md:py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative z-10 text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500" />
              <span className="text-4xl animate-pulse">🕉️</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500" />
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text">
              {page.title}
            </h1>

            <p className="text-lg md:text-xl  max-w-3xl mx-auto">
              The sacred dialogue between Lord Krishna and Arjuna on the battlefield of Kurukshetra
            </p>

            <div className="flex items-center justify-center gap-2 pt-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
            </div>
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
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
              <Link
                key={i}
                href={`/scriptures/bhagavathgita/chapter/${chapNum}`}
                className="group relative
                  bg-white
                  rounded-2xl
                  shadow-lg hover:shadow-2xl
                  border-2 border-amber-100
                  hover:border-amber-300
                  overflow-hidden
                  transition-all duration-500
                  transform hover:-translate-y-2
                  no-underline
                "
              >
                <article className="flex flex-col h-full">
                  {/* Chapter Number Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <div className="
                      flex items-center justify-center
                      w-12 h-12
                      bg-gradient-to-br from-amber-500 to-orange-600
                      text-white font-bold text-lg
                      rounded-full
                      shadow-lg
                      transform group-hover:scale-110 group-hover:rotate-12
                      transition-all duration-300
                    ">
                      {chapNum}
                    </div>
                  </div>

                  {/* Image Container */}
                  <div className="relative w-full h-56 overflow-hidden">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

                    {/* Image */}
                    <div className="absolute inset-0 transform group-hover:scale-110 transition-transform duration-700">
                      <LazyImage
                        src={imgSrc}
                        alt={imgAlt}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>

                    {/* Hover shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-10" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 space-y-3 relative">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-100/50 to-transparent rounded-bl-full" />

                    {/* Title */}
                    <h3 className="
                      relative z-10
                      text-lg md:text-xl font-bold
                      text-gray-900
                      line-clamp-2
                      group-hover:text-amber-800
                      transition-colors duration-300
                    ">
                      {chapTitle}
                    </h3>

                    {/* Excerpt */}
                    {excerpt && (
                      <p className="
                        relative z-10
                        text-sm md:text-base
                        text-gray-600
                        line-clamp-3
                        leading-relaxed
                      ">
                        {excerpt}
                      </p>
                    )}

                    {/* Read More CTA */}
                    <div className="
                      relative z-10
                      pt-4
                      flex items-center gap-2
                      text-amber-800
                      font-semibold text-sm
                      group-hover:gap-3
                      transition-all duration-300
                    ">
                      <span>Read Chapter</span>
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom border accent */}
                  <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
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