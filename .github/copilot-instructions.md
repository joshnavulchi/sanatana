
# Code Standards for This Repository

## Frameworks & Libraries

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS (with custom gradients, rounded corners, and shadow effects for modern UI)
- **State/Locale:** React Context, custom hooks (e.g., `useLocale`, `useLocaleSection`)
- **Components:** Modular, reusable, and imported from `@components` or local folders
- **Metadata:** Use `createGenerateMetadata` from `@lib/pageUtils` for SEO/meta

## Component Rendering

- Components are functional React components (with `export default function ...`)
- Use `use client` directive for client components
- Props and state are typed with TypeScript
- Use hooks for locale, data fetching, and effects
- Render content dynamically from JSON/locale objects when possible
- Use Tailwind classes for all styling; avoid inline styles except for dynamic cases
- Use semantic HTML (section, article, nav, etc.)
- Use utility classes for spacing, layout, and responsiveness
- Use unique, visually distinct card/section designs for major content blocks

## Page Rendering

- Each page is a file in the `app/` directory, exporting a default function
- Pages import and render a single main client component (e.g., `AboutClient`, `DonateClient`)
- Use a shared `PageLayout` component for consistent layout, meta, and breadcrumbs
- Metadata is generated per-page using `generateMetadata`
- Pages may include additional components (e.g., `StructuredData`, `SimilarCategories`)
- All navigation and links use Next.js `<Link>` or `<a>` with Tailwind classes
- Pages are organized by feature/domain (e.g., `stories/`, `scriptures/`, `philosophy/`)

## General Coding Practices

- Prefer composition over inheritance
- Keep components small and focused
- Use descriptive variable and function names
- Avoid magic numbers/strings; use constants or enums
- All code must be TypeScript
- All new code must be formatted and linted

## Example Patterns

- **Page file:**
	```tsx
	import { createGenerateMetadata } from '@lib/pageUtils';
	export const generateMetadata = createGenerateMetadata('page_key');
	import SomeClient from './someclient';
	export default function Page() { return <SomeClient />; }
	```
- **Client component:**
	```tsx
	'use client';
	import { useLocale } from '@app/context/locale-context';
	import PageLayout from '@components/common/PageLayout';
	export default function SomeClient() { /* ... */ }
	```
