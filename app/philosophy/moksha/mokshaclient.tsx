"use client";
import PageLayout from '@/app/components/common/PageLayout';
import { t, getLocaleNamespaceObject, getMeta } from '../../../lib/i18n';
import { useLocale } from '@/app/context/locale-context';
// Local placeholder components for HeroImage and Sidebar
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

const ns: Record<string, unknown> = {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'philosophy_moksha' ? parts.shift() : 'philosophy_moksha';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};

export default function MokshaClient() {
  const { locale } = useLocale();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('philosophy_moksha', {}, locale) || {};
    const loc: any = getLocaleNamespaceObject(locale, 'philosophy_moksha') || {};
    const moksha = loc?.philosophy_moksha || {};
    return {
      title: typeof k.title === 'string' ? k.title : (moksha.title || __getLoc('philosophy_moksha.title') || 'Moksha Philosophy'),
      definition: k.definition || moksha.definition,
      core_principles: Array.isArray(k.core_principles) ? k.core_principles : (Array.isArray(moksha.core_principles) ? moksha.core_principles : []),
      origin: k.origin || moksha.origin || {},
      paths_to_moksha: k.paths_to_moksha || moksha.paths_to_moksha || {},
      goals: k.goals || moksha.goals || {},
      relation_to_other_concepts: k.relation_to_other_concepts || moksha.relation_to_other_concepts || {},
      modern_relevance: k.modern_relevance || moksha.modern_relevance || {}
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="philosophy_moksha"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: (typeof page.title !== 'undefined' ? page.title : '') }]}
        className={`layout-md`}
      >
        <div className="relative group overflow-hidden rounded-2xl shadow-2xl border-4 border-indigo-300/30 bg-gradient-to-br from-indigo-50/40 to-indigo-100/20 mb-8">
          <div className="w-full h-48 flex items-center justify-center text-4xl text-indigo-400">[Hero Image Placeholder]</div>
          <div className="absolute top-4 left-4 w-10 h-10 bg-indigo-400/80 rounded-full flex items-center justify-center shadow-lg text-white text-2xl z-20">🕉️</div>
        </div>
        <div className="w-full lg:w-1/4">
          <div className="sticky top-24">
            <div className="bg-indigo-50 rounded-xl p-4 shadow-md">[Sidebar Placeholder]</div>
          </div>
        </div>
        <p><strong>Definition : </strong>{page.definition}</p>
        {/* Core Principles of moksha */}
        <div>
          <p><strong>Core Principles of Moksha : </strong> {page.core_principles.map((s: string, idx: number) => (<span key={idx}>{s}{idx < page.core_principles.length - 1 ? ', ' : ''}</span>))}</p>
          <ul role="list" className="list-disc">
            {Object.entries(page.origin).map((cKey: any, idx: number) => (
              <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            ))}
          </ul>
          <p><strong>Path to Moksha : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.paths_to_moksha).map((cKey: any, idx: number) => (
              <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            ))}
          </ul>
          <p><strong>Goals of Moksha : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.goals).map((cKey: any, idx: number) => (
              <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            ))}
          </ul>
          <p><strong>Relation to other concepts of Moksha : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.relation_to_other_concepts).map((cKey: any, idx: number) => (
              <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            ))}
          </ul>
          <p><strong>Modern Relevance of Moksha : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.modern_relevance).map((cKey: any, idx: number) => (
              <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            ))}
          </ul>
        </div>
      </PageLayout>
    </>
  );
}
