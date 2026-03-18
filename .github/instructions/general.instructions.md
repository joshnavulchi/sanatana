# General Project Instructions

This document describes the overall architecture, frameworks, and libraries used in this project.

---

# Technology Stack

Framework

* Next.js (App Router)
* React
* TypeScript

Styling

* Tailwind CSS

Testing

* Jest
* Testing Library

Build

* Turbopack

Package Manager

* npm

---

# Folder Structure

```
app/
  components/
  hooks/
  context/
  pages/
lib/
types/
public/
scripts/
```

---

# State Management

Primary approach:

* React Context
* Custom Hooks

Local state:

```
useState
useReducer
```

---

# Internationalization

Translation files are stored in:

```
data/
public/locales/
```

Supported languages:

* English
* French

Example usage

```tsx
import { useLocale } from "@app/context/locale-context";

const { t } = useLocale();
```

---

# API Integration

Central axios client

```
app/services/apiClient.ts
```

Features

* request interceptors
* response interceptors
* token handling
* global error handling

---

# Routing

Next.js App Router structure

```
app/
  about/page.tsx
  donate/page.tsx
```

Each page renders a client component.

---

# Environment Variables

Stored in

```
.env
```

Examples

```
VITE_BASE_URL
VITE_SIGNALR_BASE_URL
VITE_ROUTE_BASENAME
```

---

# Testing

Commands

```
npm run test
npm run test:watch
npm run test:coverage
```

---

# Code Quality Tools

Tools used

* ESLint
* Prettier
* Husky

Command

```
npm run lint
```

---

# Performance Practices

* lazy loaded routes
* memoized components
* optimized images
* code splitting

---

# Security

* cookie authentication
* token refresh handling
* input validation
* no secrets committed

---

# Browser Support

Supported browsers

* Chrome
* Firefox
* Safari
* Edge
