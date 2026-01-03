/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('dailypuja_practices');
export default function Page() {
  const locale = detectLocale();
  const page: any = (() => {
    const k: any = getMeta('dailypuja_practices', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('dailypuja_practices.title', locale) || ''),
      definition: typeof k.definition === 'string' ? k.definition : String(t('dailypuja_practices.intro', locale) || 'Placeholder page for daily puja routines and short guides.')
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="dailypuja_practices"
        title={page.title}
        breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || '' }]}
        className=""
      >
        <p>{page.definition}</p>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */