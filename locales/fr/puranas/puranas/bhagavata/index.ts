// @ts-nocheck
// Auto-generated index for folder 'fr\puranas\puranas\bhagavata'
// Imports local JSON files and child folder indexes, deep-merging them into one export.
import _j0 from './purana.json';
import _j1 from './skanda1.json';
import _j2 from './skanda10.json';
import _j3 from './skanda11.json';
import _j4 from './skanda12.json';
import _j5 from './skanda2.json';
import _j6 from './skanda3.json';
import _j7 from './skanda4.json';
import _j8 from './skanda5.json';
import _j9 from './skanda6.json';
import _j10 from './skanda7.json';
import _j11 from './skanda8.json';
import _j12 from './skanda9.json';
import _j13 from './structure.json';
import _d0 from './skanda1/index';
import _d1 from './skanda10/index';
import _d2 from './skanda11/index';
import _d3 from './skanda12/index';
import _d4 from './skanda2/index';
import _d5 from './skanda3/index';
import _d6 from './skanda4/index';
import _d7 from './skanda5/index';
import _d8 from './skanda6/index';
import _d9 from './skanda7/index';
import _d10 from './skanda8/index';
import _d11 from './skanda9/index';

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
const merged = ([_j0, _j1, _j2, _j3, _j4, _j5, _j6, _j7, _j8, _j9, _j10, _j11, _j12, _j13, _d0, _d1, _d2, _d3, _d4, _d5, _d6, _d7, _d8, _d9, _d10, _d11] as any[]).reduce((acc: any, cur: any) => deepMerge(acc, cur || {}), base as any);
export default merged;
