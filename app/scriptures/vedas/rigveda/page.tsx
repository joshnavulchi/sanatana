/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

const ns = useLocaleSection('rigveda');
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  if (parts[0] === 'rigveda') parts.shift();
  let cur: any = ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { t, detectLocale, getMeta } from '../../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import useLocaleSection from '../../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('scriptures_vedas_rigveda');
export default function RigvedaPage() {
  const locale = detectLocale();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('scriptures_vedas_rigveda', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('rigveda.title') || ''),
      summary: typeof k.summary === 'string' ? k.summary : String(__getLoc('rigveda.summary') || ''),
      contentTitle: typeof k.contentTitle === 'string' ? k.contentTitle : String(__getLoc('rigveda.contentTitle') || ''),
      content: typeof k.content === 'string' ? k.content : String(__getLoc('rigveda.content') || '')
    };
  })();
  return (
    <>
      <PageLayout metaKey="scriptures_vedas_rigveda" title={page.title} breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title }]}>
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