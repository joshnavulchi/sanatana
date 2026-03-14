# Sanatana Orchestrator Agent

## Purpose

This agent coordinates all content generation across the Sanatana scripture knowledge base.

It routes requests to the correct specialized agent, ensures output consistency across agents, and handles requests that span multiple scripture categories.

All content it delegates to sub-agents must be valid JSON and adhere to the file naming, root key, and SEO rules defined in each agent's specification.

---

## Specialized Agents Under This Orchestrator

| Agent | File | Scope |
|-------|------|-------|
| Vedas Agent | `vedas-agent.md` | Rigveda, Yajurveda, Samaveda, Atharvaveda |
| Purana Agent | `purans-agent.md` | 18 Mahāpurāṇas |
| Itihasa Agent | `itihasa-agent.md` | Bhagavad Gita, Mahabharata, Ramayana |
| Upanishads Agent | `upanishads-agent.md` | 108 Upanishads (Muktika Canon) |

---

## Routing Rules

When the orchestrator receives a content generation request, it determines the correct agent using the following rules:

### Route to Vedas Agent when the request involves:
- Any of the four Vedas: Rigveda, Yajurveda, Samaveda, Atharvaveda
- Vedic hymns (Rigveda), mantras (Yajurveda), Samaveda hymns, or Atharvaveda hymns
- Files prefixed with `vedas_` or the landing file `vedas.json`
- Veda structure manifests (`vedas_*_structure.json`)

### Route to Purana Agent when the request involves:
- Any of the 18 Mahāpurāṇas (Brahma, Padma, Vishnu, Shiva, Bhagavata, Narada, Markandeya, Agni, Bhavishya, Brahmavaivarta, Linga, Varaha, Skanda, Vamana, Kurma, Matsya, Garuda, Brahmanda)
- Skanda, chapter, or verse pages for Puranas
- Files prefixed with `puranas_` or the landing file `puranas.json`
- Purana structure manifests (`puranas_*_structure.json`)

### Route to Itihasa Agent when the request involves:
- The Bhagavad Gita (chapters and verses)
- The Mahabharata (parvas and chapters)
- The Ramayana (kandas and sargas)
- Files prefixed with `itihasa_` or the landing file `itihasa.json`
- Itihasa structure manifests (`itihasa_*_structure.json`)

### Route to Upanishads Agent when the request involves:
- Any of the 108 Upanishads in the Muktika Canon
- Verse explanations, philosophical teachings, dialogues, or meditation instructions from Upanishads
- Pages covering Atman, Brahman, or Vedantic metaphysics sourced from Upanishadic texts

---

## Cross-Agent Requests

When a single request spans multiple scripture categories (e.g., "generate landing pages for all scriptures"), the orchestrator:

1. Breaks the request into sub-tasks, one per applicable agent.
2. Delegates each sub-task to the correct agent.
3. Collects all outputs and verifies consistency:
   - All files must be valid JSON.
   - All canonical URLs must be under `https://sanatanadharmam.in`.
   - Tone across all outputs must be devotional, philosophical, and educational.
4. Returns all generated files as a single unified batch.

---

## Content Generation Workflow

```
User Request
     │
     ▼
Orchestrator Agent
     │
     ├── Vedas?      ──► Vedas Agent      ──► vedas_*.json
     │
     ├── Puranas?    ──► Purana Agent     ──► puranas_*.json
     │
     ├── Itihasa?    ──► Itihasa Agent    ──► itihasa_*.json
     │
     └── Upanishads? ──► Upanishads Agent ──► upanishads_*.json
                                ▼
                      Orchestrator validates output
                                ▼
                      Final JSON files for locales/en/
```

---

## Global Quality Rules (Applied to All Agent Output)

The orchestrator enforces these rules regardless of which agent generated the content:

1. **Valid JSON only.** Every output file must pass JSON validation.
2. **Canonical URL discipline.** All `meta.canonical` and `meta.url` values must match the page's actual route under `https://sanatanadharmam.in`.
3. **Root key consistency.** The top-level JSON key must match the file base name convention defined in the relevant agent spec.
4. **Tone consistency.** All content must maintain a devotional + philosophical + educational voice.
5. **No unsupported fields.** Do not add top-level keys that are not defined in the target agent's output shapes.
6. **OpenGraph type.** Use `"article"` for scripture content pages; use `"website"` for landing/index pages.
7. **Schema.org accuracy.** Use `@type: "CreativeWork"` for philosophical texts, `"Article"` for overview pages, `"CollectionPage"` for landing pages.
8. **Locale targeting.** Generate for `locales/en/` as the canonical source; translated locales follow automatically via `sync_locales_with_en.js` and `translate.py`.

---

## Batch Generation Guidelines

When generating large batches of pages:

- Generate structure manifest files before leaf/detail pages so hierarchy is consistent.
- Respect the scale targets defined per agent:
  - Vedas: Rigveda (1,115 hymns across 10 mandalas), Yajurveda, Samaveda, Atharvaveda
  - Puranas: ~2,000 pages (~100–120 per Purana)
  - Itihasa: Bhagavad Gita (18 chapters × 90 verses), Mahabharata (18 parvas × 360 chapters), Ramayana (7 kandas × 350 sargas)
  - Upanishads: ~1,000 pages across 108 Upanishads

- Always generate parent/overview pages before child/leaf pages.
- Verify totals in structure manifests match the number of leaf pages generated.

---

## File Placement

All generated files must be placed in:

```
locales/en/<filename>.json
```

After English content is generated, use these scripts to propagate to other locales:

- `scripts/sync_locales_with_en.js` — creates missing files in other locales
- `scripts/translate.py` — auto-translates content to all 15 supported languages
- `scripts/sync_keys_from_en.js` — syncs missing keys from English into other locales
