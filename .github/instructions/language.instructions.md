# Language Instructions

This document defines **language, terminology, and writing standards** for code, documentation, and generated content in this repository.

The goal is to maintain **clarity, consistency, and international readability**.

---

# Primary Language

All code and documentation must use **English**.

This includes:

* source code
* comments
* documentation
* commit messages
* variable names
* function names
* test descriptions

Example:

Correct

```
function calculateTempleArea()
```

Incorrect

```
function mandirAreaHisab()
```

---

# Naming Language Rules

Use **clear descriptive English names**.

Avoid:

* slang
* regional abbreviations
* transliteration from other languages

Correct examples

```
TempleArchitectureCard
useLocale
generateMetadata
calculateReadingTime
```

Avoid

```
MandirCard
calcRT
genMeta
```

---

# Code Comments

Comments must be written in **clear technical English**.

Correct

```ts
// Fetch scripture metadata from the API
```

Incorrect

```ts
// yeh function API se data laata hai
```

---

# Documentation Language

All project documentation must be written in **neutral international English**.

Avoid region-specific idioms such as:

```
piece of cake
hit the ground running
```

Use clear technical descriptions instead.

Example

Correct

```
This function returns the localized scripture title.
```

---

# UI Content Language

User-facing text must **never be hardcoded**.

All UI text must come from **locale translation files**.

Example

Correct

```tsx
const { t } = useLocale();

<h3>{t("about.title")}</h3>
```

Incorrect

```tsx
<h3>About Us</h3>
```

---

# Supported UI Languages

The application supports multiple languages through localization.

Current languages:

```
English (en)
French (fr)
```

Translation files are stored in:

```
app/i18n/
public/locales/
data/
```

Example structure

```
app/i18n
```

```