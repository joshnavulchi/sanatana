#!/usr/bin/env bash
set -euo pipefail

echo "== Render portable build =="
echo "LOCALES_REF=${LOCALES_REF:-<empty>}"
echo "GIT_REMOTE_URL=${GIT_REMOTE_URL:-<empty>}"
echo "CI=${CI:-<empty>}"

# 1) Ensure we are in CI mode so your sync script can soft-skip when not strict
export CI=${CI:-1}
# Make locales sync non-fatal initially (change to 1 once stable)
export LOCALES_SYNC_STRICT=${LOCALES_SYNC_STRICT:-0}
# Your locales branch/tag/sha (no `origin/` prefix); defaults to 'locales'
export LOCALES_REF=${LOCALES_REF:-locales}

# 2) Recreate a minimal git context when the build is a tarball (no .git)
if [ ! -d ".git" ]; then
  echo ">> No .git directory detected. Initializing a new git repo for fetch-only operations…"
  git init
fi

# 3) Add 'origin' if it doesn't exist; requires GIT_REMOTE_URL
if ! git remote get-url origin >/dev/null 2>&1; then
  if [ -z "${GIT_REMOTE_URL:-}" ]; then
    echo ">> WARNING: GIT_REMOTE_URL not set; cannot add 'origin'. Locales sync may skip."
  else
    echo ">> Adding 'origin' remote: ${GIT_REMOTE_URL}"
    git remote add origin "${GIT_REMOTE_URL}"
  fi
fi

echo ">> Remotes:"
git remote -v || true

# 4) If we have an origin, fetch the locales ref explicitly (shallow)
if git remote get-url origin >/dev/null 2>&1; then
  echo ">> Checking remote for '${LOCALES_REF}'…"
  git ls-remote origin | grep -E "refs/(heads|tags)/${LOCALES_REF}$" || echo "No exact '${LOCALES_REF}' ref visible on origin (may still exist under different name)."

  echo ">> Fetching '${LOCALES_REF}' shallowly…"
  # Try as a branch, and if that fails, try as a tag.
  git fetch --no-tags --prune --depth=1 origin "${LOCALES_REF}:refs/remotes/origin/${LOCALES_REF}" \
    || git fetch --no-tags --prune --depth=1 origin "refs/tags/${LOCALES_REF}:refs/tags/${LOCALES_REF}" \
    || echo ">> Fetch did not bring '${LOCALES_REF}' locally; locales-sync may soft-skip."
fi

echo ">> Local refs (grep '${LOCALES_REF}') after fetch:"
git show-ref | grep -i "${LOCALES_REF}" || echo "No local refs matching '${LOCALES_REF}'."

# 5) Run your existing chain
echo "== Running locales sync =="
node scripts/sync-locales-from-branch.js --verbose || echo "[locales-sync] non-fatal skip (STRICT=${LOCALES_SYNC_STRICT})"

echo "== Building =="
node scripts/compile-scss.js --force
node scripts/generate-critical-css.js
npm run build:ci

echo "== Post-build verification & optimization =="
node scripts/compile-scss.js --verify
node scripts/strip-comments.js
node scripts/generate-sitemap.js
node scripts/minify-html.js
node scripts/add-hash-to-assets.js
node scripts/check-analytics-keys.js

echo "== Build complete ✅ =="