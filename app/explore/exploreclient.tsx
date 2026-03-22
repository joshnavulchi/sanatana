"use client";

import Link from "next/link";
import { useLocale } from "@app/context/locale-context";

const pages = [
  {
    slug: "temples-in-india",
    key: "explore.temples_in_india",
    descKey: "explore.temples_in_india_desc",
    emoji: "🏛️",
    gradient: "from-amber-50 via-amber-100 to-amber-50",
    accent: "text-amber-800",
  },
  {
    slug: "shakti-peethas",
    key: "explore.shakti_peethas",
    descKey: "explore.shakti_peethas_desc",
    emoji: "✨",
    gradient: "from-rose-50 via-pink-100 to-rose-50",
    accent: "text-rose-700",
  },
  {
    slug: "illustratedstories",
    key: "explore.illustrated_stories",
    descKey: "explore.illustrated_stories_desc",
    emoji: "📚",
    gradient: "from-lime-50 via-green-100 to-lime-50",
    accent: "text-green-800",
  },
  {
    slug: "world-transformation",
    key: "explore.world_transformation",
    descKey: "explore.world_transformation_desc",
    emoji: "🌍",
    gradient: "from-sky-50 via-blue-100 to-sky-50",
    accent: "text-sky-800",
  },
  {
    slug: "mythologicalquizzes",
    key: "explore.mythological_quizzes",
    descKey: "explore.mythological_quizzes_desc",
    emoji: "🧠",
    gradient: "from-violet-50 via-purple-100 to-violet-50",
    accent: "text-violet-800",
  },
];

export default function ExploreClient() {
  const { t } = useLocale();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-extrabold mb-4 text-amber-800">{t("explore.title")}</h1>
      <p className="text-lg text-stone-600 mb-6">{t("explore.subtitle") || "Discover topics, timelines and stories."}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {pages.map((p) => (
          <Link
            key={p.slug}
            href={`/explore/${p.slug}`}
            className="block rounded-2xl transform transition hover:-translate-y-1"
            aria-label={t(p.key)}
          >
            <div
              className={`relative overflow-hidden rounded-xl border border-amber-200 p-5 shadow-lg bg-gradient-to-br ${p.gradient}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-none text-3xl drop-shadow-sm">{p.emoji}</div>
                <div>
                  <h2 className={`text-xl font-semibold ${p.accent}`}>{t(p.key)}</h2>
                  <p className="mt-2 text-sm text-stone-700">{t(p.descKey) || t(p.key)}</p>
                </div>
              </div>
              <span className="absolute -right-6 -top-6 block h-36 w-36 rounded-full opacity-10 bg-white blur-3xl"></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}