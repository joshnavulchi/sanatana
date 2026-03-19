# Strict Static Export Solution

Apply this solution to all pages and OpenSpec artifacts:

```ts
export async function generateStaticParams() {
  const data = await getAllStories(); // your source
  return data
    .filter(item => item?.id && item?.localeExists) // filter invalid
    .map(item => ({ id: item.id }));
}
```

- Ensure output: 'export' is used for static generation
- Filter out invalid items and those missing locales
- This solution must be applied to all pages and OpenSpec artifacts

## Strict Scripts Policy

- Follow the repository's script rules in `.github/strict-scripts-policy.md`.
- For large static-sites (many localized pages) avoid runtime filesystem reads during Next.js build.
- Generate full `generateStaticParams` lists ahead-of-time by reading the locale data under `public/data/locales/...` and writing the results as TypeScript modules under `app/generated-params/`.
- Update your route modules to import the generated param modules from `app/generated-params/` instead of scanning `public` at build time. This ensures the static params are available deterministically and allows building thousands of pages (e.g., ~5000) without dynamic IO during the build.
- Ensure generated modules are produced before `next build` and are included in the repository or build pipeline as appropriate.

Refer to copilot-instructions.md for full build and locale handling rules.
