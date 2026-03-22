/* Utility for building public JSON paths for Vedas content */
export function buildPath(locale: string, segments: string[]) {
  const parts = Array.isArray(segments) ? segments.filter(Boolean) : [];
  const joined = parts.join('/');
  // Note: caller is expected to provide at least one segment for file requests.
  return `/data/locales/${locale}/vedas/${joined}.json`;
}

export function buildIndexPath(locale: string, segments: string[]) {
  const parts = Array.isArray(segments) ? segments.filter(Boolean) : [];
  const joined = parts.join('/');
  return `/data/locales/${locale}/vedas/${joined}${joined ? '/' : ''}index.json`;
}
