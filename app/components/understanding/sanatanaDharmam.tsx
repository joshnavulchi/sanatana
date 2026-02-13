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
    <div className="relative z-0 px-3 overflow-hidden bg-gradient-to-b from-white via-amber-50/30 to-white">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl" />

      <div className="content-wrapper relative z-10">
        {sections.map((section, sectionIndex) => (
          <div key={section.id} className={`mx-auto max-w-7xl mb-12 last:mb-0 transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            style={{ transitionDelay: `${sectionIndex * 150}ms` }}>
            {/* Header */}
            <div className="md:mx-auto md:max-w-6xl text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
                <span role="img" aria-label="decorative star" className="text-2xl text-amber-500">
                  ✦
                </span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
              </div>

              <h5 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text my-6">
                {section.title}
              </h5>

              <p className="text-lg mb-6">
                {section.content}
              </p>

              {section.src && (
                <div className="flex justify-center mt-8">
                  <LazyImage
                    src={section.src}
                    alt={section.title}
                    width={320}
                    height={320}
                    className="bg-black rounded-xl shadow-xl shadow-neutral-400"
                  />
                </div>
              )}
            </div>

            {/* Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {section.items?.map((topic, topicIndex) => (
                <div key={`${section.id}-${topic.id || topicIndex}`} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
                  <div className="text-center">
                    {topic.src && (
                      <LazyImage
                        src={topic.src}
                        alt={topic.title}
                        width={76}
                        height={76}
                        className="mx-auto inline-flex"
                      />
                    )}
                    <h6 className="text-xl font-bold text-amber-800">{topic.title}</h6>
                    <p className="text-gray-600">
                      {topic.description}
                    </p>
                    <Link
                      href={topic.href}
                      title={topic.title}
                      className="inline-flex items-center gap-2 text-amber-800 font-semibold"
                    >
                      {`Learn more about ${topic.title}`}
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
                <div key={`${section.id}-point-${index}`} className="bg-gradient-to-br from-white to-amber-50 border-2 border-amber-100 rounded-2xl p-6 mb-6 md:mb-0 shadow-lg">
                  <p className="text-2xl text-gray-800 font-medium">
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