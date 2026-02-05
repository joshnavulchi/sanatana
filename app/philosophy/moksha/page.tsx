/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import PageLayout from '@/app/components/common/PageLayout';
import { t, getLocaleNamespaceObject, getMeta } from '../../../lib/i18n';
import { createGenerateMetadata } from '../../../lib/pageUtils';
import { useLocale } from '@/app/context/locale-context';

export const generateMetadata = createGenerateMetadata('philosophy_moksha');

const ns: Record<string, unknown> = {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'philosophy_moksha' ? parts.shift() : 'philosophy_moksha';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};

export default function Page() {
  const { locale } = useLocale();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('philosophy_moksha', {}, locale) || {};
    const loc: any = getLocaleNamespaceObject(locale, 'philosophy_moksha') || {};
    const moksha = loc?.philosophy_moksha || {};
    return {
      title: typeof k.title === 'string' ? k.title : (moksha.title || __getLoc('philosophy_moksha.title') || 'Moksha Philosophy'),
      definition: k.definition || moksha.definition,
      core_principles: Array.isArray(k.core_principles) ? k.core_principles : (Array.isArray(moksha.core_principles) ? moksha.core_principles : []),
      origin: k.origin || moksha.origin || {},
      paths_to_moksha: k.paths_to_moksha || moksha.paths_to_moksha || {},
      goals: k.goals || moksha.goals || {},
      relation_to_other_concepts: k.relation_to_other_concepts || moksha.relation_to_other_concepts || {},
      modern_relevance: k.modern_relevance || moksha.modern_relevance || {}
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="philosophy_moksha"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: (typeof page.title !== 'undefined' ? page.title : '') }]}
        className={`layout-md`}
      >
        <p><strong>Definition : </strong>{page.definition}</p>
        {/* Core Principles of moksha */}
        <div>
          <p><strong>Core Principles of Moksha : </strong> {page.core_principles.map((s: string, idx: number) => (<span key={idx}>{s}, </span>))}</p>
          <ul role="list" className="list-disc">
            {Object.entries(page.origin).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Path to Moksha : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.paths_to_moksha).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Goals of Moksha : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.goals).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Relation to other concepts of Moksha : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.relation_to_other_concepts).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Modern Relevance of Moksha : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.modern_relevance).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
        </div>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */