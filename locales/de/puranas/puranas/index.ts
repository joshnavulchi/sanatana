// @ts-nocheck
// Auto-generated index for folder 'de\puranas\puranas'
// Imports local JSON files and child folder indexes, deep-merging them into one export.
import _j0 from './garuda.json';
import _j1 from './karma.json';
import _j2 from './structure.json';
import _d0 from './agni/index';
import _d1 from './bhagavata/index';
import _d2 from './bhavishya/index';
import _d3 from './brahma/index';
import _d4 from './brahmanda/index';
import _d5 from './brahmavaivarta/index';
import _d6 from './garuda/index';
import _d7 from './kurma/index';
import _d8 from './linga/index';
import _d9 from './markandeya/index';
import _d10 from './matsya/index';
import _d11 from './narada/index';
import _d12 from './padma/index';
import _d13 from './shiva/index';
import _d14 from './skanda/index';
import _d15 from './vamana/index';
import _d16 from './varaha/index';
import _d17 from './vishnu/index';

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
const merged = ([_j0, _j1, _j2, _d0, _d1, _d2, _d3, _d4, _d5, _d6, _d7, _d8, _d9, _d10, _d11, _d12, _d13, _d14, _d15, _d16, _d17] as any[]).reduce((acc: any, cur: any) => deepMerge(acc, cur || {}), base as any);
export default merged;
