/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

const ns = useLocaleSection('vishnu_stotrasmantras');
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  if (parts[0] === 'vishnu_stotrasmantras') parts.shift();
  let cur: any = ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { t, detectLocale, getMeta } from '../../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import { parseList } from 'lib/parseList';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('vishnu_stotrasmantras');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('vishnu_stotrasmantras', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('vishnu_stotrasmantras.title') || 'Vishnu Stotras'),
      items: Array.isArray(k.items) ? k.items : parseList(__getLoc('vishnu_stotrasmantras.vishnu_stotras'))
    };
  })();

  return (
    <>
      <PageLayout
        metaKey="vishnu_stotrasmantras"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: (page.title || '') }]}
        className=""
      >
        {page.items.map((item: any, i: number) => (
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