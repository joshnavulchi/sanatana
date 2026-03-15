import { readFile } from 'fs/promises';
import path from 'path';

interface PageAudit {
  route?: string;
  url: string;
  statusCode: number;
  sourceHtml?: string;
  expectedCanonical?: string;
  canonicalMatchesExpected?: boolean;
  canonical?: string | null;
  robotsMeta?: string | null;
  googlebotMeta?: string | null;
  xRobotsTag?: string | null;
  hasNoindex?: boolean;
  jsonLdScriptCount?: number;
  schemaTypesFound?: string[];
  richResultTypesFound?: string[];
  hasGoogleRichResultCandidate?: boolean;
  error?: string;
}

interface AuditReport {
  auditedAtUtc: string;
  source: string;
  baseUrl: string;
  buildSourceFolder?: string;
  totals?: {
    pagesAudited: number;
    noindexPages: number;
    pagesMissingCanonical: number;
    pagesWithJsonLd: number;
    pagesWithRichResultCandidates: number;
  };
  pages: PageAudit[];
  robotsTxt: {
    exists: boolean;
    hasSitemapDirective: boolean;
    preview?: string[];
  };
  sitemap: {
    exists: boolean;
    has404Html: boolean;
    hasNotFoundRoute: boolean;
    urlCountApprox: number;
  };
  recrawlTriggerPlan?: {
    enabled: boolean;
    actions: string[];
  };
  dailyCoverageMonitoring?: {
    enabled: boolean;
    checks: string[];
  };
}

async function loadReport(): Promise<AuditReport | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'post-deploy-audit.json');
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw) as AuditReport;
  } catch {
    return null;
  }
}

function statusBadge(ok: boolean): string {
  return ok
    ? 'inline-flex rounded-xl border border-[#d8a25a] bg-[#fffaf0] px-3 py-1 text-xs font-semibold text-[#1a6e5c]'
    : 'inline-flex rounded-xl border border-[#b45309] bg-[#fff7ed] px-3 py-1 text-xs font-semibold text-[#a63d17]';
}



import React, { useState } from "react";
import Pagination from "@components/common/Pagination";

const SORT_OPTIONS = [
  { value: "url", label: "URL" },
  { value: "statusCode", label: "HTTP Status" },
  { value: "canonical", label: "Canonical" },
  { value: "noindex", label: "Noindex" },
  { value: "jsonLdScriptCount", label: "JSON-LD Count" },
  { value: "schemaTypesFound", label: "Schema Types" },
];

