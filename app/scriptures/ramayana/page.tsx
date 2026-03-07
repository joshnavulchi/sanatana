/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import PageLayout from '@components/common/PageLayout';
import Link from 'next/link';
import { createGenerateMetadata } from '@lib/pageUtils';
import { t, detectLocale, getLocaleNamespaceObject, getMeta, DEFAULT_LOCALE } from '@lib/i18n';
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

    // Convert main_characters object to array format
    const mainCharsObj = k.main_characters || ram.main_characters || {};
    const main_characters = typeof mainCharsObj === 'object' && !Array.isArray(mainCharsObj)
      ? Object.entries(mainCharsObj).map(([key, value]) => ({ name: key.replace(/_/g, ' '), role: value }))
      : (Array.isArray(mainCharsObj) ? mainCharsObj : []);

    // Convert important_lessons to core_themes format
    const lessonsObj = k.important_lessons || ram.important_lessons || {};
    const core_themes = typeof lessonsObj === 'object' && !Array.isArray(lessonsObj)
      ? Object.entries(lessonsObj).map(([key, value]) => ({ title: key, description: value }))
      : (Array.isArray(k.core_themes) ? k.core_themes : (Array.isArray(ram.core_themes) ? ram.core_themes : []));

    // Use timeline_summary for timeline
    const timeline = Array.isArray(k.timeline_summary) ? k.timeline_summary.map((ev: string) => ({ event: ev }))
      : (Array.isArray(ram.timeline_summary) ? ram.timeline_summary.map((ev: string) => ({ event: ev }))
        : (Array.isArray(k.timeline) ? k.timeline : (Array.isArray(ram.timeline) ? ram.timeline : [])));

    // Get introduction sections
    const introduction = k.introduction || ram.introduction || {};

    return {
      title,
      author,
      description,
      main_characters,
      timeline,
      core_themes,
      introduction,
      story_divided_by_kandas: k.story_divided_by_kandas || ram.story_divided_by_kandas || undefined,
      cultural_importance: k.cultural_importance || ram.cultural_importance || undefined,
      symbolic_meaning: k.symbolic_meaning || ram.symbolic_meaning || undefined
    };
  })();

  return (
    <>
      <PageLayout
        metaKey="ramayana"
        title={page.title}
        description={page.description}
        titleColor="from-amber-600 via-rose-600 to-indigo-700"
        titleBorder="border-amber-500"
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Ramayana' }]}
        className="layout-md"
      >
        {/* Hero Header Section */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-500"></div>
          <p className="text-xl md:text-lg font-semibold text-amber-900 tracking-wide uppercase">Written by: {page.author}</p>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-500"></div>
        </div>
        {/* Introduction */}
        {page.introduction && Object.keys(page.introduction).length > 0 && (
          <section className="mb-12">
            <div className="relative mb-8">
              <h3 className="text-3xl font-bold text-amber-900 text-center mb-2 relative inline-block w-full">
                <span className="relative z-10 bg-white px-6">Introduction to the Epic</span>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {page.introduction.what_is_ramayanam && (
                <div className="bg-white border-l-4 border-orange-500 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-r-xl">
                  <div className="bg-orange-100 px-5 py-3 border-b-2 border-orange-200">
                    <h4 className="text-xl md:text-lg font-bold text-orange-900 flex items-center gap-2">
                      <span className="text-2xl">📖</span>
                      What is Ramayanam?
                    </h4>
                  </div>
                  <div className="p-5">
                    <p className="text-xl md:text-lg text-gray-700 leading-relaxed">{page.introduction.what_is_ramayanam}</p>
                  </div>
                </div>
              )}
              {page.introduction.who_wrote_it && (
                <div className="bg-white border-l-4 border-amber-500 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-r-xl">
                  <div className="bg-amber-100 px-5 py-3 border-b-2 border-amber-200">
                    <h5 className="text-xl md:text-lg font-bold text-amber-900 flex items-center gap-2">
                      <span className="text-2xl">✍️</span>
                      Who Wrote It?
                    </h5>
                  </div>
                  <div className="p-5">
                    <p className="text-xl md:text-lg text-gray-700 leading-relaxed">{page.introduction.who_wrote_it}</p>
                  </div>
                </div>
              )}
              {page.introduction.why_it_is_important && (
                <div className="bg-white border-l-4 border-red-500 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-r-xl">
                  <div className="bg-red-100 px-5 py-3 border-b-2 border-red-200">
                    <h6 className="text-xl md:text-lg font-bold text-red-900 flex items-center gap-2">
                      <span className="text-2xl">⭐</span>
                      Why It Is Important?
                    </h6>
                  </div>
                  <div className="p-5">
                    <p className="text-xl md:text-lg text-gray-700 leading-relaxed">{page.introduction.why_it_is_important}</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
        {/* Main characters */}
        {page.main_characters && page.main_characters.length > 0 && (
          <section className="mb-12">
            <div className="relative mb-8">
              <h6 className="text-3xl font-bold text-amber-900 text-center mb-2 relative inline-block w-full">
                <span className="relative z-10 bg-white px-6">Main Characters</span>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
              </h6>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {page.main_characters.map((c: any, idx: number) => (
                <div key={idx} className="group relative bg-gradient-to-br from-white to-amber-50 rounded-xl border-2 border-amber-300 hover:border-amber-500 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-200 rounded-bl-full opacity-50"></div>
                  <div className="relative p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h6 className="text-xl md:text-lg font-bold text-amber-900 group-hover:text-orange-600 transition-colors">{c.name}</h6>
                      </div>
                    </div>
                    {c.role && (
                      <p className="text-xl md:text-lg text-gray-700 leading-relaxed">{c.role}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* Important Lessons / Core Themes */}
        {page.core_themes && page.core_themes.length > 0 && (
          <section className="mb-12">
            <div className="relative mb-8">
              <h6 className="text-3xl font-bold text-amber-900 text-center mb-2 relative inline-block w-full">
                <span className="relative z-10 bg-white px-6">Important Lessons</span>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
              </h6>
            </div>
            <div className="space-y-5">
              {page.core_themes.map((ct: any, idx: number) => (
                <div key={idx} className="relative bg-white border-2 border-amber-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-orange-400 via-amber-500 to-red-500"></div>
                  <div className="pl-8 pr-6 py-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center border-2 border-amber-400">
                        <span className="text-xl md:text-lg font-bold text-amber-700">{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h6 className="text-xl md:text-lg font-bold text-amber-900 mb-2">{typeof ct.title === 'string' ? ct.title : ct['title']}</h6>
                        {ct.description && <p className="text-xl md:text-lg text-gray-700 leading-relaxed">{ct.description}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* Timeline */}
        {page.timeline && page.timeline.length > 0 && (
          <section className="mb-12">
            <div className="relative mb-8">
              <h6 className="text-3xl font-bold text-amber-900 text-center mb-2 relative inline-block w-full">
                <span className="relative z-10 bg-white px-6">Epic Timeline</span>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
              </h6>
            </div>
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 via-amber-500 to-red-500 hidden md:block"></div>
              <div className="space-y-6">
                {page.timeline.map((ev: any, idx: number) => (
                  <div key={idx} className="relative flex items-start gap-6 group">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10">
                      <span className="text-white font-bold text-xl md:text-lg">{idx + 1}</span>
                    </div>
                    <div className="flex-1 bg-white rounded-xl border-2 border-amber-200 shadow-md hover:shadow-lg transition-shadow duration-300 p-5">
                      <p className="text-xl md:text-lg font-semibold text-amber-900">{typeof ev === 'string' ? ev : ev.event}</p>
                      {typeof ev === 'object' && ev.desc && <p className="text-xl md:text-lg text-gray-600 mt-2">{ev.desc}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        {/* Symbolic Meaning */}
        {page.symbolic_meaning && Object.keys(page.symbolic_meaning).length > 0 && (
          <section className="mb-12">
            <div className="relative mb-8">
              <h6 className="text-3xl font-bold text-amber-900 text-center mb-2 relative inline-block w-full">
                <span className="relative z-10 bg-white px-6">Symbolic Meaning</span>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
              </h6>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(page.symbolic_meaning).map(([key, value]: [string, any], idx: number) => (
                <div key={idx} className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-300 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl md:text-lg">🔸</span>
                    </div>
                    <h6 className="text-xl md:text-lg font-bold text-red-900 capitalize">{key.replace(/_/g, ' ')}</h6>
                  </div>
                  <p className="text-xl md:text-lg text-gray-700 leading-relaxed ">{value}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* Story divided by Kandas */}
        {page.story_divided_by_kandas && typeof page.story_divided_by_kandas === 'object' && (
          <section className="mb-12">
            <div className="relative mb-8">
              <h6 className="text-3xl font-bold text-amber-900 text-center mb-2 relative inline-block w-full">
                <span className="relative z-10 bg-white px-6">The Seven Kandas</span>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
              </h6>
              <p className="text-center text-gray-600 mt-4 text-base md:text-md max-w-2xl mx-auto">Experience the complete epic journey through seven magnificent chapters, each revealing profound wisdom and timeless values.</p>
            </div>
            <div className="space-y-8">
              {Object.entries(page.story_divided_by_kandas)
                .sort(([, a]: [string, any], [, b]: [string, any]) => (a.order || 0) - (b.order || 0))
                .map(([kkey, kanda]: [string, any], index: number) => {
                  if (!kanda) return null;
                  const colors = [
                    { bg: 'from-violet-50 to-purple-50', border: 'border-violet-400', accent: 'bg-violet-500', text: 'text-violet-900', hover: 'hover:border-violet-600' },
                    { bg: 'from-blue-50 to-cyan-50', border: 'border-blue-400', accent: 'bg-blue-500', text: 'text-blue-900', hover: 'hover:border-blue-600' },
                    { bg: 'from-green-50 to-emerald-50', border: 'border-green-400', accent: 'bg-green-500', text: 'text-green-900', hover: 'hover:border-green-600' },
                    { bg: 'from-yellow-50 to-amber-50', border: 'border-yellow-400', accent: 'bg-yellow-500', text: 'text-yellow-900', hover: 'hover:border-yellow-600' },
                    { bg: 'from-orange-50 to-red-50', border: 'border-orange-400', accent: 'bg-orange-500', text: 'text-orange-900', hover: 'hover:border-orange-600' },
                    { bg: 'from-rose-50 to-pink-50', border: 'border-rose-400', accent: 'bg-rose-500', text: 'text-rose-900', hover: 'hover:border-rose-600' },
                    { bg: 'from-amber-50 to-orange-50', border: 'border-amber-400', accent: 'bg-amber-500', text: 'text-amber-900', hover: 'hover:border-amber-600' }
                  ];
                  const color = colors[index % colors.length];
                  return (
                    <article key={kkey} className={`relative bg-gradient-to-br ${color.bg} rounded-2xl border-2 ${color.border} ${color.hover} shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
                      <div className={`absolute top-0 left-0 w-full h-1 ${color.accent}`}></div>
                      <div className="p-8">
                        <div className="flex items-start gap-6 mb-6">
                          <div className={`flex-shrink-0 w-16 h-16 ${color.accent} rounded-2xl flex items-center justify-center shadow-lg transform rotate-3`}>
                            <span className="text-white font-black text-2xl transform -rotate-3">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <h6 className={`text-2xl font-black ${color.text} mb-2`}>
                              {kanda.title || kkey.replace(/_/g, ' ').toUpperCase()}
                            </h6>
                          </div>
                        </div>
                        {kanda.narrative && (
                          <div className="mb-6 pl-0 md:pl-22">
                            <div className="bg-white bg-opacity-70 rounded-xl p-5 border border-gray-200">
                              <p className="text-xl md:text-lg text-gray-800 leading-relaxed line-clamp-4">
                                {kanda.narrative.split('\n\n').slice(0, 2).join('\n\n')}...
                              </p>
                            </div>
                          </div>
                        )}
                        {kanda.lessons && (
                          <div className="mb-6 pl-0 md:pl-22">
                            <div className="bg-white bg-opacity-90 rounded-xl p-5 border-l-4 border-amber-500">
                              <p className="text-xl md:text-lg font-bold text-amber-700 uppercase tracking-wider mb-2">📚 Key Lessons</p>
                              <p className="text-xl md:text-lg text-gray-700 leading-relaxed">{kanda.lessons}</p>
                            </div>
                          </div>
                        )}
                        <div className="pl-0 md:pl-22 flex justify-end">
                          <Link
                            href={`/scriptures/ramayana/kandas/${kkey}`}
                            className={`inline-flex items-center gap-2 ${color.accent} hover:opacity-90 text-white px-3 py-1 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 transform`}
                          >
                            <span>Read Complete Chapter</span>
                            <span className="text-base md:text-md">→</span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
          </section>
        )}
        {/* Cultural Importance */}
        {page.cultural_importance && Object.keys(page.cultural_importance).length > 0 && (
          <section className="mb-12">
            <div className="relative mb-8">
              <h2 className="text-3xl font-bold text-amber-900 text-center mb-2 relative inline-block w-full">
                <span className="relative z-10 bg-white px-6">Cultural Importance</span>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
              </h2>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-300 shadow-xl p-8">
              <div className="space-y-6">
                {Object.entries(page.cultural_importance).map(([key, value]: [string, any], idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-base md:text-md">✦</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl md:text-lg font-bold text-amber-900 mb-2 capitalize">{key.replace(/_/g, ' ')}</h3>
                      <p className="text-base md:text-md text-gray-700 leading-relaxed">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */