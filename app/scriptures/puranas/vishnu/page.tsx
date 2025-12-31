/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

import { t, detectLocale, getMeta } from '../../../../lib/i18n';




export async function createGenerateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);

  const S = (k: string) => String(t(k, locale));

  const meta = getMeta('scriptures_puranas_vishnu', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined }
  };
}
export default function VishnuPage() {
  const locale = detectLocale();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('scriptures_puranas_vishnu', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('puranas.vishnu.title', locale) || ''),
      summary: k.summary || String(t('puranas.vishnu.summary', locale) || ''),
      content: k.content || String(t('puranas.vishnu.content', locale) || '')
    };
  })();

  return (
    <>
      <main className="content-wrapper md page-space-xl">
        <div>

          <h2>{page.title}</h2>
          <p>{page.summary}</p>
          <section>
            <h2>{page.title}</h2>
            <p>{page.content}</p>
          </section>
        </div>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
