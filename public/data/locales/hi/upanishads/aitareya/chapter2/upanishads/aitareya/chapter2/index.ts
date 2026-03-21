// @ts-nocheck
// Auto-generated index for folder 'hi\upanishads\aitareya\chapter2\upanishads\aitareya\chapter2'
// Imports local JSON files and child folder indexes, deep-merging them into one export.

import _j0 from './verse1.json';
import _j1 from './verse2.json';
import _j2 from './verse3.json';
import _j3 from './verse4.json';
import _j4 from './verse5.json';



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
const merged = ([_j0, _j1, _j2, _j3, _j4] as any[]).reduce((acc: any, cur: any) => deepMerge(acc, cur || {}), base as any);
export default merged;