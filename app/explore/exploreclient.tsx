"use client";

import Link from "next/link";
import { useLocale } from "@app/context/locale-context";

const subPages = [
  { slug: "cosmictime", key: "explore.cosmic_time" },
  { slug: "diseases-curing-temples", key: "explore.diseases_curing_temples" },
  { slug: "drip-irrigation-process", key: "explore.drip_irrigation_process" },
  { slug: "festivals", key: "explore.festivals" },
  { slug: "historical-timeline", key: "explore.historical_timeline" },
  { slug: "illustratedstories", key: "explore.illustrated_stories" },
  { slug: "indian-constitution", key: "explore.indian_constitution" },
  { slug: "jyotirlings", key: "explore.jyotirlings" },
  { slug: "mythologicalquizzes", key: "explore.mythological_quizzes" },
  { slug: "religion-conversion", key: "explore.religion_conversion" },
  { slug: "rivers-connecting", key: "explore.rivers_connecting" },
  { slug: "sanskrit-concepts", key: "explore.sanskrit_concepts" },
  { slug: "shakti-peethas", key: "explore.shakti_peethas" },
  { slug: "temples-destroyed", key: "explore.temples_destroyed" },
  { slug: "temples-in-india", key: "explore.temples_in_india" },
  { slug: "usa-strategies", key: "explore.usa_strategies" },
  { slug: "world-transformation", key: "explore.world_transformation" },
];

export default function ExploreClient() {
  const { t } = useLocale();
  return (
    <div className="max-w-2xl mx-auto py-4 px-4">
      <h1 className="text-3xl font-bold mb-4">{t("explore.title")}</h1>
      <ul className="space-y-3">
        {subPages.map((page) => (
          <li key={page.slug}>
            <Link
              href={`/explore/${page.slug}`}
              className="text-blue-600 underline hover:text-blue-800"
            >
              {t(page.key)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
