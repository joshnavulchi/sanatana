/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import PageLayout from '@components/common/PageLayout';
import { createGenerateMetadata } from '@lib/pageUtils';
import { t, detectLocale, getLocaleNamespaceObject, getMeta, DEFAULT_LOCALE } from '@lib/i18n';
import SlokasClient from './slokasclient';
import Link from 'next/dist/client/link';
export const generateMetadata = createGenerateMetadata('scriptures_sanksheparamayana');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || DEFAULT_LOCALE;
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const loc: any = getLocaleNamespaceObject(locale, 'scriptures_sanksheparamayana') || {};
    const ram = loc?.scriptures_sanksheparamayana || {};
    return {
      title: ram.title || '',
      author: ram.author || '',
      source: ram.source || '',
      description: ram.description || '',
      main_characters: Array.isArray(ram.main_characters) ? ram.main_characters : [],
      important_places: Array.isArray(ram.important_places) ? ram.important_places : [],
      timeline: ram.timeline || [],
      core_themes: ram.core_themes || [],
      slokas: ram.slokas || []
    };
  })();

  return (
    <>
      <PageLayout
        metaKey="sankshepa_ramayana"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title }]}
        className="layout-md"
      >
        <header className="bg-gradient-to-r from-amber-50 via-rose-50 to-indigo-50 rounded-lg p-6 shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              {/* <h3 className="text-3xl md:text-4xl font-extrabold leading-tight text-slate-900">
                {page.title || S('sankshepa_ramayana_title')}
              </h3> */}
              <p className="mt-2 text-md text-slate-600">
                <strong>Author:</strong> {page.author}
                {page.description ? <span className="block mt-1 text-slate-700">{page.description}</span> : null}
              </p>
            </div>
            <div className="md:w-48 flex-shrink-0">
              <div className="bg-white border border-amber-100 rounded-lg p-3 text-center shadow-sm">
                <div className="text-md text-amber-600 font-medium">Summary</div>
                <div className="mt-2 text-sm text-slate-700"><Link href={page.source} title="Valmiki Ramayana">Source Link</Link></div>
              </div>
            </div>
          </div>
        </header>
        <main className="space-y-8">
          {/* Main characters grid */}
          {page.main_characters && page.main_characters.length > 0 && (
            <section className="border border-slate-100 rounded-lg p-5">
              <h4 className="text-xl font-semibold text-slate-800 mb-3">Main Characters</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {page.main_characters.map((c: any, idx: number) => (
                  <article
                    key={idx}
                    className="flex items-start gap-3 p-4 bg-gradient-to-br from-white to-amber-50 rounded-lg border border-amber-50 hover:shadow-lg transition"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold">
                      {c.name ? c.name.charAt(0).toUpperCase() : '—'}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{c.name}</div>
                      {c.role ? <div className="text-sm text-slate-600">{c.role}</div> : null}
                      {c.note ? <div className="mt-1 text-xs text-slate-500">{c.note}</div> : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Important places */}
          {page.important_places && page.important_places.length > 0 && (
            <section className="bg-amber-50 border border-amber-100 rounded-lg p-5 shadow-sm">
              <h5 className="text-lg font-semibold text-amber-800 mb-3">Important Places</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {page.important_places.map((p: any, idx: number) => (
                  <div key={idx} className="p-4 bg-white rounded-md border border-slate-100">
                    <div className="font-medium text-slate-800">{p.name}</div>
                    {p.desc ? <div className="text-sm text-slate-600 mt-1">{p.desc}</div> : null}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Timeline */}
          {page.timeline && page.timeline.length > 0 && (
            <section className="bg-white border border-slate-100 rounded-lg p-5 shadow-sm">
              <h6 className="text-lg font-semibold text-slate-800 mb-4">Timeline</h6>
              <ol className="space-y-4">
                {page.timeline.map((ev: any, idx: number) => (
                  <li key={idx} className="flex gap-4">
                    <div className="flex-none w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold shadow-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-800">{ev.event}</div>
                      {ev.desc ? <div className="text-sm text-slate-600 mt-1">{ev.desc}</div> : null}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Core themes */}
          {page.core_themes && page.core_themes.length > 0 && (
            <section className="p-5">
              <p className="text-lg font-semibold text-amber-800 mb-3">Core Themes</p>
              <div className="flex flex-wrap gap-3">
                {page.core_themes.map((ct: any, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-slate-100 text-sm text-slate-700 shadow-sm"
                  >
                    {(typeof ct.title === 'string') ? ct.title : ct['title']}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Slokas with collapsible sections */}
          <section className="border border-slate-100 rounded-lg p-5">
            <SlokasClient slokas={page.slokas} />
          </section>
        </main>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */