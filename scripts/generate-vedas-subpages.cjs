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

function titleCaseFromSlug(text) {
  return String(text)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

let generated = 0;

// Rigveda: from existing mandala files
for (let mandala = 1; mandala <= 10; mandala += 1) {
  const file = `vedas_rigveda_madala${mandala}.json`;
  const data = readJson(file);
  const key = `mandala-${mandala}`;
  const entry = data[key] || {};
  const hymns = Array.isArray(entry.hymns) ? entry.hymns : [];

  hymns.forEach((h, index) => {
    const hymnNumber = Number(h.hymn_number || index + 1);
    const outFile = `vedas_rigveda_madala${mandala}_hymn${hymnNumber}.json`;
    const pagePath = `/vedas/rigveda/mandala-${mandala}/hymn-${hymnNumber}`;
    const title = String(h.title || `Rigveda Mandala ${mandala} Hymn ${hymnNumber}`);
    const intro = String(h.introduction || '');
    const scriptureText = String(h.scripture_text || '');
    const philosophical = String(h.philosophical_explanation || '');

    const out = {
      [`rigveda_mandala${mandala}_hymn${hymnNumber}`]: {
        title,
        description: intro || `Detailed page for Rigveda Mandala ${mandala} Hymn ${hymnNumber}.`,
        meta: {
          title,
          canonical: `https://sanatanadharmam.in${pagePath}`,
          description: intro || `Explore Rigveda Mandala ${mandala} Hymn ${hymnNumber}.`,
          url: `https://sanatanadharmam.in${pagePath}`,
        },
        openGraph: {
          title,
          description: intro || `Explore Rigveda Mandala ${mandala} Hymn ${hymnNumber}.`,
          url: `https://sanatanadharmam.in${pagePath}`,
          siteName: 'Sanatanadharmam',
          type: 'article',
        },
        chapter: {
          slug: 'rigveda',
          key: `mandala-${mandala}`,
          label: `Mandala ${mandala}`,
          path: `/vedas/rigveda/mandala-${mandala}`,
        },
        item: {
          prefix: 'hymn',
          number: hymnNumber,
          path: pagePath,
        },
        introduction: intro,
        scripture_text: scriptureText,
        philosophical_explanation: philosophical,
      },
    };

    writeJson(outFile, out);
    generated += 1;
  });
}

// Yajurveda: from structure file
const yajurData = readJson('vedas_yajurveda_structure.json');
const yajurRoot = yajurData.yajurveda || {};
const yajurChapters = Array.isArray(yajurRoot.chapters) ? yajurRoot.chapters : [];

for (const chapter of yajurChapters) {
  const chapterNumber = Number(chapter.chapter);
  const mantras = Array.isArray(chapter.mantras) ? chapter.mantras : [];

  for (const mantra of mantras) {
    const mantraNumber = Number(mantra.mantra_number);
    const outFile = `vedas_yajurveda_chapter${chapterNumber}_mantra${mantraNumber}.json`;
    const pagePath = `/vedas/yajurveda/chapter-${chapterNumber}/mantra-${mantraNumber}`;
    const title = String(mantra.title || `Yajurveda Chapter ${chapterNumber} Mantra ${mantraNumber}`);
    const intro = String(mantra.introduction || '');
    const scriptureText = String(mantra.scripture_text || '');
    const philosophical = String(mantra.philosophical_explanation || '');

    const out = {
      [`yajurveda_chapter${chapterNumber}_mantra${mantraNumber}`]: {
        title,
        description: intro || `Detailed page for Yajurveda Chapter ${chapterNumber} Mantra ${mantraNumber}.`,
        meta: {
          title,
          canonical: `https://sanatanadharmam.in${pagePath}`,
          description: intro || `Explore Yajurveda Chapter ${chapterNumber} Mantra ${mantraNumber}.`,
          url: `https://sanatanadharmam.in${pagePath}`,
        },
        openGraph: {
          title,
          description: intro || `Explore Yajurveda Chapter ${chapterNumber} Mantra ${mantraNumber}.`,
          url: `https://sanatanadharmam.in${pagePath}`,
          siteName: 'Sanatanadharmam',
          type: 'article',
        },
        chapter: {
          slug: 'yajurveda',
          key: `chapter-${chapterNumber}`,
          label: `Chapter ${chapterNumber}`,
          path: `/vedas/yajurveda/chapter-${chapterNumber}`,
        },
        item: {
          prefix: 'mantra',
          number: mantraNumber,
          path: pagePath,
        },
        introduction: intro,
        scripture_text: scriptureText,
        philosophical_explanation: philosophical,
      },
    };

    writeJson(outFile, out);
    generated += 1;
  }
}

// Samaveda: direct hymn pages
const samavedaData = readJson('vedas_samaveda_structure.json');
const samavedaRoot = samavedaData.samaveda || {};
const samavedaHymns = Array.isArray(samavedaRoot.hymns) ? samavedaRoot.hymns : [];

for (const hymn of samavedaHymns) {
  const hymnNumber = Number(hymn.hymn_number);
  const outFile = `vedas_samaveda_hymn${hymnNumber}.json`;
  const pagePath = `/vedas/samaveda/hymn-${hymnNumber}`;
  const title = String(hymn.title || `Samaveda Hymn ${hymnNumber}`);
  const intro = String(hymn.introduction || '');
  const scriptureText = String(hymn.scripture_text || '');
  const philosophical = String(hymn.philosophical_explanation || '');

  const out = {
    [`samaveda_hymn${hymnNumber}`]: {
      title,
      description: intro || `Detailed page for Samaveda Hymn ${hymnNumber}.`,
      meta: {
        title,
        canonical: `https://sanatanadharmam.in${pagePath}`,
        description: intro || `Explore Samaveda Hymn ${hymnNumber}.`,
        url: `https://sanatanadharmam.in${pagePath}`,
      },
      openGraph: {
        title,
        description: intro || `Explore Samaveda Hymn ${hymnNumber}.`,
        url: `https://sanatanadharmam.in${pagePath}`,
        siteName: 'Sanatanadharmam',
        type: 'article',
      },
      chapter: {
        slug: 'samaveda',
        key: `hymn-${hymnNumber}`,
        label: `Hymn ${hymnNumber}`,
        path: pagePath,
      },
      item: {
        prefix: 'hymn',
        number: hymnNumber,
        path: pagePath,
      },
      introduction: intro,
      scripture_text: scriptureText,
      philosophical_explanation: philosophical,
    },
  };

  writeJson(outFile, out);
  generated += 1;
}

// Atharvaveda: from structure file books -> hymns
const atharvaData = readJson('vedas_atharvaveda_structure.json');
const atharvaRoot = atharvaData.atharvaveda || {};
const atharvaBooks = Array.isArray(atharvaRoot.books) ? atharvaRoot.books : [];

for (const book of atharvaBooks) {
  const bookNumber = Number(book.book);
  const hymns = Array.isArray(book.hymns) ? book.hymns : [];

  for (const hymn of hymns) {
    const hymnNumber = Number(hymn.hymn_number);
    const outFile = `vedas_atharvaveda_book${bookNumber}_hymn${hymnNumber}.json`;
    const pagePath = `/vedas/atharvaveda/book-${bookNumber}/hymn-${hymnNumber}`;
    const title = String(hymn.title || `Atharvaveda Book ${bookNumber} Hymn ${hymnNumber}`);
    const intro = String(hymn.introduction || '');
    const scriptureText = String(hymn.scripture_text || '');
    const philosophical = String(hymn.philosophical_explanation || '');

    const out = {
      [`atharvaveda_book${bookNumber}_hymn${hymnNumber}`]: {
        title,
        description: intro || `Detailed page for Atharvaveda Book ${bookNumber} Hymn ${hymnNumber}.`,
        meta: {
          title,
          canonical: `https://sanatanadharmam.in${pagePath}`,
          description: intro || `Explore Atharvaveda Book ${bookNumber} Hymn ${hymnNumber}.`,
          url: `https://sanatanadharmam.in${pagePath}`,
        },
        openGraph: {
          title,
          description: intro || `Explore Atharvaveda Book ${bookNumber} Hymn ${hymnNumber}.`,
          url: `https://sanatanadharmam.in${pagePath}`,
          siteName: 'Sanatanadharmam',
          type: 'article',
        },
        chapter: {
          slug: 'atharvaveda',
          key: `book-${bookNumber}`,
          label: `Book ${bookNumber}`,
          path: `/vedas/atharvaveda/book-${bookNumber}`,
        },
        item: {
          prefix: 'hymn',
          number: hymnNumber,
          path: pagePath,
        },
        introduction: intro,
        scripture_text: scriptureText,
        philosophical_explanation: philosophical,
      },
    };

    writeJson(outFile, out);
    generated += 1;
  }
}

console.log(`Generated sub-page Veda JSON files: ${generated}`);
