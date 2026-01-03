/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getLocaleObject, getMeta } from '../../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from '../../../lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('karma_philosophy');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('karma_philosophy', {}, locale) || {};
    const loc: any = getLocaleObject(locale) || {};
    const karma = loc?.karma_philosophy || {};
    return {
      title: typeof k.title === 'string' ? k.title : (karma.title || t('karma_philosophy.title', locale) || 'Karma Philosophy'),
      definition: k.definition || karma.definition,
      core_principles: Array.isArray(k.core_principles) ? k.core_principles : (Array.isArray(karma.core_principles) ? karma.core_principles : []),
      origin: k.origin || karma.origin || {},
      types_of_karma: k.types_of_karma || karma.types_of_karma || {},
      goals: k.goals || karma.goals || {},
      relation_to_other_concepts: k.relation_to_other_concepts || karma.relation_to_other_concepts || {},
      modern_relevance: k.modern_relevance || karma.modern_relevance || {}
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="karma_philosophy"
        title={page.title}
        breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title }]}
        className=""
      >
        <p><strong>Definition : </strong>{page.definition}</p>
        {/* Core Principles of Karma */}
        <div>
          <p><strong>Core Principles of Karma : </strong> {page.core_principles.map((s: string) => (<span>{s}, </span>))}</p>
          <ul role="list" className="list-disc">
            {Object.entries(page.origin).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Types of Karma : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.types_of_karma).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Goals of Karma : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.goals).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Relation to other concepts of Karma : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.relation_to_other_concepts).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Modern Relevance of Karma : </strong></p>
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