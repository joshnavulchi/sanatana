/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getMeta } from '../../../lib/i18n';

import { resolveLocaleFromHeaders, createcreateGenerateMetadata } from 'lib/pageUtils';



export const generateMetadata = createcreateGenerateMetadata('scriptures_mahabharata');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));

  const page: any = (() => {
    const k: any = getMeta('scriptures_mahabharata', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : (t('mahabharata.title', locale) || ''),
      structure: Array.isArray(k.structure) ? k.structure : (t('mahabharata.structure', locale) || [])
    };
  })();

  return (
    <>
      <main className="content-wrapper md page-space-xl">
        
        <h2>{page.title}</h2>
        {(page.structure || []).map((item: any, i: number) => (
          <div key={i}>
            {item.name ? <p>{item.parva}. {item.name}</p> : null}
            {item.summary ?
              <p>{item.summary}</p> :
              <pre>{JSON.stringify(item)}</pre>}
            {item.key_events ? <p><b>Events: </b>{JSON.stringify(item.key_events)}</p> : null}
            {item.main_characters ? <p><b>Characters: </b>{JSON.stringify(item.main_characters)}</p> : null}
          </div>
        ))}
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
