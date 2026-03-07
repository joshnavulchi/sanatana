# Code Standards for This Repository

## Project Overview

This repository is a Next.js (App Router, TypeScript) project using Tailwind CSS for styling, Yarn for package management, and Turbopack for builds. All code is written in TypeScript and follows strict linting and formatting standards.

## Technology Stack

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **State Management:** React Context, custom hooks
- **Build:** Turbopack (default, no custom Webpack)
- **Testing:** Jest, @testing-library/react
- **Linting:** ESLint v10+ (flat config, ES module)
- **Package Manager:** Yarn

## Folder Structure Standards

- **Components:** All reusable and page-specific components are in `app/components/` or feature folders under `app/`.
- **Pages:** Each page is a folder under `app/` with a `page.tsx` file.
- **Hooks:** Custom hooks in `app/hooks/`.
- **Lib:** Shared utilities in `lib/`.
- **Types:** TypeScript types in `types/`.
- **Tests:** Colocated in `__tests__/` folders within component/page directories.
- **Locales:** Translation files in `public/locales/`.

### Example File Organization

```
app/
  ├── components/        # Reusable UI components
  ├── about/             # About page
  ├── donate/            # Donate page
  ├── hooks/             # Custom React hooks
  ├── context/           # React Context providers
  ├── ...                # Other feature folders
lib/
  ├── ...                # Shared utilities
public/
  ├── locales/           # i18n translation files
  ├── images/            # Static assets
scripts/
  ├── ...                # Utility scripts
```

## Naming Conventions

- **Components:** PascalCase (e.g., `AboutClient`, `DonateClient`)
- **Pages:** Folder name matches feature/domain, file is `page.tsx`
- **Variables/Functions:** camelCase
- **Constants:** UPPER_SNAKE_CASE
- **SCSS Classes:** BEM (Block Element Modifier) if using SCSS

## Component & Page Patterns

- Components are functional React components, typed with TypeScript.
- Use `use client` directive for client components.
- Pages export a default function and import/render a main client component.
- Use Tailwind classes for styling; avoid inline styles except for dynamic cases.
- All navigation uses Next.js `<Link>` or `<a>` with Tailwind classes.

### Example

```tsx
"use client";
import { useLocale } from "@app/context/locale-context";
import PageLayout from "@components/common/PageLayout";
export default function AboutClient() {
  const { t } = useLocale();
  return <PageLayout>{t("about.title")}</PageLayout>;
}
```

## State Management

- Use React Context and custom hooks for shared state.
- Use `useState` for local state, `useReducer` for complex local logic.
- No Redux Toolkit or React Query in this repo.

## Internationalization (i18n)

- All user-facing text is sourced from locale files in `public/locales/`.
- Use `useLocale` hook from `app/context/locale-context`.
- Support for multiple languages and RTL where possible.

## Testing Standards

- Use Jest and @testing-library/react for unit and integration tests.
- Colocate tests in `__tests__/` folders within component/page directories.
- Test file naming: `ComponentName.test.tsx` or `PageName.test.tsx`.

## Linting & Formatting

- ESLint v10+ (flat config, ES module syntax)
- Prettier for formatting
- All scripts use Yarn (not npm)
- Lint and format scripts target only source files (not build output)

## Build & Development

- Use Yarn for all scripts: `yarn dev`, `yarn build`, `yarn lint`, `yarn format`, `yarn test`
- Turbopack is default, no custom Webpack config
- All build/lint/test scripts are Yarn-native

## Accessibility & Localization

- UI components must be accessible (ARIA, keyboard navigation, color contrast)
- All user-facing text must be locale-sourced
- Use locale-aware formatting for dates, numbers, currencies

## Path Aliases

- Use absolute imports with `@components`, `@lib`, etc. (configured in tsconfig.json)

## Code Quality

- All code, comments, and documentation in English
- Strict TypeScript, no `any` types
- Prefer composition, keep components small and focused
- Test UI with multiple locales and languages

## Example Patterns

```tsx
import { createGenerateMetadata } from "@lib/pageUtils";
export const generateMetadata = createGenerateMetadata("about");
import AboutClient from "./aboutclient";
export default function Page() {
  return <AboutClient />;
}
```

## Change Process

1. Create feature branch from main
2. Write/update tests for new functionality
3. Run `yarn check` before committing
4. Ensure TypeScript compilation succeeds
5. Document significant changes
6. Create pull request with clear description

## Notes for AI Assistants

- Always use the project's established patterns and conventions
- Prefer existing utilities and hooks over creating new ones
- Maintain type safety - add proper TypeScript types
- Follow the file organization structure
- Use path aliases (@components, @lib, etc.) in imports
- Keep components focused and composable
- Write tests for new functionality
- Update this document when architecture changes significantly

## Architecture Principles

### React Component Guidelines

## State Management Strategy

### Redux Toolkit (Global State)

- Used for **cross-cutting concerns**: authentication, navigation, job status
- State persisted to `localStorage` via custom middleware
- Located in `app/store/slices/`
- Current slices: `authSlice`, `navSlice`, `jobSlice`
- Use typed hooks: `useAppSelector`, `useAppDispatch`

```typescript
// Always use typed hooks from app/store/hooks.ts
import { useAppSelector, useAppDispatch } from "@app/store/hooks";

const dispatch = useAppDispatch();
const authState = useAppSelector((state) => state.auth);
```

### React Query (Server State)

- Used for **data fetching, caching, and synchronization**
- Configuration in `app/queryClient.ts`
- Default stale time: 1 minute
- Retry once on failure
- Window focus refetch disabled

```typescript
// Example usage pattern
import { useQuery } from "@tanstack/react-query";

const { data, isLoading, error } = useQuery({
  queryKey: ["jobs", id],
  queryFn: () => fetchJobById(id),
});
```

### Local State

- Use `useState` for component-local state
- Use `useReducer` for complex local state logic
- Prefer lifting state up over prop drilling beyond 2 levels

## API Integration

### API Client Configuration

- Centralized axios instance in `app/services/apiClient.ts`
- Base URL from environment: `VITE_BASE_URL`
- Includes credentials (`withCredentials: true`) for cookie-based auth
- Request/response interceptors for auth token handling and error processing

### Interceptor Pattern

```typescript
// Request interceptor: app/services/requestInterceptor.ts
// - Adds auth tokens
// - Handles request preparation

// Response interceptor: app/services/responseInterceptor.ts
// - Handles token refresh
// - Global error handling
// - Unauthorized redirects
```

### API Service Pattern

```typescript
// Create service files in app/services/
// Example: app/services/accountAPI.ts
import apiClient from "./apiClient";

export const loginUser = async (credentials: LoginRequest) => {
  const response = await apiClient.post("/account/login", credentials);
  return response.data;
};
```

## Routing and Navigation

### Route Configuration

- Defined in `app/routes/route.tsx` and `app/utils/routes/route-utils.ts`
- Uses lazy loading for code splitting
- Protected routes with role-based access control
- Base path configured via `VITE_ROUTE_BASENAME` for multi-tenancy

### Route Structure

```typescript
// Public routes
/ → AccountComponent (Login)
/account/login-submit → AccountComponent

// Protected routes (role-based)
- Defined in routeData with allowedRoles
- Wrapped in <ProtectedRoute>
- Unauthorized users redirected to login
```

## Internationalization (i18n)

### Configuration

- Located in `app/i18n/index.ts`
- Supported languages: English (`en`), French (`fr`)
- Browser language detection enabled
- Translation files: `app/i18n/en/en.json`, `app/i18n/fr/fr.json`

### Usage Pattern

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  return <h1>{t('welcome.title')}</h1>;
};
```

## SignalR Real-Time Communication

### Implementation

- Custom hook: `app/hooks/useSignalRMessages.ts`
- Uses jQuery-based SignalR (legacy version)
- Hub endpoint: `TRANSMISSION_HUB` (from environment)
- Handles resource status updates and real-time notifications
- Integrated with AlertService context for displaying messages

### Usage

```typescript
import { useSignalRMessages } from "@app/hooks/useSignalRMessages";

const { messagesData } = useSignalRMessages();
```

## Styling Guidelines

### Indian Temple Color Palette

All UI across the application uses an **Indian temple-inspired color palette** — no dark mode. These colors reflect the warm tones of sandstone, saffron, turmeric, kumkum, gold leaf, and sacred wood found in traditional Hindu temples.

#### Primary Colors (use everywhere: backgrounds, borders, text, gradients)

| Token                | Hex       | Usage                                                |
| -------------------- | --------- | ---------------------------------------------------- |
| **Temple Maroon**    | `#7a2e1f` | Primary headings, badges, CTA text, icon backgrounds |
| **Sacred Saffron**   | `#9a3412` | Section accents, numbered badges, bold labels        |
| **Kumkum Red**       | `#a63d17` | Gradient start for headings, decorative borders      |
| **Turmeric Orange**  | `#d97706` | Gradient midpoints, link hovers, divider lines       |
| **Gold Leaf**        | `#f59e0b` | Gradient endpoints, highlights, sparkle accents      |
| **Burnished Copper** | `#c2410c` | Secondary gradient midpoints, warm accents           |
| **Terracotta**       | `#ea580c` | Alert accents, alternate gradient stops              |
| **Deep Teak**        | `#92400e` | Subheadings, subtle badges, label text               |
| **Sacred Wood**      | `#b45309` | Divider lines, ornamental borders                    |

#### Neutral / Surface Colors (backgrounds, cards, shells)

| Token               | Hex       | Usage                            |
| ------------------- | --------- | -------------------------------- |
| **Temple Cream**    | `#fffaf3` | Page background start            |
| **Warm Ivory**      | `#fdf0d7` | Page background mid              |
| **Sandstone Light** | `#fff8ef` | Page background end              |
| **Parchment**       | `#fffaf0` | Card backgrounds, inner frames   |
| **Butter Cream**    | `#fff7ed` | Section shell start              |
| **Pale Gold**       | `#fde7c7` | Section shell mid                |
| **Warm Sand**       | `#f8d7a0` | Section shell end                |
| **Ghee White**      | `#fffaf2` | Card/point card backgrounds      |
| **Light Saffron**   | `#fff4df` | Point-image backgrounds          |
| **Honey Wash**      | `#f8e1b9` | Point-image gradient end         |
| **Temple Dust**     | `#fff5dd` | Image frame inner gradient start |
| **Aged Gold**       | `#f4d29a` | Image frame inner gradient end   |

#### Text Colors

| Token            | Hex       | Usage                             |
| ---------------- | --------- | --------------------------------- |
| **Temple Brown** | `#5b2d12` | Body text, paragraph content      |
| **Rosewood**     | `#6b3a17` | Card descriptions, secondary text |
| **Clay Brown**   | `#7a2e1f` | Card headings, bold labels        |

#### Border / Ornament Colors

| Token             | Hex       | Usage                                 |
| ----------------- | --------- | ------------------------------------- |
| **Gold Border**   | `#d8a25a` | Primary section borders, inner frames |
| **Antique Gold**  | `#d9a15d` | Card borders (tone 1)                 |
| **Aged Brass**    | `#c98a41` | Card borders (tone 2)                 |
| **Copper Border** | `#cf8f4f` | Card borders (tone 3)                 |
| **Light Gold**    | `#edc98f` | Icon container borders                |
| **Sand Border**   | `#e3b36f` | Point card borders                    |
| **Faded Gold**    | `#efd6ab` | Point-image bottom borders            |
| **Frame Gold**    | `#f8e2b8` | Image arch frame border               |

#### Gradient Presets (commonly used Tailwind gradient combos)

```
/* Page background */
bg-linear-to-b from-[#fffaf3] via-[#fdf0d7] to-[#fff8ef]

/* Section heading text */
bg-linear-to-r from-[#a63d17] via-[#d97706] to-[#f59e0b]  (tone 1)
bg-linear-to-r from-[#92400e] via-[#c2410c] to-[#ea580c]  (tone 2)
bg-linear-to-r from-[#7c2d12] via-[#c2410c] to-[#fb923c]  (tone 3)

/* Card top accent bar */
bg-linear-to-r from-[#7c2d12] via-[#d97706] to-[#f59e0b]

/* Ornamental divider */
bg-linear-to-r from-[#b45309]/60 to-transparent
```

#### Design Rules

- **No dark mode** — light temple palette only
- Use `bg-clip-text text-transparent` with heading gradients for rich text effects
- Alternate section shell tones (3 rotating palettes) for visual rhythm
- Use rounded arch shapes (`rounded-t-[999px]`) for temple-style image framing
- Apply warm, translucent blurs (`blur-2xl`, `blur-3xl`) for ornamental background shapes
- Keep shadows warm-toned: `rgba(166,61,23,0.12)`, `rgba(146,64,14,0.13)`, `rgba(122,46,31,0.09)`
- Borders should be gold/copper toned, never grey or neutral

### SCSS Structure

- Global styles: `app/index.scss`, `app/styles/index.scss`
- Utilities: `app/styles/utilities.scss`
- Component-specific styles: colocated with components
- Custom fonts in `public/fonts/`

### Naming Convention

- Use BEM (Block Element Modifier) for CSS classes
- Prefix custom classes to avoid conflicts with library styles

### Asset Optimization

- Vite automatically minifies CSS and JS
- Gzip and Brotli compression enabled via `vite-plugin-compression2`
- Threshold: 10KB (files smaller than 10KB not compressed)

## Component Patterns

### Standard Component Structure

```typescript
// ComponentName.tsx
import { useState } from 'react';
import type { ComponentNameProps } from '@app/types/component/component-name-type';
import './ComponentName.scss';

const ComponentName = ({ prop1, prop2 }: ComponentNameProps) => {
  const [state, setState] = useState<Type>(initialValue);

  // Event handlers
  const handleAction = () => {
    // implementation
  };

  // Render
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### Custom Hooks

```typescript
// app/hooks/useCustomHook.ts
import { useState, useEffect } from "react";

export const useCustomHook = (param: Type) => {
  const [state, setState] = useState<Type>();

  useEffect(() => {
    // side effects
  }, [param]);

  return { state /* exported values */ };
};
```

## TypeScript Guidelines

### Core Principles

- **Use TypeScript for all new code** - No plain JavaScript files
- **Prefer `interface` over `type`** for object shapes (more extensible)
- **Use `readonly` and `const`** for immutability
- **Use optional chaining (`?.`)** and **nullish coalescing (`??`)** operators
- **Enable strict mode** - Ensure strict TypeScript checking
- **Avoid `any`** - Use `unknown` or proper types instead
- **Prefer `const` over `let`**, never use `var`

### Type Organization

- All types in `src/types/` organized by domain (account, component, services, etc.)
- Export types from dedicated type files
- Use `readonly` for immutable properties
- Define types close to their usage when they're not shared

### Naming Convention

```typescript
// Props interfaces
interface ComponentNameProps {}

// State interfaces
interface UserState {}

// API request/response types
interface LoginRequest {}
interface LoginResponse {}

// Utility types
type Status = "idle" | "loading" | "success" | "error";
```

## Path Aliases

Configure in `vite.config.ts` and use in imports:

```typescript
import Component from "@app/components/Component";
import { useDiagram } from "@app/diagrams/hooks";
import apiClient from "@app/services/apiClient";
import { useCustomHook } from "@app/hooks/useCustomHook";
```

## Environment Configuration

### Environment Variables

- All env vars prefixed with `VITE_`
- Defined in `.env` file
- Accessed via `import.meta.env.VITE_VAR_NAME`
- Centralized in `src/config/environment.ts`

### Key Variables

```
VITE_BASE_URL              - API base URL
VITE_SIGNALR_BASE_URL      - SignalR hub URL
VITE_ROUTE_BASENAME        - Multi-tenancy route base
VITE_USE_MOCK              - Enable mock data (true/false)
VITE_GOJS_LICENSE_KEY      - GoJS license
VITE_JOBLIST_POLLING_INTERVAL - Polling interval for jobs
```

## Testing Standards

### Testing Requirements

- **Write unit tests for all components and utilities**
- **Use Jest** for unit tests and test runner
- **Use @testing-library/react** for component testing
- **Prefer user-centric testing** - Test behavior, not implementation
- **Colocate tests** with components in `__tests__/` or `_tests_/` folders
- **Test file naming**: `ComponentName.test.tsx` or `utilityName.test.ts`

### Testing Pattern

```typescript
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    const handleClick = jest.fn();
    render(<ComponentName onClick={handleClick} />);
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test Commands

```bash
yarn run test          # Run all tests once
yarn run test:watch    # Watch mode for development
yarn run test:coverage # Generate coverage report
yarn run test:ci       # CI mode with coverage
```

### Test Coverage Goals

- Aim for high coverage on critical business logic
- Test edge cases and error scenarios
- Mock external dependencies (API calls, SignalR, etc.)

## Code Quality Standards

### Linting and Formatting

- **ESLint**: Run `yarn run lint` to ensure code adheres to ESLint rules with auto-fix
- **Prettier**: Run `yarn run format` to ensure code adheres to Prettier formatting rules
- **SCSS Linting**: Run `yarn run lint:scss` to lint SCSS files
- **Pre-commit Hooks**: Husky runs lint-staged to auto-fix issues before commits
- **Combined Check**: Run `yarn run check` to execute lint + format + test before commits

### Code Style Standards

- **Max line length**: 100 characters (enforced by Prettier)
- **Destructuring**: Use destructuring for objects and arrays
- **Template Literals**: Prefer template literals over string concatenation
- **Async/Await**: Use async/await over promise chains
- **Arrow Functions**: Use arrow functions for consistency
- **Semicolons**: Follow project's semicolon usage (configured in ESLint)
- **Quotes**: Use single quotes for strings (enforced by Prettier)

## Build and Development

### Development

```bash
yarn run dev          # Start dev server with host access
yarn run build        # TypeScript compilation + Vite build
yarn run preview      # Preview production build
```

### Code Quality

```bash
yarn run lint         # ESLint auto-fix
yarn run format       # Prettier formatting
yarn run lint:scss    # SCSS linting
yarn run check        # Run lint + format + test
```

### Pre-commit Hooks

- Husky configured to run lint-staged
- Auto-fixes ESLint issues before commit
- Configured in `package.json` lint-staged section

## Edge Toolkit Integration

### Using flex-custom-lib

- Local package installed from `src/lib/flex-custom-lib-1.0.5.tgz`
- Import components directly:

```typescript
import { Button, TextInput, Dropdown } from "flex-custom-lib";
```

### Updating the Package

1. Build new TGZ in xwuikit project
2. Copy to `src/lib/`
3. Update version in `package.json` if needed
4. Run `yarn install`

## Multi-Tenancy Support

### Configuration

- Route basename: `VITE_ROUTE_BASENAME` env variable
- Applied in `main.tsx` via `BrowserRouter basename={baseName}`
- Allows multiple tenant deployments with different base paths

### Tenant-Specific Settings

- Can be fetched via `VITE_ACCOUNT_TENANT_SETTINGS_GET` endpoint
- Store in Redux auth slice if needed

## GoJS Diagram Integration

### Files

- Diagram components: `src/diagrams/`
- Utilities: `src/utils/diagram/`
- License key: `VITE_GOJS_LICENSE_KEY`

### Usage

```typescript
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
```

## Common Patterns

### Alert/Snackbar System

- Context: `src/context/AlertServiceContext.ts`, `AlertServiceProvider.tsx`
- Hook: `src/hooks/useAlertService.ts`
- Usage:

```typescript
const { setAlertMessage, setAlertShow } = useAlertService();

setAlertMessage({
  snackbarType: "success",
  snackbarMessage: "Operation successful",
  snackbarTitle: "Success",
});
setAlertShow("d-block");
```

### Polling Pattern

- Custom hook: `src/hooks/usePolling.ts`
- For periodic data fetching (e.g., job status updates)

### Error Handling

- Global ErrorBoundary in `App.tsx`
- API error handler hook: `src/hooks/useApiErrorHandler.ts`
- Axios interceptors handle common error scenarios

## Important Considerations

### Performance

- Use React.memo for expensive components
- Implement virtualization for large lists (react-window)
- Lazy load routes and heavy components
- Optimize re-renders with useMemo and useCallback

### Security

- Never commit `.env` files with secrets
- Use `withCredentials: true` for cookie-based auth
- Validate and sanitize user inputs
- Handle auth token refresh in response interceptor

### Accessibility

- Use semantic HTML elements
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features via Vite/Babel transpilation

## Quick Reference

### Import Shortcuts

```typescript
// Absolute imports
import Component from "@/components/Component";
import { useAuth } from "@hooks/useAuth";
import apiClient from "@services/apiClient";
import { DiagramComponent } from "@diagrams/DiagramComponent";
```

### Redux Toolkit Slice Pattern

