// @ts-nocheck
// Auto-generated index for folder 'ja\itihasa\bhagavadgita\itihasa\bhagavad\gita\chapter3'
// Imports local JSON files and child folder indexes, deep-merging them into one export.

import _j0 from './verse1.json';
import _j1 from './verse10.json';
import _j2 from './verse11.json';
import _j3 from './verse12.json';
import _j4 from './verse13.json';
import _j5 from './verse14.json';
import _j6 from './verse15.json';
import _j7 from './verse16.json';
import _j8 from './verse17.json';
import _j9 from './verse18.json';
import _j10 from './verse19.json';
import _j11 from './verse2.json';
import _j12 from './verse20.json';
import _j13 from './verse21.json';
import _j14 from './verse22.json';
import _j15 from './verse23.json';
import _j16 from './verse24.json';
import _j17 from './verse25.json';
import _j18 from './verse26.json';
import _j19 from './verse27.json';
import _j20 from './verse28.json';
import _j21 from './verse29.json';
import _j22 from './verse3.json';
import _j23 from './verse30.json';
import _j24 from './verse31.json';
import _j25 from './verse32.json';
import _j26 from './verse33.json';
import _j27 from './verse34.json';
import _j28 from './verse35.json';
import _j29 from './verse36.json';
import _j30 from './verse37.json';
import _j31 from './verse38.json';
import _j32 from './verse39.json';
import _j33 from './verse4.json';
import _j34 from './verse40.json';
import _j35 from './verse41.json';
import _j36 from './verse42.json';
import _j37 from './verse43.json';
import _j38 from './verse5.json';
import _j39 from './verse6.json';
import _j40 from './verse7.json';
import _j41 from './verse8.json';
import _j42 from './verse9.json';



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
const merged = ([_j0, _j1, _j2, _j3, _j4, _j5, _j6, _j7, _j8, _j9, _j10, _j11, _j12, _j13, _j14, _j15, _j16, _j17, _j18, _j19, _j20, _j21, _j22, _j23, _j24, _j25, _j26, _j27, _j28, _j29, _j30, _j31, _j32, _j33, _j34, _j35, _j36, _j37, _j38, _j39, _j40, _j41, _j42] as any[]).reduce((acc: any, cur: any) => deepMerge(acc, cur || {}), base as any);
export default merged;