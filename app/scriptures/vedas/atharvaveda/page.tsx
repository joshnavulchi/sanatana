/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

const ns = useLocaleSection('atharvaveda');
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'atharvaveda' ? parts.shift() : 'atharvaveda';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};

import { t, detectLocale, getMeta } from '../../../../lib/i18n';


import useLocaleSection from '../../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';


export async function createGenerateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);

  const S = (k: string) => String(t(k, locale));

  const meta = getMeta('scriptures_vedas_atharvaveda', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined },
    alternates: { canonical: meta.canonical || meta.url || (meta.url ? meta.url : process.env.NEXT_PUBLIC_SITE_URL) || 'https://sanatanadharmam.in' }
  };
}
export default function AtharvavedaPage() {
  const locale = detectLocale();
  const S = (k: string) => String(t(k, locale));

  const page: any = (() => {
    const k: any = getMeta('scriptures_vedas_atharvaveda', undefined, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('atharvaveda.title') || ''),
      summary: typeof k.summary === 'string' ? k.summary : String(__getLoc('atharvaveda.summary') || ''),
      contentTitle: typeof k.contentTitle === 'string' ? k.contentTitle : String(__getLoc('atharvaveda.contentTitle') || ''),
      content: typeof k.content === 'string' ? k.content : String(__getLoc('atharvaveda.content') || '')
    };
  })();

  return (
    <>
      <PageLayout metaKey="scriptures_vedas_atharvaveda" title={page.title} breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title }]}>
        <p>{page.summary}</p>
        <section>
          <h2 className="h4">{page.contentTitle}</h2>
          <p>{page.content}</p>
        </section>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
