/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('ritual_practices');
export default function Page() {
  const locale = detectLocale();
  const page: any = (() => {
    const k: any = getMeta('ritual_practices', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('ritual_practices.title', locale) || 'Rituals'),
      definition: typeof k.definition === 'string' ? k.definition : String(t('ritual_practices.intro', locale) || 'Placeholder page about rituals and ceremonies.')
    };
  })();

  return (
    <>
      <PageLayout
        metaKey="ritual_practices"
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
