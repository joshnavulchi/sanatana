const fs = require('fs');
const path = require('path');

const root = process.cwd();
const localesDir = path.join(root, 'locales', 'en');
const siteUrl = 'https://sanatanadharmam.in';

const topicConfig = [
  {
    slug: 'dharma',
    title: 'Dharma',
    requiredSubtopics: ['definition', 'scriptural', 'examples'],
    targetSubtopics: 88,
  },
  {
    slug: 'karma',
    title: 'Karma',
    requiredSubtopics: ['types', 'law-of-cause-effect', 'prarabdha'],
    targetSubtopics: 88,
  },
  {
    slug: 'moksha',
    title: 'Moksha',
    requiredSubtopics: ['jivanmukti'],
    targetSubtopics: 88,
  },
  {
    slug: 'samsara',
    title: 'Samsara',
    requiredSubtopics: ['cycle-of-birth-and-death'],
    targetSubtopics: 88,
  },
  {
    slug: 'purushartha',
    title: 'Purushartha',
    requiredSubtopics: ['dharma-artha-kama-moksha'],
    targetSubtopics: 87,
  },
  {
    slug: 'advaita',
    title: 'Advaita',
    requiredSubtopics: ['brahman'],
    targetSubtopics: 87,
  },
  {
    slug: 'bhakti',
    title: 'Bhakti',
    requiredSubtopics: ['navavidha-bhakti'],
    targetSubtopics: 87,
  },
  {
    slug: 'yoga',
    title: 'Yoga',
    requiredSubtopics: ['ashtanga-yoga'],
    targetSubtopics: 87,
  },
];

function writeJson(file, data) {
  fs.writeFileSync(path.join(localesDir, file), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function toTitle(slug) {
  return String(slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

let totalSubtopicPages = 0;
const topicEntries = [];

for (const topic of topicConfig) {
  const topicPath = `/vedic-philosophy/${topic.slug}`;
  const topicNamespace = `vedic_philosophy_topic_${topic.slug}`;

  const generatedSubtopics = [...topic.requiredSubtopics];
  let counter = 1;
  while (generatedSubtopics.length < topic.targetSubtopics) {
    const synthetic = `concept-${counter}`;
    if (!generatedSubtopics.includes(synthetic)) {
      generatedSubtopics.push(synthetic);
    }
    counter += 1;
  }

  const subtopicEntries = [];
  for (const subtopicSlug of generatedSubtopics) {
    const subtopicTitle = toTitle(subtopicSlug);
    const subtopicPath = `${topicPath}/${subtopicSlug}`;
    const subtopicNamespace = `vedic_philosophy_${topic.slug}_${subtopicSlug}`;

    writeJson(`${subtopicNamespace}.json`, {
      [subtopicNamespace]: {
        title: `${topic.title}: ${subtopicTitle}`,
        description: `${subtopicTitle} in the context of ${topic.title} within Vedic Philosophy.`,
        meta: {
          title: `${topic.title}: ${subtopicTitle}`,
          canonical: `${siteUrl}${subtopicPath}`,
          description: `${subtopicTitle} in the context of ${topic.title} within Vedic Philosophy.`,
          url: `${siteUrl}${subtopicPath}`,
        },
        openGraph: {
          title: `${topic.title}: ${subtopicTitle}`,
          description: `${subtopicTitle} in the context of ${topic.title} within Vedic Philosophy.`,
          url: `${siteUrl}${subtopicPath}`,
          siteName: 'Sanatanadharmam',
          type: 'article',
        },
        introduction: `${subtopicTitle} is an important study point under the broader topic of ${topic.title}.`,
        scripture_text: `Placeholder philosophical content for ${topic.title} - ${subtopicTitle}.`,
        philosophical_explanation: `This section explores ${subtopicTitle} through Vedantic interpretation and practical reflection.`,
      },
    });

    subtopicEntries.push({
      slug: subtopicSlug,
      title: subtopicTitle,
      path: subtopicPath,
    });

    totalSubtopicPages += 1;
  }

  writeJson(`${topicNamespace}.json`, {
    [topicNamespace]: {
      title: topic.title,
      description: `${topic.title} as a core branch of Vedic Philosophy.`,
      meta: {
        title: topic.title,
        canonical: `${siteUrl}${topicPath}`,
        description: `${topic.title} as a core branch of Vedic Philosophy.`,
        url: `${siteUrl}${topicPath}`,
      },
      openGraph: {
        title: topic.title,
        description: `${topic.title} as a core branch of Vedic Philosophy.`,
        url: `${siteUrl}${topicPath}`,
        siteName: 'Sanatanadharmam',
        type: 'article',
      },
      introduction: `${topic.title} guides understanding of ethical and spiritual life in Sanatana Dharma.`,
      scripture_text: `This topic has ${subtopicEntries.length} generated subtopics for deep navigation.`,
      philosophical_explanation: `${topic.title} is explored through definitions, scriptural lenses, applied examples, and conceptual analysis.`,
      total_subtopics: subtopicEntries.length,
      subtopics: subtopicEntries,
    },
  });

  topicEntries.push({
    slug: topic.slug,
    title: topic.title,
    description: `${topic.title} as a core branch of Vedic Philosophy.`,
    path: topicPath,
    total_subtopics: subtopicEntries.length,
    subtopics: subtopicEntries,
  });
}

writeJson('vedic_philosophy_structure.json', {
  vedic_philosophy_structure: {
    title: 'Vedic Philosophy',
    description:
      'Structured Vedic Philosophy knowledge tree with topic and subtopic hierarchy.',
    introduction:
      'Vedic Philosophy explains the nature of reality, duty, action, liberation, and devotion through multiple darshanic and scriptural perspectives.',
    philosophical_explanation:
      'This structure organizes major philosophical themes into navigable topical units for focused study and expansion.',
    scripture_text: [
      {
        section: 'Scope',
        content:
          'Includes Dharma, Karma, Moksha, Samsara, Purushartha, Advaita, Bhakti, and Yoga with generated deep subtopic pages.',
      },
      {
        section: 'Navigation Model',
        content:
          'Each top-level topic contains dedicated subtopic pages to enable clean, deep route mapping and future content replacement.',
      },
    ],
    total_topics: topicEntries.length,
    total_subtopic_pages: totalSubtopicPages,
    topics: topicEntries,
  },
});

writeJson('vedic_philosophy.json', {
  vedic_philosophy: {
    title: 'Vedic Philosophy | Sanatana Dharma',
    description:
      'Explore Vedic Philosophy through Dharma, Karma, Moksha, Samsara, Purushartha, Advaita, Bhakti, and Yoga.',
    introduction:
      'The Vedic philosophical tradition offers a multi-layered understanding of life, ethics, consciousness, and liberation.',
    philosophical_explanation:
      'Philosophical study in Sanatana Dharma is both contemplative and practical, linking metaphysical principles with lived dharma.',
    scripture_text: [
      {
        section: 'Foundations',
        content:
          'Core themes include duty, action, rebirth, liberation, non-duality, devotion, and disciplined spiritual practice.',
      },
    ],
    meta: {
      title: 'Vedic Philosophy | Sanatana Dharma',
      canonical: `${siteUrl}/vedic-philosophy`,
      description:
        'Explore Vedic Philosophy through Dharma, Karma, Moksha, Samsara, Purushartha, Advaita, Bhakti, and Yoga.',
      url: `${siteUrl}/vedic-philosophy`,
    },
    openGraph: {
      title: 'Vedic Philosophy | Sanatana Dharma',
      description:
        'Explore Vedic Philosophy through Dharma, Karma, Moksha, Samsara, Purushartha, Advaita, Bhakti, and Yoga.',
      url: `${siteUrl}/vedic-philosophy`,
      siteName: 'Sanatanadharmam',
      type: 'article',
    },
  },
});

console.log('Generated Vedic Philosophy files');
console.log(`Total topics: ${topicEntries.length}`);
console.log(`Total subtopic pages: ${totalSubtopicPages}`);
