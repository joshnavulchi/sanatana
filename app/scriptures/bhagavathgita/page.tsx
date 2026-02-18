/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import PageLayout from '@components/common/PageLayout';
import Link from 'next/link';
import { createGenerateMetadata } from '@lib/pageUtils';
import { t, detectLocale, getLocaleNamespaceObject, getMeta, DEFAULT_LOCALE } from '@lib/i18n';
export const generateMetadata = createGenerateMetadata('scriptures_bhagavathgita');

const _localeObj = getLocaleNamespaceObject('scriptures_bhagavathgita');
const ns = (_localeObj && ((_localeObj as any)['scriptures_bhagavathgita'] || _localeObj)) || {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'scriptures_bhagavathgita' ? parts.shift() : 'scriptures_bhagavathgita';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || DEFAULT_LOCALE;
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('scriptures_bhagavathgita', {}, locale) || {};
    const loc: any = getLocaleNamespaceObject(locale, 'scriptures_bhagavathgita') || {};
    const gita = loc?.scriptures_bhagavathgita || {};
    const title = typeof k.title === 'string' ? k.title : (gita.title || __getLoc('scriptures_bhagavathgita.title') || '');
    let description: string = '';
    const descSource = k.description || gita.description;
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
      metaKey="scriptures_bhagavathgita"
      title={page.title}
      breadcrumbs={[
        { labelKey: 'Home', href: '/' },
        { label:  'Scriptures', href: '/scriptures' },
        { label: page.title }]}
      className="layout-md"
    >
      <div className="px-3 py-12">
        {/* Hero Header Section */}
        <section className="relative mb-12 bg-amber-50 overflow-hidden">
          <div className="px-8 py-10">
            <div className="text-center mb-6">
              <div className="inline-block relative">
                <h3 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-amber-700 mb-3">
                  {page.title}
                </h3>
                <div className="absolute -top-4 -left-4 w-16 h-16 border-t-4 border-l-4 border-amber-500 rounded-tl-3xl"></div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-4 border-r-4 border-amber-500 rounded-br-3xl"></div>
              </div>
            </div>
            {page.meta?.description && (
              <div className="max-w-3xl mx-auto">
                <p className="text-center text-base text-amber-800 leading-relaxed italic font-medium px-4">
                  &ldquo;{page.meta.description}&rdquo;
                </p>
              </div>
            )}
          </div>
        </section>
        {/* Parts Grid */}
        {page.parts && (
          <section className="mb-12">
            <div className="relative mb-8">
              <h4 className="text-3xl font-bold text-amber-900 text-center mb-2 relative inline-block w-full">
                <span className="relative z-10 bg-white px-6">Gita Parts</span>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {page.parts.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-12">No content available.</div>
              )}
              {page.parts.map((part: any, i: number) => {
                return (
                  <div key={i} className="group relative bg-gradient-to-br from-white to-amber-50 rounded-xl border-2 border-amber-300 hover:border-amber-500 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-200 rounded-bl-full opacity-50"></div>
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
                        <p className="text-sm text-gray-700 leading-relaxed pl-13">{part.introduction.context_of_kurukshetra || ''}</p>
                      )}
                      <div className="relative z-10 pt-4 flex items-center gap-2 text-amber-800 font-semibold text-sm hover:gap-3 transition-all duration-300">
                        <Link
                          href={`/scriptures/bhagavathgita/part/${i + 1}`}
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
      </div>
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */