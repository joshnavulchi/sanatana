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
}
interface Section {
  id: string;
  title: string;
  content: string;
  src?: string;
  nodecaration?: boolean;
  items?: TopicItem[];
  points?: string[];
  pointSrc?: string[];
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
      .catch(() => { });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <section className="relative z-0 bg-white py-4 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-3">
            <div className="h-0.5 w-12" />
            <span className="text-2xl text-amber-500">✦</span>
            <div className="h-0.5 w-12" />
          </div>
        </div>

        {sections.map((section, sectionIndex) => (
          <div
            key={section.id}
            className={`mb-6 last:mb-0 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} delay-[${sectionIndex * 120}ms]`}
          >
            <div className="text-center">
              <h4 className="text-2xl md:text-3xl font-semibold text-amber-700 mb-4">{section.title}</h4>
              <p className="text-lg sm:text-base text-gray-600 mb-4">{section.content}</p>
            </div>

            {section.src && (
              <div className="flex justify-center my-8">
                <LazyImage src={section.src} alt={section.title} width={280} height={280} className="rounded-xl backdrop-blur-sm shadow-sm hover:shadow-md transition-transform hover:-translate-y-0.5" />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 my-8">
              {section.items?.map((topic, topicIndex) => (
                <article
                  key={`${section.id}-${topic.id || topicIndex}`}
                  className="flex flex-col gap-1 p-4 rounded-xl bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3">
                    {topic.src && (
                      <LazyImage src={topic.src} alt={topic.title} width={64} height={64} className="rounded-full bg-white p-1" />
                    )}
                    <div>
                      <h5 className="text-lg sm:text-base font-semibold text-amber-700">{topic.title}</h5>
                      <p className="text-lg sm:text-base text-gray-600 line-clamp-3 my-3">{topic.description}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center gap-3">
                    {topic.link ? (
                      <Link href={topic.link} title={topic.title} className="inline-flex items-center gap-2 text-lg sm:text-base font-medium text-amber-700">
                        Learn more
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ) : (
                      <span aria-disabled className="inline-flex items-center gap-2 text-lg sm:text-base font-medium text-amber-700 opacity-60 cursor-not-allowed">
                        Learn more
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    )}
                    <span className="ml-auto text-sm px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">{topic.id || '•'}</span>
                  </div>
                </article>
              ))}

              {section.points?.map((point, index) => (
                <div key={`${section.id}-point-${index}`} className="rounded-xl p-5 bg-gradient-to-br from-amber-100 via-pink-50 to-indigo-50 shadow-md text-lg font-semibold text-gray-800 mb-3 border border-amber-300/40">
                  {point}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}