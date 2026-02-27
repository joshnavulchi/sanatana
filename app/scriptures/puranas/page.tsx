/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import PageLayout from '@components/common/PageLayout';
import { createGenerateMetadata } from '@lib/pageUtils';
import { t, detectLocale, getLocaleNamespaceObject, getMeta, DEFAULT_LOCALE } from '@lib/i18n';
export const generateMetadata = createGenerateMetadata('scriptures_puranas');

const _localeObj = getLocaleNamespaceObject('scriptures_puranas');
const ns = (_localeObj && ((_localeObj as any)['scriptures_puranas'] || ((_localeObj as any).puranas) || _localeObj)) || {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'scriptures_puranas' ? parts.shift() : 'scriptures_puranas';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};

export default function PuranasPage({ searchParams }: any) {
  const locale = detectLocale(searchParams) || DEFAULT_LOCALE;
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('scriptures_puranas', {}, locale) || {};
    const loc: any = getLocaleNamespaceObject(locale, 'scriptures_puranas') || {};
    const puranas = loc?.scriptures_puranas || {};
    return {
      title: typeof k.title === 'string' ? k.title : (puranas.title || __getLoc('scriptures_puranas.title') || ''),
      classification: k.classification || puranas.classification,
      definition: k.definition || puranas.definition,
      major_puranas: Array.isArray(k.major_puranas) ? k.major_puranas : (Array.isArray(puranas.major_puranas) ? puranas.major_puranas : [])
    };
  })();

  return (
    <>
      <PageLayout
        metaKey="scriptures_puranas"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Puranas' }]}
        className="layout-md"
      >
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
          {/* Sub Pages Links */}
          <div className="mt-8">
            <h3 className="text-lg md:text-md font-bold mb-2">Explore Sub Puranas:</h3>
            <ul className="list-disc ml-6">
              <li><a href="/scriptures/puranas/garuda" className="text-blue-600 hover:underline">Garuda Purana</a></li>
              <li><a href="/scriptures/puranas/karma" className="text-blue-600 hover:underline">Karma Purana</a></li>
            </ul>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */