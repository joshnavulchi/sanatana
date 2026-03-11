import fs from 'fs';
import path from 'path';

const LOCALE_DIR = path.join(process.cwd(), 'public', 'locales', 'en');

function readLocaleFiles(): string[] {
  if (!fs.existsSync(LOCALE_DIR)) return [];
  return fs.readdirSync(LOCALE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name);
}

export function getBhagavadGitaChapters(): number[] {
  const files = readLocaleFiles();
  const chapters = new Set<number>();

  for (const file of files) {
    const match = file.match(/^itihasa_bhagavad_gita_chapter(\d+)\.json$/);
    if (!match) continue;
    const chapter = Number(match[1]);
    if (Number.isFinite(chapter)) chapters.add(chapter);
  }

  return Array.from(chapters).sort((a, b) => a - b);
}

export function getBhagavadGitaVersesForChapter(chapter: number): number[] {
  const files = readLocaleFiles();
  const verses = new Set<number>();
  const pattern = new RegExp(`^itihasa_bhagavad_gita_chapter${chapter}_verse(\\d+)\\.json$`);

  for (const file of files) {
    const match = file.match(pattern);
    if (!match) continue;
    const verse = Number(match[1]);
    if (Number.isFinite(verse)) verses.add(verse);
  }

  return Array.from(verses).sort((a, b) => a - b);
}
