You are working on a Next.js App Router project configured with `output: 'export'` (fully static site).

Goal:
Optimize the entire application so that Google can discover and index pages immediately after deployment.

Requirements:

1. Generate sitemap.xml automatically:

   * Create `/app/sitemap.ts`
   * Include all static and dynamic routes (including `[slug]`, `[id]`)
   * Use correct lastModified timestamps
   * Base URL should come from environment variable (e.g., NEXT_PUBLIC_SITE_URL)

2. Generate robots.txt:

   * Create `/app/robots.ts`
   * Allow all pages
   * Include sitemap URL
   * Block only unnecessary paths (e.g., /api, /admin if exists)

3. Add canonical URLs:

   * Every page must include canonical link in metadata
   * Use absolute URLs

4. Improve metadata for all pages:

   * Use `generateMetadata()` in every page
   * Include:

     * title
     * description
     * keywords
     * openGraph
     * twitter metadata
   * Ensure metadata is dynamic per slug/id page

5. Fix dynamic routes for static export:

   * Implement `generateStaticParams()` for all dynamic routes
   * Ensure all pages exist at build time
   * Avoid runtime-only pages

6. Add structured data (JSON-LD):

   * Add schema.org structured data to pages
   * Use Article / WebPage / Breadcrumb schema where appropriate

7. Ensure clean URLs:

   * Use trailingSlash: true
   * Avoid query-based navigation
   * Ensure all links use <Link> from next/link

8. Add internal linking:

   * Ensure all pages are reachable via links
   * No orphan pages

9. Optimize performance:

   * Ensure pages load fast (important for indexing)
   * Avoid large JS bundles
   * Use static content wherever possible

10. Add 404 and fallback handling:

* Create proper not-found page
* Avoid blank pages

11. Ensure accessibility for crawlers:

* No blocking scripts
* No client-only rendering for critical content
* Content must be visible in HTML

12. Add headers guidance (for deployment):

* Suggest cache headers for static hosting (CDN)

Output:

* sitemap.ts
* robots.ts
* example generateMetadata() for dynamic page
* structured data example
* best practices applied across project

Important:

* This is a static export site, so everything must work without a Node server
* Do NOT use server-only features that break static export
* Ensure all pages are indexable at build time




You are working on a Next.js App Router project configured with `output: 'export'` (fully static site).

Problem:
The current SEO, metadata, and sitemap implementation is inconsistent, partially broken, or not scalable. Some pages are not indexed properly, and dynamic routes are not fully included in sitemap or metadata.

Goal:
Refactor and standardize the entire SEO system so that:

* All pages are indexable
* Sitemap is complete and accurate
* Metadata is consistent and dynamic
* Works fully with static export (no server dependencies)

Tasks:

---

1. CENTRALIZE SEO CONFIG

---

Create a reusable SEO utility:

* `/lib/seo.ts`
* Function: `generateSEO({ title, description, path, image, keywords })`

This function should:

* Return metadata object compatible with Next.js `generateMetadata()`
* Include:

  * title (with site suffix)
  * description
  * canonical URL (absolute)
  * openGraph
  * twitter metadata
  * robots (index, follow)

Base URL must come from:

* `process.env.NEXT_PUBLIC_SITE_URL`

---

2. RESTRUCTURE METADATA USAGE

---

* Remove duplicate or hardcoded metadata across pages
* Ensure ALL pages use `generateMetadata()` with centralized SEO utility
* Dynamic routes ([slug], [id]) must generate metadata dynamically based on content

---

3. FIX DYNAMIC ROUTES FOR STATIC EXPORT

---

* Implement `generateStaticParams()` for ALL dynamic routes
* Ensure:

  * Only valid slugs/ids are returned
  * Missing locale/content entries are filtered out
* Prevent build failures due to missing data

---

4. REBUILD SITEMAP SYSTEM

---

Create `/app/sitemap.ts`:

* Include ALL routes:

  * static pages
  * dynamic pages ([slug], [id])
* Pull data from same source as `generateStaticParams()`
* Each entry must include:

  * url (absolute)
  * lastModified
* Avoid duplicates
* Ensure sitemap works with static export

---

5. CREATE ROBOTS.TXT

---

Create `/app/robots.ts`:

* Allow all public pages
* Disallow:

  * /api
  * /admin (if exists)
* Include sitemap URL

---

6. ADD STRUCTURED DATA (JSON-LD)

---

* Add reusable schema generator:
  `/lib/schema.ts`
* Support:

  * WebPage
  * Article (for content pages)
  * BreadcrumbList
* Inject into pages via <script type="application/ld+json">

---

7. HANDLE MISSING DATA SAFELY

---

* If content not found:

  * Use `notFound()`
* If partial data missing:

  * Render fallback content
* Do NOT crash build

---

8. ENSURE STATIC EXPORT COMPATIBILITY

---

* Do NOT use server-only APIs
* Do NOT rely on runtime fetching for SEO-critical data
* All SEO data must be available at build time

---

9. IMPROVE INTERNAL LINKING

---

* Ensure all pages are reachable via <Link>
* No orphan pages
* Add breadcrumb navigation where possible

---

10. PERFORMANCE + INDEXING OPTIMIZATION

---

* Keep metadata lightweight
* Avoid large inline JSON in pages
* Ensure HTML contains real content (not client-only rendering)

---

11. OUTPUT EXPECTATION

---

Provide:

* `/lib/seo.ts`
* `/lib/schema.ts`
* `/app/sitemap.ts`
* `/app/robots.ts`
* Example refactored dynamic page ([id]/page.tsx)
* Example `generateStaticParams()`

Code must be:

* TypeScript-safe
* Production-ready
* Clean and reusable

---

## IMPORTANT:

* This is a STATIC EXPORT project (`output: 'export'`)
* All pages must be pre-rendered
* SEO must not depend on runtime APIs
* Ensure compatibility with large datasets (1000+ pages)

Focus on scalability, correctness, and Google indexing effectiveness.






You are working on a Next.js (App Router) TypeScript project.

Problem:
The codebase contains unused imports, unused variables, dead functions, redundant exports, and possibly unused script files. This increases build time, bundle size, and complexity.

Goal:
Clean and optimize the codebase by safely removing all unnecessary code while preserving functionality.

Tasks:

---

1. REMOVE UNUSED IMPORTS

---

* Identify and remove all unused imports from:

  * React components
  * utility files
  * API routes
* Do NOT remove imports that are used indirectly (e.g., types, dynamic usage)

---

2. REMOVE UNUSED VARIABLES & FUNCTIONS

---

* Delete variables, constants, and functions that are never used
* Remove commented-out code blocks
* Ensure no references remain

---

3. REMOVE UNUSED EXPORTS

---

* Identify exports that are not imported anywhere in the project
* Remove:

  * unused named exports
  * unused default exports
* Ensure no runtime or dynamic usage is broken

---

4. DELETE UNUSED FILES

---

* Identify files that are not imported or referenced anywhere:

  * components
  * utils
  * scripts
  * pages/routes
* Safely delete them
* Be careful with:

  * dynamic routes
  * file-based routing in Next.js
  * config files

---

5. CLEAN UNUSED SCRIPTS

---

* Review package.json scripts
* Remove scripts that are not used or redundant
* Ensure essential scripts remain:

  * dev
  * build
  * start
  * lint (optional)

---

6. OPTIMIZE IMPORTS

---

* Replace wildcard imports with specific imports where possible
* Remove duplicate imports
* Ensure consistent import paths

---

7. TYPESCRIPT SAFETY

---

* Ensure project compiles without errors after cleanup
* Avoid removing types that are required
* Maintain strict typing

---

8. NEXT.JS SAFETY CHECKS

---

* Do NOT remove:

  * layout.tsx
  * page.tsx
  * generateStaticParams
  * metadata functions
* Ensure routing structure is preserved

---

9. PERFORMANCE IMPROVEMENT

---

* Reduce bundle size
* Improve build time
* Avoid unnecessary dependencies

---

10. OUTPUT EXPECTATION

---

* Provide cleaned versions of affected files
* List deleted files
* List removed imports/exports
* Ensure no functionality is broken

---

## IMPORTANT:

* Do NOT break dynamic routing
* Do NOT remove SEO-related code
* Do NOT remove anything used via reflection or dynamic import
* Prefer safe removal over aggressive deletion

Focus on clean, minimal, production-ready code.


You are working on a Next.js (App Router) TypeScript project using Tailwind CSS.

Problem:
The UI lacks consistency across pages, subpages, and child routes. Header and footer are basic or inconsistent. Typography, spacing, padding, and margins are not standardized.

Goal:
Create a COMPLETE, consistent, and premium design system with:

* Unique header and footer design
* Mobile-first responsive layout
* Consistent typography, spacing, padding, and margins
* Reusable UI components and templates
* Light theme only (NO dark mode)

The design should feel modern, elegant, and production-grade.

---

1. GLOBAL DESIGN RULES (MANDATORY)

---

Apply across ALL pages and components:

* Mobile-first approach:
  Start with base styles → enhance with `sm: md: lg:`

* Container:
  `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

* Section spacing:
  `py-8 sm:py-10 md:py-12`

* Vertical rhythm:
  `space-y-6 md:space-y-8`

* Grid gaps:
  `gap-4 sm:gap-6`

* Border radius:
  `rounded-xl` (default), `rounded-2xl` (cards)

* Shadows:
  `shadow-sm` or subtle custom shadow only

---

2. TYPOGRAPHY SYSTEM (STRICT)

---

Standardize everywhere:

* Page Title:
  `text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900`

* Section Title:
  `text-lg sm:text-xl md:text-2xl font-semibold text-gray-900`

* Subtitle:
  `text-base sm:text-lg text-gray-600`

* Body:
  `text-gray-700 leading-relaxed`

* Small / meta:
  `text-sm text-gray-500`

DO NOT use arbitrary font sizes.

---

3. UNIQUE HEADER DESIGN

---

Create a modern sticky header:

* Layout:
  `sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100`

* Inner container:
  flex justify-between items-center

* Logo:
  Bold text or icon + text combination

* Navigation:
  Horizontal menu on desktop
  Mobile menu (hamburger) on small screens

* Nav links:
  `text-gray-600 hover:text-primary-600 transition`

* CTA button:
  Primary styled button

* Mobile menu:
  Collapsible panel with proper spacing

---

4. UNIQUE FOOTER DESIGN

---

Create a structured footer:

* Background:
  `bg-gray-50 border-t border-gray-100`

* Layout:
  Grid:
  `grid gap-6 sm:grid-cols-2 md:grid-cols-4`

* Sections:

  * About
  * Navigation links
  * Resources
  * Social links

* Text:
  `text-sm text-gray-600`

* Bottom bar:
  copyright + links

* Spacing:
  `py-10 md:py-12`

---

5. REUSABLE COMPONENT SYSTEM

---

Create:

Card:

* `bg-white border border-gray-100 rounded-2xl shadow-sm p-5`

Button:

* Primary:
  `bg-primary-600 text-white hover:bg-primary-700 rounded-xl px-4 py-2`
* Secondary:
  `bg-gray-100 hover:bg-gray-200 text-gray-700`

Section wrapper:

* `py-10 md:py-14`

Container wrapper:

* reusable layout component

---

6. PAGE TEMPLATE STRUCTURE

---

A. Listing Page:

* Title + description
* Grid:
  `grid gap-6 md:grid-cols-2 lg:grid-cols-3`
* Cards

B. Detail Page:

* Title
* Metadata row
* Content section
* Related items

C. Landing Section:

* Hero
* CTA
* Clean spacing

---

7. SPACING & CONSISTENCY ENFORCEMENT

---

* Replace ALL inconsistent spacing with standard scale
* Remove arbitrary padding/margin values
* Ensure alignment consistency across:

  * pages
  * subpages
  * child routes

---

8. MOBILE-FIRST RESPONSIVENESS

---

* Base styles = mobile
* Enhance progressively:
  sm → md → lg
* Ensure:

  * no overflow issues
  * proper stacking on mobile
  * readable typography

---

9. INTERACTION & POLISH

---

* Add subtle transitions:
  `transition-all duration-200`
* Hover states:
  `hover:shadow-md hover:-translate-y-0.5`
* Avoid excessive animation

---

10. REMOVE INCONSISTENCIES

---

* Remove inline styles
* Remove dark mode classes
* Normalize colors to palette
* Standardize layout across app

---

11. OUTPUT EXPECTATION

---

Provide:

* Header component
* Footer component
* Layout wrapper (used globally)
* Updated Tailwind classes across pages
* Example page.tsx (listing + detail)
* Clean reusable components

---

## IMPORTANT

* Do NOT change business logic
* Do NOT break routing
* Focus only on UI consistency and design quality
* Ensure design looks premium and cohesive

Goal:
Transform the entire app into a consistent, mobile-first, beautifully designed system with a strong visual identity.
