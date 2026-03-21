// @ts-nocheck
// Auto-generated index for folder 'fr\itihasa\ramayana\itihasa\ramayana\bala\kanda'
// Imports local JSON files and child folder indexes, deep-merging them into one export.

import _j0 from './sarga1.json';
import _j1 from './sarga10.json';
import _j2 from './sarga11.json';
import _j3 from './sarga12.json';
import _j4 from './sarga13.json';
import _j5 from './sarga14.json';
import _j6 from './sarga15.json';
import _j7 from './sarga16.json';
import _j8 from './sarga17.json';
import _j9 from './sarga18.json';
import _j10 from './sarga19.json';
import _j11 from './sarga2.json';
import _j12 from './sarga20.json';
import _j13 from './sarga21.json';
import _j14 from './sarga22.json';
import _j15 from './sarga23.json';
import _j16 from './sarga24.json';
import _j17 from './sarga25.json';
import _j18 from './sarga26.json';
import _j19 from './sarga27.json';
import _j20 from './sarga28.json';
import _j21 from './sarga29.json';
import _j22 from './sarga3.json';
import _j23 from './sarga30.json';
import _j24 from './sarga31.json';
import _j25 from './sarga32.json';
import _j26 from './sarga33.json';
import _j27 from './sarga34.json';
import _j28 from './sarga35.json';
import _j29 from './sarga36.json';
import _j30 from './sarga37.json';
import _j31 from './sarga38.json';
import _j32 from './sarga39.json';
import _j33 from './sarga4.json';
import _j34 from './sarga40.json';
import _j35 from './sarga41.json';
import _j36 from './sarga42.json';
import _j37 from './sarga43.json';
import _j38 from './sarga44.json';
import _j39 from './sarga45.json';
import _j40 from './sarga46.json';
import _j41 from './sarga47.json';
import _j42 from './sarga48.json';
import _j43 from './sarga49.json';
import _j44 from './sarga5.json';
import _j45 from './sarga50.json';
import _j46 from './sarga51.json';
import _j47 from './sarga52.json';
import _j48 from './sarga53.json';
import _j49 from './sarga54.json';
import _j50 from './sarga55.json';
import _j51 from './sarga56.json';
import _j52 from './sarga57.json';
import _j53 from './sarga58.json';
import _j54 from './sarga59.json';
import _j55 from './sarga6.json';
import _j56 from './sarga60.json';
import _j57 from './sarga61.json';
import _j58 from './sarga62.json';
import _j59 from './sarga63.json';
import _j60 from './sarga64.json';
import _j61 from './sarga65.json';
import _j62 from './sarga66.json';
import _j63 from './sarga67.json';
import _j64 from './sarga68.json';
import _j65 from './sarga69.json';
import _j66 from './sarga7.json';
import _j67 from './sarga70.json';
import _j68 from './sarga71.json';
import _j69 from './sarga72.json';
import _j70 from './sarga73.json';
import _j71 from './sarga74.json';
import _j72 from './sarga75.json';
import _j73 from './sarga76.json';
import _j74 from './sarga77.json';
import _j75 from './sarga78.json';
import _j76 from './sarga79.json';
import _j77 from './sarga8.json';
import _j78 from './sarga80.json';
import _j79 from './sarga9.json';



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
const merged = ([_j0, _j1, _j2, _j3, _j4, _j5, _j6, _j7, _j8, _j9, _j10, _j11, _j12, _j13, _j14, _j15, _j16, _j17, _j18, _j19, _j20, _j21, _j22, _j23, _j24, _j25, _j26, _j27, _j28, _j29, _j30, _j31, _j32, _j33, _j34, _j35, _j36, _j37, _j38, _j39, _j40, _j41, _j42, _j43, _j44, _j45, _j46, _j47, _j48, _j49, _j50, _j51, _j52, _j53, _j54, _j55, _j56, _j57, _j58, _j59, _j60, _j61, _j62, _j63, _j64, _j65, _j66, _j67, _j68, _j69, _j70, _j71, _j72, _j73, _j74, _j75, _j76, _j77, _j78, _j79] as any[]).reduce((acc: any, cur: any) => deepMerge(acc, cur || {}), base as any);
export default merged;