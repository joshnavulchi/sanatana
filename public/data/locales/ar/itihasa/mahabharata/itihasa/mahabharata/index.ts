// @ts-nocheck
// Auto-generated index for folder 'ar\itihasa\mahabharata\itihasa\mahabharata'
// Imports local JSON files and child folder indexes, deep-merging them into one export.

import _j0 from './structure.json';
import _d0 from './adi/index';
import _d1 from './anushasana/index';
import _d2 from './ashramavasika/index';
import _d3 from './ashvamedhika/index';
import _d4 from './bhishma/index';
import _d5 from './drona/index';
import _d6 from './karna/index';
import _d7 from './mahaprasthanika/index';
import _d8 from './mousala/index';
import _d9 from './sabha/index';
import _d10 from './sauptika/index';
import _d11 from './shalya/index';
import _d12 from './shanti/index';
import _d13 from './stri/index';
import _d14 from './svargarohana/index';
import _d15 from './udyoga/index';
import _d16 from './vana/index';
import _d17 from './virata/index';



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
const merged = ([_j0, _d0, _d1, _d2, _d3, _d4, _d5, _d6, _d7, _d8, _d9, _d10, _d11, _d12, _d13, _d14, _d15, _d16, _d17] as any[]).reduce((acc: any, cur: any) => deepMerge(acc, cur || {}), base as any);
export default merged;