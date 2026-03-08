// Auto-generated index for locale 'en'
// Imports JSON files in this folder and deep-merges them into one export.
import _0 from './about.json';
import _1 from './contact.json';
import _2 from './cookies-policy.json';
import _3 from './cosmictime.json';
import _4 from './diseases_curing_temples.json';
import _5 from './donate.json';
import _6 from './drip_irrigation_process.json';
import _7 from './earth.json';
import _8 from './historical_timeline.json';
import _9 from './home.json';
import _10 from './horoscope.json';
import _11 from './humans.json';
import _12 from './indian_constitute.json';
import _13 from './jyotirlings.json';
import _14 from './kidszone.json';
import _15 from './kidszone_easymantras.json';
import _16 from './kidszone_illustratedstories.json';
import _17 from './kidszone_mythologicalquizzes.json';
import _18 from './kidszone_mythologycomics.json';
import _19 from './philosophy.json';
import _20 from './philosophy_advaita.json';
import _21 from './philosophy_dharma.json';
import _22 from './philosophy_karma.json';
import _23 from './philosophy_moksha.json';
import _24 from './philosophy_purushartha.json';
import _25 from './philosophy_samsara.json';
import _26 from './practices_dailypoojas.json';
import _27 from './practices_festivals.json';
import _28 from './practices_rituals.json';
import _29 from './practices_vastu.json';
import _30 from './practices_yoga.json';
import _31 from './privacy_policy.json';
import _32 from './puranas_garuda.json';
import _33 from './puranas_karma.json';
import _34 from './purans.json';
import _35 from './questions.json';
import _36 from './quiz.json';
import _37 from './religion_conversion.json';
import _38 from './rivers_connecting.json';
import _39 from './sanatanadharma.json';
import _40 from './scriptures.json';
import _41 from './scriptures_bhagavadgita.json';
import _42 from './scriptures_mahabharata.json';
import _43 from './scriptures_puranas.json';
import _44 from './scriptures_ramayana.json';
import _45 from './scriptures_sanksheparamayana.json';
import _46 from './scriptures_upanishads.json';
import _47 from './scriptures_vedas.json';
import _48 from './shakti_peethas.json';
import _49 from './sharable_strings.json';
import _50 from './solar.json';
import _51 from './stories.json';
import _52 from './stories_adishankaracharya.json';
import _53 from './stories_bhishma.json';
import _54 from './stories_bramha.json';
import _55 from './stories_karna.json';
import _56 from './stories_krishna.json';
import _57 from './stories_lakshmi.json';
import _58 from './stories_parashurama.json';
import _59 from './stories_parvathi.json';
import _60 from './stories_puranic.json';
import _61 from './stories_ramanamaharshi.json';
import _62 from './stories_saraswathi.json';
import _63 from './stories_shiva.json';
import _64 from './stories_vasistamaharshi.json';
import _65 from './stories_vishnu.json';
import _66 from './stories_vishwamitra.json';
import _67 from './stotrasmantras.json';
import _68 from './stotrasmantras_dailyprayers.json';
import _69 from './stotrasmantras_devi.json';
import _70 from './stotrasmantras_ganesh.json';
import _71 from './stotrasmantras_hanuman.json';
import _72 from './stotrasmantras_shiva.json';
import _73 from './stotrasmantras_vishnu.json';
import _74 from './temples_destroyed.json';
import _75 from './temples_in_india.json';
import _76 from './terms_of_service.json';
import _77 from './upanishads.json';
import _78 from './usa_strategies.json';
import _79 from './vedas.json';
import _80 from './world_transformation.json';

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
const merged = [_0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80].reduce((acc, cur) => deepMerge(acc, cur || {}), base);

export default merged;
