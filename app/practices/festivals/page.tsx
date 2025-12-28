/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t } from '../../../lib/i18n';



import PageLayout from '@components/common/PageLayout';

export async function createGenerateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);

  const S = (k: string) => String(t(k, locale));

  const meta = getMeta('practices_festivals', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined },
    alternates: { canonical: meta.canonical || meta.url || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in' }
  };
}
export default function Page() {
  const locale = detectLocale();

  const page: any = (() => {
    const k: any = getMeta('practices_festivals', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('festivals.title', locale) || 'Festivals'),
      intro: typeof k.intro === 'string' ? k.intro : String(t('festivals.intro', locale) || 'Placeholder page describing major festivals and observances.')
    };
  })();

  return (
    <>
      <PageLayout title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title }]} locale={(typeof locale !== 'undefined' ? locale : undefined)}>
        
        <p>{page.intro}</p>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
