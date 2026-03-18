# Tasks

## Locale Checklist

When adding or editing pages that use localized content, ensure the following:

- Add `public/locales/en/<route>.json` (and other locales as required) with the new keys.
- Use `useLocaleSection('<route>')` or `useLocale()` in client components; do not import locale JSON directly.
- Ensure server pages use `createGenerateMetadata('<route>')` for metadata.
- Do not hardcode locale file paths (e.g., `/locales/en/`) or fetch them directly in code.
- Add a `Locale Checklist` entry in `tasks.md` for each change explaining which locale files were added/updated.
- Run `npm run lint` and `npx tsc --noEmit` and fix issues before committing.

