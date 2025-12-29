/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getMeta } from '../../../lib/i18n';
import { resolveLocaleFromHeaders, createcreateGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createcreateGenerateMetadata('stotrasmantras_dailyPrayers');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('stotrasmantras_dailyPrayers', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('daily_prayers.title', locale) || 'Daily Prayers'),
      items: Array.isArray(k.items) ? k.items : []
    };
  })();
  return (
    <>
      <PageLayout title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: (page.title || '') }]} locale={(typeof locale !== 'undefined' ? locale : undefined)}>
        <p>Placeholder for daily prayers and short mantras.</p>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */