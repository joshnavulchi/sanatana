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
