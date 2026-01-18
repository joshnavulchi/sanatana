/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getMeta } from '../../../lib/i18n';
import { parseList } from 'lib/parseList';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('mahabharata_scriptures');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('mahabharata_scriptures', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : (t('mahabharata_scriptures.title', locale) || ''),
      structure: Array.isArray(k.structure) ? k.structure : parseList(t('mahabharata_scriptures.structure', locale))
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="mahabharata_scriptures"
        title={page.title}
        breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Mahabhrata' }]}
        className="layout-sm"
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