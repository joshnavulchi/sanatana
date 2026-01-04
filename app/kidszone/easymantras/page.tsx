/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('easymantras_kidsZone');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('easymantras_kidsZone', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('stories..title', locale) || 'Easy Mantras')
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="easymantras_kidsZone"
        title={page.title}
        breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || t('kidsZone.easymantras.title', locale) }]}
        className=""
      >
        <p>Placeholder for simple mantras children can learn.</p>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */