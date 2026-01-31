/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

const ns = useLocaleSection('scriptures_vedas');
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  if (parts[0] === 'scriptures_vedas') parts.shift();
  let cur: any = ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { t, detectLocale, getMeta } from '../../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import { parseList } from 'lib/parseList';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('scriptures_vedas');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('scriptures_vedas', {}, locale) || {};
    const structure = k.structure?.fourvedas ?? parseList(__getLoc('scriptures_vedas.structure.fourvedas'));
    const origin = typeof k.origin === 'object' ? k.origin : (__getLoc('scriptures_vedas.origin') || {});
    const authorship = typeof k.authorship === 'object' ? k.authorship : (__getLoc('scriptures_vedas.authorship') || {});
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('scriptures_vedas.title') || ''),
      intro: typeof k.intro === 'string' ? k.intro : String(__getLoc('scriptures_vedas.intro') || ''),
      origin,
      authorship,
      structure
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="scriptures_vedas"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Vedas' }]}
        className="layout-sm"
      >
        <p>{page.intro}</p>
        <div>
          <p><b>Meaning: </b>{page.origin}</p>
          <p><b>Period: </b>{page.origin}</p>
          <p><b>Transmission: </b>{page.origin}</p>
        </div>
        <div>
          <p><b>Nature: </b>{page.authorship}</p>
          <p><b>Process: </b>{page.authorship}</p>
          <p><b>Compiler: </b>{page.authorship}</p>
        </div>
        {(page.structure || []).map((item: any, i: number) => (
          <div key={i}>
            <p><b>Name: </b>{item.Name}</p>
            <p><b>Content: </b>{item.Content}</p>
            <p><b>Features: </b>{item.Features}</p>
          </div>
        ))}
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */