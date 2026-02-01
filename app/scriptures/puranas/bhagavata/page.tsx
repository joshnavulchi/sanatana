/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

const ns = useLocaleSection('puranas');
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'puranas' ? parts.shift() : 'puranas';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};

import useLocaleSection from '../../../hooks/useLocaleSection';
import { t, detectLocale, getMeta } from '../../../../lib/i18n';




export async function createGenerateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);

  const S = (k: string) => String(t(k, locale));

  const meta = getMeta('scriptures_puranas_bhagavata', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined }
  };
}
export default function BhagavataPage() {
  const locale = detectLocale();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('scriptures_puranas_bhagavata', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('puranas.bhagavata.title') || ''),
      summary: k.summary || String(__getLoc('puranas.bhagavata.summary') || ''),
      content: k.content || String(__getLoc('puranas.bhagavata.content') || '')
    };
  })();

  return (
    <>
      <main className="content-wrapper md page-space-xl">
        <div>

          <h2 className="h4">{page.title}</h2>
          <p>{page.summary}</p>
          <section>
            <h2 className="h4">{page.title}</h2>
            <p>{page.content}</p>
          </section>
        </div>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
