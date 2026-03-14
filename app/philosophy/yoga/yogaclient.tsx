"use client";

import { t, getLocaleNamespaceObject, getMeta } from '@lib/i18n';
import { useLocale } from '@app/context/locale-context';
import PageLayout from '@components/common/PageLayout';
import Loader from '@components/loader';
import SimilarCategories from '@components/similar-categories/SimilarCategories';

export default function YogaClient() {
  const { locale, isLoading } = useLocale();
  const S = (k: string) => String(t(k, locale));
  const loc: any = getLocaleNamespaceObject(locale, 'philosophy_yoga') || {};
  const yoga = loc?.philosophy_yoga || {};
  const page = {
    title: yoga.title || 'Yoga Philosophy',
    definition: yoga.definition,
    core_principles: Array.isArray(yoga.core_principles) ? yoga.core_principles : [],
    origin: yoga.origin || {},
    paths_of_yoga: yoga.paths_of_yoga || {},
    eight_limbs_of_yoga: yoga.eight_limbs_of_yoga || {},
    goals: yoga.goals || {},
    relation_to_other_concepts: yoga.relation_to_other_concepts || {},
    modern_relevance: yoga.modern_relevance || {},
  };

  if (isLoading || !yoga) {
    return (
      <PageLayout metaKey="philosophy_yoga" title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Yoga' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="philosophy_yoga"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Yoga' }]}
      className="layout-md"
    >
      <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 rounded-2xl border-l-4 border-emerald-500 shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-400/8 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h3 className="text-3xl font-bold text-emerald-800 mb-4">{page.title}</h3>
          <p className="mb-6"><strong>Definition:</strong> {page.definition || 'No definition found.'}</p>
          <h2 className="text-2xl md:text-3xl">Core Principles of Yoga:</h2>
          <ul className="list-disc ml-6 mb-6">
            {page.core_principles.map((s: string, idx: number) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
          <h2 className="text-2xl md:text-3xl">Origin:</h2>
          <ul className="list-disc ml-6 mb-6">
            {Object.entries(page.origin).map(([key, val]: any, idx: number) => (
              <li key={idx}><strong>{key}</strong> - {val}</li>
            ))}
          </ul>
          <h2 className="text-2xl md:text-3xl">Paths of Yoga:</h2>
          <ul className="list-disc ml-6 mb-6">
            {Object.entries(page.paths_of_yoga).map(([key, val]: any, idx: number) => (
              <li key={idx}><strong>{key}</strong> - {val}</li>
            ))}
          </ul>
          <h2 className="text-2xl md:text-3xl">Eight Limbs of Yoga:</h2>
          <ul className="list-disc ml-6 mb-6">
            {Object.entries(page.eight_limbs_of_yoga).map(([key, val]: any, idx: number) => (
              <li key={idx}><strong>{key}</strong> - {val}</li>
            ))}
          </ul>
          <h2 className="text-2xl md:text-3xl">Goals:</h2>
          <ul className="list-disc ml-6 mb-6">
            {Object.entries(page.goals).map(([key, val]: any, idx: number) => (
              <li key={idx}><strong>{key}</strong> - {val}</li>
            ))}
          </ul>
          <h2 className="text-2xl md:text-3xl">Relation to Other Concepts:</h2>
          <ul className="list-disc ml-6 mb-6">
            {Object.entries(page.relation_to_other_concepts).map(([key, val]: any, idx: number) => (
              <li key={idx}><strong>{key}</strong> - {val}</li>
            ))}
          </ul>
          <h2 className="text-2xl md:text-3xl">Modern Relevance:</h2>
          <ul className="list-disc ml-6 mb-6">
            {Object.entries(page.modern_relevance).map(([key, val]: any, idx: number) => (
              <li key={idx}><strong>{key}</strong> - {val}</li>
            ))}
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}