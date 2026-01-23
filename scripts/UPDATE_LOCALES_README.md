# Update i18n Locales Script

This script automatically updates the `lib/i18n.ts` file with the latest locales from the GitHub repository.

## What it does

1. **Fetches available locales** from `https://github.com/vulchivijay/first-contributes/tree/main/locales`
2. **Updates SUPPORTED_LOCALES** array in `lib/i18n.ts` with discovered locales
3. **Validates locale files** (optional) to ensure they're accessible

## Usage

### Basic update

```bash
npm run update:locales
```

### Update with validation

```bash
npm run update:locales:validate
```

Or directly:

```bash
node scripts/update-i18n-locales.js
node scripts/update-i18n-locales.js --validate
```

## When to run

Run this script whenever:
- New locales are added to the GitHub repository
- Locales are removed from the GitHub repository
- You want to sync your local configuration with the remote repository

## Output

The script will:
- ✓ Display found locales
- ✓ Update `lib/i18n.ts` if changes are detected
- ✓ Validate each locale file (if `--validate` flag is used)
- ✓ Show success/error messages

## Example Output

```
============================================================
Updating i18n.ts with latest locales from GitHub
============================================================
Repository: vulchivijay/first-contributes
Branch: main

Fetching locales from GitHub repository...
Found 4 locales: en, hi, ta, te
Reading i18n.ts file...
✓ Successfully updated i18n.ts with new locales

Validating locale files...
  ✓ en: OK
  ✓ hi: OK
  ✓ ta: OK
  ✓ te: OK

✓ All locales validated successfully

============================================================
✓ Update completed successfully!
============================================================
```

## Configuration

To modify the script settings, edit the configuration section in `scripts/update-i18n-locales.js`:

```javascript
const GITHUB_REPO = 'vulchivijay/first-contributes';
const GITHUB_BRANCH = 'main';
```

## Automation

You can add this script to your CI/CD pipeline or set up a cron job to automatically check for locale updates:

```yaml
# Example GitHub Actions workflow
name: Update Locales
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
  workflow_dispatch:

jobs:
  update-locales:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm run update:locales:validate
      - name: Commit changes
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add lib/i18n.ts
          git commit -m "chore: update locales from repository" || echo "No changes"
          git push
```

## Troubleshooting

### GitHub API Rate Limiting

If you encounter rate limiting issues, you can authenticate with a GitHub token:

```javascript
headers: {
  'User-Agent': 'Node.js Script',
  'Accept': 'application/vnd.github.v3+json',
  'Authorization': `token ${process.env.GITHUB_TOKEN}`
}
```

### Network Issues

If the script fails due to network issues, check your internet connection and ensure you can access:
- `https://api.github.com`
- `https://raw.githubusercontent.com`
