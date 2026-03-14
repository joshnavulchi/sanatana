# Itihasa Content Generation Agent

## Purpose

This agent generates JSON content for Itihasa pages in the existing `locales/en` format.

Output must stay fully compatible with current filename patterns, root keys, path conventions, and SEO fields used in `itihasa_*.json` files.

All output must be valid JSON and match one of the supported shapes below.

---

## Naming Convention (Source of Truth)

- Use file prefix: **`itihasa_`**.
- Generate files under `locales/<locale>/` matching `en` conventions.

Common filename patterns:

1. Itihasa landing page:
   - `itihasa.json`
2. Bhagavad Gita chapter page:
   - `itihasa_bhagavad_gita_chapter<chapterNumber>.json`
3. Bhagavad Gita verse page:
   - `itihasa_bhagavad_gita_chapter<chapterNumber>_verse<verseNumber>.json`
4. Bhagavad Gita structure manifest:
   - `itihasa_bhagavad_gita_structure.json`
5. Mahabharata parva page:
   - `itihasa_mahabharata_<parva_slug>.json` (example: `itihasa_mahabharata_adi_parva.json`)
6. Mahabharata chapter page:
   - `itihasa_mahabharata_<parva_slug>_chapter<chapterNumber>.json`
7. Mahabharata structure manifest:
   - `itihasa_mahabharata_structure.json`
8. Ramayana kanda page:
   - `itihasa_ramayana_<kanda_slug>.json` (example: `itihasa_ramayana_ayodhya_kanda.json`)
9. Ramayana sarga page:
   - `itihasa_ramayana_<kanda_slug>_sarga<sargaNumber>.json`
10. Ramayana structure manifest:
   - `itihasa_ramayana_structure.json`

---

## Root Key Rules

Each JSON file should contain a single top-level key that mirrors the file base name (except `itihasa.json`):

- `itihasa.json` → key: `"itihasa"`
- `itihasa_bhagavad_gita_chapter1.json` → `"itihasa_bhagavad_gita_chapter1"`
- `itihasa_bhagavad_gita_chapter1_verse1.json` → `"itihasa_bhagavad_gita_chapter1_verse1"`
- `itihasa_bhagavad_gita_structure.json` → `"itihasa_bhagavad_gita_structure"`
- `itihasa_mahabharata_adi_parva.json` → `"itihasa_mahabharata_adi_parva"`
- `itihasa_mahabharata_adi_parva_chapter1.json` → `"itihasa_mahabharata_adi_parva_chapter1"`
- `itihasa_mahabharata_structure.json` → `"itihasa_mahabharata_structure"`
- `itihasa_ramayana_ayodhya_kanda.json` → `"itihasa_ramayana_ayodhya_kanda"`
- `itihasa_ramayana_ayodhya_kanda_sarga1.json` → `"itihasa_ramayana_ayodhya_kanda_sarga1"`
- `itihasa_ramayana_structure.json` → `"itihasa_ramayana_structure"`

---

## Scope Coverage

Generate and maintain Itihasa content for:

1. Itihasa landing page
2. Bhagavad Gita (chapter + verse + structure)
3. Mahabharata (parva + chapter + structure)
4. Ramayana (kanda + sarga + structure)

---

## Output Shapes

### 1) Itihasa Landing (`itihasa.json`)

```json
{
  "itihasa": {
    "title": "",
    "description": "",
    "meta": {
      "title": "",
      "canonical": "https://sanatanadharmam.in/itihasa",
      "description": "",
      "keywords": [],
      "url": "https://sanatanadharmam.in/itihasa"
    },
    "openGraph": {
      "title": "",
      "description": "",
      "url": "https://sanatanadharmam.in/itihasa",
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
      "@graph": []
    }
  }
}
```

### 2) Standard Content Page (chapter/parva/kanda/sarga/verse)

Use this structure for:

- `itihasa_bhagavad_gita_chapter*.json`
- `itihasa_bhagavad_gita_chapter*_verse*.json`
- `itihasa_mahabharata_<parva>.json`
- `itihasa_mahabharata_<parva>_chapter*.json`
- `itihasa_ramayana_<kanda>.json`
- `itihasa_ramayana_<kanda>_sarga*.json`

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
    "philosophical_explanation": ""
  }
}
```

### 3) Bhagavad Gita Structure (`itihasa_bhagavad_gita_structure.json`)

```json
{
  "itihasa_bhagavad_gita_structure": {
    "title": "Bhagavad Gita Structure",
    "description": "Structured Bhagavad Gita navigation with chapter and verse hierarchy.",
    "total_chapters": 18,
    "total_verses": 90,
    "chapters": [
      {
        "chapter": 1,
        "path": "/itihasa/bhagavad-gita/chapter-1",
        "title": "Bhagavad Gita Chapter 1",
        "verses": [
          {
            "verse_number": 1,
            "path": "/itihasa/bhagavad-gita/chapter-1/verse-1",
            "title": "Bhagavad Gita Chapter 1 Verse 1"
          }
        ]
      }
    ]
  }
}
```

### 4) Mahabharata Structure (`itihasa_mahabharata_structure.json`)

```json
{
  "itihasa_mahabharata_structure": {
    "title": "Mahabharata Structure",
    "description": "Structured Mahabharata navigation with parva and chapter hierarchy.",
    "total_parvas": 18,
    "total_chapters": 360,
    "parvas": [
      {
        "slug": "adi-parva",
        "title": "Adi Parva",
        "path": "/itihasa/mahabharata/adi-parva",
        "total_chapters": 20,
        "chapters": [
          {
            "chapter": 1,
            "path": "/itihasa/mahabharata/adi-parva/chapter-1",
            "title": "Mahabharata Adi Parva Chapter 1"
          }
        ]
      }
    ]
  }
}
```

### 5) Ramayana Structure (`itihasa_ramayana_structure.json`)

```json
{
  "itihasa_ramayana_structure": {
    "title": "Ramayana Structure",
    "description": "Structured Ramayana navigation with kanda and sarga hierarchy.",
    "total_kandas": 7,
    "total_sargas": 350,
    "kandas": [
      {
        "slug": "bala-kanda",
        "title": "Bala Kanda",
        "path": "/itihasa/ramayana/bala-kanda",
        "total_sargas": 50,
        "sargas": [
          {
            "sarga": 1,
            "path": "/itihasa/ramayana/bala-kanda/sarga-1",
            "title": "Ramayana Bala Kanda Sarga 1"
          }
        ]
      }
    ]
  }
}
```

---

## URL and Path Rules

1. Canonical and `meta.url` must exactly match each page route.
2. Keep all URLs under `https://sanatanadharmam.in`.
3. Route patterns must align with hierarchy:
   - Gita: `/itihasa/bhagavad-gita/chapter-X[/verse-Y]`
   - Mahabharata: `/itihasa/mahabharata/<parva-slug>[/chapter-X]`
   - Ramayana: `/itihasa/ramayana/<kanda-slug>[/sarga-X]`
4. `openGraph.type` remains `"article"` for existing Itihasa files.

---

## Quality and Consistency Rules

1. Keep tone aligned with existing pages: devotional, philosophical, educational.
2. Use concise introductions and clear scripture summaries.
3. Do not add extra top-level fields not present in existing `itihasa_*.json` files.
4. Ensure root key, filename, title, and route all agree.
5. For structure files, maintain numeric totals consistent with generated hierarchy.