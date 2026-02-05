/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
'use client';
import PageLayout from '@/app/components/common/PageLayout';
import { t, getLocaleNamespaceObject, getMeta } from '../../../lib/i18n';
import { createGenerateMetadata } from '../../../lib/pageUtils';
import { useLocale } from '@/app/context/locale-context';
export const generateMetadata = createGenerateMetadata('philosophy_advaita');

export default function Page() {
  const { locale } = useLocale();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('philosophy_advaita', {}, locale) || {};
    const ns: any = getLocaleNamespaceObject(locale, 'philosophy_advaita') || {};
    const advaita = (ns?.philosophy_advaita || ns) || {};
    return {
      title: k.title || 'Advaita Philosophy',
      definition: k.definition || advaita.definition,
      core_principles: Array.isArray(k.core_principles) ? k.core_principles : (Array.isArray(advaita.core_principles) ? advaita.core_principles : []),
      origin: k.origin || advaita.origin || {},
      key_concepts: k.key_concepts || advaita.key_concepts || {},
      paths_to_realization: k.paths_to_realization || advaita.paths_to_realization || {},
      goals: k.goals || advaita.goals || {},
      relation_to_other_concepts: k.relation_to_other_concepts || advaita.relation_to_other_concepts || {},
      modern_relevance: k.modern_relevance || advaita.modern_relevance || {}
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="philosophy_advaita"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Advaita Philosophy' }]}
        className={`layout-md`}
      >
        <p><strong>Definition : </strong>{page.definition}</p>
        {/* Core Principles of Advaita */}
        <div>
          <p><strong>Core Principles of Advaita : </strong> {page.core_principles.map((s: string, idx: number) => (<span key={idx}>{s}, </span>))}</p>
          <ul role="list" className="list-disc">
            {Object.entries(page.origin).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Key concepts of Advaita : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.key_concepts).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Paths torealization of Advaita : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.paths_to_realization).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Goals of Advaita : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.goals).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Relation to other concepts of Advaita : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.relation_to_other_concepts).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Modern Relevance of Advaita : </strong></p>
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