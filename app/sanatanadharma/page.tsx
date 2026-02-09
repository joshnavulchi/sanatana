/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import PageLayout from '@/app/components/common/PageLayout';

import { createGenerateMetadata } from 'lib/pageUtils';
import { parseList } from 'lib/parseList';
import { t, detectLocale, getLocaleNamespaceObject } from '../../lib/i18n';
// import Link from 'next/link';

const _localeObj = getLocaleNamespaceObject('en', 'sanatanadharma');
const ns = (_localeObj && ((_localeObj as any)['sanatanadharma'] || _localeObj)) || {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'sanatanadharma' ? parts.shift() : 'sanatanadharma';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};

export const generateMetadata = createGenerateMetadata('sanatanadharma');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const data: any[] = parseList(__getLoc('sanatanadharma.sections'));
  const title = String(__getLoc('sanatanadharma.title') || 'Sanātana Dharma');

  return (
    <PageLayout
      metaKey="sanatanadharma"
      title={title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: title }]}
      className="layout-md">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[10vh] py-6 px-4 bg-gradient-to-br from-yellow-100 via-orange-50 to-amber-200 rounded-3xl shadow-2xl border border-amber-200 overflow-hidden mb-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -left-16 w-72 h-72 bg-amber-100 rounded-full blur-3xl opacity-60 animate-pulse" />
          <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-50 animate-pulse" />
        </div>
        <h3 className="relative z-10 text-2xl md:text-3xl font-extrabold text-amber-800 drop-shadow-xl tracking-tight animate-fade-in">
          {title}
        </h3>
        <p className="relative z-10 text-xl md:text-2xl text-amber-700 font-medium animate-fade-in-slow max-w-2xl text-center">
          {__getLoc('sanatanadharma.subtitle')}
        </p>
      </section>

      {/* Timeline/Steps Section */}
      <section className="relative flex flex-col gap-16 px-2 md:px-8 pb-16">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-200 via-orange-200 to-amber-300 opacity-40 -translate-x-1/2 pointer-events-none" />
        <div className="flex flex-col gap-16 relative z-10">
          {(data || []).map((ch: any, i: number) => {
            const chap = ch?.chapter ?? (i + 1);
            const chapTitle = ch?.title || `Chapter ${chap}`;
            const chapPara1 = ch?.para1 || `Paragraph 1`;
            const chapPara2 = ch?.para2 || `Paragraph 2`;
            const chapPara3 = ch?.para3 || `Paragraph 3`;
            const primary = Array.isArray(ch?.keypoints) ? ch.keypoints : [];
            const isEven = i % 2 === 0;
            return (
              <div key={i} className={`flex flex-col md:flex-row items-center md:items-stretch gap-8 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                {/* Timeline Dot */}
                <div className="hidden md:flex flex-col items-center justify-center relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-300 to-orange-200 border-4 border-white shadow-lg flex items-center justify-center z-20">
                    <span className="text-xl font-bold text-amber-800">{chap}</span>
                  </div>
                  <div className="flex-1 w-1 bg-gradient-to-b from-amber-200 to-orange-200 opacity-60" />
                </div>
                {/* Card */}
                <article className="flex-1 bg-white/90 border border-amber-100 rounded-2xl shadow-xl p-8 md:p-12 transition-transform hover:scale-[1.02] hover:shadow-2xl group animate-fade-in relative">
                  <h4 className="text-3xl md:text-4xl font-bold text-orange-700 mb-4 tracking-tight group-hover:text-amber-700 transition-colors">
                    {chapTitle}
                  </h4>
                  <div className="space-y-4 mb-4">
                    <p className="text-lg md:text-xl text-amber-800/90 leading-relaxed indent-8">{chapPara1}</p>
                    <p className="text-lg md:text-xl text-amber-800/90 leading-relaxed indent-8">{chapPara2}</p>
                    <p className="text-lg md:text-xl text-amber-800/90 leading-relaxed indent-8">{chapPara3}</p>
                  </div>
                  {primary.length > 0 && (
                    <ul className="mt-6 space-y-4 pl-6 border-l-4 border-orange-300 bg-orange-50/60 rounded-lg">
                      {primary.map((point: any, idx: number) => (
                        <li key={idx} className="mb-2">
                          <h5 className="text-xl font-semibold text-amber-700 mb-1">{point.title}</h5>
                          <div className="space-y-2">
                            <p className="text-amber-800/90 text-base md:text-lg indent-8">{point.para1}</p>
                            <p className="text-amber-800/90 text-base md:text-lg indent-8">{point.para2}</p>
                            <p className="text-amber-800/90 text-base md:text-lg indent-8">{point.para3}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </div>
            );
          })}
        </div>
      </section>
    </PageLayout>
  );
}
