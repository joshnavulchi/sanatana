import fs from 'fs';
import path from 'path';

const BASE_DIR = path.join(process.cwd(), 'public/data/locales/en/vedic-philosophy');

type Param = { slug: string; parts: string[] };

function walk(dir: string, slug: string, prefixParts: string[] = []): Param[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results: Param[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(
        ...walk(fullPath, slug, [...prefixParts, entry.name])
      );
    } else if (entry.isFile()) {
      const name = entry.name.replace(/\.(md|mdx|json)$/i, '');
      const parts = [...prefixParts, name];

      // Ensure valid
      if (slug && parts.length > 0) {
        results.push({ slug, parts });
      }
    }
  }

  return results;
}

export function getAllPhilosophyPaths(): Param[] {
  if (!fs.existsSync(BASE_DIR)) return [];

  const slugs = fs.readdirSync(BASE_DIR);

  return slugs.flatMap((slug) => {
    const slugPath = path.join(BASE_DIR, slug);
    if (!fs.statSync(slugPath).isDirectory()) return [];

    return walk(slugPath, slug);
  });
}
