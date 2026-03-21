// @ts-nocheck
// Auto-generated index for folder 'ru\explore\stories'
// Imports local JSON files and child folder indexes, deep-merging them into one export.

import _j0 from './adishankaracharya.json';
import _j1 from './bhishma.json';
import _j2 from './bramha.json';
import _j3 from './karna.json';
import _j4 from './krishna.json';
import _j5 from './lakshmi.json';
import _j6 from './parashurama.json';
import _j7 from './parvathi.json';
import _j8 from './puranic.json';
import _j9 from './ramanamaharshi.json';
import _j10 from './saraswathi.json';
import _j11 from './shiva.json';
import _j12 from './vasistamaharshi.json';
import _j13 from './vishnu.json';
import _j14 from './vishwamitra.json';



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
const merged = ([_j0, _j1, _j2, _j3, _j4, _j5, _j6, _j7, _j8, _j9, _j10, _j11, _j12, _j13, _j14] as any[]).reduce((acc: any, cur: any) => deepMerge(acc, cur || {}), base as any);
export default merged;