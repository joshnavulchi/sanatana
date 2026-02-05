/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

const ns: Record<string, unknown> = {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'philosophy_ahimsa' ? parts.shift() : 'philosophy_ahimsa';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { t, getLocaleNamespaceObject } from '../../../lib/i18n';
import { createGenerateMetadata } from '../../../lib/pageUtils';
import { useLocale } from '@/app/context/locale-context';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('philosophy_ahimsa');

export default function Page() {
  const { locale } = useLocale();
  const S = (k: string) => String(t(k, locale));
  const loc: any = getLocaleNamespaceObject(locale, 'philosophy_ahimsa') || {};
  const ahimsa = loc?.philosophy_ahimsa || {};
  const title = ahimsa.title || __getLoc('philosophy_ahimsa.title') || 'Ahimsa Philosophy';
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
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Ahimsa' }]}
        className={`layout-md`}
      >
        <p><strong>Definition : </strong>{definition.length ? definition.map((s: string, i: number) => (<span key={i}>{s}{i < definition.length - 1 ? ', ' : ''}</span>)) : <span>{String(__getLoc('philosophy_ahimsa.noDefinition'))}</span>}</p>
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