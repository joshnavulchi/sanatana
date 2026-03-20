"use client";

import React, { useEffect, useState } from "react";

type Report = any;

export default function AuditViewer() {
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch('/data/post-deploy-audit.json')
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
    return () => { mounted = false; };
  }, []);

  if (error) return <div className="p-4 text-sm text-red-700">Error loading audit: {error}</div>;
  if (!report) return <div className="p-4 text-sm">Loading audit…</div>;

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Post-deploy Audit</h1>
        <button
          className="ml-4 rounded bg-gray-200 px-3 py-1 text-sm"
          onClick={() => setShowRaw((s) => !s)}
        >
          {showRaw ? 'Hide JSON' : 'Show raw JSON'}
        </button>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-700">Audited at: {report.auditedAtUtc}</div>
        <div className="text-sm text-gray-700">Pages audited: {report.totals?.pagesAudited ?? '—'}</div>
        <div className="text-sm text-gray-700">Noindex pages: {report.totals?.noindexPages ?? '—'}</div>
        <div className="text-sm text-gray-700">Pages with JSON-LD: {report.totals?.pagesWithJsonLd ?? '—'}</div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-2">Sample pages</h2>
        <ul className="space-y-2">
          {(report.pages || []).slice(0, 10).map((p: any) => (
            <li key={p.route} className="rounded border p-3">
              <div className="text-sm font-medium">{p.route}</div>
              <div className="text-xs text-gray-600">{p.url}</div>
              <div className="text-xs">Canonical: {p.canonical ?? '—'}</div>
              <div className="text-xs">Noindex: {p.hasNoindex ? 'yes' : 'no'}</div>
              <div className="text-xs">JSON-LD scripts: {p.jsonLdScriptCount}</div>
            </li>
          ))}
        </ul>
      </div>

      {showRaw && (
        <pre className="mt-6 max-h-[60vh] overflow-auto rounded bg-gray-100 p-4 text-xs">
          {JSON.stringify(report, null, 2)}
        </pre>
      )}
    </div>
  );
}
