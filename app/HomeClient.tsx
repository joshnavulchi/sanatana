"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getLocaleNamespaceObject } from "@/lib/i18n";
import { useLocale } from "@app/context/locale-context";
import useLocaleSection from "@app/hooks/useLocaleSection";
import LazyImage from "@components/lazyimage";
import WorldMapAnimated from "@components/worldmap/worldmapanimate";
import { parseList } from "@lib/parse";

/* ============ WELCOME PAGE COMPONENT ============ */
const STORAGE_KEY = "sanatana_welcome_dismissed";

function WelcomePage() {
  const [isVisible, setIsVisible] = useState(true);
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed === "true") {
      queueMicrotask(() => {
        setIsVisible(false);
        setDoNotShowAgain(true);
      });
    }
  }, []);

  const handleClose = () => {
    if (doNotShowAgain) {
      localStorage.setItem(STORAGE_KEY, "true");
    }
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-3">
      <div
        className={`
          max-w-4xl mx-auto
          transition-all duration-1000 ease-out
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
      >
        <div className="h-1 w-full mb-6 rounded-full" />

        <div className="relative">
          <button
            onClick={handleClose}
            aria-label="Close welcome message"
            className="cursor-pointer absolute -top-4 -right-4 z-30 w-10 h-10 bg-white/70 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-200"
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-6 h-6 text-amber-700 group-hover:text-amber-900 transition-colors drop-shadow"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute -top-4 -left-4 w-16 h-16 border-amber-200/40 rounded-tl-2xl" />
          <div className="absolute -top-4 -right-4 w-16 h-16 border-amber-200/40 rounded-tr-2xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 border-amber-200/40 rounded-bl-2xl" />
          <div className="absolute -bottom-4 -right-4 w-16 h-16 border-amber-200/40 rounded-br-2xl" />

          <div className="bg-white/75 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="1" fill="currentColor" className="text-amber-800" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10 text-center space-y-4">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-px w-12" />
                <span className="text-3xl text-amber-800 animate-pulse">ॐ</span>
                <div className="h-px w-12" />
              </div>

              <h2 className="text-3xl md:text-3xl font-extrabold tracking-tight leading-tight text-amber-800">
                Namaste & Welcome
              </h2>

              <p className="text-md sm:text-base sm:text-md sm:text-base italic text-amber-700 tracking-wide">
                स्वागतम् । आपका स्वागत है
              </p>

              <div className="flex items-center justify-center gap-2 py-4">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce anim-delay-0" />
                <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce anim-delay-150" />
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce anim-delay-300" />
              </div>

              <div className="space-y-4 max-w-2xl mx-auto">
                <p className="text-md sm:text-base leading-relaxed text-gray-700">
                  We are deeply honored and blessed by your presence here.
                </p>
                <p className="text-md sm:text-base leading-relaxed text-gray-700">
                  Thank you for taking this sacred step towards understanding and embracing the
                  <span className="font-semibold text-amber-700"> eternal truths of Sanātana Dharma</span>
                  — the timeless wisdom that illuminates the path to inner peace, righteousness, and spiritual awakening.
                </p>
                <p className="text-md sm:text-base leading-relaxed text-gray-700">
                  May your journey through these ancient teachings bring you
                  <span className="font-semibold text-amber-600"> clarity, devotion, and divine grace</span>.
                </p>
              </div>

              <div className="pt-6 space-y-2">
                <p className="text-md sm:text-base text-amber-700 font-medium tracking-wide">
                  सत्यमेव जयते । धर्मो रक्षति रक्षितः
                </p>
                <p className="text-md sm:text-base text-gray-600 italic">
                  Truth Alone Triumphs · Dharma Protects Those Who Protect It
                </p>
              </div>

              <div className="pt-6 flex justify-center">
                <svg className="w-16 h-16 text-amber-500/40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C12 2 9 5 9 9C9 11.21 10.79 13 13 13C13 13 13 15 13 17C13 19.21 11.21 21 9 21C9 21 9 19 9 17C9 14.79 7.21 13 5 13C5 13 5 11 5 9C5 6.79 6.79 5 9 5C9 5 11 5 11 5C11 5 11 3 11 2H12M12 2C12 2 15 5 15 9C15 11.21 13.21 13 11 13C11 13 11 15 11 17C11 19.21 12.79 21 15 21C15 21 15 19 15 17C15 14.79 16.79 13 19 13C19 13 19 11 19 9C19 6.79 17.21 5 15 5C15 5 13 5 13 5C13 5 13 3 13 2H12Z" />
                </svg>
              </div>

              <div className="pt-6 border-amber-200/30 mt-6 flex flex-col items-center gap-4">
                <label className="flex items-center justify-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={doNotShowAgain}
                    onChange={(e) => setDoNotShowAgain(e.target.checked)}
                    className="w-5 h-5 rounded text-amber-700 focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 cursor-pointer transition-all"
                  />
                  <span className="text-md sm:text-base text-gray-700 group-hover:text-amber-700 transition-colors">
                    Do not show this welcome message again
                  </span>
                </label>
                <button
                  onClick={handleClose}
                  className="cursor-pointer px-6 py-2 rounded-full bg-amber-600 text-white font-semibold shadow-md transition-all duration-300 relative overflow-hidden group focus:outline-none focus:ring-4 focus:ring-amber-200/50 active:scale-95 mt-2"
                >
                  <span className="relative z-10 tracking-widest text-md sm:text-base select-none">Close</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-1 w-full mt-8 rounded-full" />
      </div>
    </div>
  );
}

/* ============ HERO SECTION COMPONENT ============ */
interface HeroSectionProps {
  isLoading?: boolean;
}

function HeroSection({ isLoading = false }: HeroSectionProps) {
  const { locale } = useLocale();
  const [hero, setHero] = useState<Record<string, any>>({});
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const videoRefMobile = useRef<HTMLVideoElement | null>(null);
  const videoRefDesktop = useRef<HTMLVideoElement | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const isMobile = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 767px)").matches;

  useEffect(() => {
    let cancelled = false;
    getLocaleNamespaceObject(locale, "home")
      .then((ns: any) => {
        setIsVisible(true);
        if (cancelled) return;
        const candidate = ns?.hero ? ns.hero : ns?.home ? ns.home.hero : ns;
        if (candidate && typeof candidate === "object") setHero(candidate);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    if (!shouldLoadVideo) return;

    const playVideo = (video: HTMLVideoElement | null) => {
      if (!video) return Promise.resolve();
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("autoplay", "");
      return video.play();
    };

    const target = videoRefDesktop.current;
    if (!target) return;

    playVideo(target)
      .then(() => {
        setShowPlayOverlay(false);
        setIsVideoReady(true);
      })
      .catch(() => {
        setShowPlayOverlay(false);
        setIsVideoReady(false);
      });
  }, [shouldLoadVideo]);

  useEffect(() => {
    if (isMobile) return;
    const node = heroRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShouldLoadVideo(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoadVideo(true);
            observer.disconnect();
            break;
          }
        }
      },
      {
        rootMargin: "200px 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <div className="relative w-full min-h-[600px] px-3 overflow-hidden">
      <div className="absolute inset-0" ref={heroRef}>
        <Image
          className="block md:hidden object-cover bg-top"
          src="/images/home/mobile-hero.png"
          alt="Sanātana Dharma hero background"
          fill
          sizes="100vw"
          priority
          quality={90}
          unoptimized
        />
        <div className="hidden md:block absolute inset-0">
          <video
            ref={videoRefDesktop}
            preload={shouldLoadVideo ? "metadata" : "none"}
            playsInline
            muted
            loop
            autoPlay={shouldLoadVideo}
            poster={hero?.desktopImage ?? "/images/home/hero.png"}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isVideoReady ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            {shouldLoadVideo ? (
              <>
                <source src="/videos/kurushetra.webm" type="video/webm" />
                <source src="/videos/kurushetra.mp4" type="video/mp4" />
                <track
                  kind="captions"
                  src="/videos/kurushetra-captions.vtt"
                  srcLang="en"
                  label="English captions"
                  default
                />
              </>
            ) : null}
          </video>
          <Image
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isVideoReady ? "opacity-0" : "opacity-100"}`}
            src={hero?.desktopImage ?? "/images/home/hero.png"}
            alt="Sanātana Dharma hero background"
            fill
            sizes="100vw"
            priority
            quality={90}
            unoptimized
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
      </div>

      <div className="absolute top-20 right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-pulse anim-delay-1000" />

      <div className="relative z-8 md:mx-auto md:max-w-6xl flex items-center">
        <div className="w-full flex flex-col md:flex-row items-center py-32 gap-12">
          <div
            className={`hidden md:flex items-center justify-center transition-all duration-1000 ease-out delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-600/20 blur-3xl rounded-full" />

              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <div className="text-center space-y-4">
                  <div className="text-6xl text-amber-300/80 animate-pulse">ॐ</div>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                  <p className="text-white/90 text-md sm:text-base italic">सत्यमेव जयते</p>
                  <p className="text-amber-200 text-md sm:text-base">Truth Alone Triumphs</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`w-full transition-all text-center duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>
            <div className="flex flex-col items-center md:mx-auto md:max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
                <span className="text-3xl text-amber-400 animate-pulse">ॐ</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse anim-delay-150" />
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse anim-delay-300" />
              </div>
            </div>

            <div className="flex flex-col md:mx-auto md:max-w-3xl">
              <h1 className="text-4xl font-semibold text-white leading-tight drop-shadow-2xl [text-shadow:_2px_2px_8px_rgb(0_0_0_/_80%)] mt-4">
                {hero?.heading || "Sanātana Dharma"}
              </h1>
              <h2 className="text-2xl/8 md:text-3xl/12 font-semibold text-amber-300 leading-snug drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_60%)]">
                {hero?.subheading || "Eternal Wisdom"}
              </h2>

              <p className="text-md sm:text-base text-gray-100 drop-shadow-lg [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%)] mt-4">
                {hero?.description || "Discover the timeless teachings and sacred wisdom of ancient India"}
              </p>
              <div className="w-full text-center flex flex-col md:flex-row md:justify-center gap-4 mt-4">
                <Link
                  href={hero?.primarycta?.link ? `/${hero.primarycta.link}` : "/itihasa"}
                  className="group relative md:inline-flex px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-md sm:text-base rounded-full shadow-xl font-light hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 no-underline overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                  <span className="relative flex items-center justify-center gap-2">
                    {hero?.primarycta?.label || "Explore Itihasa"}
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>

                <Link
                  href={hero?.secondarycta?.link ? `/${hero.secondarycta.link}` : "/sanatanadharma"}
                  className="group md:inline-flex px-6 py-3 bg-white/10 backdrop-blur-md hover:bg-white/20 border-2 border-white/50 hover:border-white text-white text-md sm:text-base font-light rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 no-underline"
                >
                  <span className="flex items-center justify-center gap-2">
                    {hero?.secondarycta?.label || "Learn Sanatana Dharma"}
                    <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </span>
                </Link>
              </div>

              <div className="flex justify-center gap-2 mt-6">
                <LazyImage src="/images/svg/arrow.svg" alt="Scroll Down" width={16} height={16} className="inline-block text-amber-200 animate-bounce" />
                <span className="text-md sm:text-base drop-shadow-md text-amber-200">{hero?.scroll || "Scroll to explore"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
    </div>
  );
}

/* ============ UNDERSTANDING SANATANA DHARMA COMPONENT ============ */
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

function UnderstandingOfSanatana() {
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                  {section.items?.map((topic, topicIndex) => (
                    <article
                      key={`${section.id}-${topic.id || topicIndex}`}
                      className="flex flex-col gap-3 p-5 rounded-2xl bg-slate-100 transition-transform hover:-translate-y-0.5"
                    >
                      <div className="flex items-start gap-3">
                        {topic.src && <LazyImage src={topic.src} alt={topic.title} width={64} height={64} className="rounded-xl bg-white" />}
                        <div>
                          <h5 className="text-md sm:text-base font-semibold text-slate-800">{topic.title}</h5>
                          <p className="text-sm text-slate-600 my-2 leading-relaxed">{topic.description}</p>                          
                        </div>
                      </div>
                      
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

/* ============ GIT SUPPORT COMPONENT ============ */
function GitSupport() {
  const loc = useLocaleSection("home");
  const isVisible = true;

  return (
    <section className="gradient-background map-wrapper md:min-h-screen relative z-0 py-30 md:py-0 overflow-hidden">
      <WorldMapAnimated
        stroke="#ffffff"
        fill="#000000"
        fillOpacity={0.25}
        borderWidth={0.7}
        loopSpeed={6}
        stagger={16}
        fillPulse={true}
        pauseOnHover={true}
        scale={0.19}
        showGraticule={false}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/50 pointer-events-none" />

      <div className="hidden! absolute top-1/4 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="hidden! absolute bottom-1/3 left-1/3 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse anim-delay-1500" />

      <div
        className={`relative z-1 md:content-wrapper md:absolute md:top-1/2 md:left-20 md:-translate-y-1/2 p-3 sm:py-16 md:px-0 md:py-0 transition-all duration-1000 ease-out
          ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
      >
        <div className="relative bg-black/30 backdrop-blur-xl border border-white/20 rounded-xl p-4 md:p-8 shadow-xl max-w-2xl overflow-hidden group text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
            <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
              <span className="text-2xl text-amber-400">⚡</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
            </div>

            <h4 className="text-xl md:text-2xl leading-tight drop-shadow-2xl">{loc?.cta?.title || "Contribute"}</h4>

            <p className="text-md sm:text-base leading-relaxed drop-shadow-lg my-4">{loc?.cta?.subtitle || ""}</p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="https://github.com/vulchivijay/sanatana"
                target="_blank"
                className="group/btn relative px-4 md:px-8 py-3 bg-white/90 hover:bg-white text-md sm:text-base rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 no-underline overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-500" />
                <span className="relative flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="#000000" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span className="text-black">{loc?.cta?.contribute || "Contribute"}</span>
                  <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="#000" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              <Link
                href="https://github.com/vulchivijay/sanatana"
                target="_blank"
                className="group/btn px-4 md:px-8 py-3 bg-transparent border-2 border-white/50 hover:border-white text-white text-md sm:text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 no-underline backdrop-blur-sm"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {loc?.cta?.guidelines || "Guidelines"}
                  <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-400/20 to-transparent rounded-tl-full" />
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-transparent rounded-br-full" />
        </div>

        <div className="absolute -z-1 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="absolute top-2 inset-2 md:top-0 md:-inset-2 w-4 h-4 bg-amber-400 rounded-full animate-ping" />
          <div className="absolute bottom-0 right-0 md:-bottom-2 md:-right-2 w-6 h-6 bg-orange-400 rounded-full animate-pulse" />
          <div className="absolute -bottom-1 -right-1 md:-bottom-3 md:-right-3 w-8 h-8 bg-orange-400 rounded-full animate-ping" />
          <div className="absolute -top-3 right-1/2 translate-x-1/2 md:-top-6 md:right-24 w-6 h-6 bg-amber-500 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

/* ============ OUR FOUR CORE YUGAS COMPONENT ============ */
const YUGA_TONES = [
  {
    ring: "border-[#d8a25a]",
    badge: "bg-[#7a2e1f] text-[#fff4df]",
    accent: "from-[#a63d17] via-[#d97706] to-[#f59e0b]",
    glow: "shadow-[0_20px_50px_rgba(166,61,23,0.16)]",
    pillBg: "bg-[#fff4df]",
    numBg: "bg-[#7a2e1f]",
  },
  {
    ring: "border-[#c98a41]",
    badge: "bg-[#92400e] text-[#fff7e6]",
    accent: "from-[#92400e] via-[#c2410c] to-[#ea580c]",
    glow: "shadow-[0_22px_48px_rgba(146,64,14,0.15)]",
    pillBg: "bg-[#fffaf0]",
    numBg: "bg-[#92400e]",
  },
  {
    ring: "border-[#cf8f4f]",
    badge: "bg-[#9a3412] text-[#fff3e0]",
    accent: "from-[#7c2d12] via-[#c2410c] to-[#fb923c]",
    glow: "shadow-[0_20px_44px_rgba(124,45,18,0.16)]",
    pillBg: "bg-[#fff8f1]",
    numBg: "bg-[#9a3412]",
  },
  {
    ring: "border-[#d9a15d]",
    badge: "bg-[#7c2d12] text-[#fff4df]",
    accent: "from-[#7a2e1f] via-[#b45309] to-[#d97706]",
    glow: "shadow-[0_22px_50px_rgba(122,46,31,0.16)]",
    pillBg: "bg-[#fffaf2]",
    numBg: "bg-[#7c2d12]",
  },
];

const ROMAN = ["I", "II", "III", "IV"];

interface YugaCardProps {
  name: string;
  subtitle: string;
  years: string;
  description?: string[];
  index: number;
  isVisible: boolean;
  gradientfrom: string;
  gradientto: string;
}

function YugaCard({ gradientfrom, gradientto, name, subtitle, years, description, index, isVisible }: YugaCardProps) {
  const tone = YUGA_TONES[index % YUGA_TONES.length];

  return (
    <div
      className={`group relative overflow-hidden ${tone.ring} ${tone.glow} bg-gradient-to-br from-white/80 via-${gradientfrom} to-${gradientto} backdrop-blur-xl shadow-xl transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-2xl ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
      style={{ transitionDelay: `${index * 160}ms` }}
    >
      <div className={`hidden h-[3px] w-full rounded-t-3xl bg-gradient-to-r ${tone.accent} shadow-md`} />

      <div className="hidden absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-yellow-200/40 to-pink-200/30 blur-2xl" />
      <div className="hidden absolute -left-4 bottom-4 h-14 w-14 rounded-full bg-gradient-to-br from-orange-200/30 to-pink-100/20 blur-2xl" />

      <div className="relative p-6 sm:p-8">
        <div className="mb-5 flex items-center gap-4">
          <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 via-pink-400 to-indigo-400 shadow-lg text-lg font-black text-white tracking-widest border-4 border-white`}>
            {ROMAN[index] || index + 1}
          </span>
          <div className="h-1 w-16 bg-linear-to-r from-indigo-300/40 to-transparent" />
        </div>

        <h6 className="text-2xl/8 md:text-3xl/12 font-extrabold leading-tight text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-pink-500 to-indigo-700 drop-shadow-xl">
          {name}
        </h6>

        <p className="mt-2 text-md sm:text-base font-semibold uppercase tracking-widest text-indigo-700">{subtitle}</p>

        {description && description.length > 0 && (
          <ul className="mt-6 flex flex-col gap-3">
            {description.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-md sm:text-base leading-relaxed text-gray-700">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-br from-amber-400 to-pink-400" />
                {point}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-6">
          <span className={`inline-flex items-center gap-2 rounded-md border-2 border-indigo-200 bg-gradient-to-r from-amber-50 via-pink-50 to-indigo-50 px-3 py-2 text-sm tracking-widest text-indigo-700 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-105`}>
            <svg className="h-4 w-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {years}
          </span>
        </div>
      </div>
    </div>
  );
}

function OurFourCoreYugas() {
  const locale = useLocaleSection("home");
  const title = parseList((locale?.ourfourcoreyugastitle as any) || "");
  const subtitle = parseList((locale?.ourfourcoreyugassubtitle as any) || "");
  const yugas = Array.isArray(locale?.ourfourcoreyugas) ? locale!.ourfourcoreyugas : parseList((locale?.ourfourcoreyugas as any) || "");
  const earthAgeComparisonNote = parseList((locale?.earth_age_comparison_note as any) || "");
  const scalingComment = parseList((locale?.scaling_comment as any) || "");
  const [isVisible] = useState(true);

  return (
    <section className="relative bg-white/50 backdrop-blur-sm py-6 md:py-20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-25 top-5 h-72 w-72 rounded-full bg-[#f3b86b]/10 blur-2xl animate-ping" />
        <div className="absolute -right-25 bottom-5 h-80 w-80 rounded-full bg-[#d97706]/10 blur-2xl animate-ping" />
        <div className="absolute left-1/2 top-0 h-32 w-[60%] -translate-x-1/2 rounded-b-full bg-[#f4c98b]/10 blur-2xl animate-ping" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
        <div className={`mx-auto mb-8 max-w-4xl text-center transition-all duration-1000 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-[#d8a25a]" />
            <span className="text-2xl text-[#9a3412] animate-bounce" aria-hidden="true">
              🕉️
            </span>
            <div className="h-px w-16 bg-linear-to-l from-transparent to-[#d8a25a]" />
          </div>

          <h6 className="text-3xl/12 md:text-4xl/16 font-extrabold text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-rose-600 to-indigo-700 drop-shadow-xl">
            {title}
          </h6>

          <p className="mt-4 text-md sm:text-base leading-relaxed text-gray-700">
            {subtitle}{" "}
            <Link
              href="/cosmictime"
              className="group inline-flex items-center gap-1 text-[#9a3412] underline decoration-[#d97706]/40 underline-offset-4 transition-all duration-300 hover:text-[#7a2e1f] hover:decoration-[#d97706]"
              aria-label="Learn more about Cosmic Time"
            >
              Learn more about Cosmic Time
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d97706]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#9a3412]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#d97706]" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {yugas.map((y: any, idx: number) => (
            <YugaCard
              key={y.name}
              gradientfrom={y.gradientfrom}
              gradientto={y.gradientto}
              name={y.name}
              subtitle={y.subtitle}
              years={y.years}
              description={y.description}
              index={idx}
              isVisible={isVisible}
            />
          ))}
        </div>

        <div className={`mt-10 transition-all duration-1000 ease-out delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-[#b45309]/50" />
            <span className="text-md sm:text-base font-black uppercase tracking-[0.35em] text-[#92400e]">
              ✦ Cycle of Time ✦
            </span>
            <div className="h-px w-16 bg-linear-to-l from-transparent to-[#b45309]/50" />
          </div>

          {earthAgeComparisonNote && (
            <div className="mx-auto max-w-5xl bg-black/5 rounded-md border border-[#d8a25a]/15 p-4 text-center shadow-[0_2px_5px_rgba(166,61,23,0.10)]">
              <p className="bg-linear-to-r from-[#7a2e1f] via-[#9a3412] to-[#7a2e1f] bg-clip-text text-md sm:text-base leading-relaxed">
                {earthAgeComparisonNote}
              </p>
            </div>
          )}

          {scalingComment && (
            <p className="mx-auto mt-5 max-w-4xl text-center text-md sm:text-base leading-relaxed text-[#5b2d12]">
              {scalingComment}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ============ MAIN HOME CLIENT COMPONENT ============ */
export function HomeClient() {
  return (
    <>
      <WelcomePage />
      <HeroSection />
      <UnderstandingOfSanatana />
      <GitSupport />
      <OurFourCoreYugas />
    </>
  );
}
