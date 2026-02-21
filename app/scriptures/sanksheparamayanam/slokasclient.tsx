/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";
import { useState } from 'react';

type Sloka = {
  sloka?: string;
  sanskrit?: string;
  transliteration?: string;
  meaning?: string;
  context?: string;
  [k: string]: any;
};

export default function SlokasClient({ slokas }: { slokas: Sloka[] }) {
  const CHUNK = 18;
  const total = Array.isArray(slokas) ? slokas.length : 0;
  const maxVisible = Math.min(120, total);
  const [visible, setVisible] = useState(Math.min(CHUNK, maxVisible));
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const loadMore = () => setVisible((v) => Math.min(v + CHUNK, maxVisible));
  const toggleExpand = (i: number) =>
    setExpanded((e) => ({ ...e, [i]: !e[i] }));

  const copyText = async (text: string, i: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(i);
      setTimeout(() => setCopiedIdx(null), 1400);
    } catch {
      // silent
    }
  };

  if (!Array.isArray(slokas) || slokas.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-slate-600">
        No slokas available.
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto">
      <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Sankshepa Ramayanam — Slokas
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Showing {visible} of {total} — elegant, readable cards with quick actions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm px-3 py-2 bg-amber-50 rounded-full text-amber-700 shadow-sm">
            {total} slokas
          </span>
        </div>
      </header>

      <div className="grid gap-6 grid-cols-1">
        {slokas.slice(0, visible).map((s, idx) => {
          const key = s.sloka || s.sanskrit || idx;
          const isExpanded = !!expanded[idx];
          const meaning = s.simplemeaning || "";
          const context = s.storycontext || "";
          const previewMeaning = meaning.length > 220 ? meaning.slice(0, 220) + "…" : meaning;
          const previewContext = context.length > 220 ? context.slice(0, 220) + "…" : context;

          return (
            <article
              key={key}
              className="relative group overflow-hidden rounded-xl border border-amber-400 bg-gradient-to-br from-white/60 to-white/40 shadow-lg p-6 backdrop-blur-sm"
            >
              <div className="absolute -left-6 top-4 h-24 w-2 rounded-r-full bg-gradient-to-b from-amber-400 via-orange-500 to-rose-500 opacity-90 transform rotate-3" />
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {s.sanskrit ? (
                    <p className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-700">
                      {s.sanskrit}
                    </p>
                  ) : null}

                  {s.transliteration ? (
                    <p className="mt-2 text-md italic text-slate-700">
                      {s.transliteration}
                    </p>
                  ) : null}
                </div>

                <div className="ml-4 flex flex-col items-end gap-2">
                  <button
                    onClick={() =>
                      copyText(
                        `${s.sanskrit ?? ""}\n\n${s.transliteration ?? ""}\n\n${s.meaning ?? ""}`,
                        idx
                      )
                    }
                    aria-label="Copy sloka"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/70 border border-slate-200 shadow-sm hover:scale-105 transition-transform"
                    title="Copy"
                  >
                    {copiedIdx === idx ? (
                      <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h11v11H8z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 11h1a2 2 0 0 0 2-2V4a2 2 0 0 1 2-2h6" />
                      </svg>
                    )}
                  </button>
                  <span className="text-md text-slate-400">{idx + 1}</span>
                </div>
              </div>

              <div className="mt-4">
                {context ? (
                  <div className="text-sm text-slate-700 leading-relaxed">
                    <p className={`${isExpanded ? "" : "line-clamp-[8]"}`}>{isExpanded ? context : previewContext}</p>
                    {context.length > 220 ? (
                      <button
                        onClick={() => toggleExpand(idx)}
                        className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-amber-50 text-amber-700 border border-amber-100 shadow-sm hover:brightness-105 transition"
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? "Show less" : "Read more"}
                        <svg className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-sm text-slate-700">No context available.</p>
                )}
              </div>

              <div className="mt-4">
                {meaning ? (
                  <div className="text-md text-slate-700 leading-relaxed">
                    <p className={`${isExpanded ? "" : "line-clamp-[8]"}`}>{isExpanded ? meaning : previewMeaning}</p>
                    {meaning.length > 220 ? (
                      <button
                        onClick={() => toggleExpand(idx)}
                        className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-amber-50 text-amber-700 border border-amber-100 shadow-sm hover:brightness-105 transition"
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? "Show less" : "Read more"}
                        <svg className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-md text-slate-700">No meaning available.</p>
                )}
              </div>

              <div className="pointer-events-none absolute -bottom-10 -right-10 opacity-10 group-hover:opacity-25 transition-opacity">
                <svg width="160" height="160" viewBox="0 0 100 100" className="text-amber-200">
                  <defs>
                    <linearGradient id={`g-${idx}`} x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="rgba(250,204,21,0.6)" />
                      <stop offset="100%" stopColor="rgba(255,87,34,0.4)" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="40" fill={`url(#g-${idx})`} />
                </svg>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          onClick={loadMore}
          disabled={visible >= maxVisible}
          aria-disabled={visible >= maxVisible}
          className={`cursor-pointer px-6 py-3 rounded-full text-lg font-medium shadow-xl transition transform hover:-translate-y-0.5 ${visible >= maxVisible
            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
            : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
            }`}
        >
          {visible >= maxVisible ? "All loaded" : `Load ${Math.min(CHUNK, maxVisible - visible)} more`}
        </button>
      </div>
    </section>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */