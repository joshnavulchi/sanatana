/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

const ns: Record<string, unknown> = {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'shiva_stotrasmantras' ? parts.shift() : 'shiva_stotrasmantras';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { detectLocale, t, getMeta } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import { parseList } from 'lib/parseList';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('shiva_stotrasmantras');

export default async function Page() {
  const locale = await detectLocale({});
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('shiva_stotrasmantras', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('shiva_stotrasmantras.title') || 'Shiva Stotras'),
      items: Array.isArray(k.items) ? k.items : parseList(__getLoc('shiva_stotrasmantras.stotras'))
    };
  })();
  // detectLocale is async; but for static rendering we will fall back to default through t() when needed
  const items = page.items || [];
  return (
    <PageLayout
      metaKey="shiva_stotrasmantras"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title || 'Shiva Stotras' }]}
      className=""
    >
      {items.map((item: any, i: number) => (
        <section key={i}>
          <h2 className="h4">{item.name || item.title || `Item ${i + 1}`}</h2>
          <div>
            {item.author || item.meter || item.deity_form ? (
              <span>
                {item.author ? `${item.author}` : null}
                {item.meter ? `${item.author ? ' — ' : ''}${item.meter}` : null}
                {item.deity_form ? `${item.author || item.meter ? ' — ' : ''}${item.deity_form}` : null}
              </span>
            ) : null}
          </div>
          {item.summary ? <p>{item.summary}</p> : null}
          {item.benefits ? <p><strong>Benefits:</strong> {item.benefits}</p> : null}
          {item.verses ? <p>Verses: {item.verses}</p> : null}
        </section>
      ))}
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */