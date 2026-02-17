/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import PageLayout from '@components/common/PageLayout';
import { createGenerateMetadata } from '@lib/pageUtils';
import { parseList } from '@lib/parseList';
import { t, detectLocale, getMeta, getLocaleNamespaceObject, DEFAULT_LOCALE } from '@lib/i18n';
export const generateMetadata = createGenerateMetadata('scriptures_mahabharata');

const _localeObj = getLocaleNamespaceObject('scriptures_mahabharata');
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
  const locale = detectLocale(searchParams) || DEFAULT_LOCALE;
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const nsObj: any = getLocaleNamespaceObject(locale, 'scriptures_mahabharata')?.scriptures_mahabharata || {};
    return {
      title: typeof nsObj.title === 'string' ? nsObj.title : (__getLoc('scriptures_mahabharata.title') || ''),
      structure: Array.isArray(nsObj.structure) ? nsObj.structure : parseList(__getLoc('scriptures_mahabharata.structure'))
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="scriptures_mahabharata"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Mahabharata' }]}
        className="layout-md"
      >
        <section className="bg-gradient-to-br from-blue-100 via-indigo-50 to-green-100 rounded-xl shadow-lg px-3 py-6 border border-blue-300">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight mb-2">{page.title}</h1>
            <div className="flex justify-center mt-4">
              <img src="/images/mahabharata-motif.png" alt="Mahabharata motif" className="w-24 h-24 rounded-full border-4 border-blue-300 shadow-md" />
            </div>
          </header>
          <div className="space-y-8">
            {(page.structure || []).map((item: any, i: number) => (
              <section key={i} className="bg-white/80 rounded-lg p-6 shadow border border-blue-100">
                {item.name && <h2 className="text-2xl font-bold text-blue-700 mb-2">{item.parva}. {item.name}</h2>}
                {item.summary && <p className="text-base text-blue-900 mb-2 italic">{item.summary}</p>}
                {!item.summary && <pre className="text-xs text-gray-700 bg-gray-50 rounded p-2 overflow-x-auto">{JSON.stringify(item, null, 2)}</pre>}
                {item.key_events && (
                  <div className="mt-2">
                    <span className="font-semibold text-green-800">Key Events:</span>
                    <ul className="list-disc list-inside ml-4 text-green-900">
                      {Array.isArray(item.key_events) ? item.key_events.map((ev: any, idx: number) => (
                        <li key={idx}>{ev}</li>
                      )) : <li>{JSON.stringify(item.key_events)}</li>}
                    </ul>
                  </div>
                )}
                {item.main_characters && (
                  <div className="mt-2">
                    <span className="font-semibold text-indigo-800">Main Characters:</span>
                    <ul className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(item.main_characters) ? item.main_characters.map((ch: any, idx: number) => (
                        <li key={idx} className="bg-indigo-100 text-indigo-900 rounded-full px-3 py-1 text-sm font-medium shadow">{typeof ch === 'string' ? ch : JSON.stringify(ch)}</li>
                      )) : <li>{JSON.stringify(item.main_characters)}</li>}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>
        </section>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */