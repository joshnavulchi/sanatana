CI caching and clean steps

Why we clean before installing
- We remove any existing `node_modules` and non-Yarn lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `package.json.lock`) to avoid conflicts with the project's Yarn 4 (Berry) immutable installs (`yarn install --immutable`).
- We purposely keep `yarn.lock` and Yarn config so installs are deterministic.

What we cache
- Yarn cache: `.yarn/cache` (already present in workflows)
- Next.js build cache: `.next/cache` (added to workflows)
- Optional: static artifact caches (e.g., `public/critical-home.css`) are cached where useful.

Cache keys
- Yarn cache key: `yarn-cache-${{ runner.os }}-${{ hashFiles('yarn.lock') }}`
- Next cache key: `next-cache-${{ runner.os }}-${{ hashFiles('package.json', 'yarn.lock', 'next.config.ts') }}`

Local verification (run in project root)

1) Clean and build locally (simulate CI steps):
```bash
rm -rf node_modules
rm -f package-lock.json pnpm-lock.yaml package.json.lock
corepack enable
corepack prepare yarn@4.12.0 --activate
yarn install --immutable
yarn build
```

2) Check for Next.js cache after build:
```bash
ls -la .next/cache || echo ".next/cache not present"
```

Notes
- GitHub Actions' cache restore behavior depends on the key; first run will miss the cache and subsequent runs should hit it if the keys match.
- If you use other package managers locally (npm, pnpm), the workflows intentionally remove their lockfiles to avoid conflicts; contributors should use Yarn for this repository.
