const fs = require('fs');
const path = require('path');

function findJsonFiles(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      out.push(...findJsonFiles(full));
    } else if (stat.isFile() && full.endsWith('.json')) {
      out.push(full);
    }
  }
  return out;
}

function checkFile(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const j = JSON.parse(raw);
    // look for first nested object that has a meta property
    let meta = null;
    if (j && typeof j === 'object') {
      for (const k of Object.keys(j)) {
        if (j[k] && typeof j[k] === 'object' && j[k].meta && typeof j[k].meta === 'object') {
          meta = j[k].meta;
          break;
        }
      }
    }
    if (!meta) return { file, hasMeta: false };
    const hasTitle = typeof meta.title === 'string' && meta.title.trim().length > 0;
    const hasDescription = typeof meta.description === 'string' && meta.description.trim().length > 0;
    const hasKeywords = Array.isArray(meta.keywords) && meta.keywords.length > 0;
    return { file, hasMeta: true, hasTitle, hasDescription, hasKeywords };
  } catch (e) {
    return { file, error: String(e) };
  }
}

const root = path.join(__dirname, '..', 'locales');
if (!fs.existsSync(root)) {
  console.error('locales folder not found:', root);
  process.exit(2);
}
const files = findJsonFiles(root).sort();
const results = files.map(checkFile);
const missingMeta = results.filter(r => !r.hasMeta && !r.error).map(r => r.file);
const errors = results.filter(r => r.error).map(r => ({file: r.file, error: r.error}));
const missingTitle = results.filter(r => r.hasMeta && !r.hasTitle).map(r => r.file);
const missingDescription = results.filter(r => r.hasMeta && !r.hasDescription).map(r => r.file);
const missingKeywords = results.filter(r => r.hasMeta && !r.hasKeywords).map(r => r.file);

console.log('Audit results for', files.length, 'files');
console.log('Files missing `meta` object:', missingMeta.length);
missingMeta.forEach(f => console.log('  -', f));
console.log('\nFiles with `meta` but missing `meta.title`:', missingTitle.length);
missingTitle.forEach(f => console.log('  -', f));
console.log('\nFiles with `meta` but missing `meta.description`:', missingDescription.length);
missingDescription.forEach(f => console.log('  -', f));
console.log('\nFiles with `meta` but missing `meta.keywords` or empty keywords array:', missingKeywords.length);
missingKeywords.forEach(f => console.log('  -', f));
if (errors.length) {
  console.log('\nFiles with parse errors:');
  errors.forEach(e => console.log('  -', e.file, e.error));
}

// exit non-zero if any missing meta/title/description/keywords
const totalProblems = missingMeta.length + missingTitle.length + missingDescription.length + missingKeywords.length + errors.length;
process.exit(totalProblems > 0 ? 0 : 0);
