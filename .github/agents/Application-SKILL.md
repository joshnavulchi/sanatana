---
name: Application SKILL
description: "Create, update, and validate VS Code agent customization SKILL.md files for this repository. Use when you need a reusable, workspace-scoped workflow guide for agent customization." 
---

# Agent Customization Skill

This skill helps you author workspace-level `SKILL.md` files for repository-specific agent customization.

## When to use

* When you want to document a multi-step workflow or reusable process.
* When you need a workspace-scoped guide that should be shared with collaborators.
* When a task requires more than a single prompt and should be packaged as a skill.

## What this skill produces

A repository skill file that includes:

* `name` and `description` frontmatter
* clear usage guidance for the skill
* step-by-step creation instructions
* examples and validation notes

## Creation checklist

1. Choose workspace scope.
   * Save under `.github/skills/<skill-name>/SKILL.md`
2. Pick the right customization primitive.
   * Use a skill for multi-step workflows and reusable guidance.
3. Write valid YAML frontmatter.
   * Required fields: `name`, `description`
4. Add a concise body.
   * Explain purpose, steps, and sample usage.
5. Validate the file.
   * Confirm the file path and YAML syntax.

## Example SKILL.md template

```md
---
name: <skill-name>
description: "Short summary of what this skill does and when to use it."
---

# <Skill Title>

Describe the workflow, decision points, and expected output.

## When to use

* Use case 1
* Use case 2

## Steps

1. Step one.
2. Step two.
3. Validate the result.

## Notes

* Keep YAML frontmatter valid.
* Save under `.github/skills/<skill-name>/SKILL.md`.
```

## Validation tips

* Do not use tabs in YAML.
* Quote descriptions containing colons.
* Keep the body focused on the workflow and completion criteria.

## Try it

* `Create a SKILL.md for workspace customization workflows.`
* `Draft a repository skill that helps me write agent customization files.`
