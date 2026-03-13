/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
/*
  Generates per-page locale JSON namespace files used by createGenerateMetadata().

  Default behavior:
  - Writes ONLY when the target file does not exist.
  - Includes required SEO fields: title, description, meta, openGraph, schema.
  - Adds content fields: introduction, scripture_text, philosophical_explanation.

  Optional behavior:
  - With `--fill-placeholders`, updates existing files ONLY where content is still the literal
    placeholder text (does not overwrite user-edited content).

  Usage:
    node scripts/generate-locale-pages.js
    node scripts/generate-locale-pages.js --fill-placeholders
*/

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');

const SITE_URL = 'https://sanatanadharmam.in';

function titleCaseFromSlug(slug) {
  return String(slug)
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function safeFilenameFromNamespace(namespace) {
  return String(namespace).replace(/-/g, '_');
}

function absoluteUrl(routePath) {
  const p = String(routePath || '/').trim() || '/';
  return p.startsWith('/') ? `${SITE_URL}${p}` : `${SITE_URL}/${p}`;
}

function ogImageFor(namespace) {
  // Image may or may not exist yet; this is a placeholder.
  return `${SITE_URL}/og/${safeFilenameFromNamespace(namespace)}.png`;
}

function isPlaceholderString(value) {
  if (typeof value !== 'string') return false;
  return value.trim().startsWith('Placeholder:');
}

function isPlaceholderScriptureArray(value) {
  if (!Array.isArray(value) || value.length === 0) return false;
  const first = value[0];
  return (
    first &&
    typeof first === 'object' &&
    (isPlaceholderString(first.section) || isPlaceholderString(first.content))
  );
}

function pageKindFromNamespace(namespace) {
  if (namespace === 'puranas') return { kind: 'puranas-landing' };
  if (namespace === 'scriptures_ramayana') return { kind: 'ramayana-landing' };
  if (namespace === 'scriptures_mahabharata') return { kind: 'mahabharata-landing' };
  if (namespace === 'scriptures_bhagavadgita') return { kind: 'gita-landing' };

  if (namespace.startsWith('upanishads_')) return { kind: 'upanishad', slug: namespace.slice('upanishads_'.length) };
  if (namespace.startsWith('puranas_')) return { kind: 'purana', slug: namespace.slice('puranas_'.length) };
  if (namespace.startsWith('ramayana_')) return { kind: 'ramayana-kanda', slug: namespace.slice('ramayana_'.length) };
  if (namespace.startsWith('bhagavadgita_')) return { kind: 'gita-chapter', slug: namespace.slice('bhagavadgita_'.length) };
  if (namespace.startsWith('vedic_philosophy_')) return { kind: 'vedic-science', slug: namespace.slice('vedic_philosophy_'.length) };

  return { kind: 'generic' };
}

function upanishadContent(slug) {
  const name = titleCaseFromSlug(slug);
  const commonIntro = `${name} is one of the principal Upanishads—texts that explore the deepest questions of human life: Who am I? What is real? What is the Self (Atman) and the ultimate reality (Brahman)?\n\nUpanishadic teaching is often presented as dialogue and inquiry. Rather than offering a single “belief”, it trains attention and discernment so a seeker can move from outer identity to inner truth.`;

  /** @type {{intro: string, sections: Array<{section: string, content: string}>, explanation: string}} */
  let out;

  switch (slug) {
    case 'isha-upanishad':
      out = {
        intro: `${commonIntro}\n\nA distinctive feature of the Isha Upanishad is the way it joins renunciation with right action: it teaches inner non-attachment while living responsibly in the world.`,
        sections: [
          {
            section: 'Central themes',
            content: 'Inner renunciation, seeing the Divine presence within and around, freedom from possessiveness, and the discipline of acting without ego-driven attachment.'
          },
          {
            section: 'Practice reflection',
            content: 'The text invites a balanced life: perform your duties, but let go of the “I own” and “I control” mindset. This is a practical doorway to peace.'
          }
        ],
        explanation:
          'Philosophically, Isha emphasizes a unified vision: the same reality is present in movement and stillness, in the near and the far. When this vision becomes stable, fear and greed soften, and action becomes cleaner—more like service than self-assertion.'
      };
      break;
    case 'kena-upanishad':
      out = {
        intro: `${commonIntro}\n\nThe Kena Upanishad begins with a powerful question about agency: “By whom is the mind directed? By whom does speech speak?” It turns the seeker back toward the source of knowing itself.`,
        sections: [
          {
            section: 'Central themes',
            content: 'The source behind perception and thought, the limits of language, humility in knowledge, and the difference between conceptual knowing and direct realization.'
          },
          {
            section: 'Key insight',
            content: 'The Upanishad points to a reality that is not an object among objects. It is the light by which all objects are known.'
          }
        ],
        explanation:
          'Kena is a training in epistemic humility: what you can describe is not the final truth. The “knower of knowing” is approached through quieting arrogance, refining attention, and recognizing that consciousness is primary to experience.'
      };
      break;
    case 'katha-upanishad':
      out = {
        intro: `${commonIntro}\n\nThe Katha Upanishad is famed for the story of Nachiketa, who meets Yama (the lord of death). Through this encounter it explores the choice between the pleasant and the good, and the quest for what does not perish.`,
        sections: [
          {
            section: 'Central themes',
            content: 'Discernment between short-term pleasure and lasting good, the immortality of the Self, discipline of the senses, and the “chariot” metaphor for mind and body.'
          },
          {
            section: 'Practice reflection',
            content: 'The text highlights self-mastery: when senses and mind are guided by inner intelligence, the seeker becomes fit for deeper knowledge.'
          }
        ],
        explanation:
          'Katha brings philosophy into daily decision-making: what you repeatedly choose becomes your character. By choosing the “good” over the merely pleasant, you cultivate the steadiness required to recognize the Self beyond fear, change, and death.'
      };
      break;
    case 'prashna-upanishad':
      out = {
        intro: `${commonIntro}\n\nPrashna means “question”. This Upanishad is structured around a set of inquiries by sincere students. The format emphasizes that wisdom grows through clear questions, disciplined living, and patient reasoning.`,
        sections: [
          {
            section: 'Central themes',
            content: 'Life-breath (prana), the powers of perception, the relationship between body and mind, meditation, and the foundations of a stable inner life.'
          },
          {
            section: 'Learning method',
            content: 'The question-and-answer structure models a respectful pedagogy: ask precisely, listen carefully, test understanding, and integrate through practice.'
          }
        ],
        explanation:
          'Prashna connects philosophy to physiology and psychology: mind is not separate from life-energy and disciplined habits. By understanding prana and the workings of attention, the seeker learns how to stabilize the inner instrument for contemplation.'
      };
      break;
    case 'mundaka-upanishad':
      out = {
        intro: `${commonIntro}\n\nA well-known teaching of the Mundaka Upanishad is the distinction between two kinds of knowledge: lower knowledge (skills, rituals, learning) and higher knowledge (direct realization of the imperishable reality).`,
        sections: [
          {
            section: 'Central themes',
            content: 'Higher vs lower knowledge, renunciation and sincerity, the nature of Brahman, and the need for inner purification before subtle inquiry.'
          },
          {
            section: 'Practice reflection',
            content: 'The text encourages using learning as a support—but not mistaking it for realization. Inner integrity matters as much as study.'
          }
        ],
        explanation:
          'Mundaka is a corrective for spiritual materialism: achievements and information are valuable, but liberation depends on seeing what does not change. It invites the seeker to turn from accumulation to clarity.'
      };
      break;
    case 'mandukya-upanishad':
      out = {
        intro: `${commonIntro}\n\nThe Mandukya Upanishad is concise yet profound. It analyzes experience through the states of waking, dreaming, and deep sleep, and points to a “fourth” (turiya) that underlies them all. It also uses AUM (Om) as a symbolic map of consciousness.`,
        sections: [
          {
            section: 'Central themes',
            content: 'States of consciousness, AUM as a contemplative symbol, and the recognition of a stable awareness beyond changing mental content.'
          },
          {
            section: 'Practice reflection',
            content: 'Meditative inquiry: notice that experiences change while the fact of awareness remains. This observation becomes a doorway into non-dual understanding.'
          }
        ],
        explanation:
          'Mandukya’s method is phenomenological: it studies lived experience. By observing the three states and their transitions, the seeker gains confidence that the Self is not limited to any one mode of mind.'
      };
      break;
    case 'taittiriya-upanishad':
      out = {
        intro: `${commonIntro}\n\nThe Taittiriya Upanishad is known for its layered approach to the human being—often explained through “sheaths” (koshas), moving from the physical to the subtle, culminating in the dimension of bliss (ananda).`,
        sections: [
          {
            section: 'Central themes',
            content: 'Education and discipline, the kosha model, the nature of bliss, gratitude, and living with integrity.'
          },
          {
            section: 'Practice reflection',
            content: 'The text connects knowledge with character: truthful speech, responsible conduct, and respect for learning are presented as spiritual foundations.'
          }
        ],
        explanation:
          'Taittiriya links philosophy to formation: the mind becomes fit for truth through ethical refinement. The kosha framework prevents reductionism by showing that “self” is often misidentified with layers of experience rather than awareness itself.'
      };
      break;
    case 'aitareya-upanishad':
      out = {
        intro: `${commonIntro}\n\nThe Aitareya Upanishad explores creation and the entry of consciousness into embodied life. It is often read as a study of what makes a living being truly “alive”: not merely breath or motion, but awareness.`,
        sections: [
          {
            section: 'Central themes',
            content: 'Consciousness as central, the meaning of personhood, and the relationship between the inner Self and the faculties of life.'
          },
          {
            section: 'Practice reflection',
            content: 'The teaching invites you to notice what remains present through every changing experience: the witnessing awareness.'
          }
        ],
        explanation:
          'Aitareya shifts focus from outer events to inner presence. When consciousness is recognized as primary, spiritual life becomes less about control and more about clarity—seeing what you already are.'
      };
      break;
    case 'chandogya-upanishad':
      out = {
        intro: `${commonIntro}\n\nThe Chandogya Upanishad is expansive and pedagogical, presenting many teachings through stories and analogies. It is especially known for its identity-oriented instruction: the seeker is guided to recognize the deepest Self beyond surface identity.`,
        sections: [
          {
            section: 'Central themes',
            content: 'Inner identity, disciplined living, meditation on symbols and meaning, and the move from multiplicity toward unity.'
          },
          {
            section: 'Learning style',
            content: 'The text uses repeated instruction and everyday examples to turn abstract truth into direct recognition.'
          }
        ],
        explanation:
          'Chandogya is a classic bridge from ritual culture to contemplative insight. It teaches that liberation is not a new possession but a shift in recognition—seeing the Self as already whole.'
      };
      break;
    case 'brihadaranyaka-upanishad':
      out = {
        intro: `${commonIntro}\n\nThe Brihadaranyaka Upanishad is one of the most influential and philosophically rich Upanishads. It contains deep dialogues on the Self, renunciation, and the limits of description—often pushing the seeker beyond simplistic answers.`,
        sections: [
          {
            section: 'Central themes',
            content: 'Self-inquiry, renunciation, discrimination between the real and the changing, and the use of negation to remove false identification.'
          },
          {
            section: 'Practice reflection',
            content: 'The text encourages a subtle honesty: release identities that depend on changing conditions, and rest in the awareness that does not depend on them.'
          }
        ],
        explanation:
          'Brihadaranyaka strengthens the non-dual insight by systematically dismantling mistaken self-definitions. The result is not nihilism, but freedom: when the Self is not confined to roles or possessions, fear reduces and compassion becomes natural.'
      };
      break;
    case 'shvetashvatara-upanishad':
      out = {
        intro: `${commonIntro}\n\nThe Shvetashvatara Upanishad brings together contemplative inquiry with a strong theistic-devotional tone. It explores the nature of the ultimate reality and the path of inner discipline, often using language of devotion and reverence.`,
        sections: [
          {
            section: 'Central themes',
            content: 'The nature of the divine reality, yoga and meditation, the role of grace and devotion, and liberation through knowledge and inner discipline.'
          },
          {
            section: 'Practice reflection',
            content: 'The text points toward steadiness: regulate the mind, refine desire, and let devotion soften the heart so insight can arise.'
          }
        ],
        explanation:
          'Shvetashvatara is helpful for seekers who want both devotion and philosophy. It frames liberation not as mere intellectual conclusion, but as transformation—where meditation, ethics, and reverence cooperate to reveal truth.'
      };
      break;
    case 'kaushitaki-upanishad':
      out = {
        intro: `${commonIntro}\n\nThe Kaushitaki Upanishad explores themes of life-breath, consciousness, and the inner basis of experience. It is often studied for its focus on the “inner ruler” perspective—what enables the faculties to operate.`,
        sections: [
          {
            section: 'Central themes',
            content: 'Prana and awareness, the unity behind mental functions, and spiritual maturation through disciplined understanding.'
          },
          {
            section: 'Practice reflection',
            content: 'Instead of chasing experiences, return to the experiencer: the steady fact of awareness.'
          }
        ],
        explanation:
          'Kaushitaki teaches inwardness. When attention stabilizes at the source of experience, many anxieties lose their grip because they are seen as movements in mind—not the Self.'
      };
      break;
    case 'maitri-upanishad':
      out = {
        intro: `${commonIntro}\n\nThe Maitri (Maitrayaniya) Upanishad discusses mind, time, and disciplined practice. It often reads like a bridge between early Upanishadic inquiry and later yoga-oriented approaches to mental training.`,
        sections: [
          {
            section: 'Central themes',
            content: 'Mind as the key to bondage and freedom, contemplation on time and change, and the practical need for meditation and restraint.'
          },
          {
            section: 'Practice reflection',
            content: 'The message is simple and demanding: if the mind is refined, the world becomes lighter; if it is uncontrolled, even success becomes suffering.'
          }
        ],
        explanation:
          'Maitri emphasizes the mind as the main spiritual instrument. By training it—through ethical living, meditation, and discernment—the seeker becomes capable of stable insight rather than temporary inspiration.'
      };
      break;
    default:
      out = {
        intro: commonIntro,
        sections: [
          {
            section: 'Central themes',
            content: 'Atman and Brahman, liberation (moksha), meditation and inquiry, and the transformation of identity through knowledge.'
          }
        ],
        explanation:
          'Upanishadic philosophy aims at direct recognition. It is not satisfied with belief alone; it seeks clarity about the Self that remains unchanged through all experience.'
      };
      break;
  }

  return out;
}

function puranaContent(slug) {
  const name = titleCaseFromSlug(slug);
  const sectFocus = {
    'vishnu-purana': 'Vishnu',
    'bhagavata-purana': 'Vishnu/Krishna',
    'shiva-purana': 'Shiva',
    'linga-purana': 'Shiva',
    'skanda-purana': 'Skanda (Kartikeya)',
    'narada-purana': 'bhakti and devotional practice',
    'garuda-purana': 'ethics, rites, and reflective teachings',
  };
  const focus = sectFocus[slug] || 'Puranic tradition';

  const intro = `${name} is one of the Mahapuranas in the broader Puranic literature of Sanātana Dharma. Puranas transmit philosophy, devotion, and cultural memory through stories, dialogues, hymns, and guidance for ethical living.\n\nTraditionally, ${name} is associated with ${focus}. Readers often approach it as a devotional-philosophical text rather than a single-genre book: it may include cosmology, sacred geography, ethics, vows, and narratives that illustrate dharma in action.`;

  const sections = [
    {
      section: 'What you will find on this page',
      content:
        'A structured overview: (1) context and themes, (2) key narrative ideas, (3) devotional emphasis, and (4) philosophical reflections that connect story to inner practice.'
    },
    {
      section: 'How to read Puranic material',
      content:
        'Puranic narratives can be read on multiple levels—devotional, ethical, and symbolic. When details vary across retellings, the enduring value is often the dharmic lesson: the cultivation of character, devotion, and discernment.'
    }
  ];

  const explanation =
    'Philosophically, the Puranas teach through lived scenarios: how desire, fear, pride, and compassion shape destiny. They also emphasize cyclical time and impermanence, encouraging humility and steadiness. Devotion (bhakti) is often presented as a direct, accessible discipline that purifies the heart and supports wisdom.';

  return { intro, sections, explanation };
}

function ramayanaKandaContent(slug) {
  const name = titleCaseFromSlug(slug);
  const intro = `${name} is one of the traditional kandas (books) of the Ramayana. Each kanda advances the narrative while emphasizing specific virtues—courage, restraint, loyalty, compassion, and the responsibilities of leadership and family life.\n\nThis page provides a safe overview and reflection prompts without relying on long quotations.`;
  const sections = [
    {
      section: 'Narrative arc',
      content:
        'A brief summary of the key events in this kanda and how they set up the next stage of the story.'
    },
    {
      section: 'Dharmic lessons',
      content:
        'Themes to notice: promises and consequences, right speech, self-control, and how characters respond under pressure.'
    },
    {
      section: 'Practice reflection',
      content:
        'Ask: What is the right action here? What inner quality is being tested? How does devotion or humility change the outcome?'
    }
  ];
  const explanation =
    'The Ramayana is often read as dharma-in-action. Kandawise reflection helps translate ideals into practical guidance: how to keep integrity when life is difficult, how to honor duty without hardening the heart, and how to act with steadiness rather than impulse.';
  return { intro, sections, explanation };
}

function gitaChapterContent(slug) {
  const name = titleCaseFromSlug(slug);
  const intro = `${name} is a chapter of the Bhagavad Gita. Each chapter traditionally carries a “yoga” emphasis—an angle of practice or understanding—while keeping the teaching integrated: act with clarity, cultivate devotion, and refine knowledge so the mind becomes steady.\n\nThis page summarizes the chapter’s usual themes and offers reflection prompts without quoting specific verses.`;
  const sections = [
    {
      section: 'Key ideas',
      content:
        'A compact overview of the main teachings typically associated with this chapter, and how they relate to dharma and yoga.'
    },
    {
      section: 'Practical application',
      content:
        'How the chapter’s teaching can be applied to daily work, relationships, and decision-making—especially under stress.'
    },
    {
      section: 'Reflection prompts',
      content:
        'What am I attached to? Where is my duty unclear? Can I act with sincerity while releasing obsession with outcomes?'
    }
  ];
  const explanation =
    'Gita philosophy centers on inner freedom: not the absence of action, but the purification of intention. When ego-driven attachment reduces, action becomes cleaner and the mind becomes capable of deeper insight.';
  return { intro, sections, explanation };
}

function vedicScienceContent(slug) {
  const name = titleCaseFromSlug(slug);
  const intro = `${name} is presented here as part of the broader Indian knowledge traditions that grew alongside philosophy, ritual culture, and disciplined learning. These traditions are best approached with both respect and care: they include historical methods, living practices, and cultural memory.\n\nThis page gives an overview of concepts and context without making medical or scientific claims beyond the scope of the site.`;
  const sections = [
    {
      section: 'Traditional context',
      content:
        'How this discipline typically appears in Indian learning: observation, calculation, craft lineages, and practical application.'
    },
    {
      section: 'Key concepts (overview)',
      content:
        'A plain-language set of core concepts and what problems they were intended to solve (timekeeping, construction, health routines, materials, etc.).'
    },
    {
      section: 'Connection to dharma',
      content:
        'How disciplined learning supports virtues like patience, precision, humility, responsibility, and care for life.'
    }
  ];
  const explanation =
    'From a dharmic lens, knowledge is not only power; it is responsibility. When learning is joined with ethics and humility, it becomes a support for wellbeing and inner refinement rather than ego.';
  return { intro, sections, explanation };
}

function hydratePageContent(namespace, page) {
  const info = pageKindFromNamespace(namespace);
  let content;
  switch (info.kind) {
    case 'upanishad':
      content = upanishadContent(info.slug);
      break;
    case 'purana':
      content = puranaContent(info.slug);
      break;
    case 'ramayana-kanda':
      content = ramayanaKandaContent(info.slug);
      break;
    case 'gita-chapter':
      content = gitaChapterContent(info.slug);
      break;
    case 'vedic-science':
      content = vedicScienceContent(info.slug);
      break;
    case 'puranas-landing':
    case 'ramayana-landing':
    case 'mahabharata-landing':
    case 'gita-landing':
    default:
      // For landing pages we keep the general generator output, but still fill placeholders.
      content = {
        intro:
          `This page introduces ${page.title || namespace} and provides a structured overview. Use it as a starting point to explore related subpages and concepts.`,
        sections: [
          {
            section: 'Overview',
            content:
              'Summary of the tradition, key terms, and the main themes you will encounter across the related pages on this site.'
          }
        ],
        explanation:
          'Philosophical explanation: This section can be expanded with page-specific concepts, definitions, and practical reflections.'
      };
      break;
  }

  const updated = { ...page };
  if (isPlaceholderString(updated.introduction)) updated.introduction = content.intro;
  if (isPlaceholderScriptureArray(updated.scripture_text)) {
    updated.scripture_text = content.sections.map((s) => ({ section: s.section, content: s.content }));
  }
  if (isPlaceholderString(updated.philosophical_explanation)) updated.philosophical_explanation = content.explanation;

  return updated;
}

function makeBasePage({ namespace, routePath, title, description, keywords, schemaType }) {
  const url = absoluteUrl(routePath);
  const metaTitle = title;
  const metaDescription = description;
  const img = ogImageFor(namespace);
  const type = schemaType || 'WebPage';

  return {
    [namespace]: {
      title,
      description,
      meta: {
        title: metaTitle,
        canonical: url,
        description: metaDescription,
        keywords: keywords || [],
        robots: 'index, follow',
        url,
        ogImage: img
      },
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        url,
        siteName: 'Sanatanadharmam',
        type: type === 'Article' ? 'article' : 'website',
        images: [
          {
            url: img,
            width: 1200,
            height: 630,
            alt: title
          }
        ]
      },
      schema: {
        '@context': 'https://schema.org',
        '@type': type,
        name: metaTitle,
        description: metaDescription,
        url,
        isPartOf: {
          '@type': 'WebSite',
          name: 'Sanatanadharmam',
          url: SITE_URL
        }
      },
      introduction:
        'Placeholder: Add a short introduction for this page. Summarize the topic, its place in Sanātana Dharma, and what the reader will learn.',
      scripture_text: [
        {
          section: 'Placeholder: Scripture context',
          content:
            'Placeholder: Add relevant scripture context, section summaries, or traditional references. Avoid long verbatim quotations if you do not have a verified source.'
        }
      ],
      philosophical_explanation:
        'Placeholder: Add a philosophical explanation. Explain core ideas, key terms, and practical relevance in a clear and respectful way.'
    }
  };
}

function writeOrUpdate(localesDir, namespace, jsonObj, { fillPlaceholders }) {
  const fileName = `${safeFilenameFromNamespace(namespace)}.json`;
  const filePath = path.join(localesDir, fileName);
  const exists = fs.existsSync(filePath);

  if (!exists) {
    const content = JSON.stringify(jsonObj, null, 2) + '\n';
    fs.writeFileSync(filePath, content, 'utf8');
    return { written: true, updated: false, filePath };
  }

  if (!fillPlaceholders) return { written: false, updated: false, filePath };

  // Update only placeholder fields.
  try {
    const existingRaw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const topKeys = existingRaw && typeof existingRaw === 'object' ? Object.keys(existingRaw) : [];
    const topKey = topKeys.length === 1 ? topKeys[0] : namespace;
    const existingPage = existingRaw?.[topKey] && typeof existingRaw[topKey] === 'object' ? existingRaw[topKey] : null;
    if (!existingPage) return { written: false, updated: false, filePath };

    const hydrated = hydratePageContent(topKey, existingPage);

    const changed =
      hydrated.introduction !== existingPage.introduction ||
      JSON.stringify(hydrated.scripture_text) !== JSON.stringify(existingPage.scripture_text) ||
      hydrated.philosophical_explanation !== existingPage.philosophical_explanation;

    if (!changed) return { written: false, updated: false, filePath };

    const outObj = { ...existingRaw, [topKey]: hydrated };
    fs.writeFileSync(filePath, JSON.stringify(outObj, null, 2) + '\n', 'utf8');
    return { written: false, updated: true, filePath };
  } catch (_) {
    return { written: false, updated: false, filePath };
  }
}

function run() {
  const fillPlaceholders = process.argv.includes('--fill-placeholders');
  const localesDir = path.join(REPO_ROOT, 'locales', 'en');
  if (!fs.existsSync(localesDir)) {
    throw new Error(`Missing locales/en directory at: ${localesDir}`);
  }

  const tasks = [];

  // Base pages
  tasks.push({
    namespace: 'puranas',
    routePath: '/puranas',
    title: 'Puranas – Sacred Traditions and Stories of Sanātana Dharma',
    description:
      'Explore the Puranas: ancient texts that preserve stories, cosmology, devotion, dharma, and cultural memory within Sanātana Dharma.',
    keywords: ['Puranas', 'Sanatana Dharma', 'Hindu scriptures', 'cosmology', 'bhakti', 'dharma'],
    schemaType: 'CollectionPage'
  });
  tasks.push({
    namespace: 'scriptures_ramayana',
    routePath: '/itihasa/ramayana',
    title: 'Ramayana – Itihasa of Dharma, Devotion, and Ideal Conduct',
    description:
      'Learn about the Ramayana: the Itihasa tradition that explores dharma, devotion, leadership, and the ideals embodied by Sri Rama.',
    keywords: ['Ramayana', 'Itihasa', 'Sri Rama', 'dharma', 'Valmiki', 'Sanatana Dharma'],
    schemaType: 'Article'
  });
  tasks.push({
    namespace: 'scriptures_mahabharata',
    routePath: '/itihasa/mahabharata',
    title: 'Mahabharata – Itihasa of Dharma, Ethics, and Human Choice',
    description:
      'Explore the Mahabharata: a vast Itihasa exploring dharma, conflict, duty, and the complexity of human decision-making.',
    keywords: ['Mahabharata', 'Itihasa', 'Vyasa', 'dharma', 'ethics', 'Sanatana Dharma'],
    schemaType: 'Article'
  });
  tasks.push({
    namespace: 'scriptures_bhagavadgita',
    routePath: '/itihasa/bhagavadgita',
    title: 'Bhagavad Gita – Teachings on Dharma, Yoga, and Liberation',
    description:
      'Study the Bhagavad Gita: teachings of Sri Krishna on dharma, karma yoga, bhakti, jnana, and the path to inner freedom.',
    keywords: ['Bhagavad Gita', 'Krishna', 'Arjuna', 'Yoga', 'dharma', 'karma yoga', 'bhakti'],
    schemaType: 'Article'
  });

  // Slug pages from app routes
  const UPANISHADS = [
    'isha-upanishad',
    'kena-upanishad',
    'katha-upanishad',
    'prashna-upanishad',
    'mundaka-upanishad',
    'mandukya-upanishad',
    'taittiriya-upanishad',
    'aitareya-upanishad',
    'chandogya-upanishad',
    'brihadaranyaka-upanishad',
    'shvetashvatara-upanishad',
    'kaushitaki-upanishad',
    'maitri-upanishad'
  ];
  for (const slug of UPANISHADS) {
    const nice = titleCaseFromSlug(slug);
    const namespace = `upanishads_${slug}`;
    tasks.push({
      namespace,
      routePath: `/upanishads/${slug}`,
      title: `${nice} – Upanishad Teachings in Sanātana Dharma`,
      description:
        `Overview of ${nice}: core themes, key ideas, and why this Upanishad matters for understanding Atman, Brahman, and liberation.`,
      keywords: [nice, 'Upanishads', 'Vedanta', 'Atman', 'Brahman', 'Sanatana Dharma'],
      schemaType: 'Article'
    });
  }

  const PURANAS = [
    'brahma-purana',
    'padma-purana',
    'vishnu-purana',
    'shiva-purana',
    'bhagavata-purana',
    'narada-purana',
    'markandeya-purana',
    'agni-purana',
    'bhavishya-purana',
    'brahmavaivarta-purana',
    'linga-purana',
    'varaha-purana',
    'skanda-purana',
    'vamana-purana',
    'kurma-purana',
    'matsya-purana',
    'garuda-purana',
    'brahmanda-purana'
  ];
  for (const slug of PURANAS) {
    const nice = titleCaseFromSlug(slug);
    const namespace = `puranas_${slug}`;
    tasks.push({
      namespace,
      routePath: `/puranas/${slug}`,
      title: `${nice} – Purana Overview and Key Themes`,
      description:
        `A structured overview of ${nice}: themes, purpose, and how it contributes to devotion, dharma, and cultural memory in Sanātana Dharma.`,
      keywords: [nice, 'Purana', 'Puranas', 'Sanatana Dharma', 'bhakti', 'dharma'],
      schemaType: 'Article'
    });
  }

  const RAMAYANA_KANDAS = [
    'bala-kanda',
    'ayodhya-kanda',
    'aranya-kanda',
    'kishkinda-kanda',
    'sundara-kanda',
    'yuddha-kanda',
    'uttara-kanda'
  ];
  for (const slug of RAMAYANA_KANDAS) {
    const nice = titleCaseFromSlug(slug);
    const namespace = `ramayana_${slug}`;
    tasks.push({
      namespace,
      routePath: `/itihasa/ramayana/${slug}`,
      title: `${nice} – Ramayana Section Summary`,
      description:
        `Explore ${nice} of the Ramayana: key events, dharmic lessons, and philosophical themes presented through narrative.`,
      keywords: [nice, 'Ramayana', 'Itihasa', 'dharma', 'Sri Rama'],
      schemaType: 'Article'
    });
  }

  const GITA_CHAPTERS = [
    'arjuna-vishada-yoga',
    'sankhya-yoga',
    'karma-yoga',
    'jnana-karma-sanyasa-yoga',
    'karma-sanyasa-yoga',
    'dhyana-yoga',
    'jnana-vijnana-yoga',
    'akshara-brahma-yoga',
    'raja-vidya-raja-guhya-yoga',
    'vibhuti-yoga',
    'vishvarupa-darshana-yoga',
    'bhakti-yoga',
    'kshetra-kshetrajna-vibhaga-yoga',
    'gunatraya-vibhaga-yoga',
    'purushottama-yoga',
    'daivasura-sampad-vibhaga-yoga',
    'shraddhatray-vibhaga-yoga',
    'moksha-sanyasa-yoga'
  ];
  for (const slug of GITA_CHAPTERS) {
    const nice = titleCaseFromSlug(slug);
    const namespace = `bhagavadgita_${slug}`;
    tasks.push({
      namespace,
      routePath: `/itihasa/bhagavadgita/${slug}`,
      title: `${nice} – Bhagavad Gita Chapter Overview`,
      description:
        `Chapter overview for ${nice}: central teachings, key concepts, and practical guidance from the Bhagavad Gita.`,
      keywords: [nice, 'Bhagavad Gita', 'Krishna', 'Yoga', 'dharma', 'Vedanta'],
      schemaType: 'Article'
    });
  }

  const VEDIC_PHILOSOPHY_SCIENCE = ['astronomy', 'mathematics', 'medicine', 'metallurgy', 'architecture'];
  for (const slug of VEDIC_PHILOSOPHY_SCIENCE) {
    const nice = titleCaseFromSlug(slug);
    const namespace = `vedic_philosophy_${slug}`;
    tasks.push({
      namespace,
      routePath: `/vedic-philosophy/${slug}`,
      title: `${nice} – Vedic Science and Knowledge Traditions`,
      description:
        `Explore ${nice} in the Vedic knowledge traditions: historical context, core ideas, and how these disciplines connect to dharma and learning.`,
      keywords: [nice, 'Vedic science', 'Sanatana Dharma', 'knowledge traditions'],
      schemaType: 'Article'
    });
  }

  let writtenCount = 0;
  let updatedCount = 0;
  const writtenFiles = [];
  const updatedFiles = [];

  for (const item of tasks) {
    const jsonObj = makeBasePage(item);
    const result = writeOrUpdate(localesDir, item.namespace, jsonObj, { fillPlaceholders });
    if (result.written) {
      writtenCount += 1;
      writtenFiles.push(path.relative(REPO_ROOT, result.filePath));
    } else if (result.updated) {
      updatedCount += 1;
      updatedFiles.push(path.relative(REPO_ROOT, result.filePath));
    }
  }

  // Output
  console.log(`[generate-locale-pages] Wrote ${writtenCount} new file(s).`);
  if (writtenFiles.length > 0) console.log(writtenFiles.map((p) => `- ${p}`).join('\n'));
  if (fillPlaceholders) {
    console.log(`[generate-locale-pages] Updated ${updatedCount} existing file(s) by filling placeholders.`);
    if (updatedFiles.length > 0) console.log(updatedFiles.map((p) => `- ${p}`).join('\n'));
  }
}

run();
