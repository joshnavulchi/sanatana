// @ts-nocheck
// Auto-generated index for folder 'ru'
// Imports local JSON files and child folder indexes, deep-merging them into one export.

import _j0 from './about.json';
import _j1 from './contact.json';
import _j2 from './cookies-policy.json';
import _j3 from './donate.json';
import _j4 from './home.json';
import _j5 from './itihasa.json';
import _j6 from './privacy_policy.json';
import _j7 from './puranas.json';
import _j8 from './sanatanadharma.json';
import _j9 from './sanksheparamayana.json';
import _j10 from './sharable_strings.json';
import _j11 from './strategies.json';
import _j12 from './terms_of_service.json';
import _j13 from './upanishads.json';
import _j14 from './vedas.json';
import _j15 from './vedas_structure.json';
import _j16 from './vedic_philosophy.json';
import _d0 from './explore/index';
import _d1 from './itihasa/index';
import _d2 from './puranas/index';
import _d3 from './upanishads/index';
import _d4 from './vedas/index';
import _d5 from './vedic-philosophy/index';
import _d6 from './vedic-science/index';



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
const merged = ([_j0, _j1, _j2, _j3, _j4, _j5, _j6, _j7, _j8, _j9, _j10, _j11, _j12, _j13, _j14, _j15, _j16, _d0, _d1, _d2, _d3, _d4, _d5, _d6] as any[]).reduce((acc: any, cur: any) => deepMerge(acc, cur || {}), base as any);
export default merged;