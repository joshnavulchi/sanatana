#!/usr/bin/env node
// Script: scripts/detect-changed-routes.js
// Usage: node scripts/detect-changed-routes.js [base-ref]
// Outputs: scripts/changed-routes.json (array of changed route paths)

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const APP_DIR = path.join(REPO_ROOT, 'app');
const OUTPUT_FILE = path.join(__dirname, 'changed-routes.json');

// Get base ref from args, or use origin/production on Render, origin/development locally
let baseRef;
if (process.argv[2]) {
  baseRef = process.argv[2];
} else if (process.env.RENDER || process.env.NODE_ENV === 'production') {
  baseRef = 'origin/production';
} else {
  baseRef = 'origin/development';
}

function getChangedFiles() {
  const diffCmd = `git diff --name-only ${baseRef}`;
  const output = execSync(diffCmd, { cwd: REPO_ROOT, encoding: 'utf8' });
  return output.split('\n').map(f => f.trim()).filter(Boolean);
}

function fileToRoute(filePath) {
  // Only map app/xxx/page.tsx to /xxx
  if (!filePath.startsWith('app/') || !filePath.endsWith('/page.tsx')) return null;
  const rel = filePath.slice(4, -9); // remove 'app/' and '/page.tsx'
  if (rel === '') return '/';
  return '/' + rel.replace(/\\/g, '/');
}

function main() {
  const changedFiles = getChangedFiles();
  const routes = Array.from(new Set(
    changedFiles
      .map(fileToRoute)
      .filter(Boolean)
  ));
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(routes, null, 2), 'utf8');
  console.log(`Detected changed routes:`, routes);
}

main();
