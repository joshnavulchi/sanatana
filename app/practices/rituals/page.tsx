/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('practices_rituals');
export default function Page() {
  const locale = detectLocale();
  const page: any = (() => {
    const k: any = getMeta('rituals_and_practices', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('rituals.title', locale) || 'Rituals'),
      definition: typeof k.definition === 'string' ? k.definition : String(t('rituals.intro', locale) || 'Placeholder page about rituals and ceremonies.')
    };
  })();

  return (
    <>
      <PageLayout metaKey="practices_rituals" title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title }]} locale=>
      <p>{page.definition}</p>
    </PageLayout >
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
