import { parseList } from './parseList';

export function parseSections(raw: any): any[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  // If it's an object (but not an array), try to convert it to an array
  if (typeof raw === 'object') {
    // If it has numeric keys, convert to array
    const keys = Object.keys(raw);
    if (keys.every(k => !isNaN(Number(k)))) {
      return Object.values(raw);
    }
    // Otherwise return as single-item array
    return [raw];
  }
  if (typeof raw === 'string') {
    // Check if string looks like JSON
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
    // Try to parse as list if not JSON
    return parseList(raw);
  }
  return [];
}

export function parseMaybeObject(raw: any): any {
  if (!raw) return raw;
  // If it's already an object or array, return as-is
  if (typeof raw === 'object') return raw;
  // Only try to parse if it's a string
  if (typeof raw === 'string') {
    // Check if string looks like JSON (starts with { or [)
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

export default { parseSections, parseMaybeObject };
