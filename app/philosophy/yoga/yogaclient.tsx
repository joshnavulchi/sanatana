"use client";
import { t, getLocaleNamespaceObject, getMeta } from '../../../lib/i18n';
import { useLocale } from '@/app/context/locale-context';
import PageLayout from '@/app/components/common/PageLayout';
import SimilarCategories from '@/app/components/similar-categories/SimilarCategories';

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
      modern_relevance: k.modern_relevance || yoga.modern_relevance || {},
  }});

  return (
    <PageLayout
        metaKey="philosophy_yoga"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: (typeof page.title !== 'undefined' ? page.title : '') }]}
        className="layout-md"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/4">
            <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 rounded-2xl border-l-4 border-emerald-500 shadow-lg overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-400/8 rounded-full blur-3xl" />
              <div className="relative z-10">
                <p><strong>Definition : </strong>{page.definition}</p>
                {/* Core Principles of yoga */}
                <div>
                  <p><strong>Core Principles of Yoga : </strong> {page.core_principles.map((s: string, idx: number) => (<span key={idx}>{s}{idx < page.core_principles.length - 1 ? ', ' : ''}</span>))}</p>
                  <ul role="list" className="list-disc ml-6">
                    {Object.entries(page.origin).map((cKey: any, idx: number) => {
                      return <li key={idx}>
                        <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
                      </li>
                    })}
                  </ul>
                  <p><strong>Path of Yoga : </strong></p>
                  <ul role="list" className="list-disc ml-6">
                    {Object.entries(page.paths_of_yoga).map((cKey: any, idx: number) => {
                      return <li key={idx}>
                        <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
                      </li>
                    })}
                  </ul>
                  <p><strong>Eight limbs of Yoga : </strong></p>
                  <ul role="list" className="list-disc ml-6">
                    {Object.entries(page.eight_limbs_of_yoga).map((cKey: any, idx: number) => {
                      return <li key={idx}>
                        <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
                      </li>
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/4">
            <div className="sticky top-24">
              <SimilarCategories currentCategory="philosophy" />
            </div>
          </div>
        </div>
    </PageLayout>
  );
}
