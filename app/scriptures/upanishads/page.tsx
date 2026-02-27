/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

import { t, detectLocale, getMeta, DEFAULT_LOCALE, getLocaleNamespaceObject } from '@lib/i18n';
import { parseList } from '@lib/parseList';
import { createGenerateMetadata } from '@lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
const _localeObj = getLocaleNamespaceObject('scriptures_upanishads');
const ns: Record<string, unknown> = (_localeObj && ((_localeObj as any)['scriptures_upanishads'] || _localeObj)) || {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'scriptures_upanishads' ? parts.shift() : 'scriptures_upanishads';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
export const generateMetadata = createGenerateMetadata('scriptures_upanishads');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || DEFAULT_LOCALE;
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('scriptures_upanishads', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : (__getLoc('scriptures_upanishads.title') || ''),
      list: Array.isArray(k.list) ? k.list : parseList(__getLoc('scriptures_upanishads.list'))
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="scriptures_upanishads"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Upanishads' }]}
        className="layout-md"
      >
        {(page.list || []).map((item: any, i: number) => (
          <div key={i}>
            {item.category ? <h2 className="text-2xl md:text-3xl">{item.category}</h2> : null}
            {item.description ?
              <p>{item.description}</p> :
              <ul role="list" className="list-disc">
                {item.list && item.list.map((list: any, j: number) => (
                  <li key={j}>
                    <p><b>Name:</b> {list.name}</p>
                    <p><b>Veda:</b> {list.veda}</p>
                    <p><b>Type:</b> {list.type}</p>
                    <p><b>Summary:</b> {list.summary}</p>
                  </li>
                ))}
              </ul>}
          </div>
        ))}
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */