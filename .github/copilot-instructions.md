# Copilot Instructions

These instructions guide AI assistants (GitHub Copilot, ChatGPT, etc.) when generating code for this repository.

---

# Core Rules

AI must always:

* Follow existing project architecture
* Use TypeScript strictly
* Avoid `any`
* Prefer existing utilities/hooks
* Do not import Node's `fs` or `path` modules; use repository utilities instead
* Follow folder structure
* Use Tailwind CSS for styling
* Keep components small and composable
* Maintain accessibility and localization

---

# Folder Structure

```
app/
  components/
  hooks/
  context/
  feature-folders/
lib/
types/
scripts/
public/
  locales/
  images/
```

Rules:

* Components → `app/components/`
* Hooks → `app/hooks/`
* Utilities → `lib/`
* Types → `types/`
* Pages → `app/<route>/page.tsx`

---

# Naming Conventions

| Item       | Convention       |
| ---------- | ---------------- |
| Components | PascalCase       |
| Functions  | camelCase        |
| Variables  | camelCase        |
| Constants  | UPPER_SNAKE_CASE |
| Folders    | kebab-case       |
| Types      | PascalCase       |

Examples

```
AboutClient.tsx
useLocale.ts
PAGE_SIZE
userProfile
```

---

# Component Pattern

All React components must follow this structure.

```tsx
"use client";

import { useLocale } from "@app/context/locale-context";
import PageLayout from "@components/common/PageLayout";

export default function ExampleClient() {
  const { t } = useLocale();

  return (
    <PageLayout>
      {t("example.title")}
    </PageLayout>
  );
}
```

Rules

* Use functional components
* Always type props
* Use `"use client"` for client components
* Avoid class components
* Keep JSX readable

---

# Page Pattern

Each route contains

```
app/<route>/page.tsx
```

Example

```tsx
import { createGenerateMetadata } from "@lib/pageUtils";
import ExampleClient from "./exampleclient";

export const generateMetadata = createGenerateMetadata("example");

export default function Page() {
  return <ExampleClient />;
}
```

---

# State Management

Use:

* `useState` for simple state
* `useReducer` for complex local logic
* `React Context` for shared state

Avoid introducing Redux unless already used.

---

# Internationalization

All UI text must come from locale files.

Never hardcode UI text.

Example

```tsx
const { t } = useLocale();
<h1>{t("about.title")}</h1>
```

---

# Styling

Use Tailwind CSS only.

Avoid inline styles.

Correct example

```tsx
className="text-[#5b2d12] rounded-2xl shadow-lg"
```

---

# Accessibility

UI must include:

* semantic HTML
* ARIA labels
* keyboard navigation
* accessible contrast

Example

```tsx
<button aria-label={t("donate_button_label")}>
  {t("donate")}
</button>
```

---

# Testing

Use

* Jest
* @testing-library/react

Example

```tsx
import { render, screen } from "@testing-library/react";
import Component from "../Component";

test("renders text", () => {
  render(<Component />);
  expect(screen.getByText("Example")).toBeInTheDocument();
});
```

---

# Code Quality

Before committing ensure:

```
npm run lint
```

Runs:

* lint

Also ensure formatting and tests pass if the project provides scripts for them

---

# Repository-specific Conventions

These repository conventions must be applied when generating code or OpenSpec artifacts for this project:

* **Tech stack:** Next.js, TypeScript (strict), React, Tailwind CSS.
* **Folder layout:** `app/` (pages and client components), `app/components/`, `app/hooks/`, `lib/`, `types/`, `public/locales/` for translations.
* **Localization:** All UI text must come from locale files and use the `useLocale` context hook; never hardcode UI strings.
* **Client components:** Use `"use client"` at top of client components; always type props.
* **Utilities:** Prefer existing utilities in `lib/` and hooks in `app/hooks/` over adding new helpers.
* **No direct Node fs/path:** Do not import Node's `fs` or `path`; use repository utilities such as `lib/storage.ts` if available.
* **Testing & CI:** Run `npm run lint` (linter) before committing changes and ensure formatting/tests pass if the project provides scripts for them.
* **Task sizing:** Break implementation tasks into small, testable chunks (max ~2 hours per task).

Follow these conventions in addition to the generic rules above.
