"use client";

import { useLocale } from "@app/context/locale-context";
import useLocaleSection from "@app/hooks/useLocaleSection";
import Loader from "@components/loader";
import PageLayout from "@components/common/PageLayout";

type GenericRecord = Record<string, unknown>;

function FieldCard({
  field,
  explanation,
  deepUnderstanding,
  keyConcepts,
  index,
}: {
  field: string;
  explanation: string;
  deepUnderstanding?: string[];
  keyConcepts?: string[];
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
      <h4 className="text-lg font-semibold text-[#5a2d0c] mb-2">{field}</h4>
      <p className="text-md sm:text-base text-[#6d3d1a] mb-4">{explanation}</p>

      {deepUnderstanding && deepUnderstanding.length > 0 && (
        <div className="mb-4 border-t border-[#d4ae7a]/15 pt-4">
          <h5 className="text-xs font-semibold text-[#7a4a2d] mb-2 uppercase tracking-wide">
            Deep Understanding
          </h5>
          <ul className="space-y-1">
            {deepUnderstanding.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-md sm:text-base text-[#7a4a2e]"
              >
                <span className="text-[#b8860b] font-semibold mt-1">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {keyConcepts && keyConcepts.length > 0 && (
        <div className="border-t border-[#d4ae7a]/15 pt-4">
          <h5 className="text-xs font-semibold text-[#7a4a2d] mb-2 uppercase tracking-wide">
            Key Concepts
          </h5>
          <ul className="space-y-1">
            {keyConcepts.map((concept, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-md sm:text-base text-[#7a4a2e]"
              >
                <span className="text-[#c09850] font-semibold mt-1">✓</span>
                <span>{concept}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

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
    "bg-[#fffef9]",
    "bg-[#fffcf5]",
    "bg-[#fffbf7]",
    "bg-[#fffaf4]",
  ];

  return (
    <div
      className={`relative rounded-2xl border border-[#ddb892]/25 p-6 md:p-7 ${bgColors[index % 4]} shadow-[0_4px_15px_rgba(139,69,19,0.05)]`}
    >
      <h4 className="text-lg font-semibold text-[#703d1b] mb-2">{principle}</h4>
      <p className="text-md sm:text-base text-[#7a4a2d] mb-4">{explanation}</p>
      {deepUnderstanding && deepUnderstanding.length > 0 && (
        <ul className="space-y-2 border-t border-[#ddb892]/15 pt-4">
          {deepUnderstanding.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-md sm:text-base text-[#8b5a3c]">
              <span className="text-[#c09850] font-semibold mt-1">✦</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function VedicScienceClient() {
  const { isLoading } = useLocale();
  const pageNs = useLocaleSection("vedic-science");
  const root = pageNs && typeof pageNs === "object" ? pageNs : {};

  if (isLoading && !root) {
    return (
      <PageLayout
        metaKey="vedic-science"
        title=""
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Vedic Science" }]}
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
  const majorFields = Array.isArray(content.major_fields)
    ? content.major_fields.filter((v) => v && typeof v === "object")
    : [];
  const scientificPrinciples = Array.isArray(content.scientific_principles)
    ? content.scientific_principles.filter((v) => v && typeof v === "object")
    : [];
  const approachToKnowledge = Array.isArray(content.approach_to_knowledge)
    ? content.approach_to_knowledge.filter((v) => typeof v === "string")
    : [];
  const differencesFromModernScience = Array.isArray(
    content.differences_from_modern_science
  )
    ? content.differences_from_modern_science.filter((v) => typeof v === "string")
    : [];
  const modernRelevance = Array.isArray(content.modern_relevance)
    ? content.modern_relevance.filter((v) => typeof v === "string")
    : [];

  return (
    <PageLayout
      metaKey="vedic-science"
      title="Vedic Science"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Vedic Science" }]}
      className="layout-md"
    >
      {/* Meaning Section */}
      {meaning && (
        <section className="mb-10 px-4 py-8 md:px-6 md:py-10 bg-[#fffaf4] rounded-2xl border border-[#ddb892]/20 shadow-[0_4px_12px_rgba(139,69,19,0.05)]">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#5a2d0c] mb-4">
            What is Vedic Science?
          </h2>
          <p className="text-base text-[#6d3d1a] leading-relaxed">{meaning}</p>
        </section>
      )}

      {/* Introduction Section */}
      {introduction && (
        <section className="mb-10 px-4 py-8 md:px-6 md:py-10 bg-[#fff9f0] rounded-2xl border border-[#d4ae7a]/20 shadow-[0_4px_12px_rgba(139,69,19,0.05)]">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#6d3414] mb-4">
            Introduction
          </h2>
          <p className="text-base text-[#7a4a2d] leading-relaxed">
            {introduction}
          </p>
        </section>
      )}

      {/* Core Purpose Section */}
      {corePurpose.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#5a2d0c] mb-6">
            Core Purpose
          </h2>
          <ul className="space-y-3">
            {corePurpose.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-4 p-4 bg-[#fffaf4] rounded-xl border border-[#d4ae7a]/15 shadow-[0_2px_8px_rgba(139,69,19,0.04)]"
              >
                <span className="text-[#b8860b] font-semibold text-2xl leading-tight shrink-0">
                  ◆
                </span>
                <span className="text-base text-[#6d3d1a]">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Major Fields Section */}
      {majorFields.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#5a2d0c] mb-6">
            Major Fields of Vedic Science
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(majorFields as GenericRecord[]).map((field, idx) => (
              <FieldCard
                key={idx}
                field={typeof field.field === "string" ? field.field : ""}
                explanation={
                  typeof field.explanation === "string"
                    ? field.explanation
                    : ""
                }
                deepUnderstanding={
                  Array.isArray(field.deep_understanding)
                    ? (field.deep_understanding as string[])
                    : undefined
                }
                keyConcepts={
                  Array.isArray(field.key_concepts)
                    ? (field.key_concepts as string[])
                    : undefined
                }
                index={idx}
              />
            ))}
          </div>
        </section>
      )}

      {/* Scientific Principles Section */}
      {scientificPrinciples.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#5a2d0c] mb-6">
            Scientific Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(scientificPrinciples as GenericRecord[]).map((principle, idx) => (
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

      {/* Approach to Knowledge Section */}
      {approachToKnowledge.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#5a2d0c] mb-6">
            Approach to Knowledge
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approachToKnowledge.map((item, idx) => (
              <div
                key={idx}
                className="p-5 bg-linear-to-br from-[#fff9f0] to-[#fffaf4] rounded-xl border border-[#d4ae7a]/20 shadow-[0_2px_8px_rgba(139,69,19,0.04)]"
              >
                <div className="flex items-start gap-3">
                  <span className="text-[#b8860b] font-semibold text-lg leading-tight shrink-0 pt-1">
                    {idx + 1}
                  </span>
                  <p className="text-base text-[#6d3d1a]">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Differences from Modern Science Section */}
      {differencesFromModernScience.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#5a2d0c] mb-6">
            Differences from Modern Science
          </h2>
          <ul className="space-y-3">
            {differencesFromModernScience.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-4 p-4 bg-[#fff9f0] rounded-xl border border-[#d4ae7a]/15 shadow-[0_2px_8px_rgba(139,69,19,0.04)]"
              >
                <span className="text-[#b8860b] font-semibold text-lg leading-tight shrink-0">
                  →
                </span>
                <span className="text-base text-[#6d3d1a]">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Modern Relevance Section */}
      {modernRelevance.length > 0 && (
        <section className="mb-10 bg-[#fffbf7] rounded-2xl border border-[#d4ae7a]/20 p-6 md:p-8 shadow-[0_4px_12px_rgba(139,69,19,0.05)]">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#5a2d0c] mb-6">
            Modern Relevance
          </h2>
          <ul className="space-y-3">
            {modernRelevance.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-4 text-base text-[#6d3d1a]"
              >
                <span className="text-[#b8860b] font-semibold text-xl leading-tight shrink-0">
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

