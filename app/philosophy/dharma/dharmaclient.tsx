"use client";
import { t, getLocaleNamespaceObject } from '../../../lib/i18n';
import { useLocale } from '@/app/context/locale-context';
import PageLayout from '@/app/components/common/PageLayout';

const ns: Record<string, unknown> = {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'philosophy_dharma' ? parts.shift() : 'philosophy_dharma';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};

export default function DharmaClient() {
  const { locale } = useLocale();
  const S = (k: string) => String(t(k, locale));
  const loc: any = getLocaleNamespaceObject(locale, 'philosophy_dharma') || {};
  const dharma = loc?.philosophy_dharma || {};
  const title = dharma.title || __getLoc('philosophy_dharma.title') || 'Dharma Philosophy';
  const definition: string[] = Array.isArray(dharma.definition) ? dharma.definition : (dharma.definition ? [String(dharma.definition)] : []);
  const categories = dharma.categories_of_dharma || {};
  const philosophicalDimensions = dharma.philosophical_dimensions || {};
  const corePrinciples = dharma.core_principles || {};
  const dharmaInRamayana = dharma.dharma_in_ramayana || {};
  return (
    <>
      <PageLayout
        metaKey="philosophy_dharma"
        title={title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Dharma' }]}
        className={`layout-md`}
      >
        <p><strong>Definition : </strong>{definition.length ? definition.map((s: string, i: number) => (<span key={i}>{s}{i < definition.length - 1 ? ', ' : ''}</span>)) : <span>{String(__getLoc('philosophy_dharma.noDefinition'))}</span>}</p>
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
