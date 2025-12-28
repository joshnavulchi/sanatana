/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getMeta } from '../../../lib/i18n';

import { resolveLocaleFromHeaders, createcreateGenerateMetadata } from 'lib/pageUtils';

import PageLayout from '@components/common/PageLayout';


export const generateMetadata = createcreateGenerateMetadata('scriptures_vedas');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));

  const page: any = (() => {
    const k: any = getMeta('scriptures_vedas', {}, locale) || {};
    const structure = k.structure?.fourvedas ?? (t('vedas.structure.fourvedas', locale) || []);
    const origin = typeof k.origin === 'object' ? k.origin : (t('vedas.origin', locale) || {});
    const authorship = typeof k.authorship === 'object' ? k.authorship : (t('vedas.authorship', locale) || {});
    return {
      title: typeof k.title === 'string' ? k.title : String(t('vedas.title', locale) || ''),
      intro: typeof k.intro === 'string' ? k.intro : String(t('vedas.intro', locale) || ''),
      origin,
      authorship,
      structure
    };
  })();

  return (
    <>
      <PageLayout title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title }]} locale={(typeof locale !== 'undefined' ? locale : undefined)}>
        
        <h2>{page.title}</h2>
        <p>{page.intro}</p>
        <div>
          <p><b>Meaning: </b>{page.origin.Meaning}</p>
          <p><b>Period: </b>{page.origin.Period}</p>
          <p><b>Transmission: </b>{page.origin.Transmission}</p>
        </div>
        <div>
          <p><b>Nature: </b>{page.authorship.Nature}</p>
          <p><b>Process: </b>{page.authorship.Process}</p>
          <p><b>Compiler: </b>{page.authorship.Compiler}</p>
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
