"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LazyImage from "../lazy-image/LazyImage";
import { loadLocaleNamespace } from "../../../lib/i18n";
import { useLocale } from "../../context/locale-context";

/* ---------- Types ---------- */

interface TopicItem {
  id: string;
  title: string;
  description: string;
  href: string;
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

    loadLocaleNamespace(locale, "home")
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
    <div className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-white via-amber-50/30 to-white dark:from-gray-900 dark:via-amber-950/20 dark:to-gray-900">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-200/20 dark:bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-200/20 dark:bg-orange-500/10 rounded-full blur-3xl" />

      <div className="content-wrapper relative z-10">
        {sections.map((section, sectionIndex) => (
          <div
            key={section.id}
            className={`mb-20 last:mb-0 transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            style={{ transitionDelay: `${sectionIndex * 150}ms` }}
          >
            {/* Header */}
            <div className="mx-auto max-w-5xl text-center mb-12 space-y-6">
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
                <span role="img" aria-label="decorative star" className="text-2xl text-amber-500">
                  ✦
                </span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
              </div>

              <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                {section.title}
              </h3>

              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                {section.content}
              </p>

              {section.src && (
                <div className="flex justify-center pt-4">
                  <LazyImage
                    src={section.src}
                    alt={section.title}
                    width={320}
                    height={320}
                    className="rounded-xl shadow-xl"
                  />
                </div>
              )}
            </div>

            {/* Items */}
            <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.items?.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border p-6 shadow-lg hover:shadow-xl transition"
                >
                  <div className="text-center space-y-4">
                    {topic.src && (
                      <LazyImage
                        src={topic.src}
                        alt={topic.title}
                        width={76}
                        height={76}
                        className="mx-auto"
                      />
                    )}

                    <h4 className="text-xl font-bold">{topic.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {topic.description}
                    </p>

                    <Link
                      href={topic.href}
                      title={topic.title}
                      className="inline-flex items-center gap-2 text-amber-600 font-semibold"
                    >
                      Read more
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}

              {section.points?.map((point, index) => (
                <div
                  key={`${section.id}-point-${index}`}
                  className="bg-gradient-to-br from-white to-amber-50 rounded-2xl p-6 shadow-lg"
                >
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}