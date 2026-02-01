/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

const ns = useLocaleSection('festivals_practices');
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'festivals_practices' ? parts.shift() : 'festivals_practices';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('festivals_practices');
export default function Page() {
  const locale = detectLocale();
  const page: any = (() => {
    const k: any = getMeta('festivals_practices', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('festivals_practices.title') || 'Festivals'),
      definition: typeof k.definition === 'string' ? k.definition : String(__getLoc('festivals_practices.intro') || 'Placeholder page describing major festivals and observances.')
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="festivals_practices"
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