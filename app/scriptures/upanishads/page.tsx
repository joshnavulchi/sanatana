/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getMeta } from '../../../lib/i18n';
import { parseList } from 'lib/parseList';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('upanishads_scriptures');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('upanishads_scriptures', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : (t('upanishads_scriptures.title', locale) || ''),
      list: Array.isArray(k.list) ? k.list : parseList(t('upanishads_scriptures.list', locale))
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="upanishads_scriptures"
        title={page.title}
        breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Upanishads' }]}
        className="layout-sm"
      >
        {(page.list || []).map((item: any, i: number) => (
          <div key={i}>
            {item.category ? <h2 className="h4">{item.catogory}</h2> : null}
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