/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { detectLocale, t } from '../../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
import Image from 'next/image';
export const generateMetadata = createGenerateMetadata('kidsZone_illustratedStories');
export default async function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string, l?: any) => String(t(k, l ?? locale));
  return (
    <>
      <PageLayout metaKey="kidsZone_illustratedStories" title={S('illustratedStories.title')} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: String(t('illustratedStories.title')) }]} locale=>
      <p>{S('illustratedStories.description')}</p>
      <div className="card grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-6">
        {(t('illustratedStories.kids_indian_stories', locale) as any[]).map((s: any) => (
          <article key={s.id} className="h-full  shadow hover:shadow-lg transform hover:-translate-y-1 transition flex flex-col">
            <div className="relative w-full h-44 rounded-md overflow-hidden">
              <Image src={s.imgSrc} alt={s.imgAlt} fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="card-details flex-1">
              <p className="title line-clamp-1">{s.title}</p>
              {/* <div>{s.origin}</div> */}
              <p className="description line-clamp-3">{s.summary}</p>
            </div>
          </article>
        ))}
      </div>
    </PageLayout >
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
