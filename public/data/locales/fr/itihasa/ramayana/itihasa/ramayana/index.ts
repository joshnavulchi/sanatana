// @ts-nocheck
// Auto-generated index for folder 'fr\itihasa\ramayana\itihasa\ramayana'
// Imports local JSON files and child folder indexes, deep-merging them into one export.

import _j0 from './structure.json';
import _d0 from './aranya/index';
import _d1 from './ayodhya/index';
import _d2 from './bala/index';
import _d3 from './kishkinda/index';
import _d4 from './sundara/index';
import _d5 from './uttara/index';
import _d6 from './yuddha/index';



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
const merged = ([_j0, _d0, _d1, _d2, _d3, _d4, _d5, _d6] as any[]).reduce((acc: any, cur: any) => deepMerge(acc, cur || {}), base as any);
export default merged;