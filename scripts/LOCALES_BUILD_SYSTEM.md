# Locales Build System

This document explains how locales are managed in production builds.

## Overview

The application uses a hybrid approach for loading locales:
1. **Development**: Locales are fetched from GitHub at runtime
2. **Production**: Locales are downloaded during build and bundled with the app
3. **Fallback**: If local files aren't available, falls back to GitHub

## Build Process

### 1. Download Locales (prebuild)

Before building, the `download-locales.js` script runs automatically:

```bash
npm run build
# This runs: prebuild -> build -> postbuild
# prebuild: downloads locales to public/locales/
```

The script:
- Fetches all locale folders from GitHub repository
- Downloads each locale's files
- Converts TypeScript files to JSON
- Saves them to `public/locales/{locale}/`

### 2. Build Application

Next.js builds the application with locales included in the `public` folder.

### 3. Runtime Loading

When the app runs, `lib/i18n.ts` uses this loading strategy:

```
1. Try local files: /locales/{locale}/index.json (bundled)
   ↓ (if fails)
2. Try GitHub: https://raw.githubusercontent.com/.../locales/{locale}/index.ts
   ↓ (if fails)
3. Try GitHub JSON: https://raw.githubusercontent.com/.../locales/{locale}.json
   ↓ (if fails)
4. Fallback to default locale
```

## Scripts

### Download Locales

Download all locales from GitHub:

```bash
npm run download:locales
```

This is automatically run before each build via the `prebuild` script.

### Update i18n Configuration

Update the `SUPPORTED_LOCALES` array in `lib/i18n.ts`:

```bash
npm run update:locales
npm run update:locales:validate  # with validation
```

## File Structure

```
public/
  locales/           # Downloaded during build (gitignored)
    en/
      index.json
    hi/
      index.json
    ta/
      index.json
    te/
      index.json

lib/
  i18n.ts           # Locale loading logic

scripts/
  download-locales.js        # Downloads locales from GitHub
  update-i18n-locales.js     # Updates SUPPORTED_LOCALES array
```

## .gitignore

The `public/locales/` directory should be gitignored since it's generated during build:

```gitignore
# Downloaded locales (regenerated during build)
public/locales/
```

## Production Deployment

### Option 1: Build on Server

If building on the server:

```bash
npm install
npm run build  # Downloads locales, then builds
npm start
```

### Option 2: Pre-built Artifacts

If deploying pre-built artifacts:

```bash
# On build server
npm run build  # Includes locales download

# Deploy the entire .next/ and public/ directories
```

### Option 3: Static Export

For static hosting:

```bash
NEXT_STATIC_EXPORT=true npm run build
# Locales are bundled in the exported HTML
```

## Cache Strategy

- **Memory Cache**: Loaded locales are cached in memory (`localesCache`)
- **Browser Cache**: Local files benefit from browser caching
- **CDN**: If using a CDN, locale files are cached at edge locations

## Updating Locales

### During Development

Locales are fetched from GitHub in real-time, so updates are immediate.

### In Production

To update locales in production:

1. **Rebuild the application**:
   ```bash
   npm run build
   npm start
   ```

2. **Or download locales separately**:
   ```bash
   npm run download:locales
   # Restart the application to clear the cache
   ```

## Troubleshooting

### Locales not loading

1. Check if locales were downloaded:
   ```bash
   ls public/locales/
   ```

2. Manually download locales:
   ```bash
   npm run download:locales
   ```

3. Check console for fetch errors

### Build fails during locale download

- Check internet connectivity
- Verify GitHub repository is accessible
- Check if repository structure changed

### Stale locale data

Clear the locale cache:
- Restart the application (server)
- Clear browser cache (client)
- Force reload (Ctrl+Shift+R)

## Configuration

Edit `scripts/download-locales.js` to change:

```javascript
const GITHUB_REPO = 'vulchivijay/first-contributes';
const GITHUB_BRANCH = 'main';
const LOCALES_DIR = path.join(__dirname, '../public/locales');
```

Edit `lib/i18n.ts` to change:

```typescript
const GITHUB_LOCALES_BASE = 'https://raw.githubusercontent.com/vulchivijay/first-contributes/main/locales';
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build  # Includes locale download
      - run: npm run test
      # Deploy steps...
```

### Environment Variables

No environment variables required for basic usage. For GitHub API authentication:

```bash
export GITHUB_TOKEN=your_token_here
npm run download:locales
```

Then update the script to use the token in headers.

## Performance

### Bundle Size

- Each locale adds ~10-50KB (depends on content)
- Locales are in `public/`, not bundled in JS
- Loaded on-demand, not all at once

### Loading Time

- **Local files**: ~1-5ms (from public folder)
- **GitHub fetch**: ~200-500ms (fallback only)
- **Cached**: <1ms (memory cache)

## Best Practices

1. **Always run prebuild**: Ensure locales are downloaded before build
2. **Monitor bundle size**: Keep locale files optimized
3. **Test fallback**: Verify GitHub fallback works
4. **Cache wisely**: Set appropriate cache headers for locale files
5. **Version control**: Don't commit `public/locales/` to git

## Security

- Locale files are publicly accessible (in `public/` folder)
- No sensitive data should be in locale files
- GitHub repository should be public or use authenticated requests

## FAQ

**Q: Do I need internet during build?**  
A: Yes, to download locales from GitHub.

**Q: What happens if GitHub is down?**  
A: Build will fail. Use cached locales or set up a mirror.

**Q: Can I use local locales during development?**  
A: Yes, run `npm run download:locales` then restart dev server.

**Q: How do I add a new locale?**  
A: Add it to the GitHub repository, then run `npm run update:locales`.

**Q: Are locales SSR-friendly?**  
A: Yes, they're loaded from `public/` which is accessible during SSR.
