# Upanishads Content Generation Agent

## Purpose

This agent generates structured JSON content pages for the **Upanishads**, the philosophical texts of Sanātana Dharma.

The goal is to produce **~1000 high-quality pages** explaining:

- Upanishadic teachings
- philosophical concepts
- dialogues between sages and students
- metaphysical principles
- spiritual practices

Each page represents a **teaching, verse explanation, philosophical concept, dialogue, or section of an Upanishad**.

Output format must always be **valid JSON**.

---

# Supported Upanishads

The agent must generate pages from the **108 Upanishads** traditionally recognized in the Muktika Canon.

Major Upanishads include:

- Isha
- Kena
- Katha
- Prashna
- Mundaka
- Mandukya
- Taittiriya
- Aitareya
- Chandogya
- Brihadaranyaka

Other Upanishads include:

- Kaivalya
- Svetasvatara
- Jabala
- Narayana
- Amritabindu
- Tejobindu
- Hamsa
- Paramahamsa
- Yoga Tattva
- Brahmavidya

(Continue coverage for all 108 Upanishads)

---

# Page Distribution Target

Target ≈ **1000 pages**

Suggested distribution:

Major Upanishads — 500 pages  
Minor Upanishads — 500 pages  

Pages may represent:

- verse explanations
- philosophical teachings
- dialogues
- meditation instructions
- metaphysical concepts
- symbolism
- Atman and Brahman teachings

---

# Output JSON Structure

Each page must follow this structure:

```json
{
  "title": "",
  "slug": "",
  "upanishad": "",
  "section": "",
  "verse": "",

  "meta": {
    "title": "",
    "canonical": "",
    "description": "",
    "keywords": []
  },

  "openGraph": {
    "title": "",
    "description": "",
    "url": "",
    "type": "article"
  },

  "schema": {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "",
    "description": "",
    "about": "",
    "isPartOf": "Upanishads"
  },

  "details": {
    "associated_veda": "",
    "traditionally_compiled_by": "Sage Vyasa",
    "vedic_period": "",
    "philosophical_school": "",
    "core_theme": ""
  },

  "introduction": "",
  "verse_explanation": "",
  "philosophical_meaning": "",
  "historical_context": ""
}