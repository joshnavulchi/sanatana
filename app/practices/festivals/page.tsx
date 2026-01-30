/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('festivals_practices');
export default function Page() {
  const locale = detectLocale();
  const page: any = (() => {
    const k: any = getMeta('festivals_practices', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('festivals_practices.title', locale) || 'Festivals'),
      definition: typeof k.definition === 'string' ? k.definition : String(t('festivals_practices.intro', locale) || 'Placeholder page describing major festivals and observances.')
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="festivals_practices"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title }]}
        className=""
      >
        <p>{page.definition}</p>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */