/* Serve locale JSON from the filesystem or fall back to remote raw content.
 * This endpoint ensures runtime availability even when static files are not served.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const META_FILE = path.join(process.cwd(), 'public', 'locales', '.locales-meta.json');

function readMeta(): Record<string, string> {
  try {
    if (!fs.existsSync(META_FILE)) return {};
    return JSON.parse(fs.readFileSync(META_FILE, 'utf8')) || {};
  } catch (_) {
    return {};
  }
}

function writeMeta(meta: Record<string, string>) {
  try {
    fs.writeFileSync(META_FILE, JSON.stringify(meta, null, 2), 'utf8');
  } catch (_) {
    // non-fatal
  }
}

export async function GET(_request: Request, { params }: { params: { locale: string } }) {
  const locale = params?.locale || 'en';

  // Serve local file if present
  try {
    const filePath = path.join(process.cwd(), 'public', 'locales', locale, 'index.json');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return new Response(content, { headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=31536000, immutable' } });
    }
  } catch (_) {
    // fallback to remote
  }

  // Remote fallback + cache to disk (best-effort)
  try {
    const base = process.env.NEXT_PUBLIC_REMOTE_LOCALES_BASE || 'https://raw.githubusercontent.com/vulchivijay/first-contributes/main/locales';
    const remoteUrl = `${base}/${encodeURIComponent(locale)}/index.json`;
    const resp = await fetch(remoteUrl);
    if (resp.ok) {
      const text = await resp.text();

      // Try to cache to disk so future requests read local file
      try {
        const localeDir = path.join(process.cwd(), 'public', 'locales', locale);
        fs.mkdirSync(localeDir, { recursive: true });
        const dest = path.join(localeDir, 'index.json');
        fs.writeFileSync(dest, text, 'utf8');

        // update meta sha
        try {
          const sha = crypto.createHash('sha1').update(text, 'utf8').digest('hex');
          const meta = readMeta();
          meta[`${locale}/index.json`] = sha;
          writeMeta(meta);
        } catch (_) {
          // ignore meta write errors
        }
      } catch (_) {
        // ignore caching errors — still return the fetched content
      }

      return new Response(text, { headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=3600' } });
    }

    return new Response(JSON.stringify({}), { status: 404, headers: { 'content-type': 'application/json' } });
  } catch (_) {
    return new Response(JSON.stringify({}), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
