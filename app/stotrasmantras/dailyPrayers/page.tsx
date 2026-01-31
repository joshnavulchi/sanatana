/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getMeta } from '../../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('dailyPrayers_stotrasmantras');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('dailyPrayers_stotrasmantras', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('dailyPrayers_stotrasmantras.title', locale) || 'Daily Prayers'),
      items: Array.isArray(k.items) ? k.items : []
    };
  })();

  return (
    <>
      <PageLayout
        metaKey="dailyPrayers_stotrasmantras"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: (page.title || '') }]}
        className=""
      >
        <p>Placeholder for daily prayers and short mantras.</p>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */