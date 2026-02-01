/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

const ns = useLocaleSection('ritual_practices');
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'ritual_practices' ? parts.shift() : 'ritual_practices';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('ritual_practices');
export default function Page() {
  const locale = detectLocale();
  const page: any = (() => {
    const k: any = getMeta('ritual_practices', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('ritual_practices.title') || 'Rituals'),
      definition: typeof k.definition === 'string' ? k.definition : String(__getLoc('ritual_practices.intro') || 'Placeholder page about rituals and ceremonies.')
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
