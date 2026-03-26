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
      className="layout-md">
      <div className="flex flex-col gap-8">
        {(data || []).map((ch: any, i: number) => {
          const chap = ch?.chapter ?? (i + 1);
          const chapTitle = ch?.title || `Chapter ${chap}`;
          const chapPara1 = ch?.para1 || `Paragraph 1`;
          const chapPara2 = ch?.para2 || `Paragraph 2`;
          const chapPara3 = ch?.para3 || `Paragraph 3`;
          const primary = Array.isArray(ch?.keypoints) ? ch.keypoints : [];
          return (
            <article key={i} className="">
              <p className="subtitle h4!">{`Chapter ${chap}: ${chapTitle}`}</p>
              <p className="description md:indent-16">{chapPara1}</p>
              <p className="description md:indent-16">{chapPara2}</p>
              <p className="description md:indent-16">{chapPara3}</p>
              <ul className="list-disc ml-5 mt-1">
                {primary.map((point: any, idx: number) => (
                  <li key={idx}>
                    <p className="subtitle h4!">{point.title}</p>
                    <p className="description md:indent-16">{point.para1}</p>
                    <p className="description md:indent-16">{point.para2}</p>
                    <p className="description md:indent-16">{point.para3}</p>
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