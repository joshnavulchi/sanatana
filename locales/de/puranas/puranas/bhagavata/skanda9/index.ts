// @ts-nocheck
// Auto-generated index for folder 'de\puranas\puranas\bhagavata\skanda9'
// Imports local JSON files and child folder indexes, deep-merging them into one export.
import _j0 from './chapter1.json';
import _j1 from './chapter2.json';
import _j2 from './chapter3.json';
import _j3 from './chapter4.json';
import _j4 from './chapter5.json';
import _d0 from './chapter1/index';
import _d1 from './chapter2/index';
import _d2 from './chapter3/index';
import _d3 from './chapter4/index';
import _d4 from './chapter5/index';

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
const merged = ([_j0, _j1, _j2, _j3, _j4, _d0, _d1, _d2, _d3, _d4] as any[]).reduce((acc: any, cur: any) => deepMerge(acc, cur || {}), base as any);
export default merged;
