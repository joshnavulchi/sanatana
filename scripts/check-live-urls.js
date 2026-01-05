#!/usr/bin/env node
const fs = require('fs');
const urls = [
"https://sanatanadharmam.in/contact",
"https://sanatanadharmam.in/donate",
"https://sanatanadharmam.in/kidsZone",
"https://sanatanadharmam.in/kidsZone/comics",
"https://sanatanadharmam.in/kidsZone/easymantras",
"https://sanatanadharmam.in/kidsZone/illustratedStories",
"https://sanatanadharmam.in/kidsZone/mythologicalquizzes",
"https://sanatanadharmam.in/philosophy",
"https://sanatanadharmam.in/philosophy/advaita",
"https://sanatanadharmam.in/philosophy/dharma",
"https://sanatanadharmam.in/philosophy/karma",
"https://sanatanadharmam.in/philosophy/moksha",
"https://sanatanadharmam.in/philosophy/samsara",
"https://sanatanadharmam.in/philosophy/yoga",
"https://sanatanadharmam.in/practices",
"https://sanatanadharmam.in/practices/dailypuja",
"https://sanatanadharmam.in/practices/festivals",
"https://sanatanadharmam.in/practices/rituals",
"https://sanatanadharmam.in/practices/vastu",
"https://sanatanadharmam.in/privacy-policy",
"https://sanatanadharmam.in/scriptures",
"https://sanatanadharmam.in/scriptures/gita",
"https://sanatanadharmam.in/scriptures/mahabharata",
"https://sanatanadharmam.in/scriptures/puranas",
"https://sanatanadharmam.in/scriptures/ramayana",
"https://sanatanadharmam.in/scriptures/sanksheparamayanam",
"https://sanatanadharmam.in/scriptures/upanishads",
"https://sanatanadharmam.in/scriptures/vedas",
"https://sanatanadharmam.in/stories",
"https://sanatanadharmam.in/stories/adishankar",
"https://sanatanadharmam.in/stories/bhishma",
"https://sanatanadharmam.in/stories/bramha",
"https://sanatanadharmam.in/stories/karna",
"https://sanatanadharmam.in/stories/krishna",
"https://sanatanadharmam.in/stories/lakshmi",
"https://sanatanadharmam.in/stories/moralstories",
"https://sanatanadharmam.in/stories/parasuram",
"https://sanatanadharmam.in/stories/parvati",
"https://sanatanadharmam.in/stories/puranic",
"https://sanatanadharmam.in/stories/ramanamaharshi",
"https://sanatanadharmam.in/stories/saraswati",
"https://sanatanadharmam.in/stories/shiva",
"https://sanatanadharmam.in/stories/vasistamhari",
"https://sanatanadharmam.in/stories/vishnu",
"https://sanatanadharmam.in/stories/visvamitra",
"https://sanatanadharmam.in/stotrasmantras",
"https://sanatanadharmam.in/stotrasmantras/dailyPrayers",
"https://sanatanadharmam.in/stotrasmantras/devi",
"https://sanatanadharmam.in/stotrasmantras/ganesha",
"https://sanatanadharmam.in/stotrasmantras/hanuman",
"https://sanatanadharmam.in/stotrasmantras/shiva",
"https://sanatanadharmam.in/stotrasmantras/vishnu",
"https://sanatanadharmam.in/terms-of-service"
];

const util = require('util');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function check(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    // Try HEAD first
    let res;
    try {
      res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal });
    } catch (e) {
      // if HEAD fails, try GET
    }
    if (!res || res.status === 405 || res.status === 500) {
      // do GET
      res = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal });
    }
    clearTimeout(timeout);
    const finalUrl = res.url || url;
    const status = res.status;
    // fetch HTML to get canonical
    let canonical = '';
    try {
      const htmlRes = await fetch(finalUrl, { method: 'GET', redirect: 'follow' });
      const text = await htmlRes.text();
      const m = text.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
      if (m) {
        const hrefMatch = m[0].match(/href=["']([^"']+)["']/i);
        if (hrefMatch) canonical = hrefMatch[1];
      }
    } catch (e) {
      // ignore
    }
    return { url, finalUrl, status, canonical };
  } catch (err) {
    return { url, error: err.message };
  }
}

(async () => {
  const results = [];
  for (let i = 0; i < urls.length; i++) {
    const u = urls[i];
    process.stdout.write(`Checking (${i+1}/${urls.length}): ${u}\n`);
    // normalize path: ensure trailing slash where appropriate
    let target = u;
    // perform check
    const r = await check(target);
    results.push(r);
    // be polite
    await sleep(300);
  }
  const out = { checkedAt: new Date().toISOString(), results };
  const outPath = 'out/live-url-check.json';
  fs.mkdirSync('out', { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log('\nWrote', outPath);
  // also print summary to stdout
  for (const r of results) {
    if (r.error) {
      console.log(`${r.url} -> ERROR: ${r.error}`);
    } else {
      console.log(`${r.url} -> ${r.status} -> final: ${r.finalUrl} -> canonical: ${r.canonical || '(none)'}`);
    }
  }
})();
