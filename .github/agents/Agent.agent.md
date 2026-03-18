# AI Agent Instructions

This file is the **primary entry point for AI agents** working with this repository.

Before generating code, content, or modifications, the agent **must read and follow all instruction files listed below**.

---

# Instruction Files

Agents must load these instruction documents before performing any task.

| File                                     | Purpose                                      |
| ---------------------------------------- | -------------------------------------------- |
| `/instructions/copilot-instructions.md`  | Coding standards and AI coding rules         |
| `/instructions/general-instructions.md`  | Project architecture, frameworks, libraries  |
| `/instructions/design-instructions.md`   | UI design system and Tailwind styling rules  |
| `/instructions/language-instructions.md` | Language, terminology, and writing standards |

---

# Agent Workflow

Before generating any output, the agent must:

1. Read **copilot-instructions.md** for coding standards
2. Read **general-instructions.md** for architecture and stack
3. Read **design-instructions.md** for UI rules
4. Read **language-instructions.md** for text and documentation rules

Only after loading these instructions should the agent proceed.

---

## Next.js `output: export` rule (generateStaticParams)

Agents working on Next.js pages must ensure routes that use dynamic segments and are intended for a static export provide a `generateStaticParams()` export. If Next's build reports "is missing \"generateStaticParams()\" so it cannot be used with \"output: export\"" the usual causes and remedies are:

- **Missing export:** add `export function generateStaticParams(): Params[] { return [...] }` to the page file.
- **Non-detectable export:** avoid conditional or dynamic exports; the function must be a top-level exported symbol so Next can statically analyze it.
- **Common pattern fixes:** when building params from file lists, initialize file arrays before using them (for example `let files: string[] = [];`) so TypeScript/analysis doesn't treat the function as incomplete or throw undefined errors.
- **Verify build logs:** run `npm run build` locally to capture the Next build trace and confirm which page triggered the error.

Include a Locale Checklist entry in `tasks.md` when creating or editing pages with dynamic segments and static export requirements.


# Agent Responsibilities

The agent may perform tasks such as:

* writing React components or page with locales standards of rendering properly localized content
* applying localization content to its page.
* adding SEO metadata
* adding structured data
* creating tests

All generated content must follow repository standards.

---

# Content Principles

Content must be

* historically accurate
* sourced from traditional scriptures
* culturally respectful
* educational
* SEO optimized

---

# Content Generation Tasks

Agents may generate structured content for:

```
Vedas
Upanishads
Puranas
Itihasas
Vedic Philosophy
Vedic Philosophy
Explore
```

All generated content must be **historically accurate and culturally respectful**.

---

# SEO Requirements

Each generated entry must include

* meta title
* meta description
* canonical URL
* structured data schema
* OpenGraph metadata

---

# JSON Formatting Rules

All generated JSON must follow

* 2 space indentation
* UTF-8 encoding
* valid JSON schema
* no trailing commas

---

# File Naming

Files must follow

```
kebab-case
```

Example

```
rigveda.json
bhagavata-purana.json
chandogya-upanishad.json
```
---

# Agent Safety Rules

Agents must never

* fabricate scriptures
* generate fictional sources
* modify repository architecture
* create files outside expected directories

---

## Locale Validation Rules

Agents must validate that new and updated pages follow the repository's locale pattern (the `about` page pattern) and must NOT hardcode locale file paths such as `locales/en/` or fetch/import specific locale files directly.

Checks agents must perform before modifying or adding pages/components:

- Ensure pages use `createGenerateMetadata('<route>')` for metadata where applicable.
- Ensure client components use `useLocaleSection('<route>')` or `useLocale()` (and `useLocaleSection` where a namespaced file is used) to read translations rather than importing JSON files directly.
- Ensure corresponding locale JSON exists under `public/locales/<locale>/<route>.json` for supported locales (do not hardcode `en` in application code). The locale loader fetches `/locales/<locale>/<route>.json` at runtime.
- Disallow source that references or imports `public/locales/en/` (or other explicit locale subfolders) directly. Disallow code that contains string literals matching `/locales/en/` or `fetch('/locales/en/`).
- If a new UI string is added, add the key to the relevant locale namespace and list translation work in the change proposal.
- Prefer reading locale namespaces with `getLocaleNamespaceObject` or `useLocaleSection` rather than embedding locale JSON.

Automated validations agents should run (and fix or report) before committing changes:

- Search the `app/` folder for occurrences of `'/locales/en/'`, `"/locales/en/"`, `"locales/en/"`, `fetch('/locales/en/`, or imports that reference `public/locales/en` and flag them for removal.
- For each new page under `app/<route>` ensure `about`-style structure: `page.tsx` that renders a client component and a client component that reads its locale section.
- Verify that metadata `metaKey` or `createGenerateMetadata('<route>')` values match the locale namespace used in the locale JSON.

If violations are found, the agent should either fix them (by replacing hardcoded paths with `useLocaleSection` usage and adding starter locale JSON under `openspec/changes/<name>/artifacts` or `public/locales/<locale>/<route>.json`) or fail with a clear message listing the offending files and suggested fixes.

Example forbidden pattern (must be removed):

```ts
const data = await fetch('/locales/en/about.json'); // forbidden — do not hardcode locale path
import enAbout from '../../public/locales/en/about.json'; // forbidden
```

Example required pattern (preferred):

```tsx
const ns = useLocaleSection('about');
const title = String(ns?.title || '');
```

Agents must include a Locale Checklist entry in `tasks.md` when proposing or implementing a page change, e.g.:

- Add `public/locales/en/<route>.json` (and other locales as required)
- Ensure `useLocaleSection('<route>')` is used in client component
- Run `npm run check` and fix lint/tests


---

<!-- # Example JSON Structure

```json
{
  "title": "Rigveda",
  "description": "The Rigveda is the oldest Veda containing hymns dedicated to various deities.",
  "keywords": ["Rigveda", "Vedas", "Hindu scriptures"],
  "canonical": "/vedas/rigveda",
  "content": {
    "introduction": "...",
    "history": "...",
    "purpose": "...",
    "stories": []
  }
}
```
--- -->

# Output Requirements

Generated output must:

* follow TypeScript strict mode
* respect folder structure
* use project path aliases
* comply with design system rules
* use localization for UI text
* include proper SEO metadata when applicable

---

<!-- # Output Format

Agents must output valid JSON ready to be placed in the repository.

Example directory

```
data/vedas/
data/upanishads/
data/puranas/
``` -->