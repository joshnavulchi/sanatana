// scripts/check-analytics-keys.js
// Checks for Google Analytics and Tag Manager keys in built HTML files
const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '@/app/out'); // Next.js static export output
const GA_REGEX = /G-(\w{8,})/g; // Google Analytics 4 key pattern
const GTM_REGEX = /GTM-(\w{6,})/g; // Google Tag Manager key pattern

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const gaKeys = [...content.matchAll(GA_REGEX)].map(m => m[0]);
  const gtmKeys = [...content.matchAll(GTM_REGEX)].map(m => m[0]);
  return { gaKeys, gtmKeys };
}

function scanBuildDir(dir) {
  let foundGA = new Set();
  let foundGTM = new Set();
  let checkedFiles = 0;
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isFile() && file.endsWith('.html')) {
      checkedFiles++;
      const { gaKeys, gtmKeys } = scanFile(filePath);
      gaKeys.forEach(k => foundGA.add(k));
      gtmKeys.forEach(k => foundGTM.add(k));
    }
  });
  return { foundGA: Array.from(foundGA), foundGTM: Array.from(foundGTM), checkedFiles };
}

function main() {
  if (!fs.existsSync(BUILD_DIR)) {
    console.warn('Build output directory not found:', BUILD_DIR);
    process.exit(1);
  }
  const { foundGA, foundGTM, checkedFiles } = scanBuildDir(BUILD_DIR);
  console.log(`Checked ${checkedFiles} HTML files in build.`);
  if (foundGA.length) {
    console.log('Google Analytics keys found:', foundGA.join(', '));
  } else {
    console.warn('No Google Analytics keys found in build.');
  }
  if (foundGTM.length) {
    console.log('Google Tag Manager keys found:', foundGTM.join(', '));
  } else {
    console.warn('No Google Tag Manager keys found in build.');
  }
}

if (require.main === module) main();
