"use client";

import { useEffect, useState } from "react";

type Report = any;

export default function AuditViewer() {
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    let mounted = true;
    fetch("/data/post-deploy-audit.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (mounted) setReport(json);
      })
      .catch((err) => {
        if (mounted) setError(String(err));
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="p-4 text-red-700 text-base leading-relaxed font-normal">
        Error loading audit: {error}
      </div>
    );
  }

  if (!report) {
    return <div className="p-4 text-base leading-relaxed font-normal">Loading audit…</div>;
  }

  const pages = report.pages || [];
  const totalPages = Math.ceil(pages.length / pageSize);

  const start = (currentPage - 1) * pageSize;
  const paginatedPages = pages.slice(start, start + pageSize);

  // PAGINATION BUTTON LOGIC (with ... gaps)
  const getPaginationButtons = () => {
    const btns: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) btns.push(i);
    } else {
      if (currentPage <= 4) {
        btns.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        btns.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        btns.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return btns;
  };

  const paginationButtons = getPaginationButtons();

  return (
    <div className="p-6 text-base leading-relaxed font-normal">
      <div className="flex items-center justify-between text-base leading-relaxed font-normal">
        <h3 className="text-3xl font-semibold leading-tight tracking-tight mb-4 md:text-4xl">Post-deploy Audit</h3>
        <button
          className="ml-4 rounded bg-gray-200 px-3 py-1 text-sm"
          onClick={() => setShowRaw((s) => !s)}
        >
          {showRaw ? "Hide JSON" : "Show raw JSON"}
        </button>
      </div>

      {/* Audit meta */}
      <div className="text-base leading-relaxed font-normal">
        <div className="text-base leading-relaxed font-normal">
          Audited at: {report.auditedAtUtc}
        </div>
        <div className="text-base leading-relaxed font-normal">
          Pages audited: {report.totals?.pagesAudited ?? "—"}
        </div>
        <div className="text-base leading-relaxed font-normal">
          Noindex pages: {report.totals?.noindexPages ?? "—"}
        </div>
        <div className="text-base leading-relaxed font-normal">
          Pages with JSON-LD: {report.totals?.pagesWithJsonLd ?? "—"}
        </div>
      </div>

      {/* TABLE WITH RESPONSIVE COLLAPSE */}
      <div>
        <div className="overflow-x-auto max-h-[70vh] rounded border text-base leading-relaxed font-normal">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm hidden sm:table-header-group">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Route
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  URL
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Canonical
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Noindex
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  JSON-LD Count
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginatedPages.map((p: any) => (
                <tr
                  key={p.route}
                  className="odd:bg-gray-50 even:bg-white hover:bg-gray-100 sm:table-row block mb-3 sm:mb-0 rounded"
                >
                  <td
                    className="px-4 py-2 font-medium text-gray-900 block sm:table-cell before:font-semibold before:text-gray-600 before:content-['Route:'] sm:before:content-none"
                    data-label="Route"
                  >
                    {p.route}
                  </td>

                  <td
                    className="px-4 py-2 text-gray-700 break-all block sm:table-cell before:font-semibold before:text-gray-600 before:content-['URL:'] sm:before:content-none"
                    data-label="URL"
                  >
                    {p.url}
                  </td>

                  <td
                    className="px-4 py-2 text-gray-700 block sm:table-cell before:font-semibold before:text-gray-600 before:content-['Canonical:'] sm:before:content-none"
                    data-label="Canonical"
                  >
                    {p.canonical ?? "—"}
                  </td>

                  <td
                    className="px-4 py-2 text-gray-700 block sm:table-cell before:font-semibold before:text-gray-600 before:content-['Noindex:'] sm:before:content-none"
                    data-label="Noindex"
                  >
                    {p.hasNoindex ? "yes" : "no"}
                  </td>

                  <td
                    className="px-4 py-2 text-gray-700 block sm:table-cell before:font-semibold before:text-gray-600 before:content-['JSON‑LD Count:'] sm:before:content-none"
                    data-label="JSON-LD Count"
                  >
                    {p.jsonLdScriptCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex gap-2 items-center flex-wrap text-base leading-relaxed font-normal">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {paginationButtons.map((btn, idx) =>
            btn === "..." ? (
              <span key={idx} className="px-3 py-1 text-base leading-relaxed font-normal">
                …
              </span>
            ) : (
              <button
                key={idx}
                onClick={() => setCurrentPage(btn as number)}
                className={`px-3 py-1 border rounded ${currentPage === btn ? "bg-gray-300 font-semibold" : ""
                  }`}
              >
                {btn}
              </button>
            )
          )}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {showRaw && (
        <pre className="max-h-[60vh] overflow-auto rounded bg-gray-100 p-4 text-base leading-relaxed mb-4 font-normal">
          {JSON.stringify(report, null, 2)}
        </pre>
      )}
    </div>
  );
}