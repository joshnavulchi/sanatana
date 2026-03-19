// @ts-nocheck
// Auto-generated index for folder 'te\puranas\puranas\bhavishya\chapter6'
// Imports local JSON files and child folder indexes, deep-merging them into one export.
import _j0 from './verse1.json';
import _j1 from './verse10.json';
import _j2 from './verse2.json';
import _j3 from './verse3.json';
import _j4 from './verse4.json';
import _j5 from './verse5.json';
import _j6 from './verse6.json';
import _j7 from './verse7.json';
import _j8 from './verse8.json';
import _j9 from './verse9.json';

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
