// @ts-nocheck
// Auto-generated index for folder 'ja\upanishads'
// Imports local JSON files and child folder indexes, deep-merging them into one export.
import _j0 from './upanishads.json';
import _d0 from './aitareya/index';
import _d1 from './brihadaranyaka/index';
import _d2 from './chandogya/index';
import _d3 from './isha/index';
import _d4 from './katha/index';
import _d5 from './kaushitaki/index';
import _d6 from './kena/index';
import _d7 from './maitri/index';
import _d8 from './mandukya/index';
import _d9 from './mundaka/index';
import _d10 from './prashna/index';
import _d11 from './shvetashvatara/index';
import _d12 from './taittiriya/index';

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
const merged = ([_j0, _d0, _d1, _d2, _d3, _d4, _d5, _d6, _d7, _d8, _d9, _d10, _d11, _d12] as any[]).reduce((acc: any, cur: any) => deepMerge(acc, cur || {}), base as any);
export default merged;
