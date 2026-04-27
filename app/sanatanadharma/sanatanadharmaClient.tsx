/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
'use client';

import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import PageLayout from '@components/common/PageLayout';
// import Link from 'next/link';

export default function SanatanadharmaClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('sanatanadharma');
  const data: any[] = ns.sections;
  const title = ns.title || 'Sanātana Dharma';

  return (
    <PageLayout
      metaKey="sanatanadharma"
      title={title}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: title }]}
      className="layout-md min-h-screen">
      <div className="flex flex-col gap-8">
        {(data || []).map((ch: any, i: number) => {
          const chap = ch?.chapter ?? (i + 1);
          const chapTitle = ch?.title || `Chapter ${chap}`;
          const chapPara1 = ch?.para1 || `Paragraph 1`;
          const chapPara2 = ch?.para2 || `Paragraph 2`;
          const chapPara3 = ch?.para3 || `Paragraph 3`;
          const primary = Array.isArray(ch?.keypoints) ? ch.keypoints : [];
          return (
            <article key={i} className="border border-cyan-200/40 p-6">
              <p className="subtitle h4! text-teal-700 font-semibold mb-2 drop-shadow">{`Chapter ${chap}: ${chapTitle}`}</p>
              <p className="description md:indent-16 text-teal-900 mb-2">{chapPara1}</p>
              <p className="description md:indent-16 text-teal-900 mb-2">{chapPara2}</p>
              <p className="description md:indent-16 text-teal-900 mb-2">{chapPara3}</p>
              <ul className="list-disc ml-5 mt-1 space-y-2">
                {primary.map((point: any, idx: number) => (
                  <li key={idx} className="text-teal-700">
                    <p className="subtitle h4! text-teal-600 font-semibold mb-1">{point.title}</p>
                    <p className="description md:indent-16 text-teal-900">{point.para1}</p>
                    <p className="description md:indent-16 text-teal-900">{point.para2}</p>
                    <p className="description md:indent-16 text-teal-900">{point.para3}</p>
                  </li>
                ))}
              </ul>
              {/* <div>
                <Link href={`/sanatanadharma#chapter-${chap}`} className="btn btn-primary">
                  Read more
                </Link>
              </div> */}
            </article>
          );
        })}
      </div>
    </PageLayout>
  );
}
