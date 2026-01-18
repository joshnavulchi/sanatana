// Auto-generated index for locale 'ta'
// Imports JSON files in this folder and deep-merges them into one export.
import _0 from './about.json';
import _1 from './contact.json';
import _2 from './contactForm.json';
import _3 from './cookieConsent.json';
import _4 from './cookiepolicy.json';
import _5 from './donate.json';
import _6 from './footer.json';
import _7 from './home.json';
import _8 from './krishna-fivekarmas-explained.json';
import _9 from './nav.json';
import _10 from './privacy.json';
import _11 from './site_title.json';
import _12 from './terms.json';

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
const merged = [_0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12].reduce((acc, cur) => deepMerge(acc, cur || {}), base);

export default merged;
