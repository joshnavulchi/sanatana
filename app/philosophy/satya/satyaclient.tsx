"use client";
import { t, getLocaleNamespaceObject } from '@lib/i18n';
import { useLocale } from '@app/context/locale-context';
import PageLayout from '@components/common/PageLayout';
const HeroImage = () => (
  <div className="relative group overflow-hidden rounded-2xl shadow-2xl border-4 border-indigo-300/30 bg-gradient-to-br from-indigo-50/40 to-indigo-100/20 mb-8">
    <div className="w-full h-48 flex items-center justify-center text-4xl text-indigo-400">[Hero Image Placeholder]</div>
    <div className="absolute top-4 left-4 w-10 h-10 bg-indigo-400/80 rounded-full flex items-center justify-center shadow-lg text-white text-2xl z-20">🕉️</div>
  </div>
);

import SimilarCategories from '@components/similar-categories/SimilarCategories';

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
    <PageLayout
      metaKey="philosophy_satya"
      title={title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Satya' }]}
      className="layout-md"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/4">
          <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 rounded-2xl border-l-4 border-emerald-500 shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-400/8 rounded-full blur-3xl" />
            <div className="relative z-10">
              <p><strong>Definition : </strong>{definition.length ? definition.map((s: string, i: number) => (<span key={i}>{s}{i < definition.length - 1 ? ', ' : ''}</span>)) : <span>{String(__getLoc('philosophy_satya.noDefinition'))}</span>}</p>
              {/* Categories of Satya */}
              <div>
                <h2 className="text-2xl md:text-3xl">Categories of Satya :</h2>
                <ul role="list" className="list-disc ml-6">
                  {Object.entries(categories).map((cKey: any, idx: number) => {
                    const { meaning, examples } = cKey[1] || {};
                    return <li key={idx}>
                      <strong>{meaning}</strong> - {Array.isArray(examples) ? <span>{examples.join(', ')}</span> : (examples ? <span>{String(examples)}</span> : null)}
                    </li>
                  })}
                </ul>
                <p><strong>Philosophical dimensions/Goals of Satya : </strong></p>
                <ul role="list" className="list-disc ml-6">
                  {Object.entries(philosophicalDimensions).map((cKey: any, idx: number) => {
                    return <li key={idx}>
                      <span>{cKey[1]}</span>
                    </li>
                  })}
                </ul>
                <p><strong>Core principles of Satya : </strong></p>
                <ul role="list" className="list-disc ml-6">
                  {Object.entries(corePrinciples).map((cKey: any, idx: number) => {
                    return <li key={idx}>
                      <span>{cKey[1]}</span>
                    </li>
                  })}
                </ul>
                <p><strong>Satya in Ramayana : </strong></p>
                <ul role="list" className="list-disc ml-6">
                  {Object.entries(satyaInRamayana).map((cKey: any, idx: number) => {
                    return <li key={idx}>
                      <span>{cKey[1]}</span>
                    </li>
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/4">
          <SimilarCategories />
        </div>
      </div>
    </PageLayout>
  );
}
