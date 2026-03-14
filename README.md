# Sanatana

A multi-language content and localization repository for Vedic/Hindu philosophy translations across 15 languages.

---

## GitHub Secrets and Variables Required

The following secrets and variables must be configured in the repository settings before workflows can run successfully.

### Repository Variables

Navigate to **Settings → Secrets and variables → Actions → Variables tab** to create these.

| Name | Value Format | Description | Required |
|------|-------------|-------------|----------|
| `UPSTREAM_REPO` | `owner/repo` (e.g., `original-owner/sanatana`) | The upstream GitHub repository to sync branches from | ✅ Yes |

### Secrets

Navigate to **Settings → Secrets and variables → Actions → Secrets tab** to create these.

| Name | Description | Required |
|------|-------------|----------|
| `GITHUB_TOKEN` | Automatically provided by GitHub Actions — **no manual creation needed** | ✅ Auto |

---

## Workflows

### Sync Upstream Branches (`sync-upstream.yml`)

Automatically syncs all branches from the upstream repository to this fork.

- **Schedule:** Runs 3 times daily at 08:00, 13:00, and 18:00 IST
- **Manual trigger:** Can also be triggered manually via `workflow_dispatch`
- **Requires:** `UPSTREAM_REPO` variable and `GITHUB_TOKEN` (auto-provided)

---

## Scripts

Utility scripts are located in the `/scripts/` directory.

- **`translate.py`** — Translates content using Google Translate. Supports `TRANSLATE_LOCALE_WORKERS` and `TRANSLATE_WORKERS` environment variables to control parallelism.
- **`sync_locales_with_en.js`** — Syncs locale file structure with the English (`en`) source.
- **`append-new-keywords.js`** — Appends keywords to metadata fields across locales.
- **`sync_keys_from_en.js`** — Syncs JSON keys from the English source to other locales.
- **`verify_all_canonicals.js`** — Verifies canonical URLs across all locale files.
- **`generate_locale_index.js`** — Generates index files for each locale.

See `scripts/scripts.txt` for the full list of available scripts.

---

## Locales

Content is available in 15 languages:

| Code | Language |
|------|----------|
| `en` | English (source) |
| `ar` | Arabic |
| `de` | German |
| `es` | Spanish |
| `fr` | French |
| `hi` | Hindi |
| `ja` | Japanese |
| `ne` | Nepali |
| `nl` | Dutch |
| `pt` | Portuguese |
| `ru` | Russian |
| `ta` | Tamil |
| `te` | Telugu |
| `ur` | Urdu |
| `zh-CN` | Chinese Simplified |
