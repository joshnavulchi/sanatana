/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('kidszone_easymantras');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('kidszone_easymantras', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('kidszone_easymantras.title', locale) || 'Easy Mantras')
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="kidszone_easymantras"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title || t('kidszone_easymantras.title', locale) }]}
        className=""
      >
        <p>Placeholder for simple mantras children can learn.</p>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */