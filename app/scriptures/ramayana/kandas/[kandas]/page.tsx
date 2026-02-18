/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getMeta, DEFAULT_LOCALE, detectServerLocaleFromHeaders, detectLocale, getLocaleNamespaceObject } from '@lib/i18n';
import { headers } from 'next/headers';
import Link from 'next/link';
import PageLayout from '@components/common/PageLayout';

const ns: Record<string, unknown> = {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'ramayana' ? parts.shift() : 'ramayana';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
function resolveLocaleFromHeaders() {
  try {
    const h: any = headers();
    return detectServerLocaleFromHeaders(h);
  } catch (e) {
    return DEFAULT_LOCALE;
  }
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ kandas: string }>, searchParams?: any }) {
  const resolvedParams = await params;
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));

  const loc: any = getLocaleNamespaceObject(locale, 'scriptures_ramayana') || {};
  const ram = loc?.scriptures_ramayana || {};
  const kandas = ram.story_divided_by_kandas || {};
  const kandaKeys = Object.keys(kandas);
  const chapterKey = resolvedParams?.kandas || '';
  const kanda = kandas[chapterKey];
  
  const title = kanda?.title ? `${S('nav.stories.nav.ramayana')} — ${kanda.title}` : `${S('nav.stories.nav.ramayana')} — Chapter ${chapterKey}`;
  const meta = getMeta('ramayana_slug', { title: title, excerpt: kanda?.lessons || '' }, locale);
  const description = kanda?.lessons || meta.description;
  const keywords = (meta.keywords && String(meta.keywords).trim()) ? meta.keywords : `${S('nav.stories.nav.ramayana')}, ${chapterKey}`;
  const ogImages = meta.ogImage ? [meta.ogImage] : undefined;
  return {
    title,
    description,
    keywords,
    openGraph: { title, description, images: ogImages },
    alternates: { canonical: meta.canonical || meta.url || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in' }
  };
}

export function generateStaticParams() {
  try {
    // At build time, synchronously load the default locale namespace
    const loc: any = getLocaleNamespaceObject(DEFAULT_LOCALE, 'scriptures_ramayana') || {};
    const ram = loc?.scriptures_ramayana || {};
    const kandas = ram.story_divided_by_kandas || {};
    const kandaKeys = Object.keys(kandas);
    if (kandaKeys.length > 0) {
      return kandaKeys.map((key: string) => ({ kandas: key }));
    }
  } catch (e) { }
  // Fallback: generate an initial set (the 7 kandas of Ramayana)
  return [
    { kandas: 'bala_kanda' },
    { kandas: 'ayodhya_kanda' },
    { kandas: 'aranya_kanda' },
    { kandas: 'kishkindha_kanda' },
    { kandas: 'sundara_kanda' },
    { kandas: 'yuddha_kanda' },
    { kandas: 'uttara_kanda' }
  ];
}

export default async function Page({ params, searchParams }: { params: Promise<{ kandas: string }>, searchParams?: any }) {
  const resolvedParams = await params;
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  
  const loc: any = getLocaleNamespaceObject(locale, 'scriptures_ramayana') || {};
  const ram = loc?.scriptures_ramayana || {};
  const kandas = ram.story_divided_by_kandas || {};
  const chapterKey = resolvedParams?.kandas || '';
  const kanda = kandas[chapterKey];

  const title = kanda?.title ? kanda.title : (chapterKey ? `Chapter: ${chapterKey.replace(/_/g, ' ').toUpperCase()}` : 'Chapter');
  
  // Color mapping for different kandas with full Tailwind classes
  const getKandaClasses = (key: string) => {
    switch(key) {
      case 'bala_kanda':
        return {
          bgGradient: 'from-violet-100 via-purple-50 to-pink-100',
          headerBg: 'from-violet-500 via-purple-500 to-violet-600',
          iconBg: 'from-violet-400 to-purple-500',
          textColor: 'text-violet-900',
          sectionBg: 'from-violet-50 to-purple-50',
          sectionBorder: 'border-violet-200',
          buttonBg: 'from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600',
          footerBg: 'from-violet-100 to-purple-100',
          footerBorder: 'border-violet-200'
        };
      case 'ayodhya_kanda':
        return {
          bgGradient: 'from-blue-100 via-sky-50 to-cyan-100',
          headerBg: 'from-blue-500 via-indigo-500 to-blue-600',
          iconBg: 'from-blue-400 to-indigo-500',
          textColor: 'text-blue-900',
          sectionBg: 'from-blue-50 to-indigo-50',
          sectionBorder: 'border-blue-200',
          buttonBg: 'from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
          footerBg: 'from-blue-100 to-indigo-100',
          footerBorder: 'border-blue-200'
        };
      case 'aranya_kanda':
        return {
          bgGradient: 'from-green-100 via-emerald-50 to-teal-100',
          headerBg: 'from-green-500 via-emerald-500 to-green-600',
          iconBg: 'from-green-400 to-emerald-500',
          textColor: 'text-green-900',
          sectionBg: 'from-green-50 to-emerald-50',
          sectionBorder: 'border-green-200',
          buttonBg: 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
          footerBg: 'from-green-100 to-emerald-100',
          footerBorder: 'border-green-200'
        };
      case 'kishkindha_kanda':
        return {
          bgGradient: 'from-yellow-100 via-amber-50 to-orange-100',
          headerBg: 'from-yellow-500 via-amber-500 to-yellow-600',
          iconBg: 'from-yellow-400 to-amber-500',
          textColor: 'text-yellow-900',
          sectionBg: 'from-yellow-50 to-amber-50',
          sectionBorder: 'border-yellow-200',
          buttonBg: 'from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600',
          footerBg: 'from-yellow-100 to-amber-100',
          footerBorder: 'border-yellow-200'
        };
      case 'sundara_kanda':
        return {
          bgGradient: 'from-orange-100 via-amber-50 to-red-100',
          headerBg: 'from-orange-500 via-red-500 to-orange-600',
          iconBg: 'from-orange-400 to-red-500',
          textColor: 'text-orange-900',
          sectionBg: 'from-orange-50 to-red-50',
          sectionBorder: 'border-orange-200',
          buttonBg: 'from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600',
          footerBg: 'from-orange-100 to-red-100',
          footerBorder: 'border-orange-200'
        };
      case 'yuddha_kanda':
        return {
          bgGradient: 'from-rose-100 via-pink-50 to-red-100',
          headerBg: 'from-rose-500 via-red-500 to-rose-600',
          iconBg: 'from-rose-400 to-red-500',
          textColor: 'text-rose-900',
          sectionBg: 'from-rose-50 to-red-50',
          sectionBorder: 'border-rose-200',
          buttonBg: 'from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600',
          footerBg: 'from-rose-100 to-red-100',
          footerBorder: 'border-rose-200'
        };
      case 'uttara_kanda':
        return {
          bgGradient: 'from-amber-100 via-yellow-50 to-orange-100',
          headerBg: 'from-amber-500 via-orange-500 to-amber-600',
          iconBg: 'from-amber-400 to-orange-500',
          textColor: 'text-amber-900',
          sectionBg: 'from-amber-50 to-orange-50',
          sectionBorder: 'border-amber-200',
          buttonBg: 'from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
          footerBg: 'from-amber-100 to-orange-100',
          footerBorder: 'border-amber-200'
        };
      default:
        return {
          bgGradient: 'from-amber-100 via-yellow-50 to-orange-100',
          headerBg: 'from-amber-500 via-orange-500 to-amber-600',
          iconBg: 'from-amber-400 to-orange-500',
          textColor: 'text-amber-900',
          sectionBg: 'from-amber-50 to-orange-50',
          sectionBorder: 'border-amber-200',
          buttonBg: 'from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
          footerBg: 'from-amber-100 to-orange-100',
          footerBorder: 'border-amber-200'
        };
    }
  };
  
  const classes = getKandaClasses(chapterKey);

  return (
    <>
      <PageLayout
        metaKey="ramayana_kanda"
        title={title}
        breadcrumbs={[
          { labelKey: 'Home', href: '/' },
          { label:  'Scriptures', href: '/scriptures' },
          { label: title }]}
        className="layout-md"
      >
        <div className={`min-h-screen bg-gradient-to-br ${classes.bgGradient} py-8 px-4`}>
          <div className="max-w-5xl mx-auto">
          {/* Navigation */}
          <nav className="mb-8">
            <Link 
              href="/scriptures/ramayana" 
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-gray-200"
            >
              <span className="text-xl">←</span>
              <span>Back to Ramayana</span>
            </Link>
          </nav>
          
          {/* Main Content */}
          <article className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
            {/* Decorative Header */}
            <div className={`relative bg-gradient-to-r ${classes.headerBg} px-8 py-12`}>
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-4 left-4 w-20 h-20 border-4 border-white rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-32 h-32 border-4 border-white rounded-full"></div>
                <div className="absolute top-1/2 right-1/4 w-16 h-16 border-4 border-white rounded-full"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-2 rounded-full border-2 border-white border-opacity-50">
                    <p className="text-white text-sm font-bold uppercase tracking-widest">Sacred Epic of Ramayana</p>
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
              {kanda ? (
                <>
                  {/* Story Narrative */}
                  {kanda.narrative && (
                    <section className="mb-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`w-12 h-12 bg-gradient-to-br ${classes.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                          <span className="text-white text-2xl">📜</span>
                        </div>
                        <h2 className={`text-3xl font-bold ${classes.textColor}`}>The Story</h2>
                      </div>
                      
                      <div className="relative">
                        {/* Decorative Quote Marks */}
                        <div className="absolute -left-4 -top-4 text-6xl text-gray-200 font-serif leading-none">“</div>
                        <div className="prose prose-lg max-w-none">
                          {kanda.narrative.split('\n\n').map((paragraph: string, idx: number) => (
                            <p key={idx} className="mb-6 text-gray-800 leading-relaxed text-justify first-letter:text-5xl first-letter:font-bold first-letter:mr-2 first-letter:float-left">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}
                  
                  {/* Key Lessons */}
                  {kanda.lessons && (
                    <section className={`bg-gradient-to-br ${classes.sectionBg} rounded-2xl border-2 ${classes.sectionBorder} shadow-xl p-8`}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-2xl">💡</span>
                        </div>
                        <h3 className="text-2xl font-bold text-amber-900">Key Lessons & Wisdom</h3>
                      </div>
                      <div className="relative bg-white bg-opacity-60 rounded-xl p-6 border-l-4 border-amber-500">
                        <p className="text-base text-gray-800 leading-relaxed italic">
                          {kanda.lessons}
                        </p>
                      </div>
                    </section>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                    <span className="text-4xl text-gray-400">💭</span>
                  </div>
                  <p className="text-xl text-gray-600 font-medium">Content not available for this chapter.</p>
                  <p className="text-sm text-gray-500 mt-2">Please check back later or explore other chapters.</p>
                </div>
              )}
            </div>
            
            {/* Footer Navigation */}
            {kanda && (
              <div className={`bg-gradient-to-r ${classes.footerBg} px-8 py-6 border-t-2 ${classes.footerBorder}`}>
                <div className="flex justify-center">
                  <Link 
                    href="/scriptures/ramayana" 
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${classes.buttonBg} text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <span className="text-xl">←</span>
                    <span>Explore All Chapters</span>
                  </Link>
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
