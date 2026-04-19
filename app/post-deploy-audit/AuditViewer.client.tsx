"use client";

import { useEffect, useState } from "react";

type PageItem = { page: string; status: string; score?: number; issues?: string[] };
type Report = { generatedAt?: string; totalPages?: number; passed?: number; failed?: number; averageScore?: number | string; pages?: PageItem[] };

export default function AuditViewer() {
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    let mounted = true;
    fetch('/data/audit-report.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((j) => { if (mounted) setReport(j); })
      .catch((e) => { if (mounted) setError(String(e)); });
    return () => { mounted = false; };
  }, []);

  if (error) return <div className="p-4 text-red-700">Error loading audit: {error}</div>;
  if (!report) return <div className="p-4">Loading audit…</div>;

  const pages = report.pages || [];
  const totalPages = Math.max(1, Math.ceil(pages.length / pageSize));
  const start = (currentPage - 1) * pageSize;
  const paginated = pages.slice(start, start + pageSize);

  const paginationButtons = (() => {
    const btns: (number | string)[] = [];
    if (totalPages <= 7) for (let i = 1; i <= totalPages; i++) btns.push(i);
    else if (currentPage <= 4) btns.push(1, 2, 3, 4, 5, '...', totalPages);
    else if (currentPage >= totalPages - 3) btns.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    else btns.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    return btns;
  })();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Post-Deploy Audit</h2>
        <button className="text-md sm:text-base text-amber-800" onClick={() => setShowRaw((s) => !s)}>{showRaw ? 'Hide JSON' : 'Show raw JSON'}</button>
      </div>

      <div className="mb-4 bg-amber-50 p-4 rounded-lg shadow-sm">
        <div className="text-md sm:text-base">Generated: <strong>{report.generatedAt ?? 'N/A'}</strong></div>
        <div className="text-md sm:text-base">Pages: <strong>{report.totalPages ?? pages.length}</strong></div>
        <div className="text-md sm:text-base">Passed: <strong className="text-green-700">{report.passed ?? '—'}</strong> Failed: <strong className="text-red-700">{report.failed ?? '—'}</strong></div>
      </div>

      {showRaw && <pre className="mb-4 p-3 bg-gray-100 rounded text-sm overflow-auto">{JSON.stringify(report, null, 2)}</pre>}

      <div className="space-y-3">
        {paginated.map((p, i) => (
          <div key={`${p.page}-${i}`} className="p-4 rounded-lg border shadow-sm flex items-start gap-4">
            <div className={p.status === 'PASS' ? 'w-3 h-3 rounded-full mt-1 bg-green-500' : p.status === 'FAIL' ? 'w-3 h-3 rounded-full mt-1 bg-red-500' : 'w-3 h-3 rounded-full mt-1 bg-yellow-500'} />
            <div className="flex-1">
              <div className="font-semibold">{p.page}</div>
              <div className="text-md sm:text-base text-gray-700">Status: <span className="font-medium">{p.status}</span> — Score: {p.score ?? '—'}</div>
              {p.issues && p.issues.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-md sm:text-base text-red-700">
                  {p.issues.map((it, idx) => <li key={idx}>{it}</li>)}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage((c) => Math.max(1, c - 1))} className="px-3 py-1 rounded border disabled:opacity-50">Prev</button>
        {paginationButtons.map((b, idx) => typeof b === 'number' ? (
          <button key={idx} onClick={() => setCurrentPage(b as number)} className={"px-3 py-1 rounded " + (b === currentPage ? 'bg-amber-700 text-white' : 'bg-amber-100')}>{b}</button>
        ) : (
          <span key={idx} className="px-2">{b}</span>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))} className="px-3 py-1 rounded border disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}

