// @ts-nocheck
// Auto-generated index for folder 'en\explore'
// Imports local JSON files and child folder indexes, deep-merging them into one export.
import _j0 from './cosmictime.json';
import _j1 from './diseases_curing_temples.json';
import _j2 from './drip_irrigation_process.json';
import _j3 from './earth.json';
import _j4 from './festivals.json';
import _j5 from './historical_timeline.json';
import _j6 from './horoscope.json';
import _j7 from './humans.json';
import _j8 from './jyotirlings.json';
import _j9 from './kidszone.json';
import _j10 from './mythological_quizzes.json';
import _j11 from './nadi_sasram.json';
import _j12 from './questions.json';
import _j13 from './quiz.json';
import _j14 from './religion_conversion.json';
import _j15 from './rivers_connecting.json';
import _j16 from './sanatanadharma.json';
import _j17 from './sanskrit_concepts.json';
import _j18 from './scriptures.json';
import _j19 from './shakti_peethas.json';
import _j20 from './solar.json';
import _j21 from './stories.json';
import _j22 from './stotrasmantras.json';
import _j23 from './vedic_gods.json';
import _j24 from './world_transformation.json';
import _d0 from './bharath/index';
import _d1 from './kidszone/index';
import _d2 from './practices/index';
import _d3 from './scriptures/index';
import _d4 from './stories/index';
import _d5 from './stotrasmantras/index';

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
const merged = ([_j0, _j1, _j2, _j3, _j4, _j5, _j6, _j7, _j8, _j9, _j10, _j11, _j12, _j13, _j14, _j15, _j16, _j17, _j18, _j19, _j20, _j21, _j22, _j23, _j24, _d0, _d1, _d2, _d3, _d4, _d5] as any[]).reduce((acc: any, cur: any) => deepMerge(acc, cur || {}), base as any);
export default merged;
