/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getMeta, locales } from '../../../lib/i18n';
import { parseList } from 'lib/parseList';
import { resolveLocaleFromHeaders, createcreateGenerateMetadata } from 'lib/pageUtils';
import Image from 'next/image';
import Link from 'next/link';
const en = locales.en;

export const generateMetadata = createcreateGenerateMetadata('scriptures_bhagavadgita');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));

  const page: any = (() => {
    const k: any = getMeta('scriptures_bhagavadgita', {}, locale) || {};
    const chapters = (k.chapters && Array.isArray(k.chapters)) ? k.chapters : parseList(t('bhagavadgita.chapters', locale));
    return {
      title: typeof k.title === 'string' ? k.title : String(t('bhagavadgita.title', locale) || ''),
      chapters
    };
  })();
  return (
    <>
      <main className="content-wrapper lg page-space-xl">
        <h2>{page.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            const enChapter = (en as any)?.bhagavadgita?.chapters?.[Number(chapNum) - 1];
            const enAi0 = enChapter?.ai_images && enChapter.ai_images[0] ? enChapter.ai_images[0] : undefined;
            const imgSrc = item?.ai_images?.[0]?.imageSrc || enAi0?.imageSrc || '/og/gita.png';
            const imgAlt = item?.ai_images?.[0]?.alt || enAi0?.alt || `${chapTitle}`;

            return (
              <Link key={i} href={`/scriptures/gita/chapter/${chapNum}`} className="card block no-underline">
                <article className="h-full rounded-md! shadow hover:shadow-lg transform hover:-translate-y-1 transition flex flex-col">
                  <div className="relative w-full h-44 rounded-md overflow-hidden">
                    <Image src={imgSrc} alt={imgAlt} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="card-details flex-1">
                    <p className="title line-clamp-1">{`Chapter ${chapNum}: ${chapTitle}`}</p>
                    {excerpt ? <p className="description line-clamp-3">{excerpt}</p> : null}
                  </div>
                  <div>
                    <small className="inline-block font-medium underline">Read chapter</small>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </main >
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */