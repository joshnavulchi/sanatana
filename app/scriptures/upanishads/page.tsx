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
    const local = (ns as any)?.scriptures_upanishads || ns || {};
    return {
      title: typeof k.title === 'string' ? k.title : (local.title || __getLoc('scriptures_upanishads.title') || ''),
      purpose: (local.meta && local.meta.purpose) || k.purpose || __getLoc('scriptures_upanishads.meta.purpose') || '',
      benefits: (local.meta && local.meta.benefits) || k.benefits || [],
      unique_insights: (local.meta && local.meta.unique_insights) || k.unique_insights || '',
      features: (local.meta && local.meta.features) || k.features || [],
      list: Array.isArray(k.list) ? k.list : (Array.isArray(local.list) ? local.list : parseList(__getLoc('scriptures_upanishads.list')))
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
        <header className="rounded-lg overflow-hidden mb-6 border p-6 bg-gradient-to-r from-indigo-50 via-teal-50 to-emerald-50">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-800">{page.title}</h1>
            <p className="mt-3 text-md text-indigo-700">{page.purpose}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <main className="lg:col-span-3 space-y-6">
            {(page.list || []).map((group: any, gi: number) => (
              <section key={gi} className="rounded-lg p-6 bg-white shadow-sm border-t-4 border-indigo-200">
                {group.category ? <h3 className="text-md font-semibold mb-3 text-indigo-800">{group.category}</h3> : null}
                {group.description ? <p className="mb-3 text-slate-700">{group.description}</p> : null}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0">
                  {(group.list || []).map((it: any, idx: number) => (
                    <li key={idx} className="border rounded-md p-3 bg-gradient-to-r from-white to-indigo-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-slate-800">{it.name}</h4>
                          <p className="text-xs md:base-sm text-slate-600">{it.summary}</p>
                        </div>
                        <div className="text-base text-amber-700 ml-4 px-2 py-1 bg-amber-100 rounded-full">{it.veda}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </main>

          <aside className="space-y-4">
            <div className="p-4 rounded-lg bg-amber-50 border-l-4 border-amber-400">
              <h4 className="font-semibold mb-2 text-amber-800">Benefits</h4>
              <ul className="list-disc ml-5 text-xs md:base-sm">
                {(page.benefits || []).map((b: string, i: number) => <li key={i}>{b}</li>)}
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-teal-50 border-l-4 border-teal-400">
              <h4 className="font-semibold mb-2 text-teal-800">Features</h4>
              <ul className="list-disc ml-5 text-xs md:base-sm">
                {(page.features || []).map((f: string, i: number) => <li key={i}>{f}</li>)}
              </ul>
            </div>

            {page.unique_insights ? (
              <div className="p-4 rounded-lg bg-indigo-50 border-l-4 border-indigo-400">
                <h4 className="font-semibold mb-2 text-indigo-800">Unique Insights</h4>
                <p className="text-xs md:base-sm">{page.unique_insights}</p>
              </div>
            ) : null}
          </aside>
        </div>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */