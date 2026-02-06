"use client";
import { t, getLocaleNamespaceObject } from '../../../lib/i18n';
import { useLocale } from '@/app/context/locale-context';
import PageLayout from '@/app/components/common/PageLayout';

const ns: Record<string, unknown> = {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'philosophy_satya' ? parts.shift() : 'philosophy_satya';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};

export default function SatyaClient() {
  const { locale } = useLocale();
  const S = (k: string) => String(t(k, locale));
  const loc: any = getLocaleNamespaceObject(locale, 'philosophy_satya') || {};
  const satya = loc?.philosophy_satya || {};
  const title = satya.title || __getLoc('philosophy_satya.title') || 'Satya Philosophy';
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
        className={`layout-md`}
      >
        <p><strong>Definition : </strong>{definition.length ? definition.map((s: string, i: number) => (<span key={i}>{s}{i < definition.length - 1 ? ', ' : ''}</span>)) : <span>{String(__getLoc('philosophy_satya.noDefinition'))}</span>}</p>
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
