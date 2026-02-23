"use client";
import React from "react";
import PageLayout from "@components/common/PageLayout";
import { useLocale } from "@app/context/locale-context";
import useLocaleSection from "@app/hooks/useLocaleSection";
import Loader from "@components/loader";
import SimilarCategories from "@components/similar-categories/SimilarCategories";

export default function AdvaitaClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection("philosophy_advaita");

  const data = {
    title: ns?.title || "Advaita Philosophy",
    meta: ns?.meta || {},
    definition: ns?.definition || "",
    benefits: Array.isArray(ns?.benefits) ? ns.benefits : [],
    core_principles: Array.isArray(ns?.core_principles) ? ns.core_principles : [],
    features: Array.isArray(ns?.features) ? ns.features : [],
    goals: Array.isArray(ns?.goals) ? ns.goals : [],
    key_concepts: ns?.key_concepts || {},
    key_scriptural_references: Array.isArray(ns?.key_scriptural_references) ? ns.key_scriptural_references : [],
    modern_relevance: ns?.modern_relevance || {},
    origin: ns?.origin || {},
    paths_to_realization: ns?.paths_to_realization || {},
    purpose: ns?.purpose || "",
    relation_to_other_concepts: ns?.relation_to_other_concepts || {},
    unique_insights: ns?.unique_insights || "",
  };

  if (isLoading && !data.title) {
    return (
      <PageLayout metaKey="philosophy_advaita" title="" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Philosophy", href: "/philosophy" }, { label: "Advaita" }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="philosophy_advaita"
      title={data.title}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Philosophy", href: "/philosophy" }, { label: data.title }]}
      className="layout-md"
    >
      <div id="advaita-content">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/4">
            <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-50 rounded-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/8 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-indigo-600" />
                  <span className="text-3xl animate-pulse">🧘‍♂️</span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-indigo-600" />
                </div>
                <h3 className="text-4xl font-extrabold text-indigo-700 mb-4">{data.title}</h3>
                <p className="text-lg md:text-xl md:text-lg text-indigo-900 mb-6 italic">{data.definition}</p>
                {data.purpose && <div className="mt-4 p-4 bg-blue-50 border-l-4 border-indigo-400 rounded"><strong>Purpose:</strong> {data.purpose}</div>}
                {data.unique_insights && <div className="mt-4 p-4 bg-blue-50 border-l-4 border-indigo-400 rounded"><strong>Unique Insights:</strong> {data.unique_insights}</div>}
              </div>
            </div>

            {data.core_principles.length > 0 && (
              <div className="mt-12 p-6 md:p-8 bg-white border-2 border-indigo-100 rounded-2xl ring-1 ring-indigo-100/30 bg-white/80 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 text-indigo-700">Core Principles</h3>
                <ul className="list-disc pl-6">
                  {data.core_principles.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.benefits.length > 0 && (
              <div className="mt-12 p-6 md:p-8 bg-white border-2 border-indigo-100 rounded-2xl ring-1 ring-indigo-100/30 bg-white/80 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 text-indigo-700">Benefits</h3>
                <ul className="list-disc pl-6">
                  {data.benefits.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.features.length > 0 && (
              <div className="mt-12 p-6 md:p-8 bg-white border-2 border-indigo-100 rounded-2xl ring-1 ring-indigo-100/30 bg-white/80 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 text-indigo-700">Features</h3>
                <ul className="list-disc pl-6">
                  {data.features.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.goals.length > 0 && (
              <div className="mt-12 p-6 md:p-8 bg-white border-2 border-indigo-100 rounded-2xl ring-1 ring-indigo-100/30 bg-white/80 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 text-indigo-700">Goals</h3>
                <ul className="list-disc pl-6">
                  {data.goals.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.key_concepts && Object.keys(data.key_concepts).length > 0 && (
              <div className="mt-12 p-6 md:p-8 bg-white border-2 border-indigo-100 rounded-2xl ring-1 ring-indigo-100/30 bg-white/80 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 text-indigo-700">Key Concepts</h3>
                <ul className="list-disc pl-6">
                  {Object.entries(data.key_concepts).map(([k, v]) => (
                    <li key={k}><strong>{k}:</strong> {v as string}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.key_scriptural_references.length > 0 && (
              <div className="mt-12 p-6 md:p-8 bg-white border-2 border-indigo-100 rounded-2xl ring-1 ring-indigo-100/30 bg-white/80 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 text-indigo-700">Key Scriptural References</h3>
                <ul className="list-disc pl-6">
                  {data.key_scriptural_references.map((ref, idx) => (
                    <li key={idx}><span className="font-semibold">{ref.text}:</span> {ref.quote_summary}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.origin && Object.keys(data.origin).length > 0 && (
              <div className="mt-12 p-6 md:p-8 bg-white border-2 border-indigo-100 rounded-2xl ring-1 ring-indigo-100/30 bg-white/80 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 text-indigo-700">Origin</h3>
                <ul className="list-disc pl-6">
                  {Object.entries(data.origin).map(([k, v]) => (
                    <li key={k}><strong>{k}:</strong> {Array.isArray(v) ? v.join(", ") : v as string}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.paths_to_realization && Object.keys(data.paths_to_realization).length > 0 && (
              <div className="mt-12 p-6 md:p-8 bg-white border-2 border-indigo-100 rounded-2xl ring-1 ring-indigo-100/30 bg-white/80 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 text-indigo-700">Paths to Realization</h3>
                <ul className="list-disc pl-6">
                  {Object.entries(data.paths_to_realization).map(([k, v]) => (
                    <li key={k}><strong>{k.replace(/_/g, ' ')}:</strong> {v as string}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.relation_to_other_concepts && Object.keys(data.relation_to_other_concepts).length > 0 && (
              <div className="mt-12 p-6 md:p-8 bg-white border-2 border-indigo-100 rounded-2xl ring-1 ring-indigo-100/30 bg-white/80 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 text-indigo-700">Relation to Other Concepts</h3>
                <ul className="list-disc pl-6">
                  {Object.entries(data.relation_to_other_concepts).map(([k, v]) => (
                    <li key={k}><strong>{k}:</strong> {v as string}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.modern_relevance && Object.keys(data.modern_relevance).length > 0 && (
              <div className="mt-12 p-6 md:p-8 bg-white border-2 border-indigo-100 rounded-2xl ring-1 ring-indigo-100/30 bg-white/80 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 text-indigo-700">Modern Relevance</h3>
                <ul className="list-disc pl-6">
                  {Object.entries(data.modern_relevance).map(([k, v]) => (
                    <li key={k}><strong>{k}:</strong> {v as string}</li>
                  ))}
                </ul>
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