"use client";
import { t } from '../../../lib/i18n';
import { useEffect, useState } from 'react';
import PageLayout from '@/app/components/common/PageLayout';
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

export default function SamsaraClient() {
  const { locale } = useLocale();
  const S = (k: string) => String(t(k, locale));
  const [page, setPage] = useState<any | null>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/locales/${locale}/philosophy_samsara.json`);
      const data = await res.json();
      const nsObj = data?.philosophy_samsara || {};
      setPage({
        title: nsObj.title || 'Samsara Philosophy',
        definition: nsObj.definition,
        core_principles: Array.isArray(nsObj.core_principles) ? nsObj.core_principles : [],
        origin: nsObj.origin || {},
        components: nsObj.components || {},
        relation_to_other_concepts: nsObj.relation_to_other_concepts || {},
        modern_relevance: nsObj.modern_relevance || {},
        goals: Array.isArray(nsObj.goals) ? nsObj.goals : [],
        key_scriptural_references: Array.isArray(nsObj.key_scriptural_references) ? nsObj.key_scriptural_references : []
      });
    }
    fetchData();
  }, [locale]);

  if (!page) {
    return <div className="text-center py-10 text-blue-500">Loading...</div>;
  }
  return (
    <>
      <PageLayout
        metaKey="philosophy_samsara"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title }]}
        className="layout-md"
      >
        <section className="bg-gradient-to-br from-indigo-50 via-blue-50 to-green-50 rounded-2xl shadow-2xl border-4 border-blue-200/40 px-3 py-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-blue-700 mb-4">{page.title}</h1>
              <p className="text-lg text-blue-900 mb-6 italic">{page.definition}</p>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-green-700 mb-2">Core Principles</h2>
                <ul className="list-disc ml-6 text-green-900 space-y-1">
                  {page.core_principles.map((s: string, idx: number) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-blue-700 mb-2">Origin</h2>
                <ul className="list-disc ml-6 text-blue-900 space-y-1">
                  {Object.entries(page.origin).map(([k, v]: any, idx: number) => (
                    <li key={idx}><span className="font-semibold">{k}:</span> {Array.isArray(v) ? v.join(', ') : v}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-indigo-700 mb-2">Components of Samsara</h2>
                <ul className="list-disc ml-6 text-indigo-900 space-y-1">
                  {Object.entries(page.components).map(([k, v]: any, idx: number) => (
                    <li key={idx}><span className="font-semibold">{k.replace(/_/g, ' ')}:</span> {v}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-purple-700 mb-2">Relation to Other Concepts</h2>
                <ul className="list-disc ml-6 text-purple-900 space-y-1">
                  {Object.entries(page.relation_to_other_concepts).map(([k, v]: any, idx: number) => (
                    <li key={idx}><span className="font-semibold">{k}:</span> {v}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-orange-700 mb-2">Modern Relevance</h2>
                <ul className="list-disc ml-6 text-orange-900 space-y-1">
                  {Object.entries(page.modern_relevance).map(([k, v]: any, idx: number) => (
                    <li key={idx}><span className="font-semibold">{k.replace(/_/g, ' ')}:</span> {v}</li>
                  ))}
                </ul>
              </div>
              {page.goals.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-blue-700 mb-2">Goals</h2>
                  <ul className="list-disc ml-6 text-blue-900 space-y-1">
                    {page.goals.map((g: string, idx: number) => (
                      <li key={idx}>{g}</li>
                    ))}
                  </ul>
                </div>
              )}
              {page.key_scriptural_references.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-indigo-700 mb-2">Key Scriptural References</h2>
                  <ul className="list-disc ml-6 text-indigo-900 space-y-1">
                    {page.key_scriptural_references.map((ref: any, idx: number) => (
                      <li key={idx}><span className="font-semibold">{ref.text}:</span> {ref.quote_summary}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="w-full md:w-72 flex-shrink-0">
              <div className="sticky top-24">
                <div className="bg-blue-100 rounded-xl p-6 shadow-md flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-200 to-green-200 flex items-center justify-center text-5xl mb-4">🔄</div>
                  <div className="text-blue-700 font-bold text-lg mb-2">Samsara</div>
                  <div className="text-blue-500 text-sm text-center">Cycle of Rebirth, Karma, Liberation</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
