import { parseList } from './parseList';

export function parseSections(raw: any): any[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return parseList(raw);
    }
  }
  return [];
}

export function parseMaybeObject(raw: any): any {
  if (!raw) return raw;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return raw;
    }
  }
  return raw;
}

export default { parseSections, parseMaybeObject };
