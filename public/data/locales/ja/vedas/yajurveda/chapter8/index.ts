// @ts-nocheck
// Auto-generated index for folder 'ja\vedas\yajurveda\chapter8'
// Imports local JSON files and child folder indexes, deep-merging them into one export.

import _j0 from './mantra1.json';
import _j1 from './mantra10.json';
import _j2 from './mantra11.json';
import _j3 from './mantra12.json';
import _j4 from './mantra2.json';
import _j5 from './mantra3.json';
import _j6 from './mantra4.json';
import _j7 from './mantra5.json';
import _j8 from './mantra6.json';
import _j9 from './mantra7.json';
import _j10 from './mantra8.json';
import _j11 from './mantra9.json';



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
const merged = ([_j0, _j1, _j2, _j3, _j4, _j5, _j6, _j7, _j8, _j9, _j10, _j11] as any[]).reduce((acc: any, cur: any) => deepMerge(acc, cur || {}), base as any);
export default merged;