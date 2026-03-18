import { normalizeLocale } from '@lib/i18n';
import PostDeployAuditClient from "./postdeployauditclient";

import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';

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

export interface AuditReport {
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

export const generateMetadata = createGenerateMetadata('post_deploy_audit');

async function loadReport(): Promise<AuditReport | null> {
  try {
    const raw = await normalizeLocale('post-deploy-audit.json');
    if (!raw) return null;
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
  return (
    <>
      <StructuredData metaKey="post_deploy_audit" />
      <PostDeployAuditClient report={report} />
    </>
  );
}
