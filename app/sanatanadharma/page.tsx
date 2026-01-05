/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale } from '../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import { parseList } from 'lib/parseList';
import PageLayout from '@components/common/PageLayout';
// import Link from 'next/link';

export const generateMetadata = createGenerateMetadata('sanatanadharma');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const data: any[] = parseList(t('sanatanadharma.sections', locale));
  const title = String(t('sanatanadharma.title', locale) || 'Sanatana Dharma');

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
              <p className="subtitle font-semibold!">{`Chapter ${chap}: ${chapTitle}`}</p>
              <p className="description indent-16">{chapPara1}</p>
              <p className="description indent-16">{chapPara2}</p>
              <p className="description indent-16">{chapPara3}</p>
              <ul className="list-disc ml-5 mt-1">
                {primary.map((point: any, idx: number) => (
                  <li key={idx}>
                    <p className="subtitle font-semibold!">{point.title}</p>
                    <p className="description indent-16">{point.para1}</p>
                    <p className="description indent-16">{point.para2}</p>
                    <p className="description indent-16">{point.para3}</p>
                  </li>
                ))}
              </ul>
              {/* <div>
                <Link href={`/sanatanadharma#chapter-${chap}`} className="button">
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
