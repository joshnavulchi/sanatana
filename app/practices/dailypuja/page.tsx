/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import PageLayout from '@/app/components/common/PageLayout';
import { createGenerateMetadata } from 'lib/pageUtils';
import { getMeta, detectLocale, t, getLocaleObject } from '../../../lib/i18n';
export const generateMetadata = createGenerateMetadata('dailypuja_practices');

const _localeObj = getLocaleObject();
const ns = (_localeObj && ((_localeObj as any)['dailypuja_practices'] || ((_localeObj as any).sharable_strings && (_localeObj as any).sharable_strings['dailypuja_practices']))) || {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  if (parts[0] === 'dailypuja_practices') parts.shift();
  let cur: any = ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
export default function Page() {
  const locale = detectLocale();
  const page: any = (() => {
    const k: any = getMeta('dailypuja_practices', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('dailypuja_practices.title') || ''),
      definition: typeof k.definition === 'string' ? k.definition : String(__getLoc('dailypuja_practices.intro') || 'Placeholder page for daily puja routines and short guides.')
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="dailypuja_practices"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title || '' }]}
        className=""
      >
        <p>{page.definition}</p>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */