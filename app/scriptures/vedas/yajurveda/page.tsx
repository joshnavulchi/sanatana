/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

const ns = useLocaleSection('yajurveda');
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'yajurveda' ? parts.shift() : 'yajurveda';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};

import { t, detectLocale, getMeta } from '../../../../lib/i18n';

import { createGenerateMetadata } from 'lib/pageUtils';

import useLocaleSection from '../../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';


export const generateMetadata = createGenerateMetadata('scriptures_vedas_yajurveda');
export default function YajurvedaPage() {
  const locale = detectLocale();

  const S = (k: string) => String(t(k, locale));

  const page: any = (() => {
    const k: any = getMeta('scriptures_vedas_yajurveda', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('yajurveda.title') || ''),
      summary: typeof k.summary === 'string' ? k.summary : String(__getLoc('yajurveda.summary') || ''),
      contentTitle: typeof k.contentTitle === 'string' ? k.contentTitle : String(__getLoc('yajurveda.contentTitle') || ''),
      content: typeof k.content === 'string' ? k.content : String(__getLoc('yajurveda.content') || '')
    };
  })();

  return (
    <>
      <PageLayout metaKey="scriptures_vedas_yajurveda" title={page.title} breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title }]}>
        <p>{page.summary}</p>
        <section>
          <h2 className="h4">{page.contentTitle}</h2>
          <p>{page.content}</p>
        </section>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
