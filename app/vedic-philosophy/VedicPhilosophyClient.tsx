"use client";

import { useLocale } from "@app/context/locale-context";
import useLocaleSection from "@app/hooks/useLocaleSection";
import Loader from "@components/loader";
import PageLayout from "@components/common/PageLayout";

type GenericRecord = Record<string, unknown>;

function PrincipleCard({
  principle,
  explanation,
  deepUnderstanding,
  index,
}: {
  principle: string;
  explanation: string;
  deepUnderstanding?: string[];
  index: number;
}) {
  const bgColors = [
    "bg-[#fffbf7]",
    "bg-[#fff9f2]",
    "bg-[#fffaf4]",
    "bg-[#fff8f1]",
  ];

  return (
    <div
      className={`relative rounded-2xl border border-[#d4ae7a]/20 p-6 md:p-7 ${bgColors[index % 4]} shadow-[0_4px_15px_rgba(139,69,19,0.06)]`}
    >
      <h4 className="text-lg font-bold text-[#5a2d0c] mb-2">{principle}</h4>
      <p className="text-md sm:text-base text-[#6d3d1a] mb-4">{explanation}</p>
      {deepUnderstanding && deepUnderstanding.length > 0 && (
        <ul className="space-y-2 border-t border-[#d4ae7a]/15 pt-4">
          {deepUnderstanding.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-[#7a4a2e]">
              <span className="text-[#b8860b] font-bold mt-1">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PathCard({
  path,
  explanation,
  deepUnderstanding,
  index,
}: {
  path: string;
  explanation: string;
  deepUnderstanding?: string[];
  index: number;
}) {
  const bgColors = [
    "bg-gradient-to-br from-[#fff9f0] to-[#fff5e6]",
    "bg-gradient-to-br from-[#fffaf4] to-[#fff8f0]",
    "bg-gradient-to-br from-[#fffbf7] to-[#fffef9]",
    "bg-gradient-to-br from-[#fff8f1] to-[#fffaf4]",
  ];

  return (
    <div
      className={`relative rounded-2xl border border-[#d4a574]/25 p-6 md:p-7 ${bgColors[index % 4]} shadow-[0_4px_15px_rgba(139,69,19,0.07)]`}
    >
      <h4 className="text-lg font-bold text-[#6d3414] mb-2">{path}</h4>
      <p className="text-md sm:text-base text-[#7a4a2d] mb-4">{explanation}</p>
      {deepUnderstanding && deepUnderstanding.length > 0 && (
        <ul className="space-y-2 border-t border-[#d4a574]/15 pt-4">
          {deepUnderstanding.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-[#8b5a3c]">
              <span className="text-[#c09850] font-bold mt-1">✦</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ConceptCard({
  concept,
  explanation,
  deepUnderstanding,
  index,
}: {
  concept: string;
  explanation: string;
  deepUnderstanding?: string[];
  index: number;
}) {
  const bgColors = [
    "bg-[#fffef9]",
    "bg-[#fffcf5]",
    "bg-[#fffbf7]",
    "bg-[#fffaf4]",
  ];

  return (
    <div
      className={`relative rounded-2xl border border-[#ddb892]/25 p-6 md:p-7 ${bgColors[index % 4]} shadow-[0_4px_15px_rgba(139,69,19,0.05)]`}
    >
      <h4 className="text-lg font-bold text-[#703d1b] mb-2">{concept}</h4>
      <p className="text-md sm:text-base text-[#7a4a2d] mb-4">{explanation}</p>
      {deepUnderstanding && deepUnderstanding.length > 0 && (
        <ul className="space-y-2 border-t border-[#ddb892]/15 pt-4">
          {deepUnderstanding.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-[#8b5a3c]">
              <span className="text-[#c09850] font-bold mt-1">✦</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function VedicClient() {
  const { isLoading } = useLocale();
  const pageNs = useLocaleSection("vedic-philosophy");
  const root = pageNs && typeof pageNs === "object" ? pageNs : {};

  if (isLoading && !root) {
    return (
      <PageLayout
        metaKey="vedic-philosophy"
        title=""
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Vedic Philosophy" }]}
        className="layout-md"
      >
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  const content = (root as GenericRecord) || {};
  const meaning = typeof content.meaning === "string" ? content.meaning : "";
  const introduction =
    typeof content.introduction === "string" ? content.introduction : "";
  const corePurpose = Array.isArray(content.core_purpose)
    ? content.core_purpose.filter((v) => typeof v === "string")
    : [];
  const fundamentalPrinciples = Array.isArray(content.fundamental_principles)
    ? content.fundamental_principles.filter((v) => v && typeof v === "object")
    : [];
  const pathsOfSpiritualGrowth = Array.isArray(content.paths_of_spiritual_growth)
    ? content.paths_of_spiritual_growth.filter((v) => v && typeof v === "object")
    : [];
  const keyConcepts = Array.isArray(content.key_concepts)
    ? content.key_concepts.filter((v) => v && typeof v === "object")
    : [];
  const learningApproach = Array.isArray(content.learning_approach)
    ? content.learning_approach.filter((v) => typeof v === "string")
    : [];
  const modernRelevance = Array.isArray(content.modern_relevance)
    ? content.modern_relevance.filter((v) => typeof v === "string")
    : [];

  return (
    <PageLayout
      metaKey="vedic-philosophy"
      title="Vedic Philosophy"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Vedic Philosophy" }]}
      className="layout-md"
    >
      {/* Meaning Section */}
      {meaning && (
        <section className="mb-10 px-4 py-8 md:px-6 md:py-10 bg-[#fffaf4] rounded-2xl border border-[#ddb892]/20 shadow-[0_4px_12px_rgba(139,69,19,0.05)]">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5a2d0c] mb-4">
            What is Vedic Philosophy?
          </h2>
          <p className="text-base text-[#6d3d1a] leading-relaxed">{meaning}</p>
        </section>
      )}

      {/* Introduction Section */}
      {introduction && (
        <section className="mb-10 px-4 py-8 md:px-6 md:py-10 bg-[#fff9f0] rounded-2xl border border-[#d4ae7a]/20 shadow-[0_4px_12px_rgba(139,69,19,0.05)]">
          <h2 className="text-2xl md:text-3xl font-bold text-[#6d3414] mb-4">
            Introduction
          </h2>
          <p className="text-base text-[#7a4a2d] leading-relaxed">{introduction}</p>
        </section>
      )}

      {/* Core Purpose Section */}
      {corePurpose.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5a2d0c] mb-6">
            Core Purpose
          </h2>
          <ul className="space-y-3">
            {corePurpose.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-4 p-4 bg-[#fffaf4] rounded-xl border border-[#d4ae7a]/15 shadow-[0_2px_8px_rgba(139,69,19,0.04)]"
              >
                <span className="text-[#b8860b] font-bold text-2xl leading-tight shrink-0">
                  ◆
                </span>
                <span className="text-base text-[#6d3d1a]">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Fundamental Principles Section */}
      {fundamentalPrinciples.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5a2d0c] mb-6">
            Fundamental Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(fundamentalPrinciples as GenericRecord[]).map((principle, idx) => (
              <PrincipleCard
                key={idx}
                principle={
                  typeof principle.principle === "string"
                    ? principle.principle
                    : ""
                }
                explanation={
                  typeof principle.explanation === "string"
                    ? principle.explanation
                    : ""
                }
                deepUnderstanding={
                  Array.isArray(principle.deep_understanding)
                    ? (principle.deep_understanding as string[])
                    : undefined
                }
                index={idx}
              />
            ))}
          </div>
        </section>
      )}

      {/* Paths of Spiritual Growth Section */}
      {pathsOfSpiritualGrowth.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5a2d0c] mb-6">
            Paths of Spiritual Growth
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(pathsOfSpiritualGrowth as GenericRecord[]).map((pathItem, idx) => (
              <PathCard
                key={idx}
                path={typeof pathItem.path === "string" ? pathItem.path : ""}
                explanation={
                  typeof pathItem.explanation === "string"
                    ? pathItem.explanation
                    : ""
                }
                deepUnderstanding={
                  Array.isArray(pathItem.deep_understanding)
                    ? (pathItem.deep_understanding as string[])
                    : undefined
                }
                index={idx}
              />
            ))}
          </div>
        </section>
      )}

      {/* Key Concepts Section */}
      {keyConcepts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5a2d0c] mb-6">
            Key Concepts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(keyConcepts as GenericRecord[]).map((concept, idx) => (
              <ConceptCard
                key={idx}
                concept={
                  typeof concept.concept === "string" ? concept.concept : ""
                }
                explanation={
                  typeof concept.explanation === "string"
                    ? concept.explanation
                    : ""
                }
                deepUnderstanding={
                  Array.isArray(concept.deep_understanding)
                    ? (concept.deep_understanding as string[])
                    : undefined
                }
                index={idx}
              />
            ))}
          </div>
        </section>
      )}

      {/* Learning Approach Section */}
      {learningApproach.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5a2d0c] mb-6">
            How to Learn Vedic Philosophy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningApproach.map((item, idx) => (
              <div
                key={idx}
                className="p-5 bg-linear-to-br from-[#fff9f0] to-[#fffaf4] rounded-xl border border-[#d4ae7a]/20 shadow-[0_2px_8px_rgba(139,69,19,0.04)]"
              >
                <div className="flex items-start gap-3">
                  <span className="text-[#b8860b] font-extrabold text-lg leading-tight shrink-0 pt-1">
                    {idx + 1}
                  </span>
                  <p className="text-base text-[#6d3d1a]">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Modern Relevance Section */}
      {modernRelevance.length > 0 && (
        <section className="mb-10 bg-[#fffbf7] rounded-2xl border border-[#d4ae7a]/20 p-6 md:p-8 shadow-[0_4px_12px_rgba(139,69,19,0.05)]">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5a2d0c] mb-6">
            Modern Relevance
          </h2>
          <ul className="space-y-3">
            {modernRelevance.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-4 text-base text-[#6d3d1a]"
              >
                <span className="text-[#b8860b] font-bold text-xl leading-tight shrink-0">
                  ★
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

