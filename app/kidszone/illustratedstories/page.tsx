/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { detectLocale, t } from '../../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
import Image from 'next/image';
import Link from 'next/link';
export const generateMetadata = createGenerateMetadata('illustrated_stories');

export default async function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string, l?: any) => String(t(k, l ?? locale));
  return (
    <>
      <PageLayout
        metaKey="illustrated_stories"
        title={S('illustrated_stories.title')}
        breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: String(t('illustrated_stories.title')) }]}
        className="layout-md"
      >
        <p>{S('illustrated_stories.description')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-6">
          {(t('illustrated_stories.kids_indian_stories', locale) as any[]).map((s: any) => (
            <Link key={s.id} href={`/kidszone/illustratedstories/${s.id}`} className="card no-padding shadow hover:shadow-lg transform hover:-translate-y-1 transition no-underline">
              <article key={s.id} className="flex flex-col">
                <div className="relative w-full h-44 rounded-tl-md rounded-tr-md overflow-hidden">
                  <Image src={s.imgsrc} alt={s.imgalt} fill style={{ objectFit: 'cover' }} />
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
