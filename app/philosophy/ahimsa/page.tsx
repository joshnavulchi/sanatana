/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getLocaleObject } from '../../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from '../../../lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('philosophy_ahimsa');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  const loc: any = getLocaleObject(locale) || {};
  const ahimsa = loc?.philosophy_ahimsa || {};
  const title = ahimsa.title || t('philosophy_ahimsa.title', locale) || 'Ahimsa Philosophy';
  const definition: string[] = Array.isArray(ahimsa.definition) ? ahimsa.definition : (ahimsa.definition ? [String(ahimsa.definition)] : []);
  const categories = ahimsa.categories_of_ahimsa || {};
  const philosophicalDimensions = ahimsa.philosophical_dimensions || {};
  const corePrinciples = ahimsa.core_principles || {};
  const ahimsaInRamayana = ahimsa.ahimsa_in_ramayana || {};
  return (
    <>
      <PageLayout
        metaKey="philosophy_ahimsa"
        title={title}
        breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Ahimsa' }]}
        className={`layout-sm`}
      >
        <p><strong>Definition : </strong>{definition.length ? definition.map((s: string, i: number) => (<span key={i}>{s}{i < definition.length - 1 ? ', ' : ''}</span>)) : <span>{String(t('philosophy_ahimsa.noDefinition', 'en'))}</span>}</p>
        {/* Categories of Ahimsa */}
        <div>
          <h2 className="h4">Categories of Ahimsa :</h2>
          <ul role="list" className="list-disc">
            {Object.entries(categories).map((cKey: any, idx: number) => {
              const { meaning, examples } = cKey[1] || {};
              return <li key={idx}>
                <strong>{meaning}</strong> - {Array.isArray(examples) ? <span>{examples.join(', ')}</span> : (examples ? <span>{String(examples)}</span> : null)}
              </li>
            })}
          </ul>
          <p><strong>Philosophical dimensionsGoals of Ahimsa : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(philosophicalDimensions).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Core principles of Ahimsa : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(corePrinciples).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Ahimsa in Ramayana : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(ahimsaInRamayana).map((cKey: any, idx: number) => {
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