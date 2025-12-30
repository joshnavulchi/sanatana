/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createcreateGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createcreateGenerateMetadata('kidsZone_easymantras');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('kidsZone_easymantras', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('stories..title', locale) || 'Easy Mantras')
    };
  })();
  return (
    <>
      <PageLayout title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || t('kidsZone.easymantras.title', locale) }]} locale={(typeof locale !== 'undefined' ? locale : undefined)}>
        <p>Placeholder for simple mantras children can learn.</p>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */