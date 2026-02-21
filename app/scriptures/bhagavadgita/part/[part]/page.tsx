/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import React from 'react';
import Link from 'next/link';
import { detectLocale, getLocaleNamespaceObject, DEFAULT_LOCALE } from '@lib/i18n';
import { notFound } from 'next/navigation';
import PageLayout from '@components/common/PageLayout';

export async function generateMetadata({ params, searchParams }: { params: Promise<{ part: string }>, searchParams?: any }) {
  const resolvedParams = await params;
  const locale = detectLocale(searchParams) || DEFAULT_LOCALE;
  const partKey = resolvedParams.part;

  const loc: any = getLocaleNamespaceObject(locale, 'scriptures_bhagavadgita') || {};
  const gita = loc?.scriptures_bhagavadgita || {};
  const parts = Array.isArray(gita.parts) ? gita.parts : [];

  const part = parts.find((p: any) => {
    if (!p || !p.title) return false;
    const key = p.title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[()]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '');
    return key === partKey;
  });
  const title = part?.title ? `Bhagavad Gita — ${part.title}` : `Bhagavad Gita — Part ${partKey}`;
  const description = part?.summary || part?.moralPsychologicalPhilosophicalLessons || 'Discover the profound wisdom of the Bhagavad Gita';
  const keywords = `Bhagavad Gita, ${part?.title || partKey}, Indian Epic, Hindu Scripture`;

  return {
    title,
    description,
    keywords,
    openGraph: { title, description },
    alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in'}/scriptures/bhagavadgita/part/${partKey}` }
  };
}

const _localeObj = getLocaleNamespaceObject('scriptures_bhagavdgita');
const ns = (_localeObj && ((_localeObj as any)['scriptures_bhagavadgita'] || ((_localeObj as any).bhagavadgita) || _localeObj)) || {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'scriptures_bhagavadgita' ? parts.shift() : 'scriptures_bhagavadgita';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};

// Recursively render nested JSON content in a uniquely styled way
function renderContent(value: any): React.ReactNode {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return <span className="text-orange-900 font-medium px-1 py-0.5 rounded">{String(value)}</span>;
  }
  if (Array.isArray(value)) {
    return (
      <ul className="pl-4 space-y-1">
        {value.map((item: any, idx: number) => (
          <li key={idx} className="border-l-4 border-orange-300 bg-orange-50 px-3 py-1 rounded mb-1">
            {renderContent(item)}
          </li>
        ))}
      </ul>
    );
  }
  if (typeof value === 'object' && value !== null) {
    return (
      <div className="divide-y divide-orange-200">
        {Object.entries(value).map(([k, v]: [string, any], idx: number) => (
          <div key={k + idx} className="py-2">
            <div className="text-orange-700 font-semibold mb-1 text-base flex items-center">
              <span className="bg-orange-100 px-2 py-1 rounded mr-2">
                {k.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </span>
            </div>
            <div className="ml-4">{renderContent(v)}</div>
          </div>
        ))}
      </div>
    );
  }
  return <span />;
}

export function generateStaticParams() {
  try {
    const loc: any = getLocaleNamespaceObject(DEFAULT_LOCALE, 'scriptures_bhagavadgita') || {};
    const gita = loc?.scriptures_bhagavadgita ?? {};
    const parts: any[] = Array.isArray(gita.parts) ? gita.parts : [];
    // Each part object has keys like 'bhagavadgita_part_1', 'bhagavadgita_part_2', etc.
    const partsKeys = parts
      .map((p: any) => {
        if (!p) return null;
        const key = Object.keys(p).find(k => k.startsWith('bhagavadgita_part_'));
        if (!key) return null;
        return key.toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[()]/g, '')
          .replace(/__+/g, '_')
          .replace(/^_|_$/g, '');
      })
      .filter((k): k is string => typeof k === 'string');
    if (partsKeys.length > 0) {
      return partsKeys.map((key) => ({ part: key }));
    }
  } catch (e) {
    console.error('Error generating static params for parvas:', e);
    return [];
  }
  // Fallback: generate static params from JSON structure
  return [
    { part: 'bhagavadgita_part_1' },
    { part: 'bhagavadgita_part_2' },
    { part: 'bhagavadgita_part_3' },
    { part: 'bhagavadgita_part_4' },
    { part: 'bhagavadgita_part_5' },
    { part: 'bhagavadgita_part_6' },
    { part: 'bhagavadgita_part_7' },
    { part: 'bhagavadgita_part_8' },
    { part: 'bhagavadgita_part_9' },
    { part: 'bhagavadgita_part_10' },
    { part: 'bhagavadgita_part_11' },
    { part: 'bhagavadgita_part_12' },
    { part: 'bhagavadgita_part_13' },
    { part: 'bhagavadgita_part_14' },
    { part: 'bhagavadgita_part_15' },
    { part: 'bhagavadgita_part_16' },
    { part: 'bhagavadgita_part_17' },
    { part: 'bhagavadgita_part_18' },
    { part: 'bhagavadgita_part_19' },
    { part: 'bhagavadgita_part_20' },
    { part: 'bhagavadgita_part_21' },
    { part: 'bhagavadgita_part_22' },
    { part: 'bhagavadgita_part_23' },
    { part: 'bhagavadgita_part_24' },
    { part: 'bhagavadgita_part_25' },
    { part: 'bhagavadgita_part_26' },
    { part: 'bhagavadgita_part_27' },
    { part: 'bhagavadgita_part_28' },
    { part: 'bhagavadgita_part_29' },
    { part: 'bhagavadgita_part_30' },
    { part: 'bhagavadgita_part_31' },
    { part: 'bhagavadgita_part_32' },
    { part: 'bhagavadgita_part_33' },
    { part: 'bhagavadgita_part_34' },
    { part: 'bhagavadgita_part_35' },
    { part: 'bhagavadgita_part_36' },
    { part: 'bhagavadgita_part_37' }];
}

export default async function Page({ params, searchParams }: { params: Promise<{ part: string }>, searchParams?: any }) {
  const resolvedParams = await params;
  const locale = detectLocale(searchParams) || DEFAULT_LOCALE;
  const partKey = resolvedParams.part;

  // Bhagavadgita pattern: object mapping, section order, navigation
  const loc: any = getLocaleNamespaceObject(locale, 'scriptures_bhagavadgita') || {};
  const gita = loc?.scriptures_bhagavadgita || {};
  const partsArr = Array.isArray(gita.parts) ? gita.parts : [];

  // Sort by order
  const allParts = partsArr.slice().sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  // Find part by normalized key (underscore)
  const part = allParts.find((p: any, i: number) => {
    if (!p) return false;
    // Find the key that starts with 'bhagavadgita_part_'
    const partKeyName = Object.keys(p).find(k => k.startsWith('bhagavadgita_part_'));
    if (!partKeyName) return false;
    const key = partKeyName.toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[()]/g, '')
      .replace(/__+/g, '_')
      .replace(/^_|_$/g, '');
    return key === partKey;
  });
  if (!part) notFound();
  // Navigation
  const currentIndex = allParts.findIndex((p: any, i: number) => {
    if (!p) return false;
    const partKeyName = Object.keys(p).find(k => k.startsWith('bhagavadgita_part_'));
    if (!partKeyName) return false;
    const key = partKeyName.toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[()]/g, '')
      .replace(/__+/g, '_')
      .replace(/^_|_$/g, '');
    return key === partKey;
  });
  const prevPart = currentIndex > 0 ? allParts[currentIndex - 1] : null;
  const nextPart = currentIndex < allParts.length - 1 ? allParts[currentIndex + 1] : null;
  const getPartSafeKey = (p: any, i: number) => {
    if (!p) return '';
    const partKeyName = Object.keys(p).find(k => k.startsWith('bhagavadgita_part_'));
    if (!partKeyName) return '';
    return partKeyName.toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[()]/g, '')
      .replace(/__+/g, '_')
      .replace(/^_|_$/g, '');
  };

  // Color mapping for different parvas
  const getPartClasses = (order: number) => {
    const colorSchemes = [
      { // 1. Adi Parva
        bgGradient: 'from-red-100 via-rose-50 to-pink-100',
        headerBg: 'from-red-500 via-rose-500 to-red-600',
        iconBg: 'from-red-400 to-rose-500',
        textColor: 'text-red-900',
        sectionBg: 'from-red-50 to-rose-50',
        sectionBorder: 'border-red-200',
        buttonBg: 'from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600',
        footerBg: 'from-red-100 to-rose-100',
        footerBorder: 'border-red-200'
      },
      { // 2. Sabha Parva
        bgGradient: 'from-pink-100 via-fuchsia-50 to-purple-100',
        headerBg: 'from-pink-500 via-fuchsia-500 to-pink-600',
        iconBg: 'from-pink-400 to-fuchsia-500',
        textColor: 'text-pink-900',
        sectionBg: 'from-pink-50 to-fuchsia-50',
        sectionBorder: 'border-pink-200',
        buttonBg: 'from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600',
        footerBg: 'from-pink-100 to-fuchsia-100',
        footerBorder: 'border-pink-200'
      },
      { // 3. Vana Parva
        bgGradient: 'from-purple-100 via-violet-50 to-indigo-100',
        headerBg: 'from-purple-500 via-violet-500 to-purple-600',
        iconBg: 'from-purple-400 to-violet-500',
        textColor: 'text-purple-900',
        sectionBg: 'from-purple-50 to-violet-50',
        sectionBorder: 'border-purple-200',
        buttonBg: 'from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600',
        footerBg: 'from-purple-100 to-violet-100',
        footerBorder: 'border-purple-200'
      },
      { // 4. Virata Parva
        bgGradient: 'from-blue-100 via-sky-50 to-cyan-100',
        headerBg: 'from-blue-500 via-sky-500 to-blue-600',
        iconBg: 'from-blue-400 to-sky-500',
        textColor: 'text-blue-900',
        sectionBg: 'from-blue-50 to-sky-50',
        sectionBorder: 'border-blue-200',
        buttonBg: 'from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600',
        footerBg: 'from-blue-100 to-sky-100',
        footerBorder: 'border-blue-200'
      },
      { // 5. Udyoga Parva
        bgGradient: 'from-cyan-100 via-teal-50 to-emerald-100',
        headerBg: 'from-cyan-500 via-teal-500 to-cyan-600',
        iconBg: 'from-cyan-400 to-teal-500',
        textColor: 'text-cyan-900',
        sectionBg: 'from-cyan-50 to-teal-50',
        sectionBorder: 'border-cyan-200',
        buttonBg: 'from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600',
        footerBg: 'from-cyan-100 to-teal-100',
        footerBorder: 'border-cyan-200'
      },
      { // 6. Bhishma Parva
        bgGradient: 'from-green-100 via-emerald-50 to-teal-100',
        headerBg: 'from-green-500 via-emerald-500 to-green-600',
        iconBg: 'from-green-400 to-emerald-500',
        textColor: 'text-green-900',
        sectionBg: 'from-green-50 to-emerald-50',
        sectionBorder: 'border-green-200',
        buttonBg: 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
        footerBg: 'from-green-100 to-emerald-100',
        footerBorder: 'border-green-200'
      },
      { // 7. Drona Parva
        bgGradient: 'from-lime-100 via-green-50 to-emerald-100',
        headerBg: 'from-lime-500 via-green-500 to-lime-600',
        iconBg: 'from-lime-400 to-green-500',
        textColor: 'text-lime-900',
        sectionBg: 'from-lime-50 to-green-50',
        sectionBorder: 'border-lime-200',
        buttonBg: 'from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600',
        footerBg: 'from-lime-100 to-green-100',
        footerBorder: 'border-lime-200'
      },
      { // 8. Karna Parva
        bgGradient: 'from-yellow-100 via-amber-50 to-orange-100',
        headerBg: 'from-yellow-500 via-amber-500 to-yellow-600',
        iconBg: 'from-yellow-400 to-amber-500',
        textColor: 'text-yellow-900',
        sectionBg: 'from-yellow-50 to-amber-50',
        sectionBorder: 'border-yellow-200',
        buttonBg: 'from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600',
        footerBg: 'from-yellow-100 to-amber-100',
        footerBorder: 'border-yellow-200'
      },
      { // 9. Shalya Parva
        bgGradient: 'from-amber-100 via-orange-50 to-red-100',
        headerBg: 'from-amber-500 via-orange-500 to-amber-600',
        iconBg: 'from-amber-400 to-orange-500',
        textColor: 'text-amber-900',
        sectionBg: 'from-amber-50 to-orange-50',
        sectionBorder: 'border-amber-200',
        buttonBg: 'from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
        footerBg: 'from-amber-100 to-orange-100',
        footerBorder: 'border-amber-200'
      },
      { // 10. Sauptika Parva
        bgGradient: 'from-orange-100 via-red-50 to-rose-100',
        headerBg: 'from-orange-500 via-red-500 to-orange-600',
        iconBg: 'from-orange-400 to-red-500',
        textColor: 'text-orange-900',
        sectionBg: 'from-orange-50 to-red-50',
        sectionBorder: 'border-orange-200',
        buttonBg: 'from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600',
        footerBg: 'from-orange-100 to-red-100',
        footerBorder: 'border-orange-200'
      },
      { // 11. Stri Parva
        bgGradient: 'from-rose-100 via-pink-50 to-fuchsia-100',
        headerBg: 'from-rose-500 via-pink-500 to-rose-600',
        iconBg: 'from-rose-400 to-pink-500',
        textColor: 'text-rose-900',
        sectionBg: 'from-rose-50 to-pink-50',
        sectionBorder: 'border-rose-200',
        buttonBg: 'from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600',
        footerBg: 'from-rose-100 to-pink-100',
        footerBorder: 'border-rose-200'
      },
      { // 12. Shanti Parva
        bgGradient: 'from-indigo-100 via-blue-50 to-sky-100',
        headerBg: 'from-indigo-500 via-blue-500 to-indigo-600',
        iconBg: 'from-indigo-400 to-blue-500',
        textColor: 'text-indigo-900',
        sectionBg: 'from-indigo-50 to-blue-50',
        sectionBorder: 'border-indigo-200',
        buttonBg: 'from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600',
        footerBg: 'from-indigo-100 to-blue-100',
        footerBorder: 'border-indigo-200'
      },
      { // 13. Anushasana Parva
        bgGradient: 'from-violet-100 via-purple-50 to-fuchsia-100',
        headerBg: 'from-violet-500 via-purple-500 to-violet-600',
        iconBg: 'from-violet-400 to-purple-500',
        textColor: 'text-violet-900',
        sectionBg: 'from-violet-50 to-purple-50',
        sectionBorder: 'border-violet-200',
        buttonBg: 'from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600',
        footerBg: 'from-violet-100 to-purple-100',
        footerBorder: 'border-violet-200'
      },
      { // 14. Ashvamedhika Parva
        bgGradient: 'from-teal-100 via-cyan-50 to-blue-100',
        headerBg: 'from-teal-500 via-cyan-500 to-teal-600',
        iconBg: 'from-teal-400 to-cyan-500',
        textColor: 'text-teal-900',
        sectionBg: 'from-teal-50 to-cyan-50',
        sectionBorder: 'border-teal-200',
        buttonBg: 'from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600',
        footerBg: 'from-teal-100 to-cyan-100',
        footerBorder: 'border-teal-200'
      },
      { // 15. Ashramavasika Parva
        bgGradient: 'from-emerald-100 via-green-50 to-lime-100',
        headerBg: 'from-emerald-500 via-green-500 to-emerald-600',
        iconBg: 'from-emerald-400 to-green-500',
        textColor: 'text-emerald-900',
        sectionBg: 'from-emerald-50 to-green-50',
        sectionBorder: 'border-emerald-200',
        buttonBg: 'from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600',
        footerBg: 'from-emerald-100 to-green-100',
        footerBorder: 'border-emerald-200'
      },
      { // 16. Mausala Parva
        bgGradient: 'from-slate-100 via-gray-50 to-zinc-100',
        headerBg: 'from-slate-500 via-gray-500 to-slate-600',
        iconBg: 'from-slate-400 to-gray-500',
        textColor: 'text-slate-900',
        sectionBg: 'from-slate-50 to-gray-50',
        sectionBorder: 'border-slate-200',
        buttonBg: 'from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600',
        footerBg: 'from-slate-100 to-gray-100',
        footerBorder: 'border-slate-200'
      },
      { // 17. Mahaprasthanika Parva
        bgGradient: 'from-sky-100 via-blue-50 to-indigo-100',
        headerBg: 'from-sky-500 via-blue-500 to-sky-600',
        iconBg: 'from-sky-400 to-blue-500',
        textColor: 'text-sky-900',
        sectionBg: 'from-sky-50 to-blue-50',
        sectionBorder: 'border-sky-200',
        buttonBg: 'from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600',
        footerBg: 'from-sky-100 to-blue-100',
        footerBorder: 'border-sky-200'
      },
      { // 18. Svargarohana Parva
        bgGradient: 'from-amber-100 via-yellow-50 to-lime-100',
        headerBg: 'from-amber-500 via-yellow-500 to-amber-600',
        iconBg: 'from-amber-400 to-yellow-500',
        textColor: 'text-amber-900',
        sectionBg: 'from-amber-50 to-yellow-50',
        sectionBorder: 'border-amber-200',
        buttonBg: 'from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600',
        footerBg: 'from-amber-100 to-yellow-100',
        footerBorder: 'border-amber-200'
      }
    ];

    return colorSchemes[(order - 1) % colorSchemes.length] || colorSchemes[0];
  };

  const classes = getPartClasses(part.order || 1);

  return (
    <PageLayout
      metaKey="scriptures_bhagavadgita"
      title={part.title}
      breadcrumbs={[
        { labelKey: 'Home', href: '/' },
        { label: part.title }
      ]}
      className="layout-md"
    >
      <article className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-white">
        <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-3 py-6">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-4 left-4 w-20 h-20 border-4 border-white rounded-full animate-ping"></div>
            <div className="absolute bottom-4 right-4 w-32 h-32 border-4 border-white rounded-full animate-ping"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 border-4 border-white rounded-full animate-ping"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-2 rounded-full border-2 border-white border-opacity-50">
                <p className="text-white text-sm font-bold uppercase tracking-widest">Sacred Scripture</p>
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-white text-center mb-4 leading-tight drop-shadow-lg">
              {part.title || (() => {
                // Try to extract the part key and use as fallback title
                const partKeyName = Object.keys(part).find(k => k.startsWith('bhagavadgita_part_'));
                return partKeyName ? partKeyName.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'Part';
              })()}
            </h3>
            <div className="flex justify-center">
              <div className="w-32 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="p-3 md:p-6">
          {part.intro && typeof part.intro === 'object' && !Array.isArray(part.intro) && (
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">📜</span>
                </div>
                <h2 className="text-3xl font-bold text-amber-900">Introduction</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                {Object.entries(part.intro as Record<string, any>).map(([k, v]: [string, any], i: number) => (
                  <p key={i} className="mb-4 text-gray-800 leading-relaxed text-justify">
                    <span className="font-semibold text-orange-700 mr-2">
                      {k.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}:
                    </span>{' '}
                    {String(v)}
                  </p>
                ))}
              </div>
            </section>
          )}

          {part ? (
            <>
              {/* Render all chapter/section content recursively for part-1 and similar objects */}
              {Object.entries(part as Record<string, any>)
                .flatMap(([k, v]) => {
                  // If the value is an object and the key is like 'bhagavadgita_part_X', render its children
                  if (k.startsWith('bhagavadgita_part_') && typeof v === 'object' && v !== null) {
                    return Object.entries(v).map(([subk, subv]) => (
                      <section key={k + '-' + subk} className="mb-10">
                        <h3 className="text-2xl font-bold text-orange-800 mb-2">
                          {subk.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </h3>
                        <div className="prose prose-base max-w-none">
                          {renderContent(subv)}
                        </div>
                      </section>
                    ));
                  }
                  // Otherwise, render as before for chapters/sections
                  if (k.startsWith('chapter_') || k.startsWith('chapters_') || k.startsWith('part-')) {
                    return [
                      <section key={k} className="mb-10">
                        <h3 className="text-2xl font-bold text-orange-800 mb-2">
                          {k.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </h3>
                        <div className="prose prose-base max-w-none">
                          {renderContent(v)}
                        </div>
                      </section>
                    ];
                  }
                  return [];
                })}
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
          <footer className="mt-10 p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-full flex items-center justify-between">
                {/* Previous Part Button */}
                <div>
                  {prevPart && (
                    <Link
                      href={`/scriptures/bhagavadgita/part/${getPartSafeKey(prevPart, 0)}`}
                      className="inline-flex items-center gap-2 bg-amber-50 hover:bg-amber-500 text-orange-600 hover:text-amber-50 px-3 py-1 rounded-md shadow-sm transition-all duration-300"
                    >
                      <span className="text-xl">←</span>
                      <span>Previous Part</span>
                    </Link>
                  )}
                </div>

                {/* Next Part Button */}
                <div>
                  {nextPart && (
                    <Link
                      href={`/scriptures/bhagavadgita/part/${getPartSafeKey(nextPart, 0)}`}
                      className="inline-flex items-center gap-2 bg-amber-50 hover:bg-orange-500 text-orange-400 hover:text-amber-50 px-3 py-1 rounded-md shadow-sm transition-all duration-300"
                    >
                      <span>Next Part</span>
                      <span className="text-xl">→</span>
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex justify-center">
                <Link
                  href="/scriptures/bhagavadgita"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-orange-500 hover:to-amber-500 text-orange-600 hover:text-amber-50 px-3 py-1 rounded-md shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <span className="text-xl">←</span>
                  <span>Explore All Parts</span>
                </Link>
              </div>
            </div>
          </footer>
        )}
      </article>
    </PageLayout>
  );
}
