# Purana Content Generation Agent

## Purpose

This agent generates JSON content for Purana pages in the existing `locales/en` format.

The goal is to expand Purana coverage while staying fully compatible with current file naming, key naming, and SEO structure used in `puranas_*.json` files.

Output must always be **valid JSON** and match one of the supported shapes below.

---

## Naming Convention (Source of Truth)

- Use file prefix: **`puranas_`** (not `purnas_`).
- Generate files under `locales/<locale>/` following existing en patterns.

Common filename patterns:

1. Landing page:
   - `puranas.json`
2. Purana overview page:
   - `puranas_<purana>_purana.json` (example: `puranas_agni_purana.json`)
3. Skanda page (Bhagavata-style):
   - `puranas_bhagavata_skanda<skandaNumber>.json`
4. Skanda chapter page:
   - `puranas_bhagavata_skanda<skandaNumber>_chapter<chapterNumber>.json`
5. Skanda verse page:
   - `puranas_bhagavata_skanda<skandaNumber>_chapter<chapterNumber>_verse<verseNumber>.json`
6. Non-skanda chapter page (Agni-style):
   - `puranas_<purana>_chapter<chapterNumber>.json`
7. Non-skanda verse page (Agni-style):
   - `puranas_<purana>_chapter<chapterNumber>_verse<verseNumber>.json`
8. Optional structure manifest:
   - `puranas_<purana>_structure.json`

---

## Root Key Rules

Each JSON file should have a single top-level object key, matching existing conventions:

- `puranas.json` → key: `"puranas"`
- Purana overview file → key: `"puranas_<purana>-purana"` (hyphen before `purana`, e.g., `"puranas_agni-purana"`)
- Bhagavata skanda file → key: `"bhagavata_skanda<skandaNumber>"`
- Bhagavata chapter file → key: `"bhagavata_skanda<skandaNumber>_chapter<chapterNumber>"`
- Bhagavata verse file → key: `"bhagavata_skanda<skandaNumber>_chapter<chapterNumber>_verse<verseNumber>"`
- Agni-style chapter file → key: `"<purana>_chapter<chapterNumber>"`
- Agni-style verse file → key: `"<purana>_chapter<chapterNumber>_verse<verseNumber>"`

---

## Supported Mahāpurāṇas

Generate content for:

1. Brahma Purana
2. Padma Purana
3. Vishnu Purana
4. Shiva Purana
5. Bhagavata Purana
6. Narada Purana
7. Markandeya Purana
8. Agni Purana
9. Bhavishya Purana
10. Brahmavaivarta Purana
11. Linga Purana
12. Varaha Purana
13. Skanda Purana
14. Vamana Purana
15. Kurma Purana
16. Matsya Purana
17. Garuda Purana
18. Brahmanda Purana

---

## Content Targets

- Target scale: ~2000 pages total
- Suggested distribution: ~100–120 pages per Purana
- Page types: overview, skanda/section, chapter, verse, structure manifests

---

## Output Shapes

### 1) Puranas Landing Page (`puranas.json`)

```json
{
  "puranas": {
    "title": "",
    "description": "",
    "meta": {
      "title": "",
      "canonical": "https://sanatanadharmam.in/puranas",
      "description": "",
      "keywords": [],
      "robots": "index, follow",
      "url": "https://sanatanadharmam.in/puranas",
      "ogImage": ""
    },
    "openGraph": {
      "title": "",
      "description": "",
      "url": "https://sanatanadharmam.in/puranas",
      "siteName": "Sanatanadharmam",
      "type": "website",
      "images": [
        {
          "url": "",
          "width": 1200,
          "height": 630,
          "alt": ""
        }
      ]
    },
    "schema": {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "",
      "description": "",
      "url": "https://sanatanadharmam.in/puranas",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Sanatanadharmam",
        "url": "https://sanatanadharmam.in"
      }
    },
    "introduction": "",
    "scripture_text": [
      {
        "section": "",
        "content": ""
      }
    ],
    "philosophical_explanation": ""
  }
}
```

### 2) Purana Overview Page (`puranas_<purana>_purana.json`)

```json
{
  "puranas_<purana>-purana": {
    "title": "",
    "description": "",
    "meta": {
      "title": "",
      "canonical": "https://sanatanadharmam.in/puranas/<purana>-purana",
      "description": "",
      "keywords": [],
      "robots": "index, follow",
      "url": "https://sanatanadharmam.in/puranas/<purana>-purana",
      "ogImage": ""
    },
    "openGraph": {
      "title": "",
      "description": "",
      "url": "https://sanatanadharmam.in/puranas/<purana>-purana",
      "siteName": "Sanatanadharmam",
      "type": "article",
      "images": [
        {
          "url": "",
          "width": 1200,
          "height": 630,
          "alt": ""
        }
      ]
    },
    "schema": {
      "@context": "https://schema.org",
      "@type": "Article",
      "name": "",
      "description": "",
      "url": "https://sanatanadharmam.in/puranas/<purana>-purana",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Sanatanadharmam",
        "url": "https://sanatanadharmam.in"
      }
    },
    "introduction": "",
    "scripture_text": [
      {
        "section": "",
        "content": ""
      }
    ],
    "philosophical_explanation": ""
  }
}
```

### 3) Section/Chapter/Verse Pages

For skanda/chapter/verse pages, keep the compact structure used in existing files:

```json
{
  "<root_key>": {
    "title": "",
    "description": "",
    "meta": {
      "title": "",
      "canonical": "",
      "description": "",
      "url": ""
    },
    "openGraph": {
      "title": "",
      "description": "",
      "url": "",
      "siteName": "Sanatanadharmam",
      "type": "article"
    },
    "introduction": "",
    "scripture_text": "",
    "philosophical_explanation": "",
    "skanda": {
      "number": 0,
      "path": ""
    },
    "chapter": {
      "number": 0,
      "path": ""
    },
    "verse": {
      "number": 0,
      "path": ""
    }
  }
}
```

Notes:
- Include only the applicable navigation objects:
  - skanda page: `skanda` only
  - skanda chapter page: `skanda` + `chapter`
  - skanda verse page: `skanda` + `chapter` + `verse`
  - non-skanda chapter page: `chapter` only
  - non-skanda verse page: `chapter` + `verse`

### 4) Structure Manifest (`puranas_<purana>_structure.json`)

```json
{
  "title": "",
  "description": "",
  "slug": "",
  "total_chapters": 0,
  "total_verses": 0,
  "chapters": [
    {
      "chapter": 1,
      "title": "",
      "path": "",
      "verses": [
        {
          "verse_number": 1,
          "title": "",
          "path": ""
        }
      ]
    }
  ]
}
```

---

## Quality and Consistency Rules

1. Canonical and `meta.url` must match page path exactly.
2. Keep all URLs on `https://sanatanadharmam.in`.
3. For article pages, use `openGraph.type = "article"`; for `puranas.json`, use `"website"`.
4. Preserve existing tone: devotional + philosophical + educational.
5. Do not add unsupported top-level fields (e.g., `details`, `historical_context`, `example_story`) unless the target file pattern already uses them.
6. Maintain slug/path consistency with filename and root key.