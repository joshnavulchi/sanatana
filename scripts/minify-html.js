#!/usr/bin/env node
// Minify HTML files in the `out` directory (static export)
// Uses `html-minifier-terser` when available; otherwise silently exits.

const fs = require('fs').promises;
const path = require('path');

async function findHtml(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const ent of entries) {
    const res = path.join(dir, ent.name);
    if (ent.isDirectory()) files.push(...await findHtml(res));
    else if (ent.isFile() && res.endsWith('.html')) files.push(res);
  }
  return files;
}

async function main() {
  let minify;
  try {
    minify = require('html-minifier-terser').minify;
  } catch (err) {
    console.warn('html-minifier-terser not installed; skipping HTML minification.');
    return;
  }

  const outDir = path.resolve(process.cwd(), 'out');
  try {
    await fs.access(outDir);
  } catch (err) {
    console.warn('No `out` directory found; skipping HTML minification.');
    return;
  }

  const files = await findHtml(outDir);
  if (files.length === 0) {
    console.log('No HTML files found to minify.');
    return;
  }

  await Promise.all(files.map(async (file) => {
    try {
      const src = await fs.readFile(file, 'utf8');
      const res = await minify(src, {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true,
        minifyCSS: true,
        minifyJS: true,
        keepClosingSlash: false,
      });
      await fs.writeFile(file, res, 'utf8');
      console.log('Minified', path.relative(process.cwd(), file));
    } catch (err) {
      console.error('Failed to minify', file, err);
    }
  }));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
