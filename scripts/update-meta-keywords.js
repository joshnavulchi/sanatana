const fs = require('fs').promises;
const path = require('path');

const localesDir = path.join(__dirname, '..', 'locales');
const argv = process.argv.slice(2);
const targetPathArg = argv.find(a => !a.startsWith('-'));
const dryRun = argv.includes('--dry-run') || argv.includes('-n');

async function findJsonFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await findJsonFiles(full)));
    else if (e.isFile() && e.name.endsWith('.json')) files.push(full);
  }
  return files;
}

function humanizeFilename(filePath) {
  const name = path.basename(filePath, '.json');
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function extractTopicsFromJson(json, file) {
  const topics = new Set();

  function fromDescription(desc) {
    if (!desc || typeof desc !== 'string') return [];
    // simple extractor: split into sentences, then produce 1-3 word nouny n-grams,
    // score by frequency and length, return ordered list
    const text = desc.replace(/\s+/g, ' ').trim();
    const stop = new Set(['the','of','and','in','on','for','to','with','from','by','a','an','is','are','that','this','these','those','as','its','it','we','or','also']);
    const bannedVerbs = ['include','provide','present','offer','explore','focus','serve','publish','collect','preserve','create','support','help','encourage','aim','recognize','use','presenting','offer'];

    const sentences = text.split(/[\.\?\!\n]/).map(s => s.trim()).filter(Boolean);
    const counts = new Map();
    for (const s of sentences) {
      const cleaned = s.replace(/[^\p{L}\p{N}\s'-]/gu, ' ').replace(/\s+/g, ' ').trim();
      const tokens = cleaned.split(/\s+/).filter(Boolean);
      if (tokens.length === 0) continue;
      // generate n-grams 1..4 (more permissive)
      for (let n = 1; n <= 4; n++) {
        for (let i = 0; i + n <= tokens.length; i++) {
          const ng = tokens.slice(i, i + n).join(' ').trim();
          const low = ng.toLowerCase();
          if (low.length < 3 || low.length > 40) continue;
          // be more permissive: only skip if a banned verb is the first token
          if (bannedVerbs.some(v => low.split(' ')[0] === v)) continue;
          // drop if many stopwords
          const words = low.split(/\s+/).filter(Boolean);
          const nonStop = words.filter(w => !stop.has(w));
          if (nonStop.length === 0) continue;
          // compact form
          const form = words.join(' ');
          counts.set(form, (counts.get(form) || 0) + 1 + (words.length - 1) * 0.5);
        }
      }
    }

    // sort by score then by length (prefer multi-word)
    const items = Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || b[0].split(/\s+/).length - a[0].split(/\s+/).length);
    return items.map(i => i[0]);
  }

  // prefer meta.description if present
  try {
    if (json && json.meta && typeof json.meta.description === 'string' && json.meta.description.trim()) {
      const tlist = fromDescription(json.meta.description);
      for (const t of tlist) topics.add(t);
    }
  } catch (e) {}

  // if no topics from description, fall back to scanning the JSON body (titles, intros)
  if (topics.size === 0) {
    try {
      if (json && json.meta && typeof json.meta.title === 'string') {
        topics.add(json.meta.title.split('|')[0].split('—')[0].split('-')[0].trim());
      }
    } catch (e) {}

    function walk(obj, parentKey) {
      if (!obj) return;
      if (typeof obj === 'string') {
        const tlist = fromDescription(obj);
        for (const t of tlist) topics.add(t);
        return;
      }
      if (Array.isArray(obj)) return obj.forEach(i => walk(i, parentKey));
      if (typeof obj === 'object') {
        for (const [k, v] of Object.entries(obj)) {
          const lk = k.toLowerCase();
          if (parentKey === 'meta' && lk === 'keywords') continue;
          if (['title', 'name', 'heading', 'intro', 'description', 'summary', 'longdescription'].includes(lk)) {
            const tlist = fromDescription(v);
            for (const t of tlist) topics.add(t);
          } else {
            walk(v, k);
          }
        }
      }
    }
    walk(json, null);
  }

  // add some explicit domain keywords if present
  try {
    const clone = JSON.parse(JSON.stringify(json));
    function removeKeywords(o) { if (!o || typeof o !== 'object') return; if (Array.isArray(o)) return o.forEach(removeKeywords); for (const k of Object.keys(o)) { if (k.toLowerCase() === 'keywords') delete o[k]; else removeKeywords(o[k]); } }
    removeKeywords(clone);
    const rawText = JSON.stringify(clone).toLowerCase();
    const domainKeywords = ['sanatana dharma','sanātana dharma','sanatana','hinduism','vedas','upanishads','bhagavad gita','yoga','meditation','karma','puranas','mantra'];
    for (const k of domainKeywords) if (rawText.includes(k)) topics.add(k.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
  } catch (e) {}

  if (topics.size === 0) topics.add(humanizeFilename(file));
  return Array.from(topics);
}

function generateKeywordsFromTopics(topics, limit = 20) {
  // simple, short templates
    const templates = ['What is {t}?','Why {t}?','How to learn {t}?','{t} explained'];

  function normalizeText(s) {
    return s
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/["'`·••]/g, '')
      .replace(/[\-–—]/g, ' ')
      .replace(/[^\p{L}\p{N}\s\?]/gu, '')
      .trim();
  }

  function cleanTopic(t) {
    let s = t.replace(/\s+/g, ' ').trim();
    // remove common leading noise words/phrases
    s = s.replace(/^(what is|what does|definition of|history of|significance of|preservation means|preservation of|through several|contribute translations and commentary|ethical considerations shape our approach)\b\s*/i, '');
    // remove trailing generic words
    s = s.replace(/\b(overview|meaning|definition|history|summary|guide|intro|about|timeline|explained for students|for beginners)\b\.?$/i, '').trim();
    // remove stray leading prepositions/articles
    s = s.replace(/^(of|the|a|an)\s+/i, '');
    // collapse duplicated adjacent words e.g., "Significance of Significance of X"
    s = s.replace(/\b([a-zA-Z]+)\b\s+\1\b/gi, '$1');
    // trim punctuation
    s = s.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '').trim();
    // aggressively cut off common trailing clauses starting with prepositions/phrases
    s = s.replace(/\b(with|at|by|from|across|spanning|span|created|including|through|throughout|involving|in|on|that|which|who|for|of|involving|regarding)\b.*$/i, '').trim();
    // split at common verbs to keep the noun phrase before the verb
    const verbs = ['is','are','created','shape','shaped','means','include','present','offer','explore','focus','serve','publish','collect','preserve','create','support','help','encourage','aim','recognize','use','presenting','strengthen','illuminate','cover','provide','approach','connect'];
    const splitRx = new RegExp('\\b(' + verbs.join('|') + ')\\b','i');
    s = s.split(splitRx)[0].trim();
    // final cleanup
    s = s.replace(/[^\p{L}\p{N}\s'-]/gu, '').replace(/\s+/g, ' ').trim();
    if (!s || s.length < 3) return t.replace(/\s+/g, ' ').trim();
    // ensure topic is short: take upto first 4 words
    const parts = s.split(/\s+/).filter(Boolean);
    if (parts.length > 4) s = parts.slice(0,4).join(' ');
    return s;
  }

  const out = [];
  const seenNorms = [];
  const seenBases = new Set();

  // prefer multi-word topics first
  const sorted = topics.slice().sort((a, b) => b.split(/\s+/).length - a.split(/\s+/).length || b.length - a.length);

  function jaccard(a, b) {
    const sa = new Set(a.split(/\s+/));
    const sb = new Set(b.split(/\s+/));
    const inter = [...sa].filter(x => sb.has(x)).length;
    const union = new Set([...sa, ...sb]).size;
    return union === 0 ? 0 : inter / union;
  }

  for (const rawTopic of sorted) {
    const topic = cleanTopic(rawTopic);
    if (!topic || topic.length < 3) continue;
    // ensure topic is short (<=4 words)
    const tw = topic.split(/\s+/).filter(Boolean);
    if (tw.length > 4) continue;
    for (const temp of templates) {
      if (out.length >= limit) break;
      // limit how many templates we emit per topic base
      const baseNorm = normalizeText(topic);
      if (seenBases.has(baseNorm) && seenBases.size >= topics.length) {
        // allow at least one topic per base, but skip if this base already emitted and we have many topics
      }

      const candidate = temp.replace('{t}', topic).trim();
      const norm = normalizeText(candidate);
      // skip identical or very similar entries
      if (seenNorms.some(s => s === norm)) continue;
      if (seenNorms.some(s => jaccard(s, norm) > 0.65)) continue;
      // skip if candidate equals topic or is too short
      if (norm === normalizeText(topic)) continue;
      const words = norm.split(/\s+/).filter(Boolean);
      if (words.length === 1 && words[0].length < 5) continue;
      // skip if candidate is substring of existing candidate (or vice versa)
      if (seenNorms.some(s => s.includes(norm) || norm.includes(s))) continue;

      seenNorms.push(norm);
      seenBases.add(baseNorm);
      out.push(candidate);
    }
    if (out.length >= limit) break;
  }

  return out;
}

// New: generate keywords primarily from meta.description
function extractNgramsFromText(text, maxN = 3) {
  if (!text || typeof text !== 'string') return [];
  const stop = new Set(['the','of','and','in','on','for','to','with','from','by','a','an','is','are','that','this','these','those','as','its','it','we','or','also','be','was','were','this','these']);
  const bannedCandidates = new Set(['about','overview','page','home','index','introduction','intro','section','content','topic','topics']);
  const bannedStarts = new Set(['include','provide','present','offer','explore','focus','serve','publish','collect','preserve','create','support','help','encourage','aim','recognize','use','presenting','offer','discuss','describe']);
  const cleanedText = text.replace(/[\r\n]+/g, '. ').replace(/<[^>]*>/g, ' ').replace(/[“”",]/g, ' ').replace(/[?;:()\[\]{}]/g, ' ').replace(/\s+/g, ' ').trim();
  const sentences = cleanedText.split(/\.|\?|!/).map(s => s.trim()).filter(Boolean);
  const counts = new Map();
  for (const s of sentences) {
    let tokens = s.replace(/[^\p{L}\p{N}\s'-]/gu, ' ').split(/\s+/).filter(Boolean);
    tokens = tokens.filter(t => t !== '-' && t !== '_' && t !== '—' && t !== '–');
    if (tokens.length === 0) continue;
    for (let n = 1; n <= Math.min(maxN, tokens.length); n++) {
      for (let i = 0; i + n <= tokens.length; i++) {
        const ng = tokens.slice(i, i + n).join(' ').trim();
        const low = ng.toLowerCase();
        if (low.length < 2 || low.length > 40) continue;
        // skip ngrams that start with a banned verb
        const first = low.split(/\s+/)[0];
        if (bannedStarts.has(first)) continue;
        const words = low.split(/\s+/).filter(Boolean);
        const nonStop = words.filter(w => !stop.has(w));
        if (nonStop.length === 0) continue;
        // skip if the ngram is purely a banned candidate or consists of banned tokens
        if (words.length === 1 && bannedCandidates.has(words[0])) continue;
        if (words.every(w => stop.has(w) || bannedCandidates.has(w) || w.length < 3)) continue;
        const key = words.join(' ');
        counts.set(key, (counts.get(key) || 0) + 1 + (words.length - 1) * 0.3);
      }
    }
  }
  return Array.from(counts.entries()).sort((a,b) => b[1]-a[1]).map(i => i[0]);
}

function generateKeywordsFromDescription(description, json, limit = 20) {
  const candidates = extractNgramsFromText(description, 3);
  const out = [];
  const seen = new Set();
  const templates = ['What is {t}?','Why {t}?','How to learn {t}?','{t} explained'];
  const bannedCandidates = new Set(['about','overview','page','home','index','introduction','intro','section','content','topic','topics']);

  function normalize(s){ return s.toLowerCase().replace(/[^\p{L}\p{N}\s\?]/gu,'').replace(/\s+/g,' ').trim(); }

  for (const c of candidates) {
    if (out.length >= limit) break;
    const clean = c.replace(/\s+/g,' ').trim();
    if (clean.length < 2) continue;
    // normalize and strip leading noise like 'about'
    let cleanedTopic = clean.replace(/^about\s+/i, '');
    cleanedTopic = cleanedTopic.replace(/^[-–—_\s]+|[-–—_\s]+$/g, '').trim();
    cleanedTopic = cleanedTopic.replace(/[-–—_]+/g, ' ').replace(/\s+/g,' ').trim();
    if (!cleanedTopic) continue;
    const lowBase = cleanedTopic.toLowerCase().replace(/[^\w\s]/g,'').trim();
    if (bannedCandidates.has(lowBase)) continue;
    if (lowBase.split(/\s+/).length === 1 && lowBase.length < 4) continue;
    for (const t of templates) {
      if (out.length >= limit) break;
      const cand = t.replace('{t}', cleanedTopic);
      const n = normalize(cand);
      if (seen.has(n)) continue;
      // avoid cand equal to just the topic
      if (n === normalize(clean)) continue;
      seen.add(n);
      out.push(cand);
    }
  }

  // supplement from structured fields if not enough
  if (out.length < limit) {
    const extras = [];
    try {
      if (json) {
        if (json.title) extras.push(json.title);
        if (json.sections && Array.isArray(json.sections)) extras.push(...json.sections.map(s => s.title).filter(Boolean));
        if (json.faq && Array.isArray(json.faq.items)) extras.push(...json.faq.items.map(i => i.q).filter(Boolean));
        if (json.bullets && Array.isArray(json.bullets)) extras.push(...json.bullets.map(b => typeof b === 'string' ? b : '').filter(Boolean));
      }
    } catch(e){}
    for (const e of extras) {
      if (out.length >= limit) break;
      const c = (''+e).replace(/\s+/g,' ').trim();
      if (!c) continue;
      let cleanedTopic = c.replace(/^about\s+/i, '');
      cleanedTopic = cleanedTopic.replace(/^[-–—_\s]+|[-–—_\s]+$/g, '').trim();
      cleanedTopic = cleanedTopic.replace(/[-–—_]+/g, ' ').replace(/\s+/g,' ').trim();
      if (!cleanedTopic) continue;
      const lowBase = cleanedTopic.toLowerCase().replace(/[^\w\s]/g,'').trim();
      if (bannedCandidates.has(lowBase)) continue;
      for (const t of templates) {
        if (out.length >= limit) break;
        const cand = t.replace('{t}', cleanedTopic);
        const n = normalize(cand);
        if (seen.has(n)) continue;
        seen.add(n);
        out.push(cand);
      }
    }
  }

  // final fallback: domain keywords
  if (out.length < limit) {
    const domain = ['Sanatana Dharma','Vedas','Bhagavad Gita','Hinduism','Yoga'];
    for (const d of domain) {
      if (out.length >= limit) break;
      const cand = `What is ${d}?`;
      const n = normalize(cand);
      if (seen.has(n)) continue;
      seen.add(n);
      out.push(cand);
    }
  }

  return out.slice(0, limit);
}

async function backupFile(file) {
  const bak = file + '.bak';
  try {
    await fs.copyFile(file, bak);
  } catch (e) {
    // ignore
  }
}

async function processFile(file) {
  try {
    const raw = await fs.readFile(file, 'utf8');
    const json = JSON.parse(raw);
    let updated = false;
    let lastGeneratedKeywords = null;

    function pickTitleFromMeta(meta, parentObj, parentKey) {
      if (meta && typeof meta.title === 'string' && meta.title.trim()) {
        return meta.title.split('|')[0].trim();
      }
      if (parentObj && typeof parentObj.title === 'string' && parentObj.title.trim()) return parentObj.title;
      if (parentObj && typeof parentObj.name === 'string' && parentObj.name.trim()) return parentObj.name;
      if (parentObj && typeof parentObj.heading === 'string' && parentObj.heading.trim()) return parentObj.heading;
      if (parentKey) return humanizeFilename(parentKey + '.json');
      return humanizeFilename(file);
    }

    function walk(obj, parentKey) {
      if (!obj || typeof obj !== 'object') return;
      if (Array.isArray(obj)) {
        for (const item of obj) walk(item, parentKey);
        return;
      }
      for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (key === 'meta' && val && typeof val === 'object') {
          // prefer meta.description for keyword generation
          let keywords = [];
          try {
            if (val.description && typeof val.description === 'string' && val.description.trim()) {
              keywords = generateKeywordsFromDescription(val.description, json, 20);
            }
          } catch (e) { keywords = []; }
          // if not enough from description, supplement with topic-based generator
          if (!keywords || keywords.length < 20) {
            const topics = extractTopicsFromJson(json, file);
            const more = generateKeywordsFromTopics(topics, 40);
            // merge unique
            const seen = new Set((keywords || []).map(k => k.toLowerCase().replace(/[^\w\s]/g,'')));
            for (const m of more) {
              if ((keywords || []).length >= 20) break;
              const n = m.toLowerCase().replace(/[^\w\s]/g,'');
              if (seen.has(n)) continue;
              seen.add(n);
              (keywords || []).push(m);
            }
          }
          val.keywords = (keywords || []).slice(0,20);
          lastGeneratedKeywords = val.keywords;
          updated = true;
        } else if (val && typeof val === 'object') {
          walk(val, key);
        }
      }
    }

    walk(json, null);

    if (updated) {
      if (dryRun) {
        console.log('--- DRY RUN (no write) ---', file);
        console.log(JSON.stringify({ file, keywords: lastGeneratedKeywords }, null, 2));
      } else {
        await backupFile(file);
        await fs.writeFile(file, JSON.stringify(json, null, 2) + '\n', 'utf8');
        console.log('Updated:', file);
      }
    }
  } catch (err) {
    console.error('Failed:', file, err.message);
  }
}

(async () => {
  if (targetPathArg) {
    const p = path.isAbsolute(targetPathArg) ? targetPathArg : path.join(process.cwd(), targetPathArg);
    try {
      const stat = await fs.stat(p);
      if (stat.isFile()) {
        await processFile(p);
      } else {
        console.error('Target is not a file:', p);
      }
    } catch (e) {
      console.error('Target file not found:', p);
    }
  } else {
    const files = await findJsonFiles(localesDir);
    for (const f of files) await processFile(f);
  }
  console.log('Done.');
})();
