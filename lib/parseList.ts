export function parseList(p: any): any[] {
  if (Array.isArray(p)) return p;
  if (!p) return [];
  if (typeof p === 'string') {
    const s = p.trim();
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    return s.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  }
  return [];
}
