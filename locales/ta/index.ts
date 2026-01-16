// Auto-generated index for locale 'ta'
// Imports JSON files in this folder and deep-merges them into one export.
import _0 from './about.json';
import _1 from './footer.json';
import _2 from './home.json';
import _3 from './nav.json';
import _4 from './privacy.json';
import _5 from './terms.json';

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
const merged = [_0, _1, _2, _3, _4, _5].reduce((acc, cur) => deepMerge(acc, cur || {}), base);

export default merged;
