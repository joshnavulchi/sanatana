#!/usr/bin/env bash
set -euo pipefail

echo "== Render portable build =="

echo "LOCALES_REF=${LOCALES_REF:-<empty>}"
echo "GIT_REMOTE_URL=${GIT_REMOTE_URL:-<empty>}"
echo "CI=${CI:-<empty>}"

# Reduce memory usage
export NODE_OPTIONS="--max-old-space-size=4096"

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

echo ">> Remotes:"
git remote -v || true

# Fetch locales branch
if git remote get-url origin >/dev/null 2>&1; then
  echo ">> Fetching locales ref ${LOCALES_REF}"

  git fetch --depth=1 origin \
  "${LOCALES_REF}:refs/remotes/origin/${LOCALES_REF}" \
  || echo "Locales ref not found"
fi

echo "== Running locales sync =="
node scripts/sync-locales-from-branch.js --verbose || echo "Locales sync skipped"

echo "== Pre-build assets =="
node scripts/compile-scss.js --force

echo "== Next.js build =="
npm run build:ci

echo "== Post-build optimizations =="

node scripts/generate-sitemap.js
node scripts/add-hash-to-assets.js

# Optional heavy tasks
if [ "${CI}" = "1" ]; then
  echo "Skipping heavy HTML processing in CI"
else
  node scripts/generate-critical-css.js
  node scripts/minify-html.js
fi

node scripts/check-analytics-keys.js

echo "== Build complete ✅ =="