"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LazyImage from "./lazyimage";
import { getLocaleNamespaceObject } from "@/lib/i18n";
import { useLocale } from "@app/context/locale-context";

/* ---------- Types ---------- */
interface TopicItem {
  id: string;
  title: string;
  description: string;
  link?: string;
  src?: string;
  details?: string[];
  [key: string]: unknown;
}

interface Section {
  id: string;
  title: string;
  content: string;
  src?: string;
  nodecaration?: boolean;
  items?: TopicItem[];
  points?: string[];
  pointsrc?: string[];
  pointSrc?: string[];
  [key: string]: unknown;
}

/* ---------- Component ---------- */

export default function UnderstandingOfSanatana() {
  const { locale } = useLocale();
  const [sections, setSections] = useState<Section[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getLocaleNamespaceObject(locale, "home")
      .then((ns: unknown) => {
        setIsVisible(true);
        if (cancelled || typeof ns !== "object" || ns === null) return;
        const data = ns as { sections?: Section[]; home?: { sections?: Section[] } };
        if (Array.isArray(data.sections)) {
          setSections(data.sections);
        } else if (Array.isArray(data.home?.sections)) {
          setSections(data.home.sections);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <section className="relative z-0 bg-slate-50 py-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3">
            <div className="h-0.5 w-12 bg-slate-300" />
            <span className="text-2xl text-slate-600">✦</span>
            <div className="h-0.5 w-12 bg-slate-300" />
          </div>
        </div>

        {sections.map((section, sectionIndex) => {
          const sectionListGroups = Object.entries(section).filter(([key, value]) => {
            if (["id", "title", "content", "src", "items", "points", "pointsrc", "pointSrc", "nodecaration"].includes(key)) {
              return false;
            }
            return Array.isArray(value) && value.every((item) => typeof item === "string");
          });

          return (
            <div
              key={section.id}
              className={`mb-10 last:mb-0 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${sectionIndex * 120}ms` }}
            >
              <div className="bg-white rounded-3xl p-6 sm:p-8">
                <div className="text-center mb-6">
                  <h4 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">{section.title}</h4>
                  <p className="text-md sm:text-base text-slate-600 leading-relaxed">{section.content}</p>
                </div>

                {section.src && (
                  <div className="flex justify-center my-8">
                    <LazyImage src={section.src} alt={section.title} width={280} height={280} className="rounded-2xl" />
                  </div>
                )}

                {sectionListGroups.map(([key, value]) => {
                  const entries = value as string[];
                  const label = key
                    .split("_")
                    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                    .join(" ");

                  return (
                    <div key={`${section.id}-${key}`} className="mb-6 rounded-2xl bg-slate-100 px-5 py-4">
                      <h5 className="text-md sm:text-base font-semibold text-slate-800 mb-3">{label}</h5>
                      <ul className="space-y-2">
                        {entries.map((entry, index) => (
                          <li key={`${section.id}-${key}-${index}`} className="text-md sm:text-base text-slate-600 leading-relaxed flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                            <span>{entry}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 my-8">
                  {section.items?.map((topic, topicIndex) => (
                    <article
                      key={`${section.id}-${topic.id || topicIndex}`}
                      className="flex flex-col gap-3 p-5 rounded-2xl bg-slate-100 transition-transform hover:-translate-y-0.5"
                    >
                      <div className="flex items-start gap-3">
                        {topic.src && (
                          <LazyImage src={topic.src} alt={topic.title} width={64} height={64} className="rounded-xl bg-white" />
                        )}
                        <div>
                          <h5 className="text-md sm:text-base font-semibold text-slate-800">{topic.title}</h5>
                          <p className="text-md sm:text-base text-slate-600 my-2 leading-relaxed">{topic.description}</p>

                          {Array.isArray(topic.details) && topic.details.length > 0 && (
                            <ul className="space-y-1 mt-2">
                              {topic.details.map((detail, detailIndex) => (
                                <li
                                  key={`${section.id}-${topic.id || topicIndex}-detail-${detailIndex}`}
                                  className="text-sm text-slate-500 leading-relaxed flex items-start gap-2"
                                >
                                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      <div className="mt-auto flex items-center gap-3">
                        {topic.link ? (
                          <Link
                            href={topic.link}
                            title={topic.title}
                            aria-label={`Learn more about ${topic.title}`}
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                          >
                            Learn more about {topic.title}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        ) : (
                          <span aria-disabled className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 opacity-60 cursor-not-allowed">
                            Learn more about {topic.title}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        )}
                        <span className="ml-auto text-sm px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">{topic.id || "•"}</span>
                      </div>
                    </article>
                  ))}

                  {section.points?.map((point, index) => {
                    const pointImage = (section.pointsrc && section.pointsrc[index]) || (section.pointSrc && section.pointSrc[index]);
                    return (
                      <div
                        key={`${section.id}-point-${index}`}
                        className="rounded-2xl p-5 bg-slate-100 text-lg font-semibold text-slate-800 mb-3 flex items-center gap-3"
                      >
                        {pointImage && <LazyImage src={pointImage} alt={point} width={48} height={48} className="rounded-lg" />}
                        <span>{point}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
