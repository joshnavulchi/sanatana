# Vedas Content Generation Agent

## Purpose

This agent generates JSON content for Vedas pages in the existing `locales/en` format.

Output must match current filename conventions, root keys, route patterns, and schema shapes used in `vedas_*.json` files.

All output must be valid JSON and follow one of the supported structures below.

---

## Naming Convention (Source of Truth)

- Use file prefix: **`vedas_`** (except the landing file `vedas.json`).
- Generate files under `locales/<locale>/` using `en` as canonical reference.

### Core files

1. Landing page:
   - `vedas.json`
2. Veda overview pages:
   - `vedas_rigveda.json`
   - `vedas_yajurveda.json`
   - `vedas_samaveda.json`
   - `vedas_atharvaveda.json`

### Rigveda hierarchy

3. Mandala page file pattern (note spelling in filename):
   - `vedas_rigveda_madala<mandalaNumber>.json`
4. Hymn page file pattern:
   - `vedas_rigveda_madala<mandalaNumber>_hymn<hymnNumber>.json`
5. Structure manifest:
   - `vedas_rigveda_hymns_structure.json`

### Yajurveda hierarchy

6. Mantra page file pattern:
   - `vedas_yajurveda_chapter<chapterNumber>_mantra<mantraNumber>.json`
7. Structure manifest:
   - `vedas_yajurveda_structure.json`

### Samaveda hierarchy

8. Hymn page file pattern:
   - `vedas_samaveda_hymn<hymnNumber>.json`
9. Structure manifest:
   - `vedas_samaveda_structure.json`

### Atharvaveda hierarchy

10. Hymn page file pattern:
    - `vedas_atharvaveda_book<bookNumber>_hymn<hymnNumber>.json`
11. Structure manifest:
    - `vedas_atharvaveda_structure.json`

---

## Root Key Rules

Each file uses a single top-level key, with important exceptions:

- `vedas.json` → `"vedas"`
- `vedas_rigveda.json` → `"rigveda"`
- `vedas_yajurveda.json` → `"yajurveda"`
- `vedas_samaveda.json` → `"samaveda"`
- `vedas_atharvaveda.json` → `"atharvaveda"`

Rigveda special case:
- `vedas_rigveda_madala1.json` → `"mandala-1"` (hyphen key + `mandala` spelling)
- `vedas_rigveda_madala1_hymn1.json` → `"rigveda_mandala1_hymn1"` (uses `mandala` spelling in key)

Other leaf files:
- `vedas_yajurveda_chapter1_mantra1.json` → `"yajurveda_chapter1_mantra1"`
- `vedas_samaveda_hymn1.json` → `"samaveda_hymn1"`
- `vedas_atharvaveda_book1_hymn1.json` → `"atharvaveda_book1_hymn1"`

Structure files:
- `vedas_rigveda_hymns_structure.json` → `"rigveda"`
- `vedas_yajurveda_structure.json` → `"yajurveda"`
- `vedas_samaveda_structure.json` → `"samaveda"`
- `vedas_atharvaveda_structure.json` → `"atharvaveda"`

---

## Output Shapes

### 1) Vedas Landing (`vedas.json`)

```json
{
  "vedas": {
    "meta": {
      "title": "",
      "description": "",
      "keywords": []
    },
    "openGraph": {
      "title": "",
      "description": "",
      "url": "https://sanatanadharmam.in/vedas",
      "type": "article"
    },
    "schema": {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": "",
      "description": "",
      "url": "https://sanatanadharmam.in/vedas"
    },
    "title": "",
    "definition": "",
    "meaning_of_word_veda": "",
    "introduction": "",
    "scripture_text": [],
    "philosophical_explanation": ""
  }
}
```

### 2) Veda Overview Page (`vedas_<veda>.json`)

```json
{
  "<veda_key>": {
    "title": "",
    "description": "",
    "meta": {
      "title": "",
      "canonical": "",
      "description": "",
      "keywords": [],
      "url": ""
    },
    "openGraph": {
      "title": "",
      "description": "",
      "url": "",
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
      "@type": "CreativeWork",
      "name": "",
      "description": "",
      "url": ""
    },
    "introduction": "",
    "scripture_text": [],
    "philosophical_explanation": ""
  }
}
```

### 3) Rigveda Mandala Page (`vedas_rigveda_madalaX.json`)

```json
{
  "mandala-X": {
    "title": "",
    "description": "",
    "meta": {
      "title": "",
      "canonical": "",
      "description": "",
      "keywords": [],
      "robots": "index, follow",
      "url": ""
    },
    "openGraph": {
      "title": "",
      "description": "",
      "url": "",
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
    },
    "hymns": [
      {
        "hymn_number": 1,
        "title": "",
        "introduction": "",
        "scripture_text": "",
        "philosophical_explanation": ""
      }
    ]
  }
}
```

### 4) Leaf Page (Rigveda hymn / Yajurveda mantra / Samaveda hymn / Atharvaveda hymn)

```json
{
  "<leaf_root_key>": {
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
    "chapter": {
      "slug": "",
      "key": "",
      "label": "",
      "path": ""
    },
    "item": {
      "prefix": "",
      "number": 0,
      "path": ""
    },
    "introduction": "",
    "scripture_text": "",
    "philosophical_explanation": ""
  }
}
```

### 5) Structure Files

#### Rigveda structure (`vedas_rigveda_hymns_structure.json`)

```json
{
  "rigveda": {
    "title": "",
    "total_mandalas": 10,
    "total_hymns": 1115,
    "mandalas": [
      {
        "mandala": 1,
        "path": "/vedas/rigveda/mandala-1",
        "hymn_count": 191,
        "hymns": [
          {
            "hymn_number": 1,
            "title": "",
            "path": "/vedas/rigveda/mandala-1/hymn-1"
          }
        ]
      }
    ]
  }
}
```

#### Yajurveda structure (`vedas_yajurveda_structure.json`)

```json
{
  "yajurveda": {
    "title": "",
    "total_chapters": 10,
    "total_mantras": 120,
    "chapters": [
      {
        "chapter": 1,
        "title": "",
        "introduction": "",
        "scripture_text": "",
        "philosophical_explanation": "",
        "path": "/vedas/yajurveda/chapter-1",
        "mantras": [
          {
            "mantra_number": 1,
            "title": "",
            "introduction": "",
            "scripture_text": "",
            "philosophical_explanation": "",
            "path": "/vedas/yajurveda/chapter-1/mantra-1"
          }
        ]
      }
    ]
  }
}
```

#### Samaveda structure (`vedas_samaveda_structure.json`)

```json
{
  "samaveda": {
    "title": "",
    "total_hymns": 10,
    "hymns": [
      {
        "hymn_number": 1,
        "title": "",
        "introduction": "",
        "scripture_text": "",
        "philosophical_explanation": "",
        "path": "/vedas/samaveda/hymn-1"
      }
    ]
  }
}
```

#### Atharvaveda structure (`vedas_atharvaveda_structure.json`)

```json
{
  "atharvaveda": {
    "title": "",
    "total_books": 10,
    "total_hymns": 100,
    "books": [
      {
        "book": 1,
        "title": "",
        "introduction": "",
        "scripture_text": "",
        "philosophical_explanation": "",
        "path": "/vedas/atharvaveda/book-1",
        "hymns": [
          {
            "hymn_number": 1,
            "title": "",
            "introduction": "",
            "scripture_text": "",
            "philosophical_explanation": "",
            "path": "/vedas/atharvaveda/book-1/hymn-1"
          }
        ]
      }
    ]
  }
}
```

---

## URL and Path Rules

1. Keep all canonical and `meta.url` values under `https://sanatanadharmam.in`.
2. Ensure canonical equals actual route.
3. Use these route patterns:
   - landing: `/vedas`
   - overview: `/vedas/<veda>`
   - rigveda mandala: `/vedas/rigveda/mandala-X`
   - rigveda hymn: `/vedas/rigveda/mandala-X/hymn-Y`
   - yajurveda mantra: `/vedas/yajurveda/chapter-X/mantra-Y`
   - samaveda hymn: `/vedas/samaveda/hymn-X`
   - atharvaveda hymn: `/vedas/atharvaveda/book-X/hymn-Y`

---

## Quality and Consistency Rules

1. Maintain existing tone: devotional + philosophical + educational.
2. Keep `openGraph.type` as `"article"` in current Vedas files.
3. Do not add unsupported top-level keys for a given file type.
4. Keep root key, filename, title, and route mutually consistent.
5. Preserve the existing Rigveda filename quirk (`madala`) while keeping route/key semantics (`mandala`) as currently used.
6. For structure files, ensure aggregate totals match the listed hierarchy.