"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LazyImage from "./lazyimage";
import { loadLocaleNamespace } from "@lib/i18n";
import { useLocale } from "@app/context/locale-context";

interface TopicItem {
  id?: string;
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
  pointsrc?: string[] | string;
}

const SECTION_SYMBOLS = ["ॐ", "✺", "🪔", "❋", "☀️", "🕉️"];
const SECTION_TONES = [
  {
    shell: "from-[#fff7ed] via-[#fde7c7] to-[#f8d7a0]",
    border: "border-[#d8a25a]/70",
    badge: "bg-[#7a2e1f] text-[#fff4df]",
    accent: "from-[#a63d17] via-[#d97706] to-[#f59e0b]",
    ornament: "bg-[#f4c98b]/55",
    cardBorder: "border-[#d9a15d]",
    cardGlow: "shadow-[0_20px_50px_rgba(166,61,23,0.12)]",
  },
  {
    shell: "from-[#fffaf0] via-[#f6e7cc] to-[#efd7b1]",
    border: "border-[#b45309]/30",
    badge: "bg-[#92400e] text-[#fff7e6]",
    accent: "from-[#92400e] via-[#c2410c] to-[#ea580c]",
    ornament: "bg-[#f5d7a1]/60",
    cardBorder: "border-[#c98a41]",
    cardGlow: "shadow-[0_22px_48px_rgba(146,64,14,0.13)]",
  },
  {
    shell: "from-[#fff8f1] via-[#fde8d1] to-[#f4d6b0]",
    border: "border-[#7c2d12]/25",
    badge: "bg-[#9a3412] text-[#fff3e0]",
    accent: "from-[#7c2d12] via-[#c2410c] to-[#fb923c]",
    ornament: "bg-[#efc48c]/60",
    cardBorder: "border-[#cf8f4f]",
    cardGlow: "shadow-[0_20px_44px_rgba(124,45,18,0.14)]",
  },
];

const normalizePointImages = (section: Section): string[] => {
  if (Array.isArray(section.pointSrc)) {
    return section.pointSrc;
  }

  if (Array.isArray(section.pointsrc)) {
    return section.pointsrc;
  }

  return [];
};

export default function UnderstandingOfSanatana() {
  const { locale } = useLocale();
  const [sections, setSections] = useState<Section[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadLocaleNamespace(locale, "home")
      .then((ns: unknown) => {
        if (cancelled || typeof ns !== "object" || ns === null) {
          return;
        }

        const data = ns as { sections?: Section[]; home?: { sections?: Section[] } };

        if (Array.isArray(data.sections)) {
          setSections(data.sections);
        } else if (Array.isArray(data.home?.sections)) {
          setSections(data.home.sections);
        }

        setIsVisible(true);
      })
      .catch(() => {
        setIsVisible(true);
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#fffaf3] via-[#fdf0d7] to-[#fff8ef] py-8 md:py-12">
      <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-[#f6d59b]/50 to-transparent" />
      <div className="absolute -left-16 top-24 h-64 w-64 rounded-full bg-[#f3b86b]/20 blur-3xl" />
      <div className="absolute -right-12 bottom-16 h-72 w-72 rounded-full bg-[#d97706]/15 blur-3xl" />

      <div className="content-wrapper relative z-10 space-y-10 md:space-y-14">
        {sections.map((section, sectionIndex) => {
          const tone = SECTION_TONES[sectionIndex % SECTION_TONES.length];
          const sectionSymbol = SECTION_SYMBOLS[sectionIndex % SECTION_SYMBOLS.length];
          const pointImages = normalizePointImages(section);
          const hasVisual = Boolean(section.src);
          const isAlternating = sectionIndex % 2 === 1;

          return (
            <article key={section.id} className={`group relative overflow-hidden rounded-4xl border bg-linear-to-br ${tone.shell} ${tone.border} ${tone.cardGlow} transition-all duration-1000 ease-out ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`} style={{ transitionDelay: `${sectionIndex * 140}ms` }}>
              {!section.nodecaration && (
                <>
                  <div className={`absolute left-8 top-8 h-20 w-20 rounded-full ${tone.ornament} blur-2xl`} />
                  <div className={`absolute bottom-10 right-8 h-24 w-24 rounded-full ${tone.ornament} blur-2xl`} />
                </>
              )}

              <div className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-[#b45309]/40 to-transparent" />

              <div className={`grid gap-8 px-5 py-8 md:px-8 md:py-10 lg:px-10 ${hasVisual ? "lg:grid-cols-[1.15fr_0.85fr] lg:items-center" : "grid-cols-1" }`} >
                <div className={`${isAlternating && hasVisual ? "lg:order-2" : ""}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-xl md:text-lg tracking-[0.18em] ${tone.badge}`}>
                      {`Sacred insight ${String(sectionIndex + 1).padStart(2, "0")}`}
                    </span>
                    <span className="text-2xl text-[#9a3412]" aria-hidden="true">
                      {sectionSymbol}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-linear-to-r from-[#b45309]/60 to-transparent" />
                    <span className="text-xl md:text-lg font-bold uppercase tracking-[0.35em] text-[#92400e]">
                      Temple wisdom
                    </span>
                    <div className="h-px flex-1 bg-linear-to-l from-[#b45309]/60 to-transparent" />
                  </div>

                  <h2 className={`mt-5 bg-linear-to-r ${tone.accent} bg-clip-text text-3xl font-black leading-tight text-transparent md:text-4xl`}>
                    {section.title}
                  </h2>

                  <p className="mt-5 text-xl md:text-lg leading-8 text-[#5b2d12]">
                    {section.content}
                  </p>
                </div>

                {hasVisual && (
                  <div className={`relative mx-auto w-full max-w-sm ${ isAlternating ? "lg:order-1" : "" }`}>
                    <div className="relative rounded-t-[999px] rounded-b-4xl border-10 border-[#f8e2b8] bg-linear-to-b from-[#fff5dd] to-[#f4d29a] p-4 shadow-[0_30px_60px_rgba(122,46,31,0.16)]">
                      <div className="absolute left-1/2 top-0 h-6 w-20 -translate-x-1/2 rounded-b-full bg-[#9a3412]" />
                      <div className="flex items-center justify-center  rounded-t-[999px] rounded-b-3xl border border-[#d8a25a] bg-[#fffaf0] p-4">
                        <LazyImage src={section.src as string} alt={section.title} width={230}
                          height={230} className="mx-auto aspect-square rounded-t-[999px] rounded-b-[1.25rem] object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {section.items && section.items.length > 0 && (
                <div className="px-5 pb-8 md:px-8 md:pb-10 lg:px-10">
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {section.items.map((topic, topicIndex) => (
                      <Link
                        key={`${section.id}-${topic.id || topicIndex}`}
                        href={topic.href}
                        title={topic.title}
                        className={`group/card relative overflow-hidden rounded-[1.75rem] border ${tone.cardBorder} bg-[#fffaf2]/95 p-5 shadow-[0_16px_38px_rgba(146,64,14,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(146,64,14,0.18)]`}
                      >
                        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#7c2d12] via-[#d97706] to-[#f59e0b]" />
                        <div className="flex h-full flex-col">
                          {topic.src && (
                            <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-[#edc98f] bg-linear-to-br from-[#fff6e2] to-[#f7deb0] p-3">
                              <LazyImage
                                src={topic.src}
                                alt={topic.title}
                                width={72}
                                height={72}
                                className="h-14 w-14 object-contain"
                              />
                            </div>
                          )}

                          <h3 className="text-xl md:text-lg font-extrabold text-[#7a2e1f]">
                            {topic.title}
                          </h3>
                          <p className="mt-3 flex-1 leading-7 text-[#6b3a17] text-xl md:text-lg">
                            {topic.description}
                          </p>

                          <div className="mt-5 inline-flex items-center gap-2 font-bold uppercase tracking-[0.18em] text-[#9a3412]">
                            Discover more
                            <span
                              aria-hidden="true"
                              className="transition-transform duration-300 group-hover/card:translate-x-1"
                            >
                              →
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {section.points && section.points.length > 0 && (
                <div className="px-5 pb-8 md:px-8 md:pb-10 lg:px-10">
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {section.points.map((point, index) => (
                      <div
                        key={`${section.id}-point-${index}`}
                        className="overflow-hidden rounded-3xl border border-[#e3b36f] bg-[#fffaf2] shadow-[0_16px_36px_rgba(122,46,31,0.09)]"
                      >
                        {pointImages[index] && (
                          <div className="border-b border-[#efd6ab] bg-linear-to-r from-[#fff4df] to-[#f8e1b9] p-4">
                            <LazyImage
                              src={pointImages[index]}
                              alt={point}
                              width={180}
                              height={180}
                              className="h-36 w-full rounded-2xl object-cover"
                            />
                          </div>
                        )}

                        <div className="p-5">
                          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#9a3412] font-bold text-[#fff4de]">
                            {String(index + 1).padStart(2, "0")}
                          </div>
                          <p className="font-semibold leading-7 text-[#5b2d12] text-xl md:text-lg">
                            {point}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}