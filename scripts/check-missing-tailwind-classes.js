// scripts/check-missing-tailwind-classes.js
// This script scans your project for Tailwind class usage in all relevant folders and compares them to the generated CSS file.
// It warns if any used classes are missing from the final CSS (potentially purged by Tailwind).

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Adjust these as needed
const SEARCH_DIRS = [
  'app',
  'components',
  'lib',
];
const CSS_FILE = path.join('public', 'globals.from-scss.css');

// Regex to match Tailwind-like classes (simple heuristic)
const CLASS_REGEX = /class(Name)?\s*=\s*(["'`])([^"'`]+)\2/g;
const TAILWIND_CLASS_REGEX = /[a-zA-Z0-9!\-_:\/]+/g;

function getAllFiles() {
  return SEARCH_DIRS.flatMap(dir =>
    glob.sync(`${dir}/**/*.{js,ts,jsx,tsx,mdx}`, { absolute: false })
  );
}

function extractClassesFromFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = [...content.matchAll(CLASS_REGEX)];
  return matches.flatMap(m => (m[3].match(TAILWIND_CLASS_REGEX) || []));
}

function getAllUsedClasses() {
  const files = getAllFiles();
  const classSet = new Set();
  files.forEach(file => {
    extractClassesFromFile(file).forEach(cls => classSet.add(cls));
  });
  return classSet;
}

function getAllGeneratedClasses() {
  if (!fs.existsSync(CSS_FILE)) return new Set();
  const css = fs.readFileSync(CSS_FILE, 'utf8');
  // Match .class selectors
  const matches = [...css.matchAll(/\.([a-zA-Z0-9!\-_:]+)/g)];
  return new Set(matches.map(m => m[1]));
}

function main() {
  const used = getAllUsedClasses();
  const generated = getAllGeneratedClasses();
  const missing = [...used].filter(cls => !generated.has(cls));
  if (missing.length) {
    console.warn('Warning: The following Tailwind classes are used in your code but missing from the generated CSS (likely purged):');
    missing.forEach(cls => console.warn('  ' + cls));
    process.exitCode = 1;
  } else {
    console.log('All used Tailwind classes are present in the generated CSS.');
  }
}

if (require.main === module) main();
