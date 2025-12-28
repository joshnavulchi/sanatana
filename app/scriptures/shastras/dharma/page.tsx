/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

import { t, detectLocale, getMeta } from '../../../../lib/i18n';



export default async function DharmaPage() {
  const locale = await detectLocale();

  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('scriptures_shastras_dharma', undefined, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('shastras.dharma.title', locale) || ''),
      summary: k.summary || String(t('shastras.dharma.summary', locale) || ''),
      content: k.content || String(t('shastras.dharma.content', locale) || '')
    };
  })();

  return (
    <>
      <main className="content-wrapper md page-space-xl">
        <div>
          
          <h2>{page.title}</h2>
          <p>{page.summary}</p>
          <section>
            <h3>{page.title}</h3>
            <p>{page.content}</p>
          </section>
        </div>
      </main>
    </>
  );
}

export async function createGenerateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);
  const meta = getMeta('scriptures_shastras_dharma', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined },
    alternates: { canonical: meta.canonical || meta.url || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in' }
  };
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
