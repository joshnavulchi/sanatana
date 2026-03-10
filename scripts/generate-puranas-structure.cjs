const fs = require('fs');
const path = require('path');

const root = process.cwd();
const localesDir = path.join(root, 'locales', 'en');
const siteUrl = 'https://sanatanadharmam.in';

const mahapuranas = [
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

function readJson(file) {
  const full = path.join(localesDir, file);
  if (!fs.existsSync(full)) return null;
  return JSON.parse(fs.readFileSync(full, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(path.join(localesDir, file), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function toTitle(slug) {
  return String(slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getOverview(slug) {
  const file = `puranas_${slug}_purana.json`;
  const raw = readJson(file);
  if (!raw || typeof raw !== 'object') return null;
  const firstKey = Object.keys(raw)[0];
  if (!firstKey || typeof raw[firstKey] !== 'object') return null;
  return raw[firstKey];
}

const config = {
  defaultChapterCount: 10,
  defaultVersesPerChapter: 10,
  bhagavataSkandaCount: 12,
  bhagavataChaptersPerSkanda: 5,
  bhagavataVersesPerChapter: 5,
};

let generatedChapterFiles = 0;
let generatedVerseFiles = 0;
let generatedSkandaFiles = 0;
let totalVersePages = 0;

const puranasIndex = [];

for (const slug of mahapuranas) {
  const overview = getOverview(slug);
  const title = (overview && overview.title) || `${toTitle(slug)} Purana`;
  const description = (overview && overview.description) || `${toTitle(slug)} Purana overview and structure.`;

  if (slug === 'bhagavata') {
    const skandas = [];
    for (let skanda = 1; skanda <= config.bhagavataSkandaCount; skanda += 1) {
      const skandaTitle = `Bhagavata Skanda ${skanda}`;
      const skandaPath = `/puranas/bhagavata/skanda-${skanda}`;
      const skandaData = {
        [`bhagavata_skanda${skanda}`]: {
          title: skandaTitle,
          description: `Structure and chapter overview of Bhagavata Skanda ${skanda}.`,
          meta: {
            title: skandaTitle,
            canonical: `${siteUrl}${skandaPath}`,
            description: `Structure and chapter overview of Bhagavata Skanda ${skanda}.`,
            url: `${siteUrl}${skandaPath}`,
          },
          openGraph: {
            title: skandaTitle,
            description: `Structure and chapter overview of Bhagavata Skanda ${skanda}.`,
            url: `${siteUrl}${skandaPath}`,
            siteName: 'Sanatanadharmam',
            type: 'article',
          },
          introduction: `Skanda ${skanda} of the Bhagavata Purana groups chapters into a devotional and philosophical progression.`,
          scripture_text: `This skanda contains chapter-level teachings that prepare the reader for deeper verse-by-verse study.`,
          philosophical_explanation: `Bhagavata skandas are designed to progressively refine bhakti, ethics, and spiritual understanding.`,
          skanda: {
            number: skanda,
            path: skandaPath,
          },
        },
      };

      writeJson(`puranas_bhagavata_skanda${skanda}.json`, skandaData);
      generatedSkandaFiles += 1;

      const chapters = [];
      for (let chapter = 1; chapter <= config.bhagavataChaptersPerSkanda; chapter += 1) {
        const chapterTitle = `Bhagavata Skanda ${skanda} Chapter ${chapter}`;
        const chapterPath = `${skandaPath}/chapter-${chapter}`;
        const chapterData = {
          [`bhagavata_skanda${skanda}_chapter${chapter}`]: {
            title: chapterTitle,
            description: `Chapter ${chapter} from Bhagavata Skanda ${skanda}.`,
            meta: {
              title: chapterTitle,
              canonical: `${siteUrl}${chapterPath}`,
              description: `Chapter ${chapter} from Bhagavata Skanda ${skanda}.`,
              url: `${siteUrl}${chapterPath}`,
            },
            openGraph: {
              title: chapterTitle,
              description: `Chapter ${chapter} from Bhagavata Skanda ${skanda}.`,
              url: `${siteUrl}${chapterPath}`,
              siteName: 'Sanatanadharmam',
              type: 'article',
            },
            introduction: `This chapter belongs to Bhagavata Skanda ${skanda}.`,
            scripture_text: `Chapter-level summary text for Bhagavata Skanda ${skanda}, Chapter ${chapter}.`,
            philosophical_explanation: `Each Bhagavata chapter blends narrative devotion with Vedantic insight.`,
            skanda: {
              number: skanda,
              path: skandaPath,
            },
            chapter: {
              number: chapter,
              path: chapterPath,
            },
          },
        };

        writeJson(`puranas_bhagavata_skanda${skanda}_chapter${chapter}.json`, chapterData);
        generatedChapterFiles += 1;

        const verses = [];
        for (let verse = 1; verse <= config.bhagavataVersesPerChapter; verse += 1) {
          const verseTitle = `Bhagavata Skanda ${skanda} Chapter ${chapter} Verse ${verse}`;
          const versePath = `${chapterPath}/verse-${verse}`;
          const verseData = {
            [`bhagavata_skanda${skanda}_chapter${chapter}_verse${verse}`]: {
              title: verseTitle,
              description: `Verse ${verse} from Bhagavata Skanda ${skanda}, Chapter ${chapter}.`,
              meta: {
                title: verseTitle,
                canonical: `${siteUrl}${versePath}`,
                description: `Verse ${verse} from Bhagavata Skanda ${skanda}, Chapter ${chapter}.`,
                url: `${siteUrl}${versePath}`,
              },
              openGraph: {
                title: verseTitle,
                description: `Verse ${verse} from Bhagavata Skanda ${skanda}, Chapter ${chapter}.`,
                url: `${siteUrl}${versePath}`,
                siteName: 'Sanatanadharmam',
                type: 'article',
              },
              introduction: `This verse belongs to Bhagavata Skanda ${skanda}, Chapter ${chapter}.`,
              scripture_text: `Placeholder Sanskrit/translation content for Bhagavata Skanda ${skanda}, Chapter ${chapter}, Verse ${verse}.`,
              philosophical_explanation: `This verse continues the devotional and philosophical current of the Bhagavata Purana.`,
              skanda: {
                number: skanda,
                path: skandaPath,
              },
              chapter: {
                number: chapter,
                path: chapterPath,
              },
              verse: {
                number: verse,
                path: versePath,
              },
            },
          };

          writeJson(`puranas_bhagavata_skanda${skanda}_chapter${chapter}_verse${verse}.json`, verseData);
          generatedVerseFiles += 1;
          totalVersePages += 1;

          verses.push({
            verse_number: verse,
            title: verseTitle,
            path: versePath,
          });
        }

        chapters.push({
          chapter,
          title: chapterTitle,
          path: chapterPath,
          verses,
        });
      }

      skandas.push({
        skanda,
        title: skandaTitle,
        path: skandaPath,
        chapters,
      });
    }

    writeJson('puranas_bhagavata_structure.json', {
      title,
      description,
      slug,
      total_skandas: config.bhagavataSkandaCount,
      total_chapters: config.bhagavataSkandaCount * config.bhagavataChaptersPerSkanda,
      total_verses:
        config.bhagavataSkandaCount * config.bhagavataChaptersPerSkanda * config.bhagavataVersesPerChapter,
      skandas,
    });

    puranasIndex.push({
      slug,
      title,
      path: `/puranas/${slug}`,
      content_model: 'skanda/chapter/verse',
      total_chapters: config.bhagavataSkandaCount * config.bhagavataChaptersPerSkanda,
      total_verses:
        config.bhagavataSkandaCount * config.bhagavataChaptersPerSkanda * config.bhagavataVersesPerChapter,
    });

    continue;
  }

  const chapters = [];
  for (let chapter = 1; chapter <= config.defaultChapterCount; chapter += 1) {
    const chapterTitle = `${toTitle(slug)} Purana Chapter ${chapter}`;
    const chapterPath = `/puranas/${slug}/chapter-${chapter}`;
    const chapterData = {
      [`${slug}_chapter${chapter}`]: {
        title: chapterTitle,
        description: `Chapter ${chapter} from ${toTitle(slug)} Purana.`,
        meta: {
          title: chapterTitle,
          canonical: `${siteUrl}${chapterPath}`,
          description: `Chapter ${chapter} from ${toTitle(slug)} Purana.`,
          url: `${siteUrl}${chapterPath}`,
        },
        openGraph: {
          title: chapterTitle,
          description: `Chapter ${chapter} from ${toTitle(slug)} Purana.`,
          url: `${siteUrl}${chapterPath}`,
          siteName: 'Sanatanadharmam',
          type: 'article',
        },
        introduction: `This chapter belongs to ${toTitle(slug)} Purana.`,
        scripture_text: `Chapter-level summary text for ${toTitle(slug)} Purana, Chapter ${chapter}.`,
        philosophical_explanation: `${toTitle(slug)} Purana chapters combine dharma, devotion, and symbolic teaching.`,
        chapter: {
          number: chapter,
          path: chapterPath,
        },
      },
    };

    writeJson(`puranas_${slug}_chapter${chapter}.json`, chapterData);
    generatedChapterFiles += 1;

    const verses = [];
    for (let verse = 1; verse <= config.defaultVersesPerChapter; verse += 1) {
      const verseTitle = `${toTitle(slug)} Purana Chapter ${chapter} Verse ${verse}`;
      const versePath = `${chapterPath}/verse-${verse}`;
      const verseData = {
        [`${slug}_chapter${chapter}_verse${verse}`]: {
          title: verseTitle,
          description: `Verse ${verse} from ${toTitle(slug)} Purana, Chapter ${chapter}.`,
          meta: {
            title: verseTitle,
            canonical: `${siteUrl}${versePath}`,
            description: `Verse ${verse} from ${toTitle(slug)} Purana, Chapter ${chapter}.`,
            url: `${siteUrl}${versePath}`,
          },
          openGraph: {
            title: verseTitle,
            description: `Verse ${verse} from ${toTitle(slug)} Purana, Chapter ${chapter}.`,
            url: `${siteUrl}${versePath}`,
            siteName: 'Sanatanadharmam',
            type: 'article',
          },
          introduction: `This verse belongs to ${toTitle(slug)} Purana, Chapter ${chapter}.`,
          scripture_text: `Placeholder Sanskrit/translation content for ${toTitle(slug)} Purana, Chapter ${chapter}, Verse ${verse}.`,
          philosophical_explanation: `This verse contributes to the ongoing ethical and devotional narrative of ${toTitle(slug)} Purana.`,
          chapter: {
            number: chapter,
            path: chapterPath,
          },
          verse: {
            number: verse,
            path: versePath,
          },
        },
      };

      writeJson(`puranas_${slug}_chapter${chapter}_verse${verse}.json`, verseData);
      generatedVerseFiles += 1;
      totalVersePages += 1;

      verses.push({
        verse_number: verse,
        title: verseTitle,
        path: versePath,
      });
    }

    chapters.push({
      chapter,
      title: chapterTitle,
      path: chapterPath,
      verses,
    });
  }

  writeJson(`puranas_${slug}_structure.json`, {
    title,
    description,
    slug,
    total_chapters: config.defaultChapterCount,
    total_verses: config.defaultChapterCount * config.defaultVersesPerChapter,
    chapters,
  });

  puranasIndex.push({
    slug,
    title,
    path: `/puranas/${slug}`,
    content_model: 'chapter/verse',
    total_chapters: config.defaultChapterCount,
    total_verses: config.defaultChapterCount * config.defaultVersesPerChapter,
  });
}

writeJson('puranas_structure.json', {
  puranas: {
    title: 'Puranas Structure',
    total_mahapuranas: mahapuranas.length,
    total_verse_pages: totalVersePages,
    items: puranasIndex,
  },
});

console.log(
  `Generated Purana JSON files: chapters=${generatedChapterFiles}, verses=${generatedVerseFiles}, skandas=${generatedSkandaFiles}, totalVersePages=${totalVersePages}`,
);
