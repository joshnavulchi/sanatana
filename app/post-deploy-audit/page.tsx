import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import AuditViewer from './AuditViewer.client';

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

export const generateMetadata = createGenerateMetadata('post_deploy_audit');

export default async function Page() {
  return (
    <>
      <StructuredData metaKey="post_deploy_audit" />
      <main className="mx-auto max-w-4xl">
        <AuditViewer />
      </main>
    </>
  );
}
