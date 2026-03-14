# Sanatana — GitHub Directory Guide

This document explains the AI agents in `.github/agents/`, their purpose, and how to run them.

---

## Overview

The Sanatana project uses a set of AI content-generation agents to produce structured JSON pages for Hindu/Vedic philosophy content across all scripture categories. A top-level **Orchestrator Agent** routes requests to the correct specialized agent and enforces global quality rules across all output.

```
orchestrator-agent.md   ← entry point (coordinates all agents below)
├── vedas-agent.md
├── purans-agent.md
├── itihasa-agent.md
└── upanishads-agent.md
```

All generated content lands in `locales/en/` and is then propagated to the other 14 supported languages via the scripts in `/scripts/`.

---

## Agents

### Orchestrator Agent (`orchestrator-agent.md`)

**Purpose:**  
Top-level coordinator. Routes content generation requests to the correct specialized agent based on the scripture category. Enforces global consistency rules (valid JSON, canonical URL discipline, tone, schema types) across all agent output. Use this agent as the starting point for any content generation task.

**When to use:**
- When you need content that spans multiple scripture categories
- When you are unsure which specialized agent to use
- When you want to generate a full batch of pages across Vedas, Puranas, Itihasa, and Upanishads

**How to run:**  
Open the agent in GitHub Copilot (or your AI assistant), then describe what you want to generate:

```
@agent orchestrator-agent.md

Generate the landing page and overview pages for all four Vedas.
```

The orchestrator will delegate to the correct sub-agents and return the JSON files ready to place in `locales/en/`.

---

### Vedas Agent (`vedas-agent.md`)

**Purpose:**  
Generates JSON content for the four Vedas: Rigveda, Yajurveda, Samaveda, and Atharvaveda. Covers the full hierarchy from landing page → Veda overview → section/mandala/chapter pages → individual hymn/mantra pages → structure manifests.

**Scope:**
- Rigveda: 10 mandalas, 1,115 hymns
- Yajurveda: chapters and mantras
- Samaveda: individual hymns
- Atharvaveda: books and hymns

**File prefix:** `vedas_` (e.g., `vedas_rigveda_madala1_hymn1.json`)

**When to use:**
- To generate any Veda landing, overview, or leaf content page
- To create or update Veda structure manifest files

**How to run:**

```
@agent vedas-agent.md

Generate Rigveda Mandala 1, Hymns 1–10.
```

Output files should be placed in `locales/en/`.

---

### Purana Agent (`purans-agent.md`)

**Purpose:**  
Generates JSON content for the 18 Mahāpurāṇas. Covers landing page, individual Purana overview pages, skanda/chapter/verse hierarchy pages, and structure manifests.

**Scope:**
- 18 Mahāpurāṇas: Brahma, Padma, Vishnu, Shiva, Bhagavata, Narada, Markandeya, Agni, Bhavishya, Brahmavaivarta, Linga, Varaha, Skanda, Vamana, Kurma, Matsya, Garuda, Brahmanda
- Target: ~2,000 pages total (~100–120 pages per Purana)

**File prefix:** `puranas_` (e.g., `puranas_agni_purana.json`, `puranas_bhagavata_skanda1_chapter1_verse1.json`)

**When to use:**
- To generate any Purana landing, overview, skanda, chapter, or verse page
- To create or update Purana structure manifest files

**How to run:**

```
@agent purans-agent.md

Generate the Agni Purana overview page and its first 5 chapter pages.
```

Output files should be placed in `locales/en/`.

---

### Itihasa Agent (`itihasa-agent.md`)

**Purpose:**  
Generates JSON content for the Itihasas (Hindu epics): Bhagavad Gita, Mahabharata, and Ramayana. Covers landing page, chapter/parva/kanda pages, verse/sarga pages, and structure manifests.

**Scope:**
- Bhagavad Gita: 18 chapters × ~90 verses
- Mahabharata: 18 parvas × ~360 chapters
- Ramayana: 7 kandas × ~350 sargas

**File prefix:** `itihasa_` (e.g., `itihasa_bhagavad_gita_chapter1_verse1.json`)

**When to use:**
- To generate Bhagavad Gita chapter or verse pages
- To generate Mahabharata parva or chapter pages
- To generate Ramayana kanda or sarga pages
- To create or update Itihasa structure manifest files

**How to run:**

```
@agent itihasa-agent.md

Generate Bhagavad Gita Chapter 1, Verses 1–10.
```

Output files should be placed in `locales/en/`.

---

### Upanishads Agent (`upanishads-agent.md`)

**Purpose:**  
Generates JSON content for the 108 Upanishads of the Muktika Canon. Each page represents a teaching, verse explanation, philosophical concept, dialogue, or meditation instruction from an Upanishad.

**Scope:**
- 108 Upanishads (Muktika Canon)
- Major: Isha, Kena, Katha, Prashna, Mundaka, Mandukya, Taittiriya, Aitareya, Chandogya, Brihadaranyaka (500 pages)
- Minor: All remaining Upanishads (500 pages)
- Target: ~1,000 pages total

**Output format:** A single flat JSON object per page (not nested by file hierarchy like the other agents)

**When to use:**
- To generate verse explanations or philosophical teaching pages from any Upanishad
- To cover Vedanta concepts such as Atman, Brahman, and non-duality
- To create pages on specific dialogues, meditation instructions, or metaphysical topics

**How to run:**

```
@agent upanishads-agent.md

Generate 5 pages from the Isha Upanishad covering the opening verses and their philosophical meaning.
```

Output files should be placed in `locales/en/`.

---

## Content Generation Workflow

After an agent produces JSON output:

1. **Place the file** in `locales/en/<filename>.json`
2. **Sync structure to other locales:**
   ```bash
   node scripts/sync_locales_with_en.js
   ```
3. **Translate content to all languages:**
   ```bash
   python scripts/translate.py
   ```
4. **Sync any missing keys:**
   ```bash
   node scripts/sync_keys_from_en.js
   ```
5. **Validate JSON format:**
   ```bash
   node scripts/validate_json_content_format.js
   ```
6. **Verify canonical URLs:**
   ```bash
   node scripts/verify_all_canonicals.js
   ```

---

## Agent Spec Quick Reference

| Agent | File | File Prefix | Scale |
|-------|------|-------------|-------|
| Orchestrator | `orchestrator-agent.md` | (routes to sub-agents) | All categories |
| Vedas | `vedas-agent.md` | `vedas_` | 4 Vedas, ~1,000+ pages |
| Puranas | `purans-agent.md` | `puranas_` | 18 Puranas, ~2,000 pages |
| Itihasa | `itihasa-agent.md` | `itihasa_` | 3 epics, ~2,500+ pages |
| Upanishads | `upanishads-agent.md` | (flat JSON per page) | 108 Upanishads, ~1,000 pages |

---

## Locales Supported

All agent output targets `locales/en/` (English source). After generation, content is propagated to:

| Code | Language |
|------|----------|
| `en` | English (source) |
| `ar` | Arabic |
| `de` | German |
| `es` | Spanish |
| `fr` | French |
| `hi` | Hindi |
| `ja` | Japanese |
| `ne` | Nepali |
| `nl` | Dutch |
| `pt` | Portuguese |
| `ru` | Russian |
| `ta` | Tamil |
| `te` | Telugu |
| `ur` | Urdu |
| `zh-CN` | Chinese Simplified |
