/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

const ns = useLocaleSection('philosophy_samsara');
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'philosophy_samsara' ? parts.shift() : 'philosophy_samsara';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { t, detectLocale, getLocaleNamespaceObject, getMeta } from '../../../lib/i18n';
import PageLayout from '@/app/components/common/PageLayout';
import useLocaleSection from '../../hooks/useLocaleSection';
import { resolveLocaleFromHeaders, createGenerateMetadata } from '../../../lib/pageUtils';
export const generateMetadata = createGenerateMetadata('philosophy_samsara');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('philosophy_samsara', {}, locale) || {};
    const loc: any = getLocaleNamespaceObject(locale, 'philosophy_samsara') || {};
    const samsara = loc?.philosophy_samsara || {};
    return {
      title: typeof k.title === 'string' ? k.title : (samsara.title || __getLoc('philosophy_samsara.title') || 'Samsara Philosophy'),
      definition: k.definition || samsara.definition,
      core_principles: Array.isArray(k.core_principles) ? k.core_principles : (Array.isArray(samsara.core_principles) ? samsara.core_principles : []),
      origin: k.origin || samsara.origin || {},
      components: k.components || samsara.components || {},
      relation_to_other_concepts: k.relation_to_other_concepts || samsara.relation_to_other_concepts || {},
      modern_relevance: k.modern_relevance || samsara.modern_relevance || {}
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="philosophy_samsara"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title }]}
        className={`layout-sm`}
      >
        <p><strong>Definition : </strong>{page.definition}</p>
        {/* Core Principles of Samsara */}
        <div>
          <p><strong>Core Principles of Samsara : </strong> {page.core_principles.map((s: string, idx: number) => (<span key={idx}>{s}, </span>))}</p>
          <ul role="list" className="list-disc">
            {Object.entries(page.origin).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Components of Samsara : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.components).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Relation to other concepts of Samsara : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.relation_to_other_concepts).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Modern Relevance of Samsara : </strong></p>
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