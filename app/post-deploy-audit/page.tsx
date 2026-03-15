import { readFile } from 'fs/promises';
import path from 'path';

// ...existing code...

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



import PostDeployAuditClient from "./postdeployauditclient";

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
  return <PostDeployAuditClient report={report} />;
}
