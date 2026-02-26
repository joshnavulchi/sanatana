#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const LAST_COMMIT_FILE = path.join(process.cwd(), '.last_export_commit');
const OUT_FILE = path.join(process.cwd(), 'scripts', 'changed-routes.json');

function getHead() {
  return execSync('git rev-parse HEAD').toString().trim();
}

function readLastCommit() {
  try {
    return fs.readFileSync(LAST_COMMIT_FILE, 'utf8').trim();
  } catch (_) {
    return null;
  }
}

function writeLastCommit(sha) {
  try { fs.writeFileSync(LAST_COMMIT_FILE, sha, 'utf8'); } catch (e) { /* ignore */ }
}

function gitDiffNames(from, to) {
  try {
    const out = execSync(`git diff --name-only ${from} ${to}`).toString().trim();
    if (!out) return [];
    return out.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  } catch (e) {
    return [];
  }
}

function routeFromAppPath(p) {
  // p like app/about/page.tsx -> /about
  if (!p.startsWith('app/')) return null;
  let rel = p.slice(4); // remove app/
  // remove file names like page.tsx, layout.tsx, template.tsx, loading.tsx
  rel = rel.replace(/(?:page|layout|template|loading)\.[jt]sx?$/, '');
  rel = rel.replace(/index\.[jt]sx?$/, '');
  rel = rel.replace(/\/$/, '');
  const parts = rel.split('/').filter(Boolean);
  if (parts.length === 0) return '/';
  return '/' + parts.join('/');
}

async function main() {
  const head = getHead();
  const last = readLastCommit();
  if (!last) {
    console.log('No previous export commit found — will mark current commit and exit.');
    writeLastCommit(head);
    process.exit(0);
  }

  if (last === head) {
    console.log('No changes since last export commit.');
    fs.writeFileSync(OUT_FILE, JSON.stringify([], null, 2), 'utf8');
    process.exit(0);
  }

  const changed = gitDiffNames(last, head);
  const routes = new Set();
  let fallbackAll = false;

  for (const f of changed) {
    if (f.startsWith('app/')) {
      const r = routeFromAppPath(f);
      if (r) routes.add(r);
      else fallbackAll = true;
    } else if (f.startsWith('public/locales') || f.startsWith('lib/') || f.startsWith('data/') || f.startsWith('scripts/')) {
      // changes to locales, lib or data could affect many pages — fallback to full export
      fallbackAll = true;
    }
  }

  const result = fallbackAll ? null : Array.from(routes.values());
  fs.writeFileSync(OUT_FILE, JSON.stringify(result, null, 2), 'utf8');
  writeLastCommit(head);

  if (fallbackAll) {
    console.log('Detected changes that require full export.');
  } else {
    console.log('Changed routes:', result);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
