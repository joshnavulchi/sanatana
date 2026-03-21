// Combined parsing utilities: list and content parsing helpers
export function parseList(p: any): any[] {
  if (Array.isArray(p)) return p;
  if (!p) return [];
  if (typeof p === 'string') {
    const s = p.trim();
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) { }
    return s.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  }
  return [];
}

export function parseSections(raw: any): any[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'object') {
    const keys = Object.keys(raw);
    if (keys.every(k => !isNaN(Number(k)))) {
      return Object.values(raw);
    }
    return [raw];
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === 'object') return [parsed];
      } catch (e) {
        return parseList(raw);
      }
    }
    return parseList(raw);
  }
  return [];
}

export function parseMaybeObject(raw: any): any {
  if (!raw) return raw;
  if (typeof raw === 'object') return raw;
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return JSON.parse(raw);
      } catch (_) {
        return raw;
      }
    }
    return raw;
  }
  return raw;
}

export default { parseList, parseSections, parseMaybeObject };