export default async function PostDeployAuditPage() {
  const report = await loadReport();

  if (!report) {
    return (
      <main className="min-h-screen bg-linear-to-b from-[#fffaf3] via-[#fdf0d7] to-[#fff8ef] px-6 py-10">
        <section className="mx-auto max-w-5xl rounded-3xl border border-[#d8a25a] bg-[#fffaf0] p-8 shadow-[0_10px_40px_rgba(122,46,31,0.10)]">
          <h1 className="text-2xl font-bold text-[#7a2e1f]">Post-Deploy Audit</h1>
          <p className="mt-3 text-[#5b2d12]">
            Report file not found. Generate it by running:
            <span className="ml-2 font-semibold">node scripts/generate-post-deploy-audit.js</span>
          </p>
        </section>
      </main>
    );
  }

  const allPagesHealthy = report.pages.every((page) =>
    page.statusCode === 200 && !page.hasNoindex && (page.canonical?.length ?? 0) > 0
  );

  // Sorting logic
  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("url");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

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
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedPages.length / PAGE_SIZE);
  const pagedPages = sortedPages.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className="min-h-screen bg-linear-to-b from-[#fffaf3] via-[#fdf0d7] to-[#fff8ef] px-4 py-8 md:px-8">
      <section className="mx-auto max-w-6xl rounded-3xl border border-[#d8a25a] bg-[#fffaf0] p-6 shadow-[0_10px_40px_rgba(122,46,31,0.10)] md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="bg-linear-to-r from-[#a63d17] via-[#d97706] to-[#f59e0b] bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
            Post-Deploy Audit Report
          </h1>
          <span className={statusBadge(allPagesHealthy)}>
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
            <select
              id="sortBy"
              value={sortBy}
              onChange={e => { setSortBy(e.target.value); setPage(1); }}
              className="rounded-xl border border-[#d8a25a] bg-[#fffaf0] px-2 py-1 text-sm text-[#5b2d12] focus:border-[#e0a632] focus:ring-0"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              type="button"
              className="ml-2 rounded-xl border border-[#d8a25a] bg-[#fffaf0] px-2 py-1 text-sm text-[#7a2e1f] hover:bg-[#fde7c7]"
              onClick={() => { setSortDir(sortDir === "asc" ? "desc" : "asc"); setPage(1); }}
              aria-label="Toggle sort direction"
            >
              {sortDir === "asc" ? "▲" : "▼"}
            </button>
          </div>
        </div>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-[#d8a25a] shadow-[0_8px_30px_rgba(146,64,14,0.08)]">
          <table className="min-w-full text-left text-sm border-separate border-spacing-0">
            <thead className="bg-[#fde7c7] text-[#7a2e1f]">
              <tr>
                <th className="px-4 py-3 font-semibold border-b border-[#efd6ab] bg-[#fde7c7]">Flag</th>
                <th className="px-4 py-3 font-semibold border-b border-[#efd6ab] bg-[#fde7c7]">URL</th>
                <th className="px-4 py-3 font-semibold border-b border-[#efd6ab] bg-[#fde7c7]">HTTP</th>
                <th className="px-4 py-3 font-semibold border-b border-[#efd6ab] bg-[#fde7c7]">Canonical</th>
                <th className="px-4 py-3 font-semibold border-b border-[#efd6ab] bg-[#fde7c7]">Robots</th>
                <th className="px-4 py-3 font-semibold border-b border-[#efd6ab] bg-[#fde7c7]">Noindex</th>
                <th className="px-4 py-3 font-semibold border-b border-[#efd6ab] bg-[#fde7c7]">JSON-LD</th>
                <th className="px-4 py-3 font-semibold border-b border-[#efd6ab] bg-[#fde7c7]">Schema types</th>
              </tr>
            </thead>
            <tbody>
              {pagedPages.map((page, idx) => {
                // Valid Google index page: status 200, no noindex, canonical present
                const isValidIndex =
                  page.statusCode === 200 &&
                  !page.hasNoindex &&
                  (page.canonical?.length ?? 0) > 0;
                let invalidReasons = [];
                if (page.statusCode !== 200) invalidReasons.push("HTTP " + page.statusCode);
                if (page.hasNoindex) invalidReasons.push("Noindex");
                if (!page.canonical) invalidReasons.push("Missing canonical");
                if (page.robotsMeta?.includes("noindex")) invalidReasons.push("Robots noindex");
                if (page.error) invalidReasons.push(page.error);
                return (
                  <tr
                    key={page.url}
                    className={
                      `text-[#5b2d12] border-t border-[#efd6ab] ` +
                      (idx % 2 === 0
                        ? 'bg-[#fffaf2]'
                        : 'bg-[#f9ece0]') +
                      ' hover:bg-[#fde7c7]/60 transition-colors duration-150'
                    }
                  >
                    <td className="px-4 py-3 text-center">
                      {isValidIndex ? (
                        <span title="Valid Google index" className="inline-block text-[#1a6e5c]">
                          {/* Tick mark */}
                          <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 mx-auto"><path d="M6 10.5l3 3 5-6" stroke="#1a6e5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </span>
                      ) : (
                        <span title={invalidReasons.join(", ")} className="inline-block text-[#a63d17]">
                          {/* Cross mark */}
                          <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 mx-auto"><path d="M6 6l8 8M14 6l-8 8" stroke="#a63d17" strokeWidth="2" strokeLinecap="round" /></svg>
                          <div className="mt-1 text-xs text-[#a89278]">{invalidReasons.join(", ")}</div>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium break-all text-[#3d2e22]">{page.url}</td>
                    <td className="px-4 py-3 text-[#7a2e1f]">{page.statusCode}</td>
                    <td className="px-4 py-3 break-all text-[#8b6914]">{page.canonical ?? '-'}</td>
                    <td className="px-4 py-3 text-[#1a6e5c]">{page.robotsMeta ?? '-'}</td>
                    <td className={
                      `px-4 py-3 font-semibold ` +
                      (page.hasNoindex ? 'text-[#a63d17]' : 'text-[#6b5d4f]')
                    }>
                      {page.hasNoindex ? 'Yes' : 'No'}
                    </td>
                    <td className="px-4 py-3 text-[#d97706]">{page.jsonLdScriptCount ?? 0}</td>
                    <td className="px-4 py-3 text-[#3b3270]">{(page.schemaTypesFound ?? []).join(', ') || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-center">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>

        {report.recrawlTriggerPlan?.enabled && (
          <section className="mt-8 rounded-2xl border border-[#d8a25a] bg-[#fffaf2] p-5">
            <h3 className="text-lg font-semibold text-[#7a2e1f]">Re-crawl Trigger Plan</h3>
            <ul className="mt-3 list-disc pl-5 text-sm text-[#5b2d12]">
              {report.recrawlTriggerPlan.actions.map((action) => (
                <li key={action} className="py-1">{action}</li>
              ))}
            </ul>
          </section>
        )}

        {report.dailyCoverageMonitoring?.enabled && (
          <section className="mt-6 rounded-2xl border border-[#d8a25a] bg-[#fffaf2] p-5">
            <h3 className="text-lg font-semibold text-[#7a2e1f]">Daily Coverage Monitoring</h3>
            <ul className="mt-3 list-disc pl-5 text-sm text-[#5b2d12]">
              {report.dailyCoverageMonitoring.checks.map((check) => (
                <li key={check} className="py-1">{check}</li>
              ))}
            </ul>
          </section>
        )}
      </section>
    </main>
  );
}
