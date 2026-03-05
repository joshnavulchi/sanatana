/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import PageLayout from '@components/common/PageLayout';
import { createGenerateMetadata } from '@lib/pageUtils';
import { parseList } from '@lib/parseList';
import { t, detectLocale, getMeta, getLocaleNamespaceObject, DEFAULT_LOCALE } from '@lib/i18n';
export const generateMetadata = createGenerateMetadata('scriptures_vedas');

const _localeObj = getLocaleNamespaceObject('scriptures_vedas');
const ns = (_localeObj && ((_localeObj as any)['scriptures_vedas'] || _localeObj)) || {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'scriptures_vedas' ? parts.shift() : 'scriptures_vedas';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || DEFAULT_LOCALE;
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('scriptures_vedas', {}, locale) || {};
    const local = (ns as any) || {};
    const structure = (k.structure?.fourvedas) ?? (local.structure?.fourvedas) ?? parseList(__getLoc('scriptures_vedas.structure.fourvedas'));
    const origin = (typeof k.origin === 'object' && Object.keys(k.origin || {}).length) ? k.origin : (local.origin || (__getLoc('scriptures_vedas.origin') || {}));
    const authorship = (typeof k.authorship === 'object' && Object.keys(k.authorship || {}).length) ? k.authorship : (local.authorship || (__getLoc('scriptures_vedas.authorship') || {}));
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('scriptures_vedas.title') || local.title || ''),
      intro: typeof k.intro === 'string' ? k.intro : String(__getLoc('scriptures_vedas.intro') || local.intro || ''),
      origin: origin || {},
      authorship: authorship || {},
      benefits: Array.isArray(k.benefits) ? k.benefits : (Array.isArray(local.benefits) ? local.benefits : []),
      features: Array.isArray(k.features) ? k.features : (Array.isArray(local.features) ? local.features : []),
      language: k.language || local.language || '',
      purpose: k.purpose || local.purpose || '',
      significance: k.significance || local.significance || '',
      structure: Array.isArray(structure) ? structure : [],
      subdivisions: (local.structure && local.structure.subdivisions) || __getLoc('scriptures_vedas.structure.subdivisions') || [],
      themes: Array.isArray(k.themes) ? k.themes : (Array.isArray(local.themes) ? local.themes : []),
      timeline: Array.isArray(k.timeline) ? k.timeline : (Array.isArray(local.timeline) ? local.timeline : []),
      unique_insights: k.unique_insights || local.unique_insights || '',
      upanishads: k.upanishads || local.upanishads || {},
      all_108_upanishads: k.all_108_upanishads || local.all_108_upanishads || {}
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="scriptures_vedas"
        title={page.title}
        description={page.intro}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Vedas' }]}
        className="layout-md"
      >
        <header className="rounded-lg overflow-hidden mb-6 border p-6 bg-gradient-to-r from-amber-50 via-amber-100 to-yellow-50">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold text-amber-800">{page.title}</h1>
            <p className="mt-3 text-lg text-amber-700">{page.intro}</p>
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              {page.language ? <span className="text-base px-2 py-1 bg-amber-100 text-amber-800 rounded-full">{page.language}</span> : null}
              {(page.themes || []).slice(0, 4).map((th: string, i: number) => (
                <span key={i} className="text-base px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">{th}</span>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="md:col-span-2">
            <section className="mb-6 border-l-4 border-amber-400 rounded-lg p-6 bg-amber-50">
              <h3 className="text-2xl font-semibold mb-3 text-amber-800">Purpose</h3>
              <p className="text-base text-amber-700">{page.purpose}</p>
            </section>

            <section className="mb-6 border-l-4 border-emerald-400 rounded-lg p-6 bg-emerald-50">
              <h4 className="text-2xl font-semibold mb-3 text-emerald-800">Significance</h4>
              <p className="text-base text-emerald-700">{page.significance}</p>
            </section>

            <section className="mb-6">
              <h5 className="text-2xl font-semibold mb-4 text-slate-800">Structure — Four Vedas</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(page.structure || []).map((v: any, idx: number) => (
                  <article key={idx} className="border-l-4 border-emerald-400 rounded-lg p-4 bg-emerald-50">
                    <h3 className="text-lg font-bold mb-2 text-emerald-800">{v.name || v.Name}</h3>
                    <p className="text-sm mb-2 text-emerald-700">{v.content || v.Content}</p>
                    {v.features || v.Features ? <p className="text-base text-emerald-600">{v.features || v.Features}</p> : null}
                  </article>
                ))}
              </div>
            </section>

            <section className="mb-6 border-l-4 border-indigo-400 rounded-lg p-6 bg-indigo-50">
              <h6 className="text-2xl font-semibold mb-3 text-indigo-800">Upanishads</h6>
              {page.upanishads.definition ? <p className="mb-3 text-indigo-700">{page.upanishads.definition}</p> : null}
              {Array.isArray(page.upanishads.major_upanishads) && page.upanishads.major_upanishads.length > 0 ? (
                <ul className="grid grid-cols-1 gap-3">
                  {page.upanishads.major_upanishads.map((u: any, i: number) => (
                    <li key={i} className="bg-white border rounded-md p-3 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <strong className="text-slate-800">{u.name}</strong>
                          {u.summary ? <p className="text-sm text-slate-600">{u.summary}</p> : null}
                        </div>
                        <span className="text-base text-indigo-600">Upanishad</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>

            <section className="mb-6 border-l-4 border-rose-400 rounded-lg p-6 bg-rose-50">
              <h6 className="text-2xl font-semibold mb-3 text-rose-800">Unique Insights</h6>
              <p className="text-rose-700">{page.unique_insights}</p>
            </section>
          </div>

          <aside className="md:col-span-1 space-y-4">
            <div className="p-4 rounded-lg bg-yellow-50 border-l-4 border-amber-400">
              <h4 className="font-semibold mb-2 text-amber-800">Origin</h4>
              <p className="text-sm"><strong>Meaning:</strong> {page.origin.meaning || ''}</p>
              <p className="text-sm"><strong>Period:</strong> {page.origin.period || ''}</p>
              <p className="text-sm"><strong>Transmission:</strong> {page.origin.transmission || ''}</p>
            </div>

            <div className="p-4 rounded-lg bg-sky-50 border-l-4 border-sky-400">
              <h4 className="font-semibold mb-2 text-sky-800">Authorship</h4>
              <p className="text-sm"><strong>Nature:</strong> {page.authorship.nature || ''}</p>
              <p className="text-sm"><strong>Process:</strong> {page.authorship.process || ''}</p>
              <p className="text-sm"><strong>Compiler:</strong> {page.authorship.compiler || ''}</p>
            </div>

            <div className="p-4 rounded-lg bg-emerald-50 border-l-4 border-emerald-400">
              <h4 className="font-semibold mb-2 text-emerald-800">Language</h4>
              <p className="text-sm">{page.language}</p>
            </div>

            <div className="p-4 rounded-lg bg-rose-50 border-l-4 border-rose-400">
              <h4 className="font-semibold mb-2 text-rose-800">Benefits</h4>
              <ul className="list-disc ml-5 text-sm">
                {(page.benefits || []).map((b: string, i: number) => <li key={i}>{b}</li>)}
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-indigo-50 border-l-4 border-indigo-400">
              <h4 className="font-semibold mb-2 text-indigo-800">Themes</h4>
              <div className="flex flex-wrap gap-2">
                {(page.themes || []).map((t: string, i: number) => (
                  <span key={i} className="text-base px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
        <div>
          {typeof page.origin === 'object' && page.origin !== null ? (
            <>
              <p><b>Meaning: </b>{page.origin.meaning || page.origin.Meaning || ''}</p>
              <p><b>Period: </b>{page.origin.period || page.origin.Period || ''}</p>
              <p><b>Transmission: </b>{page.origin.transmission || page.origin.Transmission || ''}</p>
            </>
          ) : (
            <>
              <p><b>Meaning: </b>{String(page.origin || '')}</p>
            </>
          )}
        </div>
        <div>
          {typeof page.authorship === 'object' && page.authorship !== null ? (
            <>
              <p><b>Nature: </b>{page.authorship.nature || page.authorship.Nature || ''}</p>
              <p><b>Process: </b>{page.authorship.process || page.authorship.Process || ''}</p>
              <p><b>Compiler: </b>{page.authorship.compiler || page.authorship.Compiler || ''}</p>
            </>
          ) : (
            <>
              <p><b>Nature: </b>{String(page.authorship || '')}</p>
            </>
          )}
        </div>
        {(page.structure || []).map((item: any, i: number) => (
          <div key={i} className="mb-4 p-4 bg-white border rounded-lg shadow-sm">
            <p className="text-lg font-semibold"><b>Name: </b>{item.name || item.Name}</p>
            <p className="text-sm text-slate-700"><b>Content: </b>{item.content || item.Content}</p>
            <p className="text-sm text-slate-600"><b>Features: </b>{item.features || item.Features}</p>
          </div>
        ))}
        {Array.isArray(page.timeline) && page.timeline.length > 0 ? (
          <section className="mt-6">
            <h4 className="text-lg font-semibold mb-4">Timeline</h4>
            <ol className="border-l-2 border-slate-200 pl-4">
              {page.timeline.map((ev: any, i: number) => (
                <li key={i} className="mb-4 relative">
                  <span className="absolute -left-6 top-0 w-3 h-3 bg-amber-400 rounded-full"></span>
                  <div className="bg-white p-3 rounded-md border shadow-sm">
                    <div className="text-sm text-slate-800 font-semibold">{ev.title || ev.name || ev.event}</div>
                    {ev.period ? <div className="text-base text-slate-600">{ev.period}</div> : null}
                    {ev.description ? <div className="text-sm text-slate-700 mt-1">{ev.description}</div> : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */