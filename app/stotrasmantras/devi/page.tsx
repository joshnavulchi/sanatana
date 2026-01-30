/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getMeta } from '../../../lib/i18n';
import { parseList } from 'lib/parseList';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('devi_stotras'); 

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('devi_stotras', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('devi_stotras.title', locale) || 'Devi Stotras'),
      items: Array.isArray(k.items) ? k.items : parseList(t('devi_stotras.devi_stotras', locale))
    };
  })();
  const items = page.items || [];
  return (
    <>
      <PageLayout
        metaKey="devi_stotras"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: (page.title || '') }]}
        className="layout-sm"
      >
        {items.map((item: any, i: number) => (
          <section key={i}>
            <h2 className="h4">{item.name || item.title || `Item ${i + 1}`}</h2>
            <div>
              {item.origin || item.author || item.language ? (
                <span>
                  {item.author ? `${item.author}` : null}
                  {item.origin ? `${item.author ? ' — ' : ''}${item.origin}` : null}
                  {item.language ? `${item.author || item.origin ? ' — ' : ''}${item.language}` : null}
                </span>
              ) : null}
            </div>
            {item.description ? <p>{item.description}</p> : null}
            {item.benefits && Array.isArray(item.benefits) ? (
              <ul role="list" className="list-disc">
                {item.benefits.map((b: string, idx: number) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            ) : null}
            {item.key_excerpt ? <blockquote>{item.key_excerpt}</blockquote> : null}
            {item.sections && typeof item.sections === 'object' ? (
              <div>
                {Object.entries(item.sections).map(([k, v]: any) => (
                  <p key={k}><strong>{k}:</strong> {String(v)}</p>
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */