
"use client";
import PageLayout from "@components/common/PageLayout";
import { useLocale } from "@app/context/locale-context";
import useLocaleSection from "../hooks/useLocaleSection";
import Loader from "@components/loader";
import SimilarCategories from "@components/similar-categories/SimilarCategories";


export default function CosmictimeClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection("cosmictime");

  // Derive data directly from ns, no need for setState unless async fetch/transform is needed
  const data = {
    title: ns?.title || "Cosmic Time",
    meta: ns?.meta || {},
    definition: ns?.definition || "",
    answer: ns?.answer || "",
    assumes: ns?.assumes || "",
    brahma_full_day: ns?.brahma_full_day || "",
    cosmicTimeSystem: ns?.cosmicTimeSystem || {},
    cyclical_universe: ns?.cyclical_universe || "",
    final_consolidated_insight: ns?.final_consolidated_insight || {},
    human_years: ns?.human_years || "",
    keypoint: ns?.keypoint || "",
    lifetime_brahma: ns?.lifetime_brahma || "",
    longduration: ns?.longduration || "",
    manvantara: ns?.manvantara || {},
  };

  if (isLoading && !data.title) {
    return (
      <PageLayout metaKey="cosmictime" title="" breadcrumbs={[{ labelKey: "Home", href: "/" }, { label: "Cosmic Time" }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="cosmictime"
      title={data.title}
      breadcrumbs={[{ labelKey: "Home", href: "/" }, { label: data.title }]}
      className="layout-md"
    >
      <div id="cosmictime-content">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/4">
            <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 rounded-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-400/8 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-600" />
                  <span className="text-3xl animate-pulse">🕰️</span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-600" />
                </div>
                <p className="text-lg md:text-xl leading-relaxed">{data.definition}</p>
                {data.keypoint && <div className="mt-4 p-4 bg-green-100/60 border-l-4 border-emerald-600 rounded"><strong>Key Point:</strong> {data.keypoint}</div>}
                {data.answer && <div className="mt-4 p-4 bg-green-50 border-l-4 border-emerald-400 rounded"><strong>Answer:</strong> {data.answer}</div>}
                {data.assumes && <div className="mt-4 p-4 bg-green-50 border-l-4 border-emerald-400 rounded"><strong>Assumes:</strong> {data.assumes}</div>}
                {data.cyclical_universe && <div className="mt-4 p-4 bg-green-50 border-l-4 border-emerald-400 rounded"><strong>Cyclical Universe:</strong> {data.cyclical_universe}</div>}
                {data.human_years && <div className="mt-4 p-4 bg-green-50 border-l-4 border-emerald-400 rounded"><strong>Human Years:</strong> {data.human_years}</div>}
                {data.lifetime_brahma && <div className="mt-4 p-4 bg-green-50 border-l-4 border-emerald-400 rounded"><strong>Lifetime of Brahma:</strong> {data.lifetime_brahma}</div>}
                {data.longduration && <div className="mt-4 p-4 bg-green-50 border-l-4 border-emerald-400 rounded"><strong>Long Duration:</strong> {data.longduration}</div>}
              </div>
            </div>

            {/* Render cosmic time system details */}
            {data.cosmicTimeSystem && typeof data.cosmicTimeSystem === "object" && (
              <div className="mt-12 p-6 md:p-8 bg-white border-2 border-emerald-100 rounded-2xl ring-1 ring-emerald-100/30 bg-white/80 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 text-emerald-700">Cosmic Time System</h3>
                <pre className="whitespace-pre-wrap text-xl text-gray-800 bg-emerald-50 rounded p-4 overflow-x-auto">
                  {JSON.stringify(data.cosmicTimeSystem, null, 2)}
                </pre>
              </div>
            )}

            {/* Render final consolidated insight */}
            {data.final_consolidated_insight && typeof data.final_consolidated_insight === "object" && (
              <div className="mt-12 p-6 md:p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-emerald-600 rounded-lg ring-1 ring-emerald-100/30 bg-white/70 backdrop-blur-sm">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Final Consolidated Insight</h4>
                <ul className="list-disc pl-6">
                  {Object.entries(data.final_consolidated_insight).map(([k, v]) => (
                    <li key={k}><strong>{k.replace(/_/g, ' ')}:</strong> {v as string}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Render manvantara details if present */}
            {data.manvantara && typeof data.manvantara === "object" && Object.keys(data.manvantara).length > 0 && (
              <div className="mt-12 p-6 md:p-8 bg-white border-2 border-emerald-100 rounded-2xl ring-1 ring-emerald-100/30 bg-white/80 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 text-emerald-700">Manvantara</h3>
                <pre className="whitespace-pre-wrap text-xl text-gray-800 bg-emerald-50 rounded p-4 overflow-x-auto">
                  {JSON.stringify(data.manvantara, null, 2)}
                </pre>
              </div>
            )}
          </div>
          <div className="w-full lg:w-1/4">
            <SimilarCategories />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
