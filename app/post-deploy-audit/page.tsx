import AuditViewer from './AuditViewer.client';
import { createGenerateMetadata } from '@lib/pageUtils';

export const generateMetadata = createGenerateMetadata('post-deploy-audit');

export type PageAudit = {
  route: string;
  url: string;
  sourceHtml: string;
  statusCode: number;
  canonical?: string | null;
  expectedCanonical?: string;
  canonicalMatchesExpected?: boolean;
  robotsMeta?: string | null;
  googlebotMeta?: string | null;
  hasNoindex?: boolean;
  jsonLdScriptCount?: number;
  schemaTypesFound?: string[];
  richResultTypesFound?: string[];
  hasGoogleRichResultCandidate?: boolean;
};

export type AuditReport = {
  auditedAtUtc: string;
  buildCompleteTime?: string;
  source: string;
  baseUrl?: string;
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
    preview: string[];
  };
  sitemap: {
    exists: boolean;
    urlCountApprox: number;
    has404Html: boolean;
    hasNotFoundRoute: boolean;
  };
};

export default async function Page() {
  return (
    <AuditViewer />
  );
}

