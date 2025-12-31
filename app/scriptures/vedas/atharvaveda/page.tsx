/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

import { t, detectLocale, getMeta } from '../../../../lib/i18n';


import PageLayout from '@components/common/PageLayout';


export async function createGenerateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);

  const S = (k: string) => String(t(k, locale));

  const meta = getMeta('scriptures_vedas_atharvaveda', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined },
    alternates: { canonical: meta.canonical || meta.url || (meta.url ? meta.url : process.env.NEXT_PUBLIC_SITE_URL) || 'https://sanatanadharmam.in' }
  };
}
export default function AtharvavedaPage() {
  const locale = detectLocale();
  const S = (k: string) => String(t(k, locale));

  const page: any = (() => {
    const k: any = getMeta('scriptures_vedas_atharvaveda', undefined, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('atharvaveda.title', locale) || ''),
      summary: typeof k.summary === 'string' ? k.summary : String(t('atharvaveda.summary', locale) || ''),
      contentTitle: typeof k.contentTitle === 'string' ? k.contentTitle : String(t('atharvaveda.contentTitle', locale) || ''),
      content: typeof k.content === 'string' ? k.content : String(t('atharvaveda.content', locale) || '')
    };
  })();

  return (
    <>
      <PageLayout metaKey="scriptures_vedas_atharvaveda" title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title }]}>
        <p>{page.summary}</p>
        <section>
          <h3>{page.contentTitle}</h3>
          <p>{page.content}</p>
        </section>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
