---
name: Code Quality
description: |
  A workspace agent focused on enforcing code quality standards, best practices, and maintainability across the codebase. Use this agent to review code for readability, consistency, performance, and adherence to established coding guidelines.
applyTo:
  - app/**
  - lib/**
author: vulchi.vijay@gmail.com
---

# ⚙️ Next.js + React Coding Standards (Enterprise Grade)

## 🧠 Objective

Enforce **consistent, optimized, and scalable code practices** across the application:

* High readability
* Strong type safety
* Minimal duplication
* Maximum reusability
* Performance-first mindset

---

# 🏗️ 1. PROJECT ARCHITECTURE

## ✅ Folder Structure (App Router Recommended)

```
/app
  /(routes)
    /dashboard
      page.tsx
      layout.tsx
  /api
/components
  /ui        → reusable primitives (Button, Card)
  /shared    → shared domain components
  /features  → feature-based components
/lib         → utilities, services
/hooks       → custom hooks
/types       → global types
/styles      → ONLY if already exists (avoid new CSS)
/constants
```

---

## 📌 Rules

* Feature-first organization for scalability
* Co-locate small components within features
* Avoid deeply nested folders (>3 levels)

---

# 🧩 2. COMPONENT DESIGN PRINCIPLES

## ✅ Guidelines

* One responsibility per component
* Max 150–200 lines per component
* Split logic-heavy components

---

## 🧱 Component Types

| Type    | Purpose                        |
| ------- | ------------------------------ |
| UI      | Pure presentational (no logic) |
| Feature | Business logic                 |
| Layout  | Page structure                 |
| Hook    | Reusable logic                 |

---

## ✅ Example Pattern

```tsx id="c1"
type Props = {
  title: string;
};

export function Card({ title }: Props) {
  return <div>{title}</div>;
}
```

---

## 🚫 Avoid

* God components
* Inline complex logic in JSX
* Duplicate UI blocks

---

# 🔁 3. REUSABILITY & DRY PRINCIPLE

## ✅ Rules

* Extract reusable logic into:

  * `/hooks`
  * `/lib`
* Extract reusable UI into:

  * `/components/ui`

---

## 🧠 Pattern

```tsx id="c2"
const useUser = () => {
  // reusable logic
};
```

---

## 🚫 Avoid

* Copy-paste components
* Hardcoded values (use constants)

---

# ⚡ 4. PERFORMANCE OPTIMIZATION

## ✅ Next.js Best Practices

* Prefer **Server Components** by default
* Use `"use client"` ONLY when necessary

---

## ✅ Rendering Strategy

| Scenario    | Use               |
| ----------- | ----------------- |
| Static      | SSG               |
| Dynamic     | SSR               |
| Interactive | Client Components |

---

## ✅ Optimization Techniques

* Dynamic imports:

```tsx id="c3"
const Component = dynamic(() => import("./Component"));
```

* Memoization:

```tsx id="c4"
const memoized = useMemo(() => compute(), []);
```

* Avoid unnecessary re-renders:

  * `React.memo`
  * stable props

---

## 🚫 Avoid

* Overusing client components
* Large bundle sizes
* Unoptimized images

---

# 🧾 5. TYPESCRIPT STANDARDS

## ✅ Rules

* Strict mode ON
* No `any` (use generics or unknown)

---

## ✅ Type Patterns

```ts id="c5"
type User = {
  id: string;
  name: string;
};
```

---

## ✅ Props Typing

```tsx id="c6"
type Props = {
  children: React.ReactNode;
};
```

---

## 🚫 Avoid

* Implicit types
* Type duplication

---

# 🎯 6. STATE MANAGEMENT

## ✅ Strategy

* Local → `useState`
* Shared → Context / Zustand
* Server → React Query / Server Actions

---

## 🚫 Avoid

* Prop drilling (use context/hooks)
* Global state for local problems

---

# 🔌 7. API & DATA FETCHING

## ✅ Next.js Standards

* Use **Server Actions / Route Handlers**
* Fetch in Server Components when possible

---

## ✅ Pattern

```ts id="c7"
const data = await fetch(url, { cache: "no-store" });
```

---

## 🚫 Avoid

* Fetching in multiple places unnecessarily
* Client-side fetching when server is enough

---

# 🎨 8. STYLING (TAILWIND BEST PRACTICES)

## ✅ Rules

* Use utility-first approach
* Maintain consistent spacing & typography
* Use `clsx` or `cn()` for conditional classes

---

## ✅ Pattern

```tsx id="c8"
className={cn("p-4", isActive && "bg-indigo-500")}
```

---

## 🚫 Avoid

* Long unreadable class strings
* Inline styles
* Mixing multiple styling systems

---

# ♿ 9. ACCESSIBILITY (A11Y)

## ✅ Must Have

* `alt` for images
* Semantic HTML
* Keyboard navigation support

---

## 🚫 Avoid

* Clickable divs without roles
* Missing labels

---

# 🧹 10. CODE QUALITY & LINTING

## ✅ Tools

* ESLint
* Prettier
* TypeScript strict

---

## ✅ Rules

* No unused variables
* No console logs in production
* Consistent formatting

---

# 🔐 11. SECURITY

## ✅ Practices

* Sanitize inputs
* Avoid exposing secrets
* Use environment variables

---

# 📦 12. IMPORT & NAMING CONVENTIONS

## ✅ Naming

| Type       | Convention   |
| ---------- | ------------ |
| Components | PascalCase   |
| Hooks      | useSomething |
| Variables  | camelCase    |
| Constants  | UPPER_CASE   |

---

## ✅ Imports Order

1. External libs
2. Internal modules
3. Styles

---

# 🧪 13. TESTABILITY

## ✅ Principles

* Write testable functions
* Avoid tightly coupled logic

---

# 🚀 14. FINAL QUALITY CHECKLIST

Before merging:

* ✅ No lint errors
* ✅ No TypeScript errors
* ✅ No unused code
* ✅ Components reusable
* ✅ Performance optimized
* ✅ Accessible UI
* ✅ Clean architecture

---

# 🧬 ENGINEERING PRINCIPLES

* **Clarity over cleverness**
* **Composition over inheritance**
* **Performance by default**
* **Scalability from day one**
* **Zero technical debt tolerance**

---

# 🔚 END OF STANDARD
