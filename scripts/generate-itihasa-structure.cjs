const fs = require('fs');
const path = require('path');

const root = process.cwd();
const localesDir = path.join(root, 'locales', 'en');
const siteUrl = 'https://sanatanadharmam.in';

const ramayanaKandas = [
  'bala-kanda',
  'ayodhya-kanda',
  'aranya-kanda',
  'kishkinda-kanda',
  'sundara-kanda',
  'yuddha-kanda',
  'uttara-kanda',
];

const mahabharataParvas = [
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

const config = {
  sargasPerKanda: 50,
  chaptersPerParva: 20,
  gitaChapters: 18,
  gitaVersesPerChapter: 5,
};

function writeJson(file, data) {
  fs.writeFileSync(path.join(localesDir, file), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function toTitle(slug) {
  return String(slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toUnderscore(slug) {
  return String(slug).replace(/-/g, '_');
}

let ramayanaLeafPages = 0;
let mahabharataLeafPages = 0;
let gitaLeafPages = 0;

const ramayanaKandaEntries = [];
for (const kanda of ramayanaKandas) {
  const kandaTitle = toTitle(kanda);
  const kandaPath = `/itihasa/ramayana/${kanda}`;
  const kandaNamespace = `itihasa_ramayana_${toUnderscore(kanda)}`;

  const sargas = [];
  for (let sarga = 1; sarga <= config.sargasPerKanda; sarga += 1) {
    const sargaPath = `${kandaPath}/sarga-${sarga}`;
    const sargaNamespace = `${kandaNamespace}_sarga${sarga}`;
    const sargaTitle = `Ramayana ${kandaTitle} Sarga ${sarga}`;

    writeJson(`${sargaNamespace}.json`, {
      [sargaNamespace]: {
        title: sargaTitle,
        description: `Sarga ${sarga} from ${kandaTitle} of the Ramayana.`,
        meta: {
          title: sargaTitle,
          canonical: `${siteUrl}${sargaPath}`,
          description: `Sarga ${sarga} from ${kandaTitle} of the Ramayana.`,
          url: `${siteUrl}${sargaPath}`,
        },
        openGraph: {
          title: sargaTitle,
          description: `Sarga ${sarga} from ${kandaTitle} of the Ramayana.`,
          url: `${siteUrl}${sargaPath}`,
          siteName: 'Sanatanadharmam',
          type: 'article',
        },
        introduction: `This sarga belongs to ${kandaTitle} in the Ramayana narrative sequence.`,
        scripture_text: `Placeholder text for ${kandaTitle}, Sarga ${sarga}.`,
        philosophical_explanation: `This sarga reinforces dharma, devotion, and ethical action as taught in the Ramayana.`,
      },
    });

    sargas.push({
      sarga,
      path: sargaPath,
      title: sargaTitle,
    });
    ramayanaLeafPages += 1;
  }

  writeJson(`${kandaNamespace}.json`, {
    [kandaNamespace]: {
      title: `Ramayana ${kandaTitle}`,
      description: `${kandaTitle} overview and storyline context from the Ramayana.`,
      meta: {
        title: `Ramayana ${kandaTitle}`,
        canonical: `${siteUrl}${kandaPath}`,
        description: `${kandaTitle} overview and storyline context from the Ramayana.`,
        url: `${siteUrl}${kandaPath}`,
      },
      openGraph: {
        title: `Ramayana ${kandaTitle}`,
        description: `${kandaTitle} overview and storyline context from the Ramayana.`,
        url: `${siteUrl}${kandaPath}`,
        siteName: 'Sanatanadharmam',
        type: 'article',
      },
      introduction: `${kandaTitle} organizes key episodes in Lord Rama's life and dharmic conduct.`,
      scripture_text: `${kandaTitle} contains ${config.sargasPerKanda} generated sargas for route-level navigation.`,
      philosophical_explanation: `The kanda structure helps read the Ramayana in thematic and chronological order.`,
    },
  });

  ramayanaKandaEntries.push({
    slug: kanda,
    title: kandaTitle,
    path: kandaPath,
    total_sargas: config.sargasPerKanda,
    sargas,
  });
}

writeJson('itihasa_ramayana_structure.json', {
  itihasa_ramayana_structure: {
    title: 'Ramayana Structure',
    description: 'Structured Ramayana navigation with kanda and sarga hierarchy.',
    total_kandas: ramayanaKandas.length,
    total_sargas: ramayanaLeafPages,
    kandas: ramayanaKandaEntries,
  },
});

const mahabharataParvaEntries = [];
for (const parva of mahabharataParvas) {
  const parvaTitle = toTitle(parva);
  const parvaPath = `/itihasa/mahabharata/${parva}`;
  const parvaNamespace = `itihasa_mahabharata_${toUnderscore(parva)}`;

  const chapters = [];
  for (let chapter = 1; chapter <= config.chaptersPerParva; chapter += 1) {
    const chapterPath = `${parvaPath}/chapter-${chapter}`;
    const chapterNamespace = `${parvaNamespace}_chapter${chapter}`;
    const chapterTitle = `Mahabharata ${parvaTitle} Chapter ${chapter}`;

    writeJson(`${chapterNamespace}.json`, {
      [chapterNamespace]: {
        title: chapterTitle,
        description: `Chapter ${chapter} from ${parvaTitle} of the Mahabharata.`,
        meta: {
          title: chapterTitle,
          canonical: `${siteUrl}${chapterPath}`,
          description: `Chapter ${chapter} from ${parvaTitle} of the Mahabharata.`,
          url: `${siteUrl}${chapterPath}`,
        },
        openGraph: {
          title: chapterTitle,
          description: `Chapter ${chapter} from ${parvaTitle} of the Mahabharata.`,
          url: `${siteUrl}${chapterPath}`,
          siteName: 'Sanatanadharmam',
          type: 'article',
        },
        introduction: `This chapter belongs to ${parvaTitle} in the Mahabharata.`,
        scripture_text: `Placeholder text for ${parvaTitle}, Chapter ${chapter}.`,
        philosophical_explanation: `This chapter contributes to the Mahabharata's teachings on duty, justice, and statecraft.`,
      },
    });

    chapters.push({
      chapter,
      path: chapterPath,
      title: chapterTitle,
    });
    mahabharataLeafPages += 1;
  }

  writeJson(`${parvaNamespace}.json`, {
    [parvaNamespace]: {
      title: `Mahabharata ${parvaTitle}`,
      description: `${parvaTitle} overview and chapter map in the Mahabharata.`,
      meta: {
        title: `Mahabharata ${parvaTitle}`,
        canonical: `${siteUrl}${parvaPath}`,
        description: `${parvaTitle} overview and chapter map in the Mahabharata.`,
        url: `${siteUrl}${parvaPath}`,
      },
      openGraph: {
        title: `Mahabharata ${parvaTitle}`,
        description: `${parvaTitle} overview and chapter map in the Mahabharata.`,
        url: `${siteUrl}${parvaPath}`,
        siteName: 'Sanatanadharmam',
        type: 'article',
      },
      introduction: `${parvaTitle} is one of the 18 parvas of the Mahabharata.`,
      scripture_text: `${parvaTitle} contains ${config.chaptersPerParva} generated chapters for deep route traversal.`,
      philosophical_explanation: `The parva structure helps organize narrative, ethics, and dharma dialogue across the epic.`,
    },
  });

  mahabharataParvaEntries.push({
    slug: parva,
    title: parvaTitle,
    path: parvaPath,
    total_chapters: config.chaptersPerParva,
    chapters,
  });
}

writeJson('itihasa_mahabharata_structure.json', {
  itihasa_mahabharata_structure: {
    title: 'Mahabharata Structure',
    description: 'Structured Mahabharata navigation with parva and chapter hierarchy.',
    total_parvas: mahabharataParvas.length,
    total_chapters: mahabharataLeafPages,
    parvas: mahabharataParvaEntries,
  },
});

const gitaChapters = [];
for (let chapter = 1; chapter <= config.gitaChapters; chapter += 1) {
  const chapterPath = `/itihasa/bhagavad-gita/chapter-${chapter}`;
  const chapterNamespace = `itihasa_bhagavad_gita_chapter${chapter}`;
  const chapterTitle = `Bhagavad Gita Chapter ${chapter}`;

  const verses = [];
  for (let verse = 1; verse <= config.gitaVersesPerChapter; verse += 1) {
    const versePath = `${chapterPath}/verse-${verse}`;
    const verseNamespace = `${chapterNamespace}_verse${verse}`;
    const verseTitle = `Bhagavad Gita Chapter ${chapter} Verse ${verse}`;

    writeJson(`${verseNamespace}.json`, {
      [verseNamespace]: {
        title: verseTitle,
        description: `Verse ${verse} from Bhagavad Gita Chapter ${chapter}.`,
        meta: {
          title: verseTitle,
          canonical: `${siteUrl}${versePath}`,
          description: `Verse ${verse} from Bhagavad Gita Chapter ${chapter}.`,
          url: `${siteUrl}${versePath}`,
        },
        openGraph: {
          title: verseTitle,
          description: `Verse ${verse} from Bhagavad Gita Chapter ${chapter}.`,
          url: `${siteUrl}${versePath}`,
          siteName: 'Sanatanadharmam',
          type: 'article',
        },
        introduction: `This verse belongs to Chapter ${chapter} of the Bhagavad Gita.`,
        scripture_text: `Placeholder text for Bhagavad Gita Chapter ${chapter}, Verse ${verse}.`,
        philosophical_explanation: `This verse contributes to Krishna's teaching on dharma, yoga, and liberation.`,
      },
    });

    verses.push({
      verse_number: verse,
      path: versePath,
      title: verseTitle,
    });
    gitaLeafPages += 1;
  }

  writeJson(`${chapterNamespace}.json`, {
    [chapterNamespace]: {
      title: chapterTitle,
      description: `Overview of Bhagavad Gita Chapter ${chapter}.`,
      meta: {
        title: chapterTitle,
        canonical: `${siteUrl}${chapterPath}`,
        description: `Overview of Bhagavad Gita Chapter ${chapter}.`,
        url: `${siteUrl}${chapterPath}`,
      },
      openGraph: {
        title: chapterTitle,
        description: `Overview of Bhagavad Gita Chapter ${chapter}.`,
        url: `${siteUrl}${chapterPath}`,
        siteName: 'Sanatanadharmam',
        type: 'article',
      },
      introduction: `Chapter ${chapter} presents a distinct yoga and spiritual teaching trajectory.`,
      scripture_text: `Chapter ${chapter} includes ${config.gitaVersesPerChapter} generated verse pages in this structure.`,
      philosophical_explanation: `Each chapter of the Gita develops key Vedantic and yogic ideas in a progressive framework.`,
    },
  });

  gitaChapters.push({
    chapter,
    path: chapterPath,
    title: chapterTitle,
    verses,
  });
}

writeJson('itihasa_bhagavad_gita_structure.json', {
  itihasa_bhagavad_gita_structure: {
    title: 'Bhagavad Gita Structure',
    description: 'Structured Bhagavad Gita navigation with chapter and verse hierarchy.',
    total_chapters: config.gitaChapters,
    total_verses: gitaLeafPages,
    chapters: gitaChapters,
  },
});

const totalLeafPages = ramayanaLeafPages + mahabharataLeafPages + gitaLeafPages;

writeJson('itihasa_structure.json', {
  itihasa_structure: {
    title: 'Itihasa Structure',
    description: 'Combined Itihasa structure for Ramayana, Mahabharata, and Bhagavad Gita.',
    total_leaf_pages: totalLeafPages,
    sections: [
      {
        slug: 'ramayana',
        total_leaf_pages: ramayanaLeafPages,
        path: '/itihasa/ramayana',
        content_model: 'kanda/sarga',
      },
      {
        slug: 'mahabharata',
        total_leaf_pages: mahabharataLeafPages,
        path: '/itihasa/mahabharata',
        content_model: 'parva/chapter',
      },
      {
        slug: 'bhagavad-gita',
        total_leaf_pages: gitaLeafPages,
        path: '/itihasa/bhagavad-gita',
        content_model: 'chapter/verse',
      },
    ],
  },
});

console.log('Generated Itihasa files');
console.log(`Ramayana sarga pages: ${ramayanaLeafPages}`);
console.log(`Mahabharata chapter pages: ${mahabharataLeafPages}`);
console.log(`Bhagavad Gita verse pages: ${gitaLeafPages}`);
console.log(`Total Itihasa leaf pages: ${totalLeafPages}`);
