/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getLocaleObject, getMeta } from '../../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from '../../../lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('yoga_philosophy');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('yoga_philosophy', {}, locale) || {};
    const loc: any = getLocaleObject(locale) || {};
    const yoga = loc?.yoga_philosophy || {};
    return {
      title: typeof k.title === 'string' ? k.title : (yoga.title || t('yoga_philosophy.title', locale) || 'Yoga Philosophy'),
      definition: k.definition || yoga.definition,
      core_principles: Array.isArray(k.core_principles) ? k.core_principles : (Array.isArray(yoga.core_principles) ? yoga.core_principles : []),
      origin: k.origin || yoga.origin || {},
      paths_of_yoga: k.paths_of_yoga || yoga.paths_of_yoga || {},
      eight_limbs_of_yoga: k.eight_limbs_of_yoga || yoga.eight_limbs_of_yoga || {},
      goals: k.goals || yoga.goals || {},
      relation_to_other_concepts: k.relation_to_other_concepts || yoga.relation_to_other_concepts || {},
      modern_relevance: k.modern_relevance || yoga.modern_relevance || {}
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="yoga_philosophy"
        title={page.title}
        breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: (typeof page.title !== 'undefined' ? page.title : '') }]}
        className={`layout-sm`}
      >
        <p><strong>Definition : </strong>{page.definition}</p>
        {/* Core Principles of yoga */}
        <div>
          <p><strong>Core Principles of Yoga : </strong> {page.core_principles.map((s: string, idx: number) => (<span key={idx}>{s}, </span>))}</p>
          <ul role="list" className="list-disc">
            {Object.entries(page.origin).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Path of Yoga : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.paths_of_yoga).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Eight limbs of Yoga : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.eight_limbs_of_yoga).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Goals of Yoga : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.goals).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Relation to other concepts of Yoga : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.relation_to_other_concepts).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Modern Relevance of Yoga : </strong></p>
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