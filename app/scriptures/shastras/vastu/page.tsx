/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getMeta } from '../../../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from '../../../../lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('scriptures_shastras_vastu');
export default async function VastuPage({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  return (
    <>
      <PageLayout metaKey="about" title={t('shastras.vastu.title')} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: t('shastras.vastu.title') }]} locale={(typeof locale !== 'undefined' ? locale : undefined)}>
        <p>{await t('shastras.vastu.summary', locale)}</p>
        <section>
          <h3>{await t('shastras.vastu.title', locale)}</h3>
          <p>{await t('shastras.vastu.content', locale)}</p>
        </section>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */