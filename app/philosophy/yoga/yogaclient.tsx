"use client";
import { t, getLocaleNamespaceObject, getMeta } from '../../../lib/i18n';
import { useLocale } from '@/app/context/locale-context';
import PageLayout from '@/app/components/common/PageLayout';
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
  const namespaceKey = parts[0] === 'philosophy_yoga' ? parts.shift() : 'philosophy_yoga';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};

export default function YogaClient() {
  const { locale } = useLocale();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('philosophy_yoga', {}, locale) || {};
    const loc: any = getLocaleNamespaceObject(locale, 'philosophy_yoga') || {};
    const yoga = loc?.philosophy_yoga || {};
    return {
      title: typeof k.title === 'string' ? k.title : (yoga.title || __getLoc('philosophy_yoga.title') || 'Yoga Philosophy'),
      definition: k.definition || yoga.definition,
      core_principles: Array.isArray(k.core_principles) ? k.core_principles : (Array.isArray(yoga.core_principles) ? yoga.core_principles : []),
      origin: k.origin || yoga.origin || {},
      paths_of_yoga: k.paths_of_yoga || yoga.paths_of_yoga || {},
      eight_limbs_of_yoga: k.eight_limbs_of_yoga || yoga.eight_limbs_of_yoga || {},
      goals: k.goals || yoga.goals || {},
      relation_to_other_concepts: k.relation_to_other_concepts || yoga.relation_to_other_concepts || {},
      modern_relevance: k.modern_relevance || yoga.modern_relevance || {}
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="philosophy_yoga"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: (typeof page.title !== 'undefined' ? page.title : '') }]}
        className={`layout-md`}
      >
        <p><strong>Definition : </strong>{page.definition}</p>
        {/* Core Principles of yoga */}
        <div>
          <p><strong>Core Principles of Yoga : </strong> {page.core_principles.map((s: string, idx: number) => (<span key={idx}>{s}, </span>))}</p>
          <ul role="list" className="list-disc">
            {Object.entries(page.origin).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Path of Yoga : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.paths_of_yoga).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Eight limbs of Yoga : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.eight_limbs_of_yoga).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Goals of Yoga : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.goals).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Relation to other concepts of Yoga : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(page.relation_to_other_concepts).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Modern Relevance of Yoga : </strong></p>
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
