/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getMeta, DEFAULT_LOCALE, detectLocale, getLocaleNamespaceObject } from '@lib/i18n';
import Link from 'next/link';
import PageLayout from '@components/common/PageLayout';

export function generateStaticParams() {
  // Dynamically generate static params from JSON parts (usually 5 for Gita)
  const loc: any = getLocaleNamespaceObject(DEFAULT_LOCALE, 'scriptures_bhagavathgita') || {};
  const gita = loc?.scriptures_bhagavathgita || {};
  const parts = Array.isArray(gita.parts) ? gita.parts : [];
  return parts.map((_: unknown, i: number) => ({ part: String(i + 1) }));
}

export default function Page({ params, searchParams }: any) {
  const locale = detectLocale(searchParams) || DEFAULT_LOCALE;
  const S = (k: string) => String(t(k, locale));
  const loc: any = getLocaleNamespaceObject(locale, 'scriptures_bhagavathgita') || {};
  const gita = loc?.scriptures_bhagavathgita || {};
  const parts = Array.isArray(gita.parts) ? gita.parts : [];
  const idx = params?.part ? Number(params.part) - 1 : 0;
  const part = parts[idx] || null;
  const title = part?.title || `Part ${params?.part}`;

  return (
    <PageLayout
      metaKey="scriptures_bhagavathgita_part"
      title={title}
      breadcrumbs={[
        { labelKey: 'Home', href: '/' },
        { label: gita.title || 'Bhagavad Gita', href: '/scriptures/bhagavathgita' },
        { label: title }
      ]}
      className="layout-md"
    >
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Navigation */}
          <nav className="mb-8">
            <Link
              href="/scriptures/bhagavathgita"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-gray-200"
            >
              <span className="text-xl">←</span>
              <span>Back to Bhagavad Gita</span>
            </Link>
          </nav>

          {/* Main Content */}
          <article className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
            {/* Decorative Header */}
            <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-8 py-12">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-4 left-4 w-20 h-20 border-4 border-white rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-32 h-32 border-4 border-white rounded-full"></div>
                <div className="absolute top-1/2 right-1/4 w-16 h-16 border-4 border-white rounded-full"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-2 rounded-full border-2 border-white border-opacity-50">
                    <p className="text-white text-sm font-bold uppercase tracking-widest">Sacred Scripture</p>
                  </div>
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white text-center mb-4 leading-tight drop-shadow-lg">
                  {title}
                </h3>
                <div className="flex justify-center">
                  <div className="w-32 h-1 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12">
              {part ? (
                <>
                  {/* Introduction */}
                  {part.introduction && (
                    <section className="mb-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-2xl">📜</span>
                        </div>
                        <h2 className="text-3xl font-bold text-amber-900">Introduction</h2>
                      </div>
                      <div className="prose prose-lg max-w-none">
                        {Object.entries(part.introduction).map(([k, v]: [string, any], idx: number) => (
                          <p key={idx} className="mb-4 text-gray-800 leading-relaxed text-justify">
                            <span className="font-semibold text-orange-700 mr-2">{k.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}:</span> {v}
                          </p>
                        ))}
                      </div>
                    </section>
                  )}
                  {/* Render all chapter/section content recursively for part-1 and similar objects */}
                  {Object.entries(part)
                    .filter(([k]) => k.startsWith('chapter_') || k.startsWith('chapters_') || k.startsWith('part-'))
                    .map(([k, v]: [string, any], idx: number) => (
                      <section key={k} className="mb-10">
                        <h3 className="text-2xl font-bold text-orange-800 mb-2">{k.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</h3>
                        <div className="prose prose-base max-w-none">
                          {typeof v === 'string' ? <p>{v}</p> : (
                            Array.isArray(v)
                              ? v.map((item, i) => (
                                  <div key={i} className="mb-3">
                                    {typeof item === 'string' ? item : JSON.stringify(item)}
                                  </div>
                                ))
                              : Object.entries(v).map(([subk, subv]: [string, any], subidx: number) => (
                                  <div key={subk} className="mb-3">
                                    <span className="font-semibold text-amber-700 mr-2">{subk.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}:</span> {typeof subv === 'string' ? subv : Array.isArray(subv) ? subv.join(', ') : JSON.stringify(subv)}
                                  </div>
                                ))
                          )}
                        </div>
                      </section>
                    ))}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                    <span className="text-4xl text-gray-400">💭</span>
                  </div>
                  <p className="text-xl text-gray-600 font-medium">Content not available for this part.</p>
                  <p className="text-sm text-gray-500 mt-2">Please check back later or explore other parts.</p>
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            {part && (
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-8 py-6 border-t-2 border-amber-200">
                <div className="flex justify-center">
                  <Link
                    href="/scriptures/bhagavathgita"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span className="text-xl">←</span>
                    <span>Explore All Parts</span>
                  </Link>
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </PageLayout>
  );
}
