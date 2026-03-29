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
    fetch("/data/audit-report.json")
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
      <div className="p-6 bg-red-100 text-red-800 rounded-xl shadow-lg text-base font-semibold">
        <span className="font-bold">Error loading audit:</span> {error}
      </div>
    );
  }

  if (!report) {
    return <div className="p-6 bg-linear-to-br from-amber-50 to-yellow-100 rounded-xl shadow text-base font-medium animate-pulse">Loading audit…</div>;
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
        btns.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        btns.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return btns;
  };

  // --- REDESIGN: Modern, premium Tailwind UI ---
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 md:px-8">
      <div className="mb-8 p-6 rounded-3xl bg-linear-to-br from-yellow-50 via-amber-100 to-yellow-200 shadow-xl border border-yellow-200/60 flex flex-col md:flex-row md:items-center md:justify-between gap-6 animate-fade-in">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-amber-900 mb-2 drop-shadow">Post-Deploy Audit Report</h2>
          <div className="text-base md:text-lg text-amber-800 font-medium">
            <span className="mr-4">Generated: <span className="font-semibold">{report.generatedAt ? new Date(report.generatedAt).toLocaleString() : 'N/A'}</span></span>
            <span className="mr-4">Total Pages: <span className="font-semibold">{report.totalPages}</span></span>
            <span className="mr-4">Passed: <span className="font-semibold text-green-700">{report.passed}</span></span>
            <span className="mr-4">Failed: <span className="font-semibold text-red-700">{report.failed}</span></span>
            <span>Average Score: <span className="font-semibold text-blue-700">{report.averageScore}</span></span>
          </div>
        </div>
        <button
          className="px-4 py-2 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold shadow transition"
          onClick={() => setShowRaw((v) => !v)}
        >
          {showRaw ? 'Hide Raw JSON' : 'Show Raw JSON'}
        </button>
      </div>

      {showRaw && (
        <pre className="mb-8 p-4 rounded-xl bg-gray-900 text-yellow-100 text-xs overflow-x-auto shadow-inner animate-fade-in" style={{ maxHeight: 400 }}>{JSON.stringify(report, null, 2)}</pre>
      )}

      <div className="mb-6 flex flex-wrap gap-2 items-center justify-between">
        <div className="text-lg font-bold text-amber-900">Pages</div>
        <div className="flex gap-1">
          {getPaginationButtons().map((btn, i) =>
            typeof btn === 'number' ? (
              <button
                key={btn}
                className={`px-3 py-1 rounded-lg font-semibold ${btn === currentPage ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-900 hover:bg-amber-200'} transition`}
                onClick={() => setCurrentPage(btn)}
              >{btn}</button>
            ) : (
              <span key={i} className="px-2 text-amber-400">{btn}</span>
            )
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {paginatedPages.map((p: any, idx: number) => (
          <div key={p.page + idx} className={`rounded-2xl border-2 ${p.status === 'PASS' ? 'border-green-300 bg-green-50' : p.status === 'FAIL' ? 'border-red-300 bg-red-50' : 'border-yellow-300 bg-yellow-50'} shadow-lg p-6 animate-fade-in-up`}>
            <div className="flex items-center gap-3 mb-2">
              <span className={`inline-block w-3 h-3 rounded-full ${p.status === 'PASS' ? 'bg-green-500' : p.status === 'FAIL' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
              <span className="font-bold text-lg text-gray-900">{p.page}</span>
              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${p.status === 'PASS' ? 'bg-green-200 text-green-900' : p.status === 'FAIL' ? 'bg-red-200 text-red-900' : 'bg-yellow-200 text-yellow-900'}`}>{p.status}</span>
              <span className="ml-auto font-mono text-sm text-blue-700">Score: {p.score}</span>
            </div>
            {p.issues && p.issues.length > 0 ? (
              <ul className="list-disc pl-6 text-red-800 text-base space-y-1">
                {p.issues.map((issue: string, i: number) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            ) : (
              <div className="text-green-700 font-medium">No issues found.</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

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
      <div className="overflow-x-auto max-h-[70vh] rounded text-base leading-relaxed font-normal">
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
          className="px-3 py-1 rounded disabled:opacity-50"
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
          className="px-3 py-1 rounded disabled:opacity-50"
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