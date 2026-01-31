/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('vastu_practices');
export default function Page() {
  const locale = detectLocale();
  const page: any = (() => {
    const k: any = getMeta('vastu_practices', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('vastu_practices.title', locale) || 'Vastu'),
      definition: typeof k.definition === 'string' ? k.definition : String(t('vastu_practices.intro', locale) || 'Placeholder page about Vastu principles.')
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="vastu_practices"
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