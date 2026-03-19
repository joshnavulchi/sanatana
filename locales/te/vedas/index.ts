// @ts-nocheck
// Auto-generated index for folder 'te\vedas'
// Imports local JSON files and child folder indexes, deep-merging them into one export.
import _j0 from './structure.json';
import _j1 from './vedas.json';
import _d0 from './atharvaveda/index';
import _d1 from './rigveda/index';
import _d2 from './samaveda/index';
import _d3 from './yajurveda/index';

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
const merged = ([_j0, _j1, _d0, _d1, _d2, _d3] as any[]).reduce((acc: any, cur: any) => deepMerge(acc, cur || {}), base as any);
export default merged;
