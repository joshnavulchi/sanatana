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
        <header className="rounded-lg overflow-hidden mb-6 border p-6 bg-gradient-to-r from-rose-50 via-rose-100 to-pink-50">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold text-rose-800">{page.title}</h1>
            <p className="mt-3 text-xl md:text-lg text-rose-700">{page.definition}</p>
            <div className="mt-3 text-base md:text-md md:text-sm text-rose-600">{page.classification}</div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <main className="md:col-span-2 space-y-6">
            <section className="p-4 rounded-lg bg-white border-t-4 border-rose-200 shadow-sm">
              <h3 className="text-xl md:text-lg font-semibold text-rose-800">Purpose</h3>
              <p className="text-slate-700 mt-2">{S('puranas.purpose')}</p>
            </section>

            {page.major_puranas && page.major_puranas.length > 0 && (
              <section className="p-4 rounded-lg bg-amber-50 border-l-4 border-amber-400">
                <h4 className="text-xl md:text-lg font-semibold mb-3 text-amber-800">Major Puranas</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {page.major_puranas.map((c: any, idx: number) => (
                    <article key={idx} className="p-4 bg-white rounded-md border shadow-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <strong className="text-slate-800">{c.name}</strong>
                          {c.highlights ? <p className="text-base md:text-md md:text-sm text-slate-600">{c.highlights}</p> : null}
                        </div>
                        <span className="text-base md:text-md px-2 py-1 bg-rose-100 text-rose-800 rounded-full">Purana</span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-6">
              <h3 className="text-xl md:text-lg font-semibold mb-2">Explore Sub Puranas</h3>
              <ul className="space-y-2">
                <li><a href="/scriptures/puranas/garuda" className="inline-block text-rose-700 hover:underline bg-rose-50 px-3 py-2 rounded-md">Garuda Purana</a></li>
                <li><a href="/scriptures/puranas/karma" className="inline-block text-rose-700 hover:underline bg-rose-50 px-3 py-2 rounded-md">Karma Purana</a></li>
              </ul>
            </section>
          </main>

          <aside className="space-y-4">
            <div className="p-4 rounded-lg bg-sky-50 border-l-4 border-sky-400">
              <h4 className="font-semibold text-sky-800">Classification</h4>
              <p className="text-base md:text-md md:text-sm text-slate-700">{page.classification}</p>
            </div>

            <div className="p-4 rounded-lg bg-emerald-50 border-l-4 border-emerald-400">
              <h4 className="font-semibold text-emerald-800">Quick Links</h4>
              <ul className="text-base md:text-md md:text-sm">
                <li><a href="/scriptures/puranas" className="text-emerald-700 hover:underline">All Puranas</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */