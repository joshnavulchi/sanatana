// Auto-generated index for locale 'en'
// Imports JSON files in this folder and deep-merges them into one export.
import _0 from './about.json';
import _1 from './adisankara_story.json';
import _2 from './advaita_philosophy.json';
import _3 from './banner_notifications.json';
import _4 from './banner_notifications2.json';
import _5 from './bhagavadgita_scriptures.json';
import _6 from './bhishma_story.json';
import _7 from './bramha_story.json';
import _8 from './comics_kidszone.json';
import _9 from './contact.json';
import _10 from './contactForm.json';
import _11 from './cookieConsent.json';
import _12 from './cookiepolicy.json';
import _13 from './cosmictime.json';
import _14 from './dailypoojas_practices.json';
import _15 from './dailyprayers_stotras.json';
import _16 from './devi_stotras.json';
import _17 from './dharma_philosophy.json';
import _18 from './donate.json';
import _19 from './easymantras_kidszone.json';
import _20 from './festival_practices.json';
import _21 from './footer.json';
import _22 from './ganesh_stotras.json';
import _23 from './hanuman_stotras.json';
import _24 from './home.json';
import _25 from './horoscope.json';
import _26 from './illustrated_stories.json';
import _27 from './karma_philosophy.json';
import _28 from './karna_story.json';
import _29 from './kidszone.json';
import _30 from './krishna-fivekarmas-explained.json';
import _31 from './krishna_story.json';
import _32 from './lakshmi_story.json';
import _33 from './languageDropdown.json';
import _34 from './mahabharata_scriptures.json';
import _35 from './mayaAvidya_philosophy.json';
import _36 from './moksha_philosophy.json';
import _37 from './mythological_quizzes.json';
import _38 from './nav.json';
import _39 from './parashurama_story.json';
import _40 from './parvathi_story.json';
import _41 from './philosophy.json';
import _42 from './policies.json';
import _43 from './practices.json';
import _44 from './privacy.json';
import _45 from './privacy_policy.json';
import _46 from './puranas_scriptures.json';
import _47 from './puranic_story.json';
import _48 from './purushartha_philosophy.json';
import _49 from './questions.json';
import _50 from './quiz.json';
import _51 from './ramanamaharshi_story.json';
import _52 from './ramayana_scriptures.json';
import _53 from './rituals_practices.json';
import _54 from './samsara_philosophy.json';
import _55 from './sanatanadharma.json';
import _56 from './sankshepa_ramayana_scriptures.json';
import _57 from './saraswathi_story.json';
import _58 from './scriptures.json';
import _59 from './shiva_story.json';
import _60 from './shiva_stotras.json';
import _61 from './site_title.json';
import _62 from './slugPage.json';
import _63 from './stories.json';
import _64 from './stotrasmantras.json';
import _65 from './terms.json';
import _66 from './timeline.json';
import _67 from './upanishads_scriptures.json';
import _68 from './vasista_story.json';
import _69 from './vastu_practices.json';
import _70 from './vedasPage1.json';
import _71 from './vedas_scriptures.json';
import _72 from './vishnu_story.json';
import _73 from './vishnu_stotras.json';
import _74 from './vishwamitra_story.json';
import _75 from './yoga_philosophy.json';

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
const merged = [_0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75].reduce((acc, cur) => deepMerge(acc, cur || {}), base);

export default merged;
