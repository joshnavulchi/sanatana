import fs from 'fs';
import path from 'path';

type ValidPath = { segments: string[]; filePath: string };

function isJsonFile(p: string) {
  return p.toLowerCase().endsWith('.json');
}

function walkDirSync(dir: string, rootBase: string, out: ValidPath[]) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const full = path.join(dir, it.name);
    if (it.isDirectory()) {
      walkDirSync(full, rootBase, out);
    } else if (it.isFile() && isJsonFile(it.name)) {
      const rel = path.relative(rootBase, full).split(path.sep);
      // remove extension from last segment
      rel[rel.length - 1] = rel[rel.length - 1].replace(/\.json$/i, '');
      // filter out empty segments
      const segments = rel.filter((s) => typeof s === 'string' && s.trim().length > 0);
      if (segments.length > 0) {
        out.push({ segments, filePath: full });
      }
    }
  }
}

/**
 * Recursively scans `public/data/locales/{locale}` or a scoped subfolder for JSON
 * files and returns an array of valid paths. Use `scope` to limit scanning to a
 * specific route folder (e.g., ['itihasa','ramayana']) to avoid scanning all
 * public data files.
 *
 * This is synchronous so it can be used from `generateStaticParams()`.
 */
export function getAllValidPathsSync(locale = 'en', scope?: string | string[]): ValidPath[] {
  const repoRoot = path.resolve(__dirname, '..');
  const rootBase = path.join(repoRoot, 'public', 'data', 'locales', locale);
  let scanBase = rootBase;
  try {
    if (scope) {
      const parts = Array.isArray(scope) ? scope : String(scope).split('/').filter(Boolean);
      if (parts.length > 0) scanBase = path.join(rootBase, ...parts);
    }
    const out: ValidPath[] = [];
    walkDirSync(scanBase, rootBase, out);
    return out;
  } catch (e) {
    return [];
  }
}

export default getAllValidPathsSync;
