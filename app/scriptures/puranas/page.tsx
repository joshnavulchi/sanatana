/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getLocaleObject, getMeta } from '../../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('scriptures_puranas');

export default function PuranasPage({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('scriptures_puranas', {}, locale) || {};
    const loc: any = getLocaleObject(locale) || {};
    const puranas = loc?.puranas || {};
    return {
      title: typeof k.title === 'string' ? k.title : (puranas.title || t('puranas.title', locale) || ''),
      classification: k.classification || puranas.classification,
      definition: k.definition || puranas.definition,
      major_puranas: Array.isArray(k.major_puranas) ? k.major_puranas : (Array.isArray(puranas.major_puranas) ? puranas.major_puranas : [])
    };
  })();

  return (
    <>
      <PageLayout metaKey="scriptures_puranas" title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Puranas' }]}>
        <p>{page.classification}</p>
        <p>{page.definition}</p>
        <div>
          <p>{S('puranas.purpose')}</p>
          {/* Major Puranas */}
          {page.major_puranas && page.major_puranas.length > 0 && (
            <div>
              <p>Major Puranas :</p>
              <ul role="list" className="list-disc">
                {page.major_puranas.map((c: any, idx: number) => (
                  <li key={idx}>
                    <strong>{c.name}</strong> - {c.highlights ? <span>{c.highlights}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */