/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import PageLayout from '@/app/components/common/PageLayout';
import styles from '../styles.module.scss';
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
      className="layout-sm">
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
