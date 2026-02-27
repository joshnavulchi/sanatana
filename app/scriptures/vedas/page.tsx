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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <section className="mb-6 bg-white border rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-3">Purpose</h3>
              <p className="text-base">{page.purpose}</p>
            </section>

            <section className="mb-6 bg-white border rounded-lg p-6">
              <h4 className="text-2xl font-semibold mb-3">Significance</h4>
              <p className="text-base">{page.significance}</p>
            </section>

            <section className="mb-6">
              <h5 className="text-2xl font-semibold mb-4">Structure — Four Vedas</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(page.structure || []).map((v: any, idx: number) => (
                  <article key={idx} className="border rounded-lg p-4 bg-white">
                    <h3 className="text-lg font-bold mb-2">{v.name || v.Name}</h3>
                    <p className="text-sm mb-2">{v.content || v.Content}</p>
                    {v.features || v.Features ? <p className="text-xs text-gray-600">{v.features || v.Features}</p> : null}
                  </article>
                ))}
              </div>
            </section>

            <section className="mb-6 bg-white border rounded-lg p-6">
              <h6 className="text-2xl font-semibold mb-3">Upanishads</h6>
              {page.upanishads.definition ? <p className="mb-3">{page.upanishads.definition}</p> : null}
              {Array.isArray(page.upanishads.major_upanishads) && page.upanishads.major_upanishads.length > 0 ? (
                <ul className="list-disc ml-6">
                  {page.upanishads.major_upanishads.map((u: any, i: number) => (
                    <li key={i} className="mb-2">
                      <strong>{u.name}</strong>{u.summary ? <span className="ml-2 text-sm">— {u.summary}</span> : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>

            <section className="mb-6 bg-white border rounded-lg p-6">
              <h6 className="text-2xl font-semibold mb-3">Unique Insights</h6>
              <p>{page.unique_insights}</p>
            </section>
          </div>

          <aside className="md:col-span-1 space-y-4">
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Origin</h4>
              <p><strong>Meaning:</strong> {page.origin.meaning || ''}</p>
              <p><strong>Period:</strong> {page.origin.period || ''}</p>
              <p><strong>Transmission:</strong> {page.origin.transmission || ''}</p>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Authorship</h4>
              <p><strong>Nature:</strong> {page.authorship.nature || ''}</p>
              <p><strong>Process:</strong> {page.authorship.process || ''}</p>
              <p><strong>Compiler:</strong> {page.authorship.compiler || ''}</p>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Language</h4>
              <p>{page.language}</p>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Benefits</h4>
              <ul className="list-disc ml-5 text-sm">
                {(page.benefits || []).map((b: string, i: number) => <li key={i}>{b}</li>)}
              </ul>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Themes</h4>
              <div className="flex flex-wrap gap-2">
                {(page.themes || []).map((t: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-1 border rounded-full">{t}</span>
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
          <div key={i}>
            <p><b>Name: </b>{item.name || item.Name}</p>
            <p><b>Content: </b>{item.content || item.Content}</p>
            <p><b>Features: </b>{item.features || item.Features}</p>
          </div>
        ))}
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */