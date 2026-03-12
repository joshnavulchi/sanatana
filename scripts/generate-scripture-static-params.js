const fs = require('fs');
const path = require('path');

const root = process.cwd();
const localeDir = path.join(root, 'public', 'locales', 'en');
const outFile = path.join(root, 'lib', 'generated', 'scriptureStaticParams.ts');

const MAHAPURANA_SLUGS = [
  'brahma',
  'padma',
  'vishnu',
  'shiva',
  'bhagavata',
  'narada',
  'markandeya',
  'agni',
  'bhavishya',
  'brahmavaivarta',
  'linga',
  'varaha',
  'skanda',
  'vamana',
  'kurma',
  'matsya',
  'garuda',
  'brahmanda',
];

const RAMAYANA_KANDAS = [
  'bala-kanda',
  'ayodhya-kanda',
  'aranya-kanda',
  'kishkinda-kanda',
  'sundara-kanda',
  'yuddha-kanda',
  'uttara-kanda',
];

const MAHABHARATA_PARVAS = [
  'adi-parva',
  'sabha-parva',
  'vana-parva',
  'virata-parva',
  'udyoga-parva',
  'bhishma-parva',
  'drona-parva',
  'karna-parva',
  'shalya-parva',
  'sauptika-parva',
  'stri-parva',
  'shanti-parva',
  'anushasana-parva',
  'ashvamedhika-parva',
  'ashramavasika-parva',
  'mousala-parva',
  'mahaprasthanika-parva',
  'svargarohana-parva',
];

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function unwrapSingleKeyObject(value) {
  const obj = asObject(value);
  const keys = Object.keys(obj);
  if (keys.length === 1) {
    return asObject(obj[keys[0]]);
  }
  return obj;
}

function toFiniteNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function toUnderscoreSlug(slug) {
  return slug.replace(/-/g, '_');
}

function readJson(fileName) {
  const filePath = path.join(localeDir, fileName);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function readLocaleFileNames() {
  if (!fs.existsSync(localeDir)) return [];
  return fs
    .readdirSync(localeDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name);
}

function buildPuranasPartParams() {
  const params = [];

  for (const slug of MAHAPURANA_SLUGS) {
    const raw = readJson(`puranas_${slug}_structure.json`);
    if (!raw) continue;

    const structure = unwrapSingleKeyObject(raw);
    const routeSlugs = [slug, `${slug}-purana`];

    if (slug === 'bhagavata') {
      const skandas = asArray(structure.skandas);
      for (const skanda of skandas) {
        const skandaObj = asObject(skanda);
        const skandaNumber = toFiniteNumber(skandaObj.skanda);
        if (skandaNumber === null) continue;

        for (const routeSlug of routeSlugs) {
          params.push({ slug: routeSlug, parts: [`skanda-${skandaNumber}`] });
        }

        const chapters = asArray(skandaObj.chapters);
        for (const chapter of chapters) {
          const chapterObj = asObject(chapter);
          const chapterNumber = toFiniteNumber(chapterObj.chapter);
          if (chapterNumber === null) continue;

          for (const routeSlug of routeSlugs) {
            params.push({
              slug: routeSlug,
              parts: [`skanda-${skandaNumber}`, `chapter-${chapterNumber}`],
            });
          }

          const verses = asArray(chapterObj.verses);
          for (const verse of verses) {
            const verseObj = asObject(verse);
            const verseNumber = toFiniteNumber(verseObj.verse_number);
            if (verseNumber === null) continue;

            for (const routeSlug of routeSlugs) {
              params.push({
                slug: routeSlug,
                parts: [
                  `skanda-${skandaNumber}`,
                  `chapter-${chapterNumber}`,
                  `verse-${verseNumber}`,
                ],
              });
            }
          }
        }
      }
      continue;
    }

    const chapters = asArray(structure.chapters);
    for (const chapter of chapters) {
      const chapterObj = asObject(chapter);
      const chapterNumber = toFiniteNumber(chapterObj.chapter);
      if (chapterNumber === null) continue;

      for (const routeSlug of routeSlugs) {
        params.push({ slug: routeSlug, parts: [`chapter-${chapterNumber}`] });
      }

      const verses = asArray(chapterObj.verses);
      for (const verse of verses) {
        const verseObj = asObject(verse);
        const verseNumber = toFiniteNumber(verseObj.verse_number);
        if (verseNumber === null) continue;

        for (const routeSlug of routeSlugs) {
          params.push({
            slug: routeSlug,
            parts: [`chapter-${chapterNumber}`, `verse-${verseNumber}`],
          });
        }
      }
    }
  }

  return params;
}

function buildRamayanaSargaParams() {
  const params = [];
  const structureRaw = readJson('itihasa_ramayana_structure.json');

  if (structureRaw) {
    const kandas = asArray(unwrapSingleKeyObject(structureRaw).kandas);
    for (const kanda of kandas) {
      const kandaObj = asObject(kanda);
      const kandaSlug = String(kandaObj.slug || '');
      if (!kandaSlug) continue;

      for (const sarga of asArray(kandaObj.sargas)) {
        const sargaObj = asObject(sarga);
        const sargaNumber = toFiniteNumber(sargaObj.sarga);
        if (sargaNumber === null) continue;
        params.push({ slug: kandaSlug, parts: [`sarga-${sargaNumber}`] });
      }
    }
  }

  if (params.length === 0) {
    for (const kanda of RAMAYANA_KANDAS) {
      params.push({ slug: kanda, parts: ['sarga-1'] });
    }
  }

  return params;
}

function buildMahabharataParvaParams(files) {
  const params = [];
  for (const parva of MAHABHARATA_PARVAS) {
    const fileName = `itihasa_mahabharata_${toUnderscoreSlug(parva)}.json`;
    if (files.includes(fileName)) {
      params.push({ parva });
    }
  }
  return params;
}

function buildMahabharataChapterParams(files) {
  const params = [];

  for (const parva of MAHABHARATA_PARVAS) {
    const parvaKey = toUnderscoreSlug(parva);
    const pattern = new RegExp(`^itihasa_mahabharata_${parvaKey}_chapter(\\d+)\\.json$`);
    const chapters = new Set();

    for (const file of files) {
      const match = file.match(pattern);
      if (!match) continue;
      const chapter = toFiniteNumber(match[1]);
      if (chapter !== null) chapters.add(chapter);
    }

    for (const chapter of [...chapters].sort((a, b) => a - b)) {
      params.push({ parva, parts: [`chapter-${chapter}`] });
    }
  }

  return params;
}

function buildBhagavadGitaChapterParams(files) {
  const chapters = new Set();

  for (const file of files) {
    const match = file.match(/^itihasa_bhagavad_gita_chapter(\d+)\.json$/);
    if (!match) continue;
    const chapter = toFiniteNumber(match[1]);
    if (chapter !== null) chapters.add(chapter);
  }

  return [...chapters].sort((a, b) => a - b).map((chapter) => ({
    chapter: `chapter-${chapter}`,
  }));
}

function buildBhagavadGitaVerseParams(files) {
  const chapterNumbers = new Set();

  for (const file of files) {
    const match = file.match(/^itihasa_bhagavad_gita_chapter(\d+)\.json$/);
    if (!match) continue;
    const chapter = toFiniteNumber(match[1]);
    if (chapter !== null) chapterNumbers.add(chapter);
  }

  const params = [];
  for (const chapter of [...chapterNumbers].sort((a, b) => a - b)) {
    const pattern = new RegExp(`^itihasa_bhagavad_gita_chapter${chapter}_verse(\\d+)\\.json$`);
    const verses = new Set();

    for (const file of files) {
      const match = file.match(pattern);
      if (!match) continue;
      const verse = toFiniteNumber(match[1]);
      if (verse !== null) verses.add(verse);
    }

    for (const verse of [...verses].sort((a, b) => a - b)) {
      params.push({
        chapter: `chapter-${chapter}`,
        parts: [`verse-${verse}`],
      });
    }
  }

  return params;
}

function buildVedasChapterParams() {
  const out = [];

  for (let i = 1; i <= 10; i += 1) {
    out.push({ slug: 'rigveda', chapter: `mandala-${i}` });
  }

  const yajur = asObject(readJson('vedas_yajurveda.json'));
  const yajurRoot = asObject(
    yajur.yajurveda || yajur.vedas_yajurveda || unwrapSingleKeyObject(yajur)
  );
  for (const chapter of asArray(yajurRoot.yajurveda_chapters)) {
    const n = toFiniteNumber(chapter.chapter);
    if (n !== null) out.push({ slug: 'yajurveda', chapter: `chapter-${n}` });
  }

  const sama = asObject(readJson('vedas_samaveda.json'));
  const samaRoot = asObject(
    sama.samaveda || sama.vedas_samaveda || unwrapSingleKeyObject(sama)
  );
  for (const section of asArray(samaRoot.samaveda_sections)) {
    const n = toFiniteNumber(section.section);
    if (n !== null) out.push({ slug: 'samaveda', chapter: `hymn-${n}` });
  }

  const atharva = asObject(readJson('vedas_atharvaveda.json'));
  const atharvaRoot = asObject(
    atharva.atharvaveda || atharva.vedas_atharvaveda || unwrapSingleKeyObject(atharva)
  );
  for (const book of asArray(atharvaRoot.atharvaveda_books)) {
    const n = toFiniteNumber(book.book);
    if (n !== null) out.push({ slug: 'atharvaveda', chapter: `book-${n}` });
  }

  return out;
}

function buildVedasItemParams() {
  const out = [];

  for (let mandala = 1; mandala <= 10; mandala += 1) {
    const rig = asObject(readJson(`vedas_rigveda_madala${mandala}.json`));
    const rigRoot = asObject(
      rig[`vedas_rigveda_madala${mandala}`] ||
      rig[`mandala-${mandala}`] ||
      unwrapSingleKeyObject(rig)
    );
    for (const hymn of asArray(rigRoot.hymns)) {
      const n = toFiniteNumber(hymn.hymn_number);
      if (n !== null) {
        out.push({
          slug: 'rigveda',
          chapter: `mandala-${mandala}`,
          item: `hymn-${n}`,
        });
      }
    }
  }

  const yajur = asObject(readJson('vedas_yajurveda_structure.json'));
  const yajurRoot = asObject(yajur.yajurveda || unwrapSingleKeyObject(yajur));
  for (const chapter of asArray(yajurRoot.chapters)) {
    const chapterNum = toFiniteNumber(chapter.chapter);
    if (chapterNum === null) continue;
    for (const mantra of asArray(chapter.mantras)) {
      const itemNum = toFiniteNumber(mantra.mantra_number);
      if (itemNum !== null) {
        out.push({
          slug: 'yajurveda',
          chapter: `chapter-${chapterNum}`,
          item: `mantra-${itemNum}`,
        });
      }
    }
  }

  const atharva = asObject(readJson('vedas_atharvaveda_structure.json'));
  const atharvaRoot = asObject(atharva.atharvaveda || unwrapSingleKeyObject(atharva));
  for (const book of asArray(atharvaRoot.books)) {
    const bookNum = toFiniteNumber(book.book);
    if (bookNum === null) continue;
    for (const hymn of asArray(book.hymns)) {
      const itemNum = toFiniteNumber(hymn.hymn_number);
      if (itemNum !== null) {
        out.push({
          slug: 'atharvaveda',
          chapter: `book-${bookNum}`,
          item: `hymn-${itemNum}`,
        });
      }
    }
  }

  return out;
}

function buildVedicPhilosophyPartParams() {
  const out = [];
  const raw = readJson('vedic_philosophy_structure.json');
  if (!raw) return out;

  const structure = unwrapSingleKeyObject(raw);
  const topics = asArray(structure.topics);

  for (const topic of topics) {
    const topicObj = asObject(topic);
    const topicSlug = String(topicObj.slug || '');
    if (!topicSlug) continue;

    const subtopics = asArray(topicObj.subtopics);
    for (const subtopic of subtopics) {
      const subtopicObj = asObject(subtopic);
      const subtopicSlug = String(subtopicObj.slug || '');
      if (!subtopicSlug) continue;
      out.push({ slug: topicSlug, parts: [subtopicSlug] });
    }
  }

  return out;
}

function writeOutput(data) {
  const content = `/* Auto-generated by scripts/generate-scripture-static-params.js */\n\nexport interface SlugPartsParam {\n  readonly slug: string;\n  readonly parts: ReadonlyArray<string>;\n}\n\nexport interface ParvaParam {\n  readonly parva: string;\n}\n\nexport interface ParvaPartsParam {\n  readonly parva: string;\n  readonly parts: ReadonlyArray<string>;\n}\n\nexport interface ChapterParam {\n  readonly chapter: string;\n}\n\nexport interface ChapterPartsParam {\n  readonly chapter: string;\n  readonly parts: ReadonlyArray<string>;\n}\n\nexport interface VedaChapterParam {\n  readonly slug: string;\n  readonly chapter: string;\n}\n\nexport interface VedaItemParam {\n  readonly slug: string;\n  readonly chapter: string;\n  readonly item: string;\n}\n\nexport const PURANAS_PART_PARAMS: ReadonlyArray<SlugPartsParam> = ${JSON.stringify(data.puranasParts, null, 2)} as const;\n\nexport const RAMAYANA_SARGA_PARAMS: ReadonlyArray<SlugPartsParam> = ${JSON.stringify(data.ramayanaSargas, null, 2)} as const;\n\nexport const MAHABHARATA_PARVA_PARAMS: ReadonlyArray<ParvaParam> = ${JSON.stringify(data.mahabharataParvas, null, 2)} as const;\n\nexport const MAHABHARATA_CHAPTER_PARAMS: ReadonlyArray<ParvaPartsParam> = ${JSON.stringify(data.mahabharataChapters, null, 2)} as const;\n\nexport const BHAGAVAD_GITA_CHAPTER_PARAMS: ReadonlyArray<ChapterParam> = ${JSON.stringify(data.bhagavadGitaChapters, null, 2)} as const;\n\nexport const BHAGAVAD_GITA_VERSE_PARAMS: ReadonlyArray<ChapterPartsParam> = ${JSON.stringify(data.bhagavadGitaVerses, null, 2)} as const;\n\nexport const VEDAS_CHAPTER_PARAMS: ReadonlyArray<VedaChapterParam> = ${JSON.stringify(data.vedasChapters, null, 2)} as const;\n\nexport const VEDAS_ITEM_PARAMS: ReadonlyArray<VedaItemParam> = ${JSON.stringify(data.vedasItems, null, 2)} as const;\n\nexport const VEDIC_PHILOSOPHY_PART_PARAMS: ReadonlyArray<SlugPartsParam> = ${JSON.stringify(data.vedicPhilosophyParts, null, 2)} as const;\n`;

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, content, 'utf8');
}

const files = readLocaleFileNames();

const data = {
  puranasParts: buildPuranasPartParams(),
  ramayanaSargas: buildRamayanaSargaParams(),
  mahabharataParvas: buildMahabharataParvaParams(files),
  mahabharataChapters: buildMahabharataChapterParams(files),
  bhagavadGitaChapters: buildBhagavadGitaChapterParams(files),
  bhagavadGitaVerses: buildBhagavadGitaVerseParams(files),
  vedasChapters: buildVedasChapterParams(),
  vedasItems: buildVedasItemParams(),
  vedicPhilosophyParts: buildVedicPhilosophyPartParams(),
};

writeOutput(data);

console.log(`Generated ${path.relative(root, outFile)}`);
console.log(`Puranas params: ${data.puranasParts.length}`);
console.log(`Ramayana params: ${data.ramayanaSargas.length}`);
console.log(`Mahabharata parvas: ${data.mahabharataParvas.length}`);
console.log(`Mahabharata chapters: ${data.mahabharataChapters.length}`);
console.log(`Bhagavad Gita chapters: ${data.bhagavadGitaChapters.length}`);
console.log(`Bhagavad Gita verses: ${data.bhagavadGitaVerses.length}`);
console.log(`Vedas chapters: ${data.vedasChapters.length}`);
console.log(`Vedas items: ${data.vedasItems.length}`);
console.log(`Vedic Philosophy parts: ${data.vedicPhilosophyParts.length}`);
