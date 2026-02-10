/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import PageLayout from '@/app/components/common/PageLayout';
import { createGenerateMetadata } from 'lib/pageUtils';
import { t, detectLocale, getLocaleNamespaceObject, getMeta, DEFAULT_LOCALE } from '../../../lib/i18n';
export const generateMetadata = createGenerateMetadata('scriptures_ramayana');

const _localeObj = getLocaleNamespaceObject('scriptures_ramayana');
const ns = (_localeObj && ((_localeObj as any)['scriptures_ramayana'] || ((_localeObj as any).ramayana) || _localeObj)) || {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'scriptures_ramayana' ? parts.shift() : 'scriptures_ramayana';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || DEFAULT_LOCALE;
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('scriptures_ramayana', {}, locale) || {};
    const loc: any = getLocaleNamespaceObject(locale, 'scriptures_ramayana') || {};
    const ram = loc?.scriptures_ramayana || {};
    const title = typeof k.title === 'string' ? k.title : (ram.title || __getLoc('scriptures_ramayana.title') || '');
    const author = k.source || ram.source || '';
    let description: string = '';
    const descSource = k.description || ram.description;
    if (typeof descSource === 'string') description = descSource;
    else if (descSource && typeof descSource === 'object') description = descSource[locale] || descSource['translate'] || '';
    return {
      title,
      author,
      description,
      main_characters: Array.isArray(k.main_characters) ? k.main_characters : (Array.isArray(ram.main_characters) ? ram.main_characters : []),
      important_places: Array.isArray(k.important_places) ? k.important_places : (Array.isArray(ram.important_places) ? ram.important_places : []),
      timeline: Array.isArray(k.timeline) ? k.timeline : (Array.isArray(ram.timeline) ? ram.timeline : []),
      core_themes: Array.isArray(k.core_themes) ? k.core_themes : (Array.isArray(ram.core_themes) ? ram.core_themes : []),
      full_ramayana: k.full_ramayana || ram.full_ramayana || undefined
    };
  })();

  return (
    <>
      <PageLayout
        metaKey="ramayana"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Ramayana' }]}
        className="layout-md"
      >
        <section className="bg-gradient-to-br from-yellow-100 via-orange-50 to-red-100 rounded-xl shadow-lg px-3 py-6 border border-yellow-300">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-orange-700 tracking-tight mb-2">{page.title}</h1>
            <p className="text-lg font-medium text-orange-900">Source: {page.author}</p>
            {page.description && <p className="mt-2 text-base text-orange-800 italic">{page.description}</p>}
            <div className="flex justify-center mt-4">
              <img src="/images/ramayana-motif.png" alt="Ramayana motif" className="w-24 h-24 rounded-full border-4 border-orange-300 shadow-md" />
            </div>
          </header>
          {/* Main characters */}
          {page.main_characters && page.main_characters.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-orange-700 mb-3">Main Characters</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {page.main_characters.map((c: any, idx: number) => (
                  <li key={idx} className="bg-orange-50 rounded-lg p-4 shadow border border-orange-200">
                    <span className="text-lg font-semibold text-orange-800">{c.name}</span>
                    {c.role && <span className="block text-sm text-orange-600 mt-1">{c.role}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {/* Important places */}
          {page.important_places && page.important_places.length > 0 && (
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-orange-700 mb-3">Important Places</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {page.important_places.map((p: any, idx: number) => (
                  <li key={idx} className="bg-yellow-50 rounded-lg p-4 shadow border border-yellow-200">
                    <span className="text-lg font-semibold text-yellow-800">{p.name}</span>
                    {p.desc && <span className="block text-sm text-yellow-600 mt-1">{p.desc}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {/* Timeline */}
          {page.timeline && page.timeline.length > 0 && (
            <section className="mb-8">
              <h4 className="text-2xl font-bold text-orange-700 mb-3">Timeline</h4>
              <ol className="space-y-3">
                {page.timeline.map((ev: any, idx: number) => (
                  <li key={idx} className="bg-red-50 rounded-lg p-4 shadow border border-red-200">
                    <span className="text-lg font-semibold text-red-800">{ev.event}</span>
                    {ev.desc && <span className="block text-sm text-red-600 mt-1">{ev.desc}</span>}
                  </li>
                ))}
              </ol>
            </section>
          )}
          {/* Core themes */}
          {page.core_themes && page.core_themes.length > 0 && (
            <section className="mb-8">
              <h5 className="text-2xl font-bold text-orange-700 mb-3">Core Themes</h5>
              <ul className="flex flex-wrap gap-3">
                {page.core_themes.map((ct: any, idx: number) => (
                  <li key={idx} className="bg-orange-200 text-orange-900 rounded-full px-4 py-2 text-base font-semibold shadow">{(typeof ct.title === 'string') ? ct.title : ct['title']}</li>
                ))}
              </ul>
            </section>
          )}
          {/* Full ramayana kandas and sargas */}
          {page.full_ramayana && typeof page.full_ramayana === 'object' && (
            <section className="mb-8">
              <h6 className="text-2xl font-bold text-orange-700 mb-3">Ramayana (Kandas & Sargas)</h6>
              {Object.keys(page.full_ramayana).map((kkey: string, index: number) => {
                const kanda = (page.full_ramayana as any)[kkey];
                if (!kanda) return null;
                return (
                  <div key={kkey} className="mb-6">
                    {kanda.kanda ? <p className="text-lg font-semibold text-orange-800 mb-2">{index + 1}. {kanda.kanda}</p> : <p className="text-lg font-semibold text-orange-800 mb-2">{kkey}</p>}
                    <div>
                      {kanda.description && <p className="text-sm text-orange-700 mb-2">{(typeof kanda.description === 'string') ? kanda.description : null}</p>}
                      {Array.isArray(kanda.sargas) && kanda.sargas.length > 0 && (
                        <ul className="space-y-2">
                          {kanda.sargas.map((s: any) => (
                            <li key={s.sarga} className="bg-orange-50 rounded-lg p-3 shadow border border-orange-200">
                              <span className="text-base font-semibold text-orange-900">{s.title}</span>
                              {s.story && <p className="text-sm text-orange-700 mt-1"><strong>Story: </strong>{(typeof s.story === 'string') ? s.story : null}</p>}
                              {s.lesson && <p className="text-sm text-orange-700 mt-1"><strong>Lesson: </strong>{(typeof s.lesson === 'string') ? s.lesson : null}</p>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          )}
        </section>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */