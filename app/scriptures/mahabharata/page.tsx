/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import PageLayout from '@/app/components/common/PageLayout';
import styles from '../../styles.module.scss';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import { parseList } from 'lib/parseList';
import { t, detectLocale, getMeta, getLocaleNamespaceObject } from '../../../lib/i18n';
export const generateMetadata = createGenerateMetadata('scriptures_mahabharata');

const _localeObj = getLocaleNamespaceObject('en', 'scriptures_mahabharata');
const ns = (_localeObj && ((_localeObj as any)['scriptures_mahabharata'] || _localeObj)) || {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'scriptures_mahabharata' ? parts.shift() : 'scriptures_mahabharata';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('scriptures_mahabharata', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : (__getLoc('scriptures_mahabharata.title') || ''),
      structure: Array.isArray(k.structure) ? k.structure : parseList(__getLoc('scriptures_mahabharata.structure'))
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="scriptures_mahabharata"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Mahabhrata' }]}
        className="layout-md"
      >
        {(page.structure || []).map((item: any, i: number) => (
          <div key={i}>
            {item.name ? <p className="h4">{item.parva}. {item.name}</p> : null}
            {item.summary ?
              <p>{item.summary}</p> :
              <pre>{JSON.stringify(item)}</pre>}
            {item.key_events ? <p><b>Events: </b>{JSON.stringify(item.key_events)}</p> : null}
            {item.main_characters ? <p><b>Characters: </b>{JSON.stringify(item.main_characters)}</p> : null}
          </div>
        ))}
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */