#!/usr/bin/env bash
set -euo pipefail

echo ">> LOCALES_REF=${LOCALES_REF:-<empty>}"

# Reduce memory usage
export NODE_OPTIONS="--max-old-space-size=6144"

# Ensure CI mode
export CI=${CI:-1}
export LOCALES_SYNC_STRICT=${LOCALES_SYNC_STRICT:-0}
export LOCALES_REF=${LOCALES_REF:-locales}

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

echo "== Post-build optimizations =="

node scripts/generate-sitemap.js
node scripts/generate-post-deploy-audit.js
node scripts/add-hash-to-assets.js

# Optional heavy tasks
if [ "${CI}" = "1" ]; then
  echo "Skipping heavy HTML processing in CI"
else
  node scripts/generate-critical-css.js
  node scripts/minify-html.js
fi

echo "== Build complete ✅ =="