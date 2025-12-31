/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('practices_dailypuja');
export default function Page() {
  const locale = detectLocale();
  const page: any = (() => {
    const k: any = getMeta('daily_pujas', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('dailypuja.title', locale) || ''),
      definition: typeof k.definition === 'string' ? k.definition : String(t('dailypuja.intro', locale) || 'Placeholder page for daily puja routines and short guides.')
    };
  })();
  return (
    <>
      <PageLayout metaKey="practices_dailypuja" title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || '' }]} locale=>
      <p>{page.definition}</p>
    </PageLayout >
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */