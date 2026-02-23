/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import PageLayout from '@components/common/PageLayout';
import Link from 'next/link';
import { createGenerateMetadata } from '@lib/pageUtils';
import { t, detectLocale, getLocaleNamespaceObject, getMeta, DEFAULT_LOCALE } from '@lib/i18n';
export const generateMetadata = createGenerateMetadata('scriptures_bhagavadgita');

const _localeObj = getLocaleNamespaceObject('scriptures_bhagavadgita');
const ns = (_localeObj && ((_localeObj as any)['scriptures_bhagavadgita'] || _localeObj)) || {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'scriptures_bhagavadgita' ? parts.shift() : 'scriptures_bhagavadgita';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || DEFAULT_LOCALE;
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('scriptures_bhagavadgita', {}, locale) || {};
    const loc: any = getLocaleNamespaceObject(locale, 'scriptures_bhagavadgita') || {};
    const gita = loc?.scriptures_bhagavadgita || {};
    const title = typeof k.title === 'string' ? k.title : (gita.title || __getLoc('scriptures_bhagavadgita.title') || '');
    let description: string = '';
    const descSource = k.meta?.description || gita.meta?.description;
    if (typeof descSource === 'string') description = descSource;
    else if (descSource && typeof descSource === 'object') description = descSource[locale] || descSource['translate'] || '';
    const parts = Array.isArray(gita.parts) ? gita.parts : [];
    return {
      title,
      description,
      parts,
      meta: gita.meta || {},
    };
  })();

  return (
    <PageLayout
      metaKey="scriptures_bhagavadgita"
      title={page.title}
      description={page.description}
      titleColor="from-orange-600 via-red-600 to-amber-700"
      titleBorder="border-amber-500"
      breadcrumbs={[
        { labelKey: 'Home', href: '/' },
        { label: 'Scriptures', href: '/scriptures' }]}
      className="layout-md"
    >
      {/* Parts Grid */}
      {page.parts && (
        <section className="mb-12">
          <div className="relative mb-8">
            <h4 className="text-3xl font-bold text-amber-900 text-center mb-2 relative inline-block w-full">
              <span className="relative z-10 bg-white px-6">Gita Parts</span>
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {page.parts.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-12">No content available.</div>
            )}
            {Object.entries(page.parts)
              .sort(([, a]: [string, any], [, b]: [string, any]) => (a.order || 0) - (b.order || 0))
              .map(([partKey, part]: [string, any], i: number) => {
                if (!`bhagavadgita_part_${i}`) return null;
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
                const color = colors[i % colors.length];
                return (
                  <div key={partKey} className={`group relative rounded-xl border-2 border-red-300 hover:border-red-500 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-red-200 rounded-bl-full opacity-50"></div>
                    <div className="relative p-6">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-amber-900 group-hover:text-orange-600 transition-colors">{part.title}</h3>
                        </div>
                      </div>
                      {part.introduction && (
                        <p className="text-xl text-gray-700 leading-relaxed ">{part.introduction.context_of_kurukshetra || ''}</p>
                      )}
                      <div className="relative z-10 pt-4 flex items-center gap-2 text-amber-800 font-semibold text-xl hover:gap-3 transition-all duration-300">
                        <Link
                          href={`/scriptures/bhagavadgita/part/bhagavadgita_part_${i + 1}`}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <span>Read Part</span>
                          <span className="text-xl">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */