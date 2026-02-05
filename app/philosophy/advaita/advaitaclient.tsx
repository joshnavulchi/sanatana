"use client";
import PageLayout from '@/app/components/common/PageLayout';
import { t, getLocaleNamespaceObject, getMeta } from '../../../lib/i18n';
import { useLocale } from '@/app/context/locale-context';

const ns: Record<string, unknown> = {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'philosophy_advaita' ? parts.shift() : 'philosophy_advaita';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};

export default function AdvaitaClient() {
  const { locale } = useLocale();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('philosophy_advaita', {}, locale) || {};
    const ns: any = getLocaleNamespaceObject(locale, 'philosophy_advaita') || {};
    const advaita = (ns?.philosophy_advaita || ns) || {};
    return {
      title: k.title || 'Advaita Philosophy',
      definition: k.definition || advaita.definition,
      core_principles: Array.isArray(k.core_principles) ? k.core_principles : (Array.isArray(advaita.core_principles) ? advaita.core_principles : []),
      origin: k.origin || advaita.origin || {},
      key_concepts: k.key_concepts || advaita.key_concepts || {},
      paths_to_realization: k.paths_to_realization || advaita.paths_to_realization || {},
      goals: k.goals || advaita.goals || {},
      relation_to_other_concepts: k.relation_to_other_concepts || advaita.relation_to_other_concepts || {},
      modern_relevance: k.modern_relevance || advaita.modern_relevance || {}
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="philosophy_advaita"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Advaita Philosophy' }]}
        className={`layout-md`}
      >
        <p><strong>Definition : </strong>{page.definition}</p>
        {/* Core Principles of Advaita */}
        <div>
          <p><strong>Core Principles of Advaita : </strong> {page.core_principles.map((s: string, idx: number) => (<span key={idx}>{s}, </span>))}</p>
          <ul role="list" className="list-disc">
            {/* ...existing code for core principles... */}
          </ul>
        </div>
        {/* ...existing code for other sections... */}
      </PageLayout>
    </>
  );
}