```typescript
// src/store/slices/exampleSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const exampleSlice = createSlice({
  name: "example",
  initialState: {
    /* ... */
  },
  reducers: {
    actionName: (state, action: PayloadAction<Type>) => {
      state.field = action.payload;
    },
  },
});

export const { actionName } = exampleSlice.actions;
export default exampleSlice.reducer;
```

## Getting Help

### Key Documentation

- React: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs
- Vite: https://vitejs.dev
- React Router: https://reactrouter.com
- Redux Toolkit: https://redux-toolkit.js.org
- React Query: https://tanstack.com/query
- GoJS: https://gojs.net/latest/index.html

### Internal Resources

- `README.md` - Setup and integration guide
- `instructions/CODING_STANDARDS.md` - Detailed coding standards
- `package.json` - All available scripts and dependencies

## Change Process

When making changes:

1. Create feature branch from main
2. Write/update tests for new functionality
3. Run `yarn run check` before committing
4. Ensure TypeScript compilation succeeds
5. Document significant changes
6. Create pull request with clear description

## Notes for AI Assistants

- Always use the project's established patterns and conventions
- Prefer existing utilities and hooks over creating new ones
- Maintain type safety - add proper TypeScript types
- Follow the file organization structure
- Use path aliases (@, @components, etc.) in imports
- Keep components focused and composable
- Write tests for new functionality
- Update this document when architecture changes significantly

## Frameworks & Libraries

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS (with custom gradients, rounded corners, and shadow effects for modern UI)
- **State/Locale:** React Context, custom hooks (e.g., `useLocale`, `useLocaleSection`)
- **Components:** Modular, reusable, and imported from `@components` or local folders
- **Metadata:** Use `createGenerateMetadata` from `@lib/pageUtils` for SEO/meta

## Component Rendering

- Components are functional React components (with `export default function ...`)
- Use `use client` directive for client components
- Props and state are typed with TypeScript
- Use hooks for locale, data fetching, and effects
- Render content dynamically from JSON/locale objects when possible
- Use Tailwind classes for all styling; avoid inline styles except for dynamic cases
- Use semantic HTML (section, article, nav, etc.)
- Use utility classes for spacing, layout, and responsiveness
- Use unique, visually distinct card/section designs for major content blocks

## Page Rendering

- Each page is a file in the `app/` directory, exporting a default function
- Pages import and render a single main client component (e.g., `AboutClient`, `DonateClient`)
- Use a shared `PageLayout` component for consistent layout, meta, and breadcrumbs
- Metadata is generated per-page using `generateMetadata`
- Pages may include additional components (e.g., `StructuredData`, `SimilarCategories`)
- All navigation and links use Next.js `<Link>` or `<a>` with Tailwind classes
- Pages are organized by feature/domain (e.g., `stories/`, `scriptures/`, `philosophy/`)

## General Coding Practices

## International Coding Standards

### Naming Conventions

- Use descriptive, English-based names for files, components, variables, and functions.
- Avoid abbreviations unless widely recognized.
- Use PascalCase for components, camelCase for variables/functions, and kebab-case for folders/files.

### Language Neutrality

- All code, comments, and documentation must be in English.
- Avoid region-specific idioms or slang.

### Accessibility & Localization

- Ensure UI components are accessible (ARIA roles, keyboard navigation, color contrast).
- All user-facing text must be sourced from locale files (not hardcoded).
- Use locale-aware formatting for dates, numbers, and currencies.
- Support RTL languages where possible.

### Best Practices

- Use Unicode for all string handling.
- Validate input/output for international character sets.
- Test UI with multiple locales and languages.

### Example

```tsx
// Good: Locale-aware, accessible, English-named
import { useLocale } from "@app/context/locale-context";
export default function DonateClient() {
  const { t } = useLocale();
  return <button aria-label={t("donate_button_label")}>{t("donate")}</button>;
}
```

## Example Patterns

    ```tsx
    import { createGenerateMetadata } from '@lib/pageUtils';
    export const generateMetadata = createGenerateMetadata('page_key');
    import SomeClient from './someclient';
    export default function Page() { return <SomeClient />; }
    ```
    ```tsx
    'use client';
    import { useLocale } from '@app/context/locale-context';
    import PageLayout from '@components/common/PageLayout';
    export default function SomeClient() { /* ... */ }
    ```
