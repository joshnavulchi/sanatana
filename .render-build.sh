#!/usr/bin/env bash
set -euo pipefail

echo ">> LOCALES_REF=${LOCALES_REF:-<empty>}"
git remote -v || true
echo ">> ls-remote origin (filter locales):"
git ls-remote origin | grep -i 'refs/heads/locales' || echo "no 'refs/heads/locales' visible on origin"

# Fetch the locales branch explicitly so your sync script can resolve it
echo ">> Fetching 'locales' branch…"
git fetch --no-tags --prune --depth=1 origin locales:refs/remotes/origin/locales || true

echo ">> Local refs (grep locales):"
git show-ref | grep -i locales || echo "no 'locales' refs found locally after fetch"

# Make sure the script treats this environment as CI and skips non-fatally if needed
export CI=${CI:-1}
export LOCALES_REF=${LOCALES_REF:-locales}

# If you want locales missing to NOT fail the build, keep STRICT=0
export LOCALES_SYNC_STRICT=${LOCALES_SYNC_STRICT:-0}

# Run your existing chain
node scripts/sync-locales-from-branch.js --verbose || echo "[locales-sync] non-fatal skip"
node scripts/compile-scss.js --force
node scripts/generate-critical-css.js
npm run build:ci
node scripts/compile-scss.js --verify
node scripts/strip-comments.js
node scripts/generate-sitemap.js
node scripts/minify-html.js
node scripts/add-hash-to-assets.js
node scripts/check-analytics-keys.js