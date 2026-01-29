/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getLocaleObject } from '../../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from '../../../lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('philosophy_satya');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  const loc: any = getLocaleObject(locale) || {};
  const satya = loc?.philosophy_satya || {};
  const title = satya.title || t('philosophy_satya.title', locale) || 'Satya Philosophy';
  const definition: string[] = Array.isArray(satya.definition) ? satya.definition : (satya.definition ? [String(satya.definition)] : []);
  const categories = satya.categories_of_satya || {};
  const philosophicalDimensions = satya.philosophical_dimensions || {};
  const corePrinciples = satya.core_principles || {};
  const satyaInRamayana = satya.satya_in_ramayana || {};
  return (
    <>
      <PageLayout
        metaKey="philosophy_satya"
        title={title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Satya' }]}
        className={`layout-sm`}
      >
        <p><strong>Definition : </strong>{definition.length ? definition.map((s: string, i: number) => (<span key={i}>{s}{i < definition.length - 1 ? ', ' : ''}</span>)) : <span>{String(t('philosophy_satya.noDefinition', 'en'))}</span>}</p>
        {/* Categories of Satya */}
        <div>
          <h2 className="h4">Categories of Satya :</h2>
          <ul role="list" className="list-disc">
            {Object.entries(categories).map((cKey: any, idx: number) => {
              const { meaning, examples } = cKey[1] || {};
              return <li key={idx}>
                <strong>{meaning}</strong> - {Array.isArray(examples) ? <span>{examples.join(', ')}</span> : (examples ? <span>{String(examples)}</span> : null)}
              </li>
            })}
          </ul>
          <p><strong>Philosophical dimensionsGoals of Satya : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(philosophicalDimensions).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Core principles of Satya : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(corePrinciples).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Satya in Ramayana : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(satyaInRamayana).map((cKey: any, idx: number) => {
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