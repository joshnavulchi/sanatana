import fs from 'fs';
import path from 'path';
import { MAHABHARATA_PARVAS, toUnderscoreSlug } from '../itihasa-utils';

const LOCALE_DIR = path.join(process.cwd(), 'public', 'locales', 'en');

function readLocaleFiles(): string[] {
  if (!fs.existsSync(LOCALE_DIR)) return [];
  return fs.readdirSync(LOCALE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name);
}

export function getMahabharataParvas(): string[] {
  const files = readLocaleFiles();

  return MAHABHARATA_PARVAS.filter((parva) => {
    const fileName = `itihasa_mahabharata_${toUnderscoreSlug(parva)}.json`;
    return files.includes(fileName);
  });
}

export function getMahabharataChapters(parva: string): number[] {
  const files = readLocaleFiles();
  const chapters = new Set<number>();
  const parvaKey = toUnderscoreSlug(parva);
  const pattern = new RegExp(`^itihasa_mahabharata_${parvaKey}_chapter(\\d+)\\.json$`);

  for (const file of files) {
    const match = file.match(pattern);
    if (!match) continue;
    const chapter = Number(match[1]);
    if (Number.isFinite(chapter)) chapters.add(chapter);
  }

  return Array.from(chapters).sort((a, b) => a - b);
}
