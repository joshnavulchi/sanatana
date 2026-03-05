/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import PageLayout from '@components/common/PageLayout';
import Link from 'next/link';
import { createGenerateMetadata } from '@lib/pageUtils';
import { t, detectLocale, getLocaleNamespaceObject, getMeta, DEFAULT_LOCALE } from '@lib/i18n';
export const generateMetadata = createGenerateMetadata('scriptures_mahabharata');

const _localeObj = getLocaleNamespaceObject('scriptures_mahabharata');
const ns = (_localeObj && ((_localeObj as any)['scriptures_mahabharata'] || ((_localeObj as any).mahabharata) || _localeObj)) || {};
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
    const k: any = getMeta('scriptures_mahabharata', {}, locale) || {};
    const loc: any = getLocaleNamespaceObject(locale, 'scriptures_mahabharata') || {};
    const mbh = loc?.scriptures_mahabharata || {};
    const title = typeof k.title === 'string' ? k.title : (mbh.title || __getLoc('scriptures_mahabharata.title') || '');
    let description: string = '';
    const descSource = k.description || mbh.description || mbh.introduction;
    if (typeof descSource === 'string') description = descSource;
    else if (descSource && typeof descSource === 'object') description = descSource[locale] || descSource['translate'] || '';

    // Convert parvas array to object keyed by normalized parvaname
    const parvasArr = Array.isArray(k.parvas) ? k.parvas : (Array.isArray(mbh.parvas) ? mbh.parvas : []);
    const parvas: Record<string, any> = {};
    parvasArr.forEach((p: any) => {
      if (p && p.parvaname) {
        const key = p.parvaname.toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[()]/g, '')
          .replace(/__+/g, '_')
          .replace(/^_|_$/g, '');
        parvas[key] = p;
      }
    });

    // Get major characters
    const majorCharactersObj = k.majorcharacteranalysis || mbh.majorcharacteranalysis || {};
    const major_characters = typeof majorCharactersObj === 'object' && !Array.isArray(majorCharactersObj)
      ? Object.entries(majorCharactersObj).map(([key, value]) => ({ name: key.replace(/_/g, ' '), description: value }))
      : [];

    // Get core themes
    const coreThemesObj = k.corethemes || mbh.corethemes || {};
    const core_themes = typeof coreThemesObj === 'object' && !Array.isArray(coreThemesObj)
      ? Object.entries(coreThemesObj).map(([key, value]) => ({ title: key, description: value }))
      : [];

    return {
      title,
      description,
      introduction: mbh.introduction || k.introduction || '',
      parvas,
      major_characters,
      core_themes,
      conclusion: mbh.conclusion || k.conclusion || ''
    };
  })();

  return (
    <>
      <PageLayout
        metaKey="mahabharata"
        title={page.title}
        description={page.description}
        titleColor="from-blue-600 via-indigo-600 to-purple-700"
        titleBorder="border-blue-500"
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Mahabharata' }]}
        className="layout-md"
      >
        {/* Introduction */}
        {page.introduction && (
          <section className="mb-12">
            <div className="relative mb-8">
              <h4 className="text-3xl font-bold text-blue-900 text-center mb-2 relative inline-block w-full">
                <span className="relative z-10 bg-white px-6">Introduction to the Epic</span>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300"></div>
              </h4>
            </div>
            <div className="bg-white border-l-4 border-blue-500 shadow-lg rounded-r-xl p-6">
              <p className="text-md text-gray-700 leading-relaxed">{page.introduction}</p>
            </div>
          </section>
        )}
        {/* Major Characters */}
        {page.major_characters && page.major_characters.length > 0 && (
          <section className="mb-12">
            <div className="relative mb-8">
              <h5 className="text-3xl font-bold text-blue-900 text-center mb-2 relative inline-block w-full">
                <span className="relative z-10 bg-white px-6">Major Characters</span>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300"></div>
              </h5>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {page.major_characters.map((c: any, idx: number) => (
                <div key={idx} className="group relative bg-gradient-to-br from-white to-blue-100 rounded-xl border-2 border-blue-300 hover:border-blue-500 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-bl-full opacity-50"></div>
                  <div className="relative p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-md font-bold text-blue-900 group-hover:text-indigo-600 transition-colors">{c.name}</h3>
                      </div>
                    </div>
                    {c.description && (
                      <p className="text-md text-gray-700 leading-relaxed ">{c.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* Core Themes */}
        {page.core_themes && page.core_themes.length > 0 && (
          <section className="mb-12">
            <div className="relative mb-8">
              <h2 className="text-3xl font-bold text-blue-900 text-center mb-2 relative inline-block w-full">
                <span className="relative z-10 bg-white px-6">Core Themes</span>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300"></div>
              </h2>
            </div>
            <div className="space-y-5">
              {page.core_themes.map((ct: any, idx: number) => (
                <div key={idx} className="relative bg-white border-2 border-blue-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-400 via-indigo-500 to-purple-500"></div>
                  <div className="pl-8 pr-6 py-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-400">
                        <span className="text-md font-bold text-blue-700">{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-md font-bold text-blue-900 mb-2">{typeof ct.title === 'string' ? ct.title : ct['title']}</h3>
                        {ct.description && <p className="text-md text-gray-700 leading-relaxed">{ct.description}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* The Eighteen Parvas (object-based, like Ramayana Kandas) */}
        {page.parvas && Object.keys(page.parvas).length > 0 && (
          <section className="mb-12">
            <div className="relative mb-8">
              <h2 className="text-3xl font-bold text-blue-900 text-center mb-2 relative inline-block w-full">
                <span className="relative z-10 bg-white px-6">The Eighteen Parvas</span>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300"></div>
              </h2>
              <p className="text-center text-gray-600 mt-4 text-md max-w-2xl mx-auto">Journey through the eighteen books of the Mahabharata, each revealing profound wisdom about duty, morality, and the complexity of human nature.</p>
            </div>
            <div className="space-y-8">
              {Object.entries(page.parvas)
                .sort(([, a]: [string, any], [, b]: [string, any]) => (a.order || 0) - (b.order || 0))
                .map(([parvaKey, parva]: [string, any], index: number) => {
                  if (!parva) return null;
                  const colors = [
                    { bg: 'from-red-50 to-orange-50', border: 'border-red-400', accent: 'bg-red-500', text: 'text-red-900', hover: 'hover:border-red-600' },
                    { bg: 'from-pink-50 to-rose-50', border: 'border-pink-400', accent: 'bg-pink-500', text: 'text-pink-900', hover: 'hover:border-pink-600' },
                    { bg: 'from-purple-50 to-violet-50', border: ' border-purple-400', accent: 'bg-purple-500', text: 'text-purple-900', hover: 'hover:border-purple-600' },
                    { bg: 'from-blue-50 to-cyan-50', border: 'border-blue-400', accent: 'bg-blue-500', text: 'text-blue-900', hover: 'hover:border-blue-600' },
                    { bg: 'from-green-50 to-emerald-50', border: 'border-green-400', accent: ' bg-green-500', text: 'text-green-900', hover: 'hover:border-green-600' },
                    { bg: 'from-yellow-50 to-amber-50', border: 'border-yellow-400', accent: 'bg-yellow-500', text: 'text-yellow-900', hover: 'hover:border-yellow-600' },
                    { bg: 'from-orange-50 to-red-50', border: 'border-orange-400', accent: 'bg-orange-500', text: 'text-orange-900', hover: 'hover:border-orange-600' },
                    { bg: 'from-teal-50 to-green-50', border: 'border-teal-400', accent: 'bg-teal-500', text: 'text-teal-900', hover: 'hover:border-teal-600' },
                    { bg: 'from-indigo-50 to-blue-50', border: 'border-indigo-400', accent: 'bg-indigo-500', text: 'text-indigo-900', hover: 'hover:border-indigo-600' },
                    { bg: 'from-violet-50 to-purple-50', border: 'border-violet-400', accent: 'bg-violet-500', text: 'text-violet-900', hover: 'hover:border-violet-600' },
                    { bg: 'from-fuchsia-50 to-pink-50', border: 'border-fuchsia-400', accent: 'bg-fuchsia-500', text: 'text-fuchsia-900', hover: 'hover:border-fuchsia-600' },
                    { bg: 'from-cyan-50 to-blue-50', border: 'border-cyan-400', accent: 'bg-cyan-500', text: 'text-cyan-900', hover: 'hover:border-cyan-600' },
                    { bg: 'from-lime-50 to-green-50', border: 'border-lime-400', accent: 'bg-lime-500', text: 'text-lime-900', hover: 'hover:border-lime-600' },
                    { bg: 'from-amber-50 to-yellow-50', border: 'border-amber-400', accent: 'bg-amber-500', text: 'text-amber-900', hover: 'hover:border-amber-600' },
                    { bg: 'from-rose-50 to-red-50', border: 'border-rose-400', accent: 'bg-rose-500', text: 'text-rose-900', hover: 'hover:border-rose-600' },
                    { bg: 'from-sky-50 to-blue-50', border: 'border-sky-400', accent: 'bg-sky-500', text: 'text-sky-900', hover: 'hover:border-sky-600' },
                    { bg: 'from-emerald-50 to-green-50', border: 'border-emerald-400', accent: 'bg-emerald-500', text: 'text-emerald-900', hover: 'hover:border-emerald-600' },
                    { bg: 'from-slate-50 to-gray-50', border: 'border-slate-400', accent: 'bg-slate-500', text: 'text-slate-900', hover: 'hover:border-slate-600' }
                  ];
                  const color = colors[index % colors.length];
                  return (
                    <article key={parvaKey} className={`relative bg-gradient-to-br ${color.bg} rounded-2xl border-2 ${color.border} ${color.hover} shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
                      <div className={`absolute top-0 left-0 w-full h-1 ${color.accent}`}></div>
                      <div className="p-8">
                        <div className="flex items-start gap-6 mb-6">
                          <div className={`flex-shrink-0 w-16 h-16 ${color.accent} rounded-2xl flex items-center justify-center shadow-lg transform rotate-3`}>
                            <span className="text-white font-black text-2xl transform -rotate-3">{parva.order || index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className={`text-2xl font-black ${color.text} mb-2`}>
                              {parva.parvaname || parvaKey.replace(/_/g, ' ').toUpperCase()}
                            </h4>
                          </div>
                        </div>
                        {parva.detailednarration && (
                          <div className="mb-6 pl-0 md:pl-22">
                            <div className="bg-white bg-opacity-70 rounded-xl p-5 border border-gray-200">
                              <p className="text-lg text-gray-800 leading-relaxed">
                                {parva.detailednarration.split('\n\n').slice(0, 2).join('\n\n')}...
                              </p>
                            </div>
                          </div>
                        )}
                        {parva.moralpsychologicalphilosophicallessons && (
                          <div className="mb-6 pl-0 md:pl-22">
                            <div className="bg-white bg-opacity-90 rounded-xl p-5 border-l-4 border-blue-500">
                              <p className="text-lg font-bold text-blue-700 uppercase tracking-wider mb-2">📚 Key Lessons</p>
                              <p className="text-lg text-gray-700 leading-relaxed">{parva.moralpsychologicalphilosophicallessons}</p>
                            </div>
                          </div>
                        )}
                        <div className="pl-0 md:pl-22 flex justify-end">
                          <Link
                            href={`/scriptures/mahabharata/parva/${parvaKey}`}
                            className={`inline-flex items-center gap-2 ${color.accent} hover:opacity-90 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 transform`}
                          >
                            <span>Read Complete Parva</span>
                            <span className="text-lg">→</span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
          </section>
        )}
        {/* Conclusion */}
        {page.conclusion && (
          <section className="mb-12">
            <div className="relative mb-8">
              <h2 className="text-3xl font-bold text-blue-900 text-center mb-2 relative inline-block w-full">
                <span className="relative z-10 bg-white px-6">Timeless Relevance</span>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-200 via-blue-500 to-blue-300"></div>
              </h2>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-300 shadow-xl p-8">
              <p className="text-md text-gray-700 leading-relaxed">{page.conclusion}</p>
            </div>
          </section>
        )}
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */