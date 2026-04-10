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