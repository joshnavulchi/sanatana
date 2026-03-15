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

        <h2 className="mt-8 text-xl font-semibold text-[#7a2e1f]">Page-level Indexing Signals</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-[#d8a25a]">
          <table className="min-w-full bg-[#fffaf2] text-left text-sm">
            <thead className="bg-[#fde7c7] text-[#7a2e1f]">
              <tr>
                <th className="px-3 py-2">URL</th>
                <th className="px-3 py-2">HTTP</th>
                <th className="px-3 py-2">Canonical</th>
                <th className="px-3 py-2">Robots</th>
                <th className="px-3 py-2">Noindex</th>
                <th className="px-3 py-2">JSON-LD count</th>
                <th className="px-3 py-2">Schema types</th>
              </tr>
            </thead>
            <tbody>
              {report.pages.map((page) => (
                <tr key={page.url} className="border-t border-[#efd6ab] text-[#5b2d12]">
                  <td className="px-3 py-2">{page.url}</td>
                  <td className="px-3 py-2">{page.statusCode}</td>
                  <td className="px-3 py-2 break-all">{page.canonical ?? '-'}</td>
                  <td className="px-3 py-2">{page.robotsMeta ?? '-'}</td>
                  <td className="px-3 py-2">{page.hasNoindex ? 'Yes' : 'No'}</td>
                  <td className="px-3 py-2">{page.jsonLdScriptCount ?? 0}</td>
                  <td className="px-3 py-2">{(page.schemaTypesFound ?? []).join(', ') || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
