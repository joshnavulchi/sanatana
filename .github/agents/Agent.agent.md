# AI Agent Instructions

This file is the **primary entry point for AI agents** working with this repository.

Before generating code, content, or modifications, the agent **must read and follow all instruction files listed below**.

---

# Instruction Files

Agents must load these instruction documents before performing any task.

| File                                     | Purpose                                      |
| ---------------------------------------- | -------------------------------------------- |
| `/instructions/copilot-instructions.md`  | Coding standards and AI coding rules         |
| `/instructions/general-instructions.md`  | Project architecture, frameworks, libraries  |
| `/instructions/design-instructions.md`   | UI design system and Tailwind styling rules  |
| `/instructions/language-instructions.md` | Language, terminology, and writing standards |

---

# Agent Workflow

Before generating any output, the agent must:

1. Read **copilot-instructions.md** for coding standards
2. Read **general-instructions.md** for architecture and stack
3. Read **design-instructions.md** for UI rules
4. Read **language-instructions.md** for text and documentation rules

Only after loading these instructions should the agent proceed.

---

<!-- # Agent Responsibilities

The agent may perform tasks such as:

* generating JSON content
* writing React components
* updating localization files
* adding SEO metadata
* generating structured data
* creating tests

All generated content must follow repository standards.

--- -->

# Content Principles

Content must be

* historically accurate
* sourced from traditional scriptures
* culturally respectful
* educational
* SEO optimized

---

# Content Generation Tasks

Agents may generate structured content for:

```
Vedas
Upanishads
Puranas
Itihasas
Vedic Philosophy
Vedic Philosophy
Explore
```

All generated content must be **historically accurate and culturally respectful**.

---

<!-- # SEO Requirements

Each generated entry must include

* meta title
* meta description
* canonical URL
* structured data schema
* OpenGraph metadata

---

# JSON Formatting Rules

All generated JSON must follow

* 2 space indentation
* UTF-8 encoding
* valid JSON schema
* no trailing commas

---

# File Naming

Files must follow

```
kebab-case
```

Example

```
rigveda.json
bhagavata-purana.json
chandogya-upanishad.json
```

--- -->

# Agent Safety Rules

Agents must never

* fabricate scriptures
* generate fictional sources
* modify repository architecture
* create files outside expected directories

---

<!-- # Example JSON Structure

```json
{
  "title": "Rigveda",
  "description": "The Rigveda is the oldest Veda containing hymns dedicated to various deities.",
  "keywords": ["Rigveda", "Vedas", "Hindu scriptures"],
  "canonical": "/vedas/rigveda",
  "content": {
    "introduction": "...",
    "history": "...",
    "purpose": "...",
    "stories": []
  }
}
```
--- -->

# Output Requirements

Generated output must:

* follow TypeScript strict mode
* respect folder structure
* use project path aliases
* comply with design system rules
* use localization for UI text
* include proper SEO metadata when applicable

---

# Output Format

Agents must output valid JSON ready to be placed in the repository.

Example directory

```
data/vedas/
data/upanishads/
data/puranas/
```