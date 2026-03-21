#!/usr/bin/env bash
set -euo pipefail

# Reduce memory usage
export NODE_OPTIONS="--max-old-space-size=6144"

# Create git context if missing
if [ ! -d ".git" ]; then
  echo ">> Initializing git repository"
  git init
fi

# Add origin if missing
if ! git remote get-url origin >/dev/null 2>&1; then
  if [ -n "${GIT_REMOTE_URL:-}" ]; then
    echo ">> Adding origin ${GIT_REMOTE_URL}"
    git remote add origin "${GIT_REMOTE_URL}"
  else
    echo ">> WARNING: No remote URL"
  fi
fi

echo "== Pre-build assets =="
node scripts/compile-scss.js --force

echo "== Next.js build =="
npm run build

echo "== Static export =="
echo "== Static export handled by next build =="
# `next export` was removed. When `output: 'export'` is set in next.config.js/ts,
# the static export is produced by `next build`. Do not call `next export`.

echo "== Verify output =="
ls -la
ls -la out || (echo "❌ out folder missing after export" && exit 1)

echo "== Post-build optimizations =="
node scripts/generate-sitemap.js
node scripts/generate-post-deploy-audit.js
node scripts/add-hash-to-assets.js
node scripts/audit-seo.js --out out --json audit-report.json || true

# Optional heavy tasks
if [ "${CI:-0}" = "1" ]; then
  echo "Skipping heavy HTML processing in CI"
else
  node scripts/generate-critical-css.js
  node scripts/minify-html.js
fi

echo "== Build complete ✅ =="