"use client";
import { t, getLocaleNamespaceObject } from '../../../lib/i18n';
import { useLocale } from '@/app/context/locale-context';
import PageLayout from '@/app/components/common/PageLayout';
// ...existing code...

const ns: Record<string, unknown> = {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'philosophy_ahimsa' ? parts.shift() : 'philosophy_ahimsa';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};

export default function AhimsaClient() {
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
          <h2 className="text-2xl md:text-3xl">Categories of Ahimsa :</h2>
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
        {/* Hero image and sidebar placeholder */}
        <div>
          <HeroImage />
          <Sidebar />
        </div>
      </PageLayout>
    </>
  );
}

// Define local placeholder components
const HeroImage = () => (
  <div className="relative group overflow-hidden rounded-2xl shadow-2xl border-4 border-indigo-300/30 bg-gradient-to-br from-indigo-50/40 to-indigo-100/20 mb-8">
    <div className="w-full h-48 flex items-center justify-center text-4xl text-indigo-400">[Hero Image Placeholder]</div>
    <div className="absolute top-4 left-4 w-10 h-10 bg-indigo-400/80 rounded-full flex items-center justify-center shadow-lg text-white text-2xl z-20">🕉️</div>
  </div>
);
const Sidebar = () => (
  <div className="w-full lg:w-1/4">
    <div className="sticky top-24">
      <div className="bg-indigo-50 rounded-xl p-4 shadow-md">[Sidebar Placeholder]</div>
    </div>
  </div>
);
