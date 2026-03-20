const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'public', 'data', 'locales', 'en');
const outFile = path.join(__dirname, '..', 'public', 'data', 'locales-en-json-files.json');

async function walk(dir, base) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      const nested = await walk(full, base);
      files.push(...nested);
    } else if (ent.isFile() && ent.name.endsWith('.json')) {
      files.push(path.relative(base, full).replace(/\\\\/g, '/'));
    }
  }
  return files;
}

(async () => {
  try {
    const files = await walk(root, root);
    files.sort();
    const out = {
      generatedAt: new Date().toISOString(),
      count: files.length,
      pathPrefix: 'public/data/locales/en/',
      paths: files
    };
    await fs.promises.writeFile(outFile, JSON.stringify(out, null, 2), 'utf8');
    console.log('WROTE', outFile, 'items=', files.length);
  } catch (err) {
    console.error('ERROR', err);
    process.exitCode = 2;
  }
})();
