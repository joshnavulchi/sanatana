// @ts-nocheck
// Auto-generated index for folder 'fr\itihasa\mahabharata\itihasa\mahabharata\stri\parva'
// Imports local JSON files and child folder indexes, deep-merging them into one export.

import _j0 from './chapter1.json';
import _j1 from './chapter10.json';
import _j2 from './chapter11.json';
import _j3 from './chapter12.json';
import _j4 from './chapter13.json';
import _j5 from './chapter14.json';
import _j6 from './chapter15.json';
import _j7 from './chapter16.json';
import _j8 from './chapter17.json';
import _j9 from './chapter18.json';
import _j10 from './chapter19.json';
import _j11 from './chapter2.json';
import _j12 from './chapter20.json';
import _j13 from './chapter3.json';
import _j14 from './chapter4.json';
import _j15 from './chapter5.json';
import _j16 from './chapter6.json';
import _j17 from './chapter7.json';
import _j18 from './chapter8.json';
import _j19 from './chapter9.json';



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
const merged = ([_j0, _j1, _j2, _j3, _j4, _j5, _j6, _j7, _j8, _j9, _j10, _j11, _j12, _j13, _j14, _j15, _j16, _j17, _j18, _j19] as any[]).reduce((acc: any, cur: any) => deepMerge(acc, cur || {}), base as any);
export default merged;