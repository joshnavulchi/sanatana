---
name: SEO Preservation
description: "Ensures all agents preserve Google indexing, IndexNow setup, and SEO-related code across the repository."
---

# SEO Preservation Skill

This skill enforces strict preservation of all SEO-related functionality, including Google indexing mechanisms and IndexNow integration.

## When to use

* When making any code changes that could affect search engine visibility
* Before running any refactoring or optimization agents
* When updating build scripts, sitemaps, or indexing-related code

## Core Rules

Agents must **NEVER** modify, remove, or disrupt:

### Google Indexing
- `public/sitemap.xml` generation and content
- `public/robots.txt` configuration
- `public/llms.txt` and other SEO metadata files
- Structured data (JSON-LD) in pages
- Meta tags for SEO (title, description, canonical URLs)
- Open Graph and Twitter meta tags
- Canonical URL implementations

### IndexNow Integration
- `lib/constants.ts` INDEXNOW_KEY constant
- `public/{key}.txt` verification files
- `scripts/notify-indexnow.js` script
- Post-build IndexNow notification in `package.json`
- Any IndexNow API calls or logic

### Build and Deployment SEO
- Sitemap generation scripts (`scripts/generate-sitemap.js`)
- SEO audit scripts (`scripts/audit-seo.js`)
- Build-time locale handling for SEO
- Static export configurations affecting SEO

## Prohibited Actions

❌ Do not remove or modify IndexNow notification scripts
❌ Do not alter sitemap generation logic
❌ Do not change robots.txt directives
❌ Do not remove SEO meta tags from components
❌ Do not modify canonical URL logic
❌ Do not disrupt structured data output
❌ Do not change build scripts that affect SEO files

## Validation Steps

Before applying any changes:

1. Check if the change affects any SEO-related files
2. Verify sitemap generation still works
3. Ensure IndexNow key and scripts remain intact
4. Confirm robots.txt and other SEO files are unchanged
5. Test that build produces correct SEO outputs

## Notes

* This skill takes precedence over all other optimization or refactoring instructions
* If SEO preservation conflicts with a task, halt and seek clarification
* Always preserve the integrity of search engine indexing mechanisms