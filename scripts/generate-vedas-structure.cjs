const fs = require('fs');
const path = require('path');

const root = process.cwd();
const localesDir = path.join(root, 'locales', 'en');

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(path.join(localesDir, file), JSON.stringify(data, null, 2) + '\n', 'utf8');
}

const rigvedaMain = readJson('vedas_rigveda.json');
const yajurMain = readJson('vedas_yajurveda.json');
const samavedaMain = readJson('vedas_samaveda.json');
const atharvaMain = readJson('vedas_atharvaveda.json');

const rigvedaMandalaCounts = {};
const rigvedaMandalas = [];

for (let mandala = 1; mandala <= 10; mandala += 1) {
  const file = `vedas_rigveda_madala${mandala}.json`;
  const data = readJson(file);
  const key = `mandala-${mandala}`;
  const node = data[key] || {};
  const hymns = Array.isArray(node.hymns) ? node.hymns : [];
  rigvedaMandalaCounts[key] = hymns.length;
  rigvedaMandalas.push({
    mandala,
    path: `/vedas/rigveda/mandala-${mandala}`,
    hymn_count: hymns.length,
    hymns: hymns.map((h, idx) => {
      const hymnNumber = Number(h.hymn_number || idx + 1);
      return {
        hymn_number: hymnNumber,
        title: String(h.title || `Rigveda Mandala ${mandala} Hymn ${hymnNumber}`),
        path: `/vedas/rigveda/mandala-${mandala}/hymn-${hymnNumber}`,
      };
    }),
  });
}

const yajurRoot = yajurMain.yajurveda || {};
const yajurChapters = Array.isArray(yajurRoot.yajurveda_chapters) ? yajurRoot.yajurveda_chapters : [];
const generatedYajurMantras = yajurChapters.map((chapter, idx) => {
  const chapterNumber = Number(chapter.chapter || idx + 1);
  const mantraCount = 12;
  return {
    chapter: chapterNumber,
    title: String(chapter.title || `Yajurveda Chapter ${chapterNumber}`),
    introduction: String(chapter.introduction || ''),
    scripture_text: String(chapter.scripture_text || ''),
    philosophical_explanation: String(chapter.philosophical_explanation || ''),
    path: `/vedas/yajurveda/chapter-${chapterNumber}`,
    mantras: Array.from({ length: mantraCount }, (_, i) => {
      const mantraNumber = i + 1;
      return {
        mantra_number: mantraNumber,
        title: `Yajurveda Chapter ${chapterNumber} Mantra ${mantraNumber}`,
        introduction: `This mantra belongs to Yajurveda Chapter ${chapterNumber}.`,
        scripture_text: `Traditional Yajurvedic mantra placeholder text for Chapter ${chapterNumber}, Mantra ${mantraNumber}.`,
        philosophical_explanation: `Yajurvedic mantras connect ritual action with inner discipline, offering and sacred intention.`,
        path: `/vedas/yajurveda/chapter-${chapterNumber}/mantra-${mantraNumber}`,
      };
    }),
  };
});

const samaRoot = samavedaMain.samaveda || {};
const samaSections = Array.isArray(samaRoot.samaveda_sections) ? samaRoot.samaveda_sections : [];
const samavedaHymns = samaSections.map((section, idx) => {
  const hymnNumber = Number(section.section || idx + 1);
  return {
    hymn_number: hymnNumber,
    title: String(section.title || `Samaveda Hymn ${hymnNumber}`),
    introduction: String(section.introduction || ''),
    scripture_text: String(section.scripture_text || ''),
    philosophical_explanation: String(section.philosophical_explanation || ''),
    path: `/vedas/samaveda/hymn-${hymnNumber}`,
  };
});

const atharvaRoot = atharvaMain.atharvaveda || {};
const atharvaBooks = Array.isArray(atharvaRoot.atharvaveda_books) ? atharvaRoot.atharvaveda_books : [];
const generatedAtharvaHymns = atharvaBooks.map((book, idx) => {
  const bookNumber = Number(book.book || idx + 1);
  const hymnCount = 10;
  return {
    book: bookNumber,
    title: String(book.title || `Atharvaveda Book ${bookNumber}`),
    introduction: String(book.introduction || ''),
    scripture_text: String(book.scripture_text || ''),
    philosophical_explanation: String(book.philosophical_explanation || ''),
    path: `/vedas/atharvaveda/book-${bookNumber}`,
    hymns: Array.from({ length: hymnCount }, (_, i) => {
      const hymnNumber = i + 1;
      return {
        hymn_number: hymnNumber,
        title: `Atharvaveda Book ${bookNumber} Hymn ${hymnNumber}`,
        introduction: `This hymn belongs to Atharvaveda Book ${bookNumber}.`,
        scripture_text: `Traditional Atharvavedic hymn placeholder text for Book ${bookNumber}, Hymn ${hymnNumber}.`,
        philosophical_explanation: `Atharvavedic hymns integrate practical life, healing, and contemplative insight.`,
        path: `/vedas/atharvaveda/book-${bookNumber}/hymn-${hymnNumber}`,
      };
    }),
  };
});

writeJson('vedas_rigveda_hymns_structure.json', {
  rigveda: {
    title: String(rigvedaMain.rigveda?.title || 'Rigveda'),
    total_mandalas: rigvedaMandalas.length,
    total_hymns: rigvedaMandalas.reduce((sum, m) => sum + m.hymn_count, 0),
    mandalas: rigvedaMandalas,
  },
});

writeJson('vedas_yajurveda_structure.json', {
  yajurveda: {
    title: String(yajurRoot.title || 'Yajurveda'),
    total_chapters: generatedYajurMantras.length,
    total_mantras: generatedYajurMantras.reduce((sum, c) => sum + c.mantras.length, 0),
    chapters: generatedYajurMantras,
  },
});

writeJson('vedas_samaveda_structure.json', {
  samaveda: {
    title: String(samaRoot.title || 'Samaveda'),
    total_hymns: samavedaHymns.length,
    hymns: samavedaHymns,
  },
});

writeJson('vedas_atharvaveda_structure.json', {
  atharvaveda: {
    title: String(atharvaRoot.title || 'Atharvaveda'),
    total_books: generatedAtharvaHymns.length,
    total_hymns: generatedAtharvaHymns.reduce((sum, b) => sum + b.hymns.length, 0),
    books: generatedAtharvaHymns,
  },
});

writeJson('vedas_structure.json', {
  vedas: {
    title: 'Vedas Structure',
    updated_on: new Date().toISOString().slice(0, 10),
    structure: {
      rigveda: {
        base_path: '/vedas/rigveda',
        chapter_prefix: 'mandala',
        item_prefix: 'hymn',
        total_chapters: 10,
        chapter_item_counts: rigvedaMandalaCounts,
      },
      yajurveda: {
        base_path: '/vedas/yajurveda',
        chapter_prefix: 'chapter',
        item_prefix: 'mantra',
        total_chapters: generatedYajurMantras.length,
        items_per_chapter: 12,
      },
      samaveda: {
        base_path: '/vedas/samaveda',
        direct_item_prefix: 'hymn',
        total_items: samavedaHymns.length,
      },
      atharvaveda: {
        base_path: '/vedas/atharvaveda',
        chapter_prefix: 'book',
        item_prefix: 'hymn',
        total_chapters: generatedAtharvaHymns.length,
        items_per_chapter: 10,
      },
    },
  },
});

console.log('Generated Veda structure JSON files in locales/en');
