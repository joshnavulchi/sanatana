"use client";

import { useEffect, useState } from "react";
import { DEFAULT_LOCALE, loadLocaleData } from "@lib/i18n";
import { useLocale } from "@app/context/locale-context";
import PageLayout from "@components/common/PageLayout";

type VedasData = Record<string, any> | null;

export default function VedasClient({
  initialData,
  initialVedas,
}: { initialData?: VedasData; initialVedas?: Record<string, unknown>[] } = {}) {
  const { isLoading, locale: ctxLocale } = useLocale();
  const [data, setData] = useState<VedasData>(initialData ?? null);
  const [loading, setLoading] = useState<boolean>(
    !initialData && !initialVedas,
  );
  const [error, setError] = useState<string | null>(null);

  const locale = (ctxLocale || DEFAULT_LOCALE) as string;

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setLoading(false);
      return;
    }

    if (initialVedas && initialVedas.length > 0) {
      // map initial list into the same shape as locale data
      setData({ scripture_text: initialVedas });
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const parsedRoot = (await loadLocaleData(
          locale,
          "vedas/index",
        )) as Record<string, any>;
        let parsed =
          parsedRoot && Object.keys(parsedRoot).length > 0
            ? parsedRoot
            : ({} as Record<string, any>);
        if (!parsed || Object.keys(parsed).length === 0) {
          if (!cancelled) setError("Vedas content not found");
          return;
        }

        // If namespace returned { vedas: { ... } } unwrap
        if (parsed.vedas && typeof parsed.vedas === "object")
          parsed = parsed.vedas;

        if (!cancelled) setData(parsed || null);
      } catch (e) {
        if (!cancelled) setError("Vedas content not found");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [initialVedas, locale]);

  const title = String(data?.meta?.title ?? data?.title ?? "Vedas");
  const description = String(
    data?.meta?.description ?? data?.description ?? "",
  );

  function formatLabel(input: string) {
    return input
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  if (loading || (isLoading && !data)) {
    return (
      <PageLayout
        metaKey="vedas/index"
        title=""
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Vedas" }]}
        className="layout-md"
      >
        <div className="py-12 text-center">Loading…</div>
      </PageLayout>
    );
  }

  if (error || !data) {
    return (
      <PageLayout
        metaKey="vedas/index"
        title={title}
        description={description}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: title }]}
        className="layout-md"
      >
        <div className="py-12 text-center text-gray-600">
          {error || "Content not available."}
        </div>
      </PageLayout>
    );
  }

  function renderValue(value: any, key?: string | number) {
    if (value === null || value === undefined) return null;
    if (typeof value === "string" || typeof value === "number") {
      return (
        <p
          key={key}
          className="text-md sm:text-base text-stone-700 leading-relaxed"
        >
          {String(value)}
        </p>
      );
    }
    if (Array.isArray(value)) {
      const isPrimitiveList = value.every(
        (item) => typeof item === "string" || typeof item === "number",
      );
      if (isPrimitiveList) {
        return (
          <ul
            key={key}
            className="list-disc ml-5 space-y-1.5 text-md sm:text-base text-stone-700 marker:text-amber-700"
          >
            {value.map((item, index) => (
              <li key={index}>{String(item)}</li>
            ))}
          </ul>
        );
      }
      return (
        <ul
          key={key}
          className="list-disc ml-5 space-y-2 text-md sm:text-base marker:text-amber-700"
        >
          {value.map((item, index) => (
            <li key={index}>{renderValue(item, index)}</li>
          ))}
        </ul>
      );
    }
    if (typeof value === "object") {
      const entries = Object.entries(value);
      if (entries.length === 0) return null;
      return (
        <div
          key={key}
          className="space-y-3 text-md sm:text-base rounded-2xl bg-amber-50/60 p-3"
        >
          {entries.map(([childKey, childValue]) => (
            <div key={childKey}>
              <strong className="block text-stone-900">
                {formatLabel(childKey)}:
              </strong>
              {renderValue(childValue, childKey)}
            </div>
          ))}
        </div>
      );
    }
    return null;
  }

  return (
    <PageLayout
      metaKey="vedas/index"
      title={title}
      description={description}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: title }]}
      className="layout-md"
    >
      <div className="space-y-8 rounded-4xl bg-linear-to-b from-orange-50 via-amber-50 to-rose-50 px-4 py-6 sm:px-6 sm:py-8">
        {data.definition && (
          <p className="text-md sm:text-base leading-relaxed text-stone-800 bg-white/70 rounded-2xl p-4 border border-amber-200">
            {data.definition}
          </p>
        )}
        {data.introduction && (
          <div className="max-w-none rounded-2xl bg-white/80 p-5 border border-orange-200">
            <p className="text-md sm:text-base leading-relaxed text-stone-700">
              {data.introduction}
            </p>
          </div>
        )}

        {Array.isArray(data.scripture_text) && (
          <section className="mt-8 rounded-3xl border border-amber-200 bg-white/75 p-5 sm:p-6">
            <h4 className="text-2xl font-semibold mb-4 text-stone-900">
              Four Vedas Overview
            </h4>
            <div className="space-y-5">
              {data.scripture_text.map((s: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-linear-to-br from-amber-100/70 via-white to-orange-100/70 border border-amber-200"
                >
                  <h5 className="font-semibold text-xl text-stone-900">
                    {s.veda}
                  </h5>
                  {s.description && (
                    <p className="text-md sm:text-base text-stone-700 mt-2 leading-relaxed">
                      {s.description}
                    </p>
                  )}
                  {s.primary_focus && (
                    <p className="text-md sm:text-base text-stone-700 mt-3">
                      <strong className="text-stone-900">Primary focus:</strong>{" "}
                      {s.primary_focus}
                    </p>
                  )}
                  {s.importance && (
                    <p className="text-md sm:text-base text-stone-700 mt-2">
                      <strong className="text-stone-900">Importance:</strong>{" "}
                      {s.importance}
                    </p>
                  )}
                  {s.major_deities && (
                    <div className="mt-3">
                      <h6 className="font-medium text-stone-900 mb-1">
                        Major deities
                      </h6>
                      {renderValue(s.major_deities)}
                    </div>
                  )}
                  {s.major_themes && (
                    <div className="mt-3">
                      <h6 className="font-medium text-stone-900 mb-1">
                        Major themes
                      </h6>
                      {renderValue(s.major_themes)}
                    </div>
                  )}
                  {s.applications && renderValue(s.applications)}
                  {s.topics && renderValue(s.topics)}
                  {s.structure && renderValue(s.structure)}
                  {s.divisions && renderValue(s.divisions)}
                  {s.primary_topics && renderValue(s.primary_topics)}
                  {s.hymn_count && (
                    <p className="text-md sm:text-base text-stone-700 mt-2">
                      <strong className="text-stone-900">Hymn count:</strong>{" "}
                      {String(s.hymn_count)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.meaning_of_word_veda && (
          <section className="mt-6 rounded-2xl bg-white/75 border border-amber-200 p-5">
            <h4 className="text-xl font-semibold mb-2 text-stone-900">
              Meaning of the word Veda
            </h4>
            <p className="text-md sm:text-base text-stone-700 leading-relaxed">
              {data.meaning_of_word_veda}
            </p>
          </section>
        )}

        {data.philosophical_explanation && (
          <section className="mt-6 rounded-2xl bg-white/75 border border-orange-200 p-5">
            <h4 className="text-xl font-semibold mb-2 text-stone-900">
              Philosophical explanation
            </h4>
            <div className="max-w-none">
              <p className="text-md sm:text-base text-stone-700 leading-relaxed">
                {data.philosophical_explanation}
              </p>
            </div>
          </section>
        )}

        {data.structure_text && (
          <section className="mt-6">
            <h4 className="text-xl font-semibold mb-2">Structure text</h4>
            {renderValue(data.structure_text, "structure_text")}
          </section>
        )}

        {data.estimated_composition_period && (
          <section className="mt-6 rounded-2xl border border-amber-200 bg-white/80 p-5">
            <h4 className="text-xl font-semibold mb-2 text-stone-900">
              Estimated composition period
            </h4>
            <dl className="grid grid-cols-1 gap-2">
              {Object.entries(data.estimated_composition_period).map(
                ([k, v]) => (
                  <div key={k} className="text-md sm:text-base text-stone-700">
                    <strong className="mr-2 text-stone-900">
                      {formatLabel(k)}:
                    </strong>{" "}
                    {String(v)}
                  </div>
                ),
              )}
            </dl>
          </section>
        )}

        {data.vedic_society && (
          <section className="mt-6 rounded-2xl border border-orange-200 bg-white/80 p-5">
            <h4 className="text-xl font-semibold mb-3 text-stone-900">
              Vedic society
            </h4>
            {data.vedic_society.social_structure && (
              <div>
                <h5 className="font-medium text-stone-900">Social structure</h5>
                <ul className="list-disc ml-5 text-md sm:text-base text-stone-700 marker:text-amber-700">
                  {Array.isArray(data.vedic_society.social_structure) &&
                    data.vedic_society.social_structure.map(
                      (s: any, i: number) => <li key={i}>{s}</li>,
                    )}
                </ul>
              </div>
            )}
          </section>
        )}

        {data.influence_of_vedas && (
          <section className="mt-6 rounded-2xl border border-amber-200 bg-white/80 p-5">
            <h4 className="text-xl font-semibold mb-3 text-stone-900">
              Influence of the Vedas
            </h4>
            {Object.entries(data.influence_of_vedas).map(([k, arr]) =>
              Array.isArray(arr) ? (
                <div key={k} className="mb-3">
                  <h5 className="font-medium text-stone-900">
                    {formatLabel(k)}
                  </h5>
                  <ul className="list-disc ml-5 text-md sm:text-base text-stone-700 marker:text-amber-700">
                    {(arr as any[]).map((it: any, idx: number) => (
                      <li key={idx}>{String(it)}</li>
                    ))}
                  </ul>
                </div>
              ) : null,
            )}
          </section>
        )}

        {data.vedic_timeline && (
          <section className="mt-6 rounded-2xl border border-orange-200 bg-white/80 p-5">
            <h4 className="text-xl font-semibold mb-2 text-stone-900">
              Vedic timeline
            </h4>
            <ul className="list-disc ml-5 text-md sm:text-base text-stone-700 marker:text-amber-700">
              {Object.entries(data.vedic_timeline).map(([k, v]) => (
                <li key={k}>
                  <strong className="mr-2 text-stone-900">
                    {formatLabel(k)}:
                  </strong>
                  {String(v)}
                </li>
              ))}
            </ul>
          </section>
        )}

        {data.vedic_philosophical_concepts && (
          <section className="mt-6 rounded-2xl border border-amber-200 bg-white/80 p-5">
            <h4 className="text-xl font-semibold mb-2 text-stone-900">
              Vedic philosophical concepts
            </h4>
            <dl className="grid grid-cols-1 gap-2 text-md sm:text-base text-stone-700">
              {Object.entries(data.vedic_philosophical_concepts).map(
                ([k, v]) => (
                  <div key={k}>
                    <strong className="mr-2 text-stone-900">
                      {formatLabel(k)}:
                    </strong>
                    {String(v)}
                  </div>
                ),
              )}
            </dl>
          </section>
        )}

        {Array.isArray(data.related_concepts) && (
          <section className="mt-6 rounded-2xl border border-orange-200 bg-white/80 p-5">
            <h4 className="text-xl font-semibold mb-2 text-stone-900">
              Related concepts
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.related_concepts.map((r: any, i: number) => (
                <span
                  key={i}
                  className="text-md sm:text-base px-3 py-1.5 bg-amber-100 text-stone-800 rounded-full border border-amber-200"
                >
                  {r}
                </span>
              ))}
            </div>
          </section>
        )}

        {data.structure && (
          <section className="mt-6">
            <div className="rounded-4xl bg-linear-to-br from-orange-100 via-amber-50 to-rose-100 border border-amber-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-amber-200 bg-white/85">
                <h4 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 ">
                  Structure summary
                </h4>
                <p className="mt-2 text-md sm:text-base text-stone-600 max-w-2xl">
                  A concise breakdown of the Vedas content structure for fast
                  scanning and reference.
                </p>
              </div>
              <div className="overflow-x-auto bg-white">
                <table className="min-w-full border-separate border-spacing-0 text-left text-md sm:text-base">
                  <thead className="bg-linear-to-r from-amber-100 to-rose-100">
                    <tr>
                      <th className="px-5 py-4 font-semibold text-amber-900 uppercase tracking-[0.18em]">
                        Section
                      </th>
                      <th className="px-5 py-4 font-semibold text-amber-900 uppercase tracking-[0.18em]">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {Object.entries(data.structure).map(([k, v]) => (
                      <tr
                        key={k}
                        className="transition-colors duration-200 hover:bg-amber-50"
                      >
                        <td className="whitespace-nowrap px-5 py-5 font-semibold text-stone-900">
                          {formatLabel(k)}
                        </td>
                        <td className="px-5 py-5 text-stone-700 leading-relaxed">
                          {typeof v === "string" || typeof v === "number" ? (
                            String(v)
                          ) : Array.isArray(v) ? (
                            <div className="grid gap-2">
                              {v.map((item: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="rounded-2xl bg-amber-50/80 p-3 text-sm text-stone-700"
                                >
                                  {renderValue(item, `${k}-${idx}`)}
                                </div>
                              ))}
                            </div>
                          ) : (
                            renderValue(v, k)
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {(() => {
          const hiddenKeys = new Set([
            "title",
            "definition",
            "meta",
            "openGraph",
            "schema",
            "introduction",
            "scripture_text",
            "meaning_of_word_veda",
            "philosophical_explanation",
            "estimated_composition_period",
            "vedic_society",
            "influence_of_vedas",
            "vedic_timeline",
            "vedic_philosophical_concepts",
            "related_concepts",
            "structure",
          ]);
          const extraKeys = Object.keys(data).filter(
            (key) => !hiddenKeys.has(key),
          );
          if (extraKeys.length === 0) return null;
          return (
            <section className="mt-6 rounded-2xl border border-amber-200 bg-white/85 p-5">
              <h4 className="text-xl font-semibold mb-2 text-stone-900">
                Additional Vedas content
              </h4>
              <div className="space-y-6">
                {extraKeys.map((key) => (
                  <div key={key}>
                    <h5 className="font-medium capitalize text-stone-900">
                      {formatLabel(key)}
                    </h5>
                    {renderValue(data[key], key)}
                  </div>
                ))}
              </div>
            </section>
          );
        })()}
      </div>
    </PageLayout>
  );
}
