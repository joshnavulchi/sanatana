/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale } from '../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import { parseList } from 'lib/parseList';
import PageLayout from '@components/common/PageLayout';
import Link from 'next/link';

export const generateMetadata = createGenerateMetadata('sanatanadharma');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const data: any[] = parseList(t('sanatanadharma', locale));
  const title = String(t('sanatanadharma.title', locale) || 'Sanatana Dharma');

  return (
    <PageLayout
      metaKey="sanatanadharma"
      title={title}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: title }]}
      className="layout-md">
      <div className="flex flex-col gap-8">
        {(data || []).map((ch: any, i: number) => {
          const chap = ch?.chapternumber ?? (i + 1);
          const chapTitle = ch?.title || `Chapter ${chap}`;
          const primary = ch?.primarykeyword || '';
          const secondary: string[] = Array.isArray(ch?.secondarykeywords) ? ch.secondarykeywords : [];
          const longtails: string[] = Array.isArray(ch?.longtailkeywords) ? ch.longtailkeywords : [];
          return (
            <article key={i} className="">
              <p className="title">{`Chapter ${chap}: ${chapTitle}`}</p>
              {primary ? <p className="font-medium">Primary: {primary}</p> : null}
              {secondary.length ? (
                <p className="mt-2">Secondary: {secondary.join(', ')}</p>
              ) : null}
              {longtails.length ? (
                <div className="mt-2">
                  <strong>Long-tail keywords:</strong>
                  <ul className="list-disc ml-5 mt-1">
                    {longtails.map((l, idx) => (
                      <li key={idx}>{l}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="mt-4">
                <Link href={`/sanatanadharma#chapter-${chap}`} className="button">
                  Read more
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </PageLayout>
  );
}
