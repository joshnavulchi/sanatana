import localesIndex from "../public/data/locales-en-json-files.json";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "");

function normalizePath(p: string) {
  // paths in the index use backslashes on Windows; convert and strip .json
  const forward = p.replace(/\\/g, "/");
  const noExt = forward.replace(/\.json$/i, "");
  if (noExt === "home") return "/";
  return `/${noExt}`;
}

export default async function sitemap() {
  const urls = new Map<string, string>();

  const generatedAt = localesIndex.generatedAt || new Date().toISOString();

  for (const p of localesIndex.paths || []) {
    try {
      const route = normalizePath(p);
      const url = SITE_URL + route;
      urls.set(url, generatedAt);
    } catch (e) {
      // skip malformed entries
      continue;
    }
  }

  // include root explicitly
  urls.set(SITE_URL + "/", generatedAt);

  return Array.from(urls.entries()).map(([url, ts]) => ({ url, lastModified: new Date(ts) }));
}
