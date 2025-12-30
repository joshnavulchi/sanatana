/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createcreateGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createcreateGenerateMetadata('practices_vastu');
export default function Page() {
  const locale = detectLocale();
  const page: any = (() => {
    const k: any = getMeta('vastu_doshas_and_remedies', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('vastu.title', locale) || 'Vastu'),
      definition: typeof k.definition === 'string' ? k.definition : String(t('vastu.intro', locale) || 'Placeholder page about Vastu principles.')
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