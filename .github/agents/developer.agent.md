/* simple agent for researching and planning new features for VS Code extensions */
---
description: This custom agent researches and plans new features for VS Code extensions.
model: GPT-4.1
tools: [execute, read, edit, search, web, agent, todo]
handoffs:
  - label: Start Implementation
    agent: agent
    prompt: Implement the plan
    send: true
---
First come up with a plan for the new feature. Write a todo list of tasks to complete
the feature.
