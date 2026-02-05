/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

const ns: Record<string, unknown> = {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'rigveda' ? parts.shift() : 'rigveda';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { t, getMeta } from '../../../../lib/i18n';
import { useLocale } from '@/app/context/locale-context';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('scriptures_vedas_rigveda');
  const { locale } = useLocale();
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