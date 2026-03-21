import getContentPath from './getContentPath';

export async function fetchContent(locale: string, segments: string[]) {
  // Try direct file first: /.../segments.json
  const primary = getContentPath(locale, segments);
  try {
    const res = await fetch(primary, { cache: 'force-cache' });
    if (res.ok) {
      const data = await res.json();
      return { data, path: primary };
    }
    // If 404, fall through to index fallback
    if (res.status !== 404) {
      // non-404 errors: still attempt fallback
    }
  } catch (e) {
    // ignore and try fallback
  }

  // Fallback: try folder index at /.../segments/index.json
  const idxSegments = [...segments];
  const last = idxSegments.pop();
  if (last !== undefined) {
    // build path to folder index: join previous + last as folder + index.json
    const folderPathSegments = [...segments, 'index'];
    const indexPath = getContentPath(locale, folderPathSegments);
    try {
      const r2 = await fetch(indexPath, { cache: 'force-cache' });
      if (r2.ok) {
        const data = await r2.json();
        return { data, path: indexPath };
      }
    } catch (e) {
      // ignore
    }
  }

  return { data: null, path: null };
}

export default fetchContent;
