"use client";
import { useState } from "react";
import type { AuditReport } from "./page";

interface Props {
  report: AuditReport | null;
}

const PAGE_SIZE = 100;

export default function PostDeployAuditClient({ report }: Props) {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("url");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  if (!report || !report.pages) {
    return (
      <>
        <main className="min-h-screen bg-linear-to-b from-[#fffaf3] via-[#fdf0d7] to-[#fff8ef] px-6 py-10">
          <section className="mx-auto max-w-5xl rounded-3xl border border-[#d8a25a] bg-[#fffaf0] p-8 shadow-[0_10px_40px_rgba(122,46,31,0.10)]">
            <h1 className="text-2xl font-bold text-[#7a2e1f]">Post-Deploy Audit</h1>
            <p className="mt-3 text-[#5b2d12]">
              Report file not found. Generate it by running:
              <span className="ml-2 font-semibold">node scripts/generate-post-deploy-audit.js</span>
            </p>
          </section>
        </main>
      </>
    );
  }

  const allPagesHealthy = report.pages.every((page) =>
    page.statusCode === 200 && !page.hasNoindex && (page.canonical?.length ?? 0) > 0
  );

  const sortedPages = [...report.pages].sort((a, b) => {
    let aVal, bVal;
    switch (sortBy) {
      case "url":
        aVal = a.url;
        bVal = b.url;
        break;
      case "statusCode":
        aVal = a.statusCode;
        bVal = b.statusCode;
        break;
      case "canonical":
        aVal = a.canonical ?? "";
        bVal = b.canonical ?? "";
        break;
      case "noindex":
        aVal = a.hasNoindex ? 1 : 0;
        bVal = b.hasNoindex ? 1 : 0;
        break;
      case "jsonLdScriptCount":
        aVal = a.jsonLdScriptCount ?? 0;
        bVal = b.jsonLdScriptCount ?? 0;
        break;
      case "schemaTypesFound":
        aVal = (a.schemaTypesFound ?? []).join(", ");
        bVal = (b.schemaTypesFound ?? []).join(", ");
        break;
      default:
        aVal = a.url;
        bVal = b.url;
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    }
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedPages.length / PAGE_SIZE);
  const pagedPages = sortedPages.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <main className="min-h-screen bg-linear-to-b from-[#fffaf3] via-[#fdf0d7] to-[#fff8ef] px-4 py-8 md:px-8">
        <section className="mx-auto max-w-6xl rounded-3xl border border-[#d8a25a] bg-[#fffaf0] p-4 shadow-[0_10px_40px_rgba(122,46,31,0.10)] md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="bg-linear-to-r from-[#a63d17] via-[#d97706] to-[#f59e0b] bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
              Post-Deploy Audit Report
            </h1>
            <span className={allPagesHealthy ? 'inline-flex rounded-xl border border-[#d8a25a] bg-[#fffaf0] px-3 py-1 text-xs font-semibold text-[#1a6e5c]' : 'inline-flex rounded-xl border border-[#b45309] bg-[#fff7ed] px-3 py-1 text-xs font-semibold text-[#a63d17]'}>
              {allPagesHealthy ? 'Core indexing signals look healthy' : 'Action needed'}
            </span>
          </div>

          <p className="mt-3 text-sm text-[#6b5d4f]">
            Audited at: {new Date(report.auditedAtUtc).toUTCString()} | Source: {report.source}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-[#d8a25a] bg-[#fffaf2] p-4">
              <h2 className="text-sm font-semibold text-[#7a2e1f]">Robots</h2>
              <p className="mt-2 text-sm text-[#5b2d12]">Exists: {report.robotsTxt.exists ? 'Yes' : 'No'}</p>
              <p className="text-sm text-[#5b2d12]">
                Sitemap directive: {report.robotsTxt.hasSitemapDirective ? 'Yes' : 'No'}
              </p>
            </article>
            <article className="rounded-2xl border border-[#d8a25a] bg-[#fffaf2] p-4">
              <h2 className="text-sm font-semibold text-[#7a2e1f]">Sitemap</h2>
              <p className="mt-2 text-sm text-[#5b2d12]">Exists: {report.sitemap.exists ? 'Yes' : 'No'}</p>
              <p className="text-sm text-[#5b2d12]">Approx URL count: {report.sitemap.urlCountApprox}</p>
            </article>
            <article className="rounded-2xl border border-[#d8a25a] bg-[#fffaf2] p-4">
              <h2 className="text-sm font-semibold text-[#7a2e1f]">Potential issues</h2>
              <p className="mt-2 text-sm text-[#5b2d12]">
                404 in sitemap: {report.sitemap.has404Html ? 'Yes' : 'No'}
              </p>
              <p className="text-sm text-[#5b2d12]">
                _not-found in sitemap: {report.sitemap.hasNotFoundRoute ? 'Yes' : 'No'}
              </p>
            </article>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-[#7a2e1f]">Page-level Indexing Signals</h2>
            <div className="flex items-center gap-2">
              <label htmlFor="sortBy" className="text-sm text-[#6b5d4f] font-medium">Sort by:</label>
              {/* ...existing sort controls... */}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
