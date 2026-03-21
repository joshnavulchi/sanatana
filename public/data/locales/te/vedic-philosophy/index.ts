// @ts-nocheck
// Auto-generated index for folder 'te\vedic-philosophy'
// Imports local JSON files and child folder indexes, deep-merging them into one export.

import _j0 from './vedic_philosophy_architecture.json';
import _j1 from './vedic_philosophy_astronomy.json';
import _j2 from './vedic_philosophy_mathematics.json';
import _j3 from './vedic_philosophy_medicine.json';
import _d0 from './advaita/index';
import _d1 from './bhakti/index';
import _d2 from './dharma/index';
import _d3 from './karma/index';
import _d4 from './moksha/index';
import _d5 from './purushartha/index';
import _d6 from './samsara/index';
import _d7 from './yoga/index';



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
const merged = ([_j0, _j1, _j2, _j3, _d0, _d1, _d2, _d3, _d4, _d5, _d6, _d7] as any[]).reduce((acc: any, cur: any) => deepMerge(acc, cur || {}), base as any);
export default merged;