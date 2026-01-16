#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function usage() {
  console.log('Usage: node scripts/clone-page.js <new-slug> [sourceDir] [--force]');
  console.log('Example: node scripts/clone-page.js understanding app/about --force');
  process.exit(1);
}

const args = process.argv.slice(2);
if (!args[0]) usage();
const newSlug = args[0];
const sourceDirArg = args[1] || 'app/about';
const force = args.includes('--force');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, sourceDirArg);
const targetDir = path.join(root, 'app', newSlug);

if (!fs.existsSync(sourceDir)) {
  console.error('Source directory does not exist:', sourceDir);
  process.exit(1);
}

if (fs.existsSync(targetDir) && !force) {
  console.error('Target directory already exists:', targetDir);
  console.error('Use --force to overwrite.');
  process.exit(1);
}

function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function replaceContent(content, slug) {
  const title = capitalize(slug);
  return content
    .replace(/\babout\b/g, slug)
    .replace(/\bAbout\b/g, title);
}

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      const srcPath = path.join(src, entry);
      // Replace 'about' in filenames
      const destName = entry.replace(/about/gi, (m) => (m === 'about' ? slug : capitalize(slug)));
      const destPath = path.join(dest, destName);
      copyRecursive(srcPath, destPath);
    }
    return;
  }
  // file
  let content = fs.readFileSync(src, 'utf8');
  content = replaceContent(content, slug);
  fs.writeFileSync(dest, content, 'utf8');
}

const slug = newSlug;
try {
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  copyRecursive(sourceDir, targetDir);
  console.log(`Cloned ${sourceDirArg} -> app/${slug}`);
} catch (err) {
  console.error('Error while cloning page:', err);
  process.exit(1);
}
