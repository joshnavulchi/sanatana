// Auto-generated index for locale 'en'
// Imports JSON files in this folder and deep-merges them into one export.
import _0 from './about.json';
import _1 from './contact.json';
import _2 from './cookies-policy.json';
import _3 from './donate.json';
import _4 from './festivals.json';
import _5 from './home.json';
import _6 from './itihasa.json';
import _7 from './philosophy.json';
import _8 from './philosophy_advaita.json';
import _9 from './philosophy_dharma.json';
import _10 from './philosophy_karma.json';
import _11 from './philosophy_moksha.json';
import _12 from './philosophy_purushartha.json';
import _13 from './philosophy_samsara.json';
import _14 from './privacy_policy.json';
import _15 from './puranas_garuda.json';
import _16 from './puranas_karma.json';
import _17 from './purans.json';
import _18 from './sanskrit_concepts.json';
import _19 from './sharable_strings.json';
import _20 from './terms_of_service.json';
import _21 from './upanishads.json';
import _22 from './vedas.json';
import _23 from './vedas_atharvaveda.json';
import _24 from './vedas_rigveda.json';
import _25 from './vedas_rigveda_madala1.json';
import _26 from './vedas_rigveda_madala2.json';
import _27 from './vedas_rigveda_madala3.json';
import _28 from './vedas_rigveda_madala4.json';
import _29 from './vedas_rigveda_madala5.json';
import _30 from './vedas_rigveda_madala6.json';
import _31 from './vedas_rigveda_madala7.json';
import _32 from './vedas_rigveda_madala8.json';
import _33 from './vedas_rigveda_madala9.json';
import _34 from './vedas_rigveda_madala10.json';
import _35 from './vedas_samaveda.json';
import _36 from './vedas_yajurveda.json';
import _37 from './vedic_gods.json';
import _38 from './vedic_philosophy.json';

function deepMerge(target: any, source: any) {
  if (source === undefined) return target;
  if (Array.isArray(target) && Array.isArray(source)) {
    const out = target.slice();
    for (let i = 0; i < source.length; i++) out[i] = deepMerge(out[i], source[i]);
    return out;
  }
  if (target && typeof target === 'object' && source && typeof source === 'object') {
    const out = { ...target };
    for (const k of Object.keys(source)) out[k] = deepMerge(target[k], source[k]);
    return out;
  }
  return source;
}

const base = {};
const merged = [_0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38].reduce((acc, cur) => deepMerge(acc, cur || {}), base);

export default merged;
