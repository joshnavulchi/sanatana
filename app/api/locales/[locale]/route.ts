/* Serve locale JSON from the filesystem or fall back to remote raw content.
 * This endpoint ensures runtime availability even when static files are not served.
 */
/* For static exports (`output: export`) API routes are not supported.
 * Provide a static stub to satisfy the build and avoid runtime errors.
 * Runtime fallback is handled by serving files under `/locales/<locale>/index.json` from `public/`.
 */
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export async function GET() {
  return new Response(JSON.stringify({ error: 'API disabled for static export' }), {
    status: 410,
    headers: { 'content-type': 'application/json' },
  });
}

// Provide static params for locales found in `public/locales` so `next export`
// can include this dynamic route during static export.
export async function generateStaticParams() {
  try {
    const localesDir = path.join(process.cwd(), 'public', 'locales');
    if (!fs.existsSync(localesDir)) return [];
    const entries = fs.readdirSync(localesDir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((d) => ({ locale: d.name }));
  } catch (_) {
    return [];
  }
}
