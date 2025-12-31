/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getMeta } from '../../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('scriptures_vedas_samaveda');
export default function SamavedaPage() {
  const locale = detectLocale();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('scriptures_vedas_samaveda', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('samaveda.title', locale) || ''),
      summary: typeof k.summary === 'string' ? k.summary : String(t('samaveda.summary', locale) || ''),
      contentTitle: typeof k.contentTitle === 'string' ? k.contentTitle : String(t('samaveda.contentTitle', locale) || ''),
      content: typeof k.content === 'string' ? k.content : String(t('samaveda.content', locale) || '')
    };
  })();
  return (
    <>
      <PageLayout metaKey="scriptures_vedas_samaveda" title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title }]} locale=>
      <p>{page.summary}</p>
      <section>
        <h3>{page.contentTitle}</h3>
        <p>{page.content}</p>
      </section>
    </PageLayout >
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
