#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const REPO_ROOT = path.resolve(__dirname, '..');

const ROUTES_FILE = path.join(REPO_ROOT, 'scripts', 'changed-routes.json');

function readRoutes() {
  try {
    const raw = fs.readFileSync(ROUTES_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return null;
  }
}

function run(cmd, args, opts) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: true, ...opts });
  if (r.error || r.status !== 0) {
    process.exit(r.status || 1);
  }
}

async function main() {
  const routes = readRoutes();
  if (!routes || routes.length === 0) {
    // console.log('No per-route changes detected (or failed to read routes). Falling back to full build + export.');
    // Full build + export
    run('node', ['--max-old-space-size=6144', './node_modules/next/dist/bin/next', 'build']);
    run('node', ['./node_modules/next/dist/bin/next', 'export', '-o', 'out']);
    process.exit(0);
  }

  // Placeholder: per-route export is not implemented yet.
  // console.log('Per-route export requested for routes:', routes);
  // console.log('Currently falling back to full build + export (TODO: implement per-route renderer).');
  run('node', ['--max-old-space-size=8192', './node_modules/next/dist/bin/next', 'build']);
  run('node', ['./node_modules/next/dist/bin/next', 'export', '-o', 'out']);
}

main();
