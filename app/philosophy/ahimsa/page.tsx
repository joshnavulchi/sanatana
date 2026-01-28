/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getLocaleObject } from '../../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from '../../../lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('dharma_philosophy');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  const loc: any = getLocaleObject(locale) || {};
  const dharma = loc?.dharma_philosophy || {};
  const title = dharma.title || t('dharma_philosophy.title', locale) || 'Dharma Philosophy';
  const definition: string[] = Array.isArray(dharma.definition) ? dharma.definition : (dharma.definition ? [String(dharma.definition)] : []);
  const categories = dharma.categories_of_dharma || {};
  const philosophicalDimensions = dharma.philosophical_dimensions || {};
  const corePrinciples = dharma.core_principles || {};
  const dharmaInRamayana = dharma.dharma_in_ramayana || {};
  return (
    <>
      <PageLayout
        metaKey="dharma_philosophy"
        title={title}
        breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Dharma' }]}
        className={`layout-sm`}
      >
        <p><strong>Definition : </strong>{definition.length ? definition.map((s: string, i: number) => (<span key={i}>{s}{i < definition.length - 1 ? ', ' : ''}</span>)) : <span>{String(t('dharma_philosophy.noDefinition', 'en'))}</span>}</p>
        {/* Categories of Dharma */}
        <div>
          <h2 className="h4">Categories of Dharma :</h2>
          <ul role="list" className="list-disc">
            {Object.entries(categories).map((cKey: any, idx: number) => {
              const { meaning, examples } = cKey[1] || {};
              return <li key={idx}>
                <strong>{meaning}</strong> - {Array.isArray(examples) ? <span>{examples.join(', ')}</span> : (examples ? <span>{String(examples)}</span> : null)}
              </li>
            })}
          </ul>
          <p><strong>Philosophical dimensionsGoals of Dharma : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(philosophicalDimensions).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Core principles of Dharma : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(corePrinciples).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Dharma in Ramayana : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(dharmaInRamayana).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            })}
          </ul>
        </div>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */