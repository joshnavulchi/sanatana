const fs = require('fs');

const file = process.argv[2] || 'public/locales/en/nadi_sasram.json';
const text = fs.readFileSync(file, 'utf8');

const chunks = [];
let inString = false;
let escaped = false;
let depth = 0;
let start = -1;

for (let index = 0; index < text.length; index++) {
  const char = text[index];

  if (inString) {
    if (escaped) {
      escaped = false;
    } else if (char === '\\') {
      escaped = true;
    } else if (char === '"') {
      inString = false;
    }
    continue;
  }

  if (char === '"') {
    inString = true;
    continue;
  }

  if (char === '{') {
    if (depth === 0) start = index;
    depth += 1;
    continue;
  }

  if (char === '}') {
    depth -= 1;
    if (depth === 0 && start !== -1) {
      chunks.push(text.slice(start, index + 1));
      start = -1;
    }
  }
}

if (chunks.length === 0) {
  throw new Error('No top-level JSON objects found.');
}

const objects = chunks.map((chunk, index) => {
  try {
    return JSON.parse(chunk);
  } catch (error) {
    throw new Error(`Chunk ${index + 1} is invalid JSON: ${error.message}`);
  }
});

const merged = { ...objects[0] };
for (let index = 1; index < objects.length; index++) {
  const obj = objects[index] || {};
  const rawKey = typeof obj.dataset === 'string' && obj.dataset.trim()
    ? obj.dataset.trim()
    : `section_${index + 1}`;
  const key = Object.prototype.hasOwnProperty.call(merged, rawKey)
    ? `${rawKey}_${index + 1}`
    : rawKey;
  merged[key] = obj;
}

fs.writeFileSync(file, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
console.log(`Rebuilt ${file} from ${objects.length} top-level objects into one object.`);
