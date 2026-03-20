// @ts-nocheck
// Auto-generated index for folder 'en\vedas\atharvaveda\book7'
// Imports local JSON files and child folder indexes, deep-merging them into one export.
import _j0 from './hymn1.json';
import _j1 from './hymn10.json';
import _j2 from './hymn2.json';
import _j3 from './hymn3.json';
import _j4 from './hymn4.json';
import _j5 from './hymn5.json';
import _j6 from './hymn6.json';
import _j7 from './hymn7.json';
import _j8 from './hymn8.json';
import _j9 from './hymn9.json';

function deepMerge(target: any, source: any) {
  if (source === undefined) return target;
  if (Array.isArray(target) && Array.isArray(source)) {
    const out = target.slice();
    for (let i = 0; i < source.length; i++) out[i] = deepMerge(out[i], source[i]);
    return out;
  }
  if (target && typeof target === 'object' && source && typeof source === 'object') {
    const out: any = { ...target };
    for (const k of Object.keys(source)) out[k] = deepMerge(target ? target[k] : undefined, source[k]);
    return out;
  }
  return source;
}

const base: any = {};
const merged = ([_j0, _j1, _j2, _j3, _j4, _j5, _j6, _j7, _j8, _j9] as any[]).reduce((acc: any, cur: any) => deepMerge(acc, cur || {}), base as any);
export default merged;
