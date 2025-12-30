/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('practices_festivals');
export default function Page() {
  const locale = detectLocale();
  const page: any = (() => {
    const k: any = getMeta('festivals_and_practices', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('festivals.title', locale) || 'Festivals'),
      definition: typeof k.definition === 'string' ? k.definition : String(t('festivals.intro', locale) || 'Placeholder page describing major festivals and observances.')
    };
  })();
  return (
    <>
      <PageLayout title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title }]} locale={(typeof locale !== 'undefined' ? locale : undefined)}>
        <p>{page.definition}</p>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */