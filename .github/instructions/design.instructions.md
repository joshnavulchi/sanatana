# Design Instructions

This project uses a **Temple Architecture Inspired UI Design System**.

No dark mode is supported.

---

# Core Design Philosophy

The UI design draws inspiration from:

* South Indian temples
* carved granite pillars
* painted gopuram towers
* bronze deity statues
* lime-washed temple corridors

Design should feel:

* sacred
* warm
* historic
* elegant

---

# Background Gradients

Main page background

```
bg-linear-to-b from-[#fffaf3] via-[#fdf0d7] to-[#fff8ef]
```

Section shell backgrounds rotate between:

```
bg-linear-to-br from-[#fffaf3] via-[#fef3e2] to-[#fbe8c8]
bg-linear-to-br from-[#fffbf5] via-[#fdf1dc] to-[#f8e4c0]
bg-linear-to-br from-[#fff9f0] via-[#fce9ce] to-[#f5d9ae]
```

---

# Heading Gradients

Temple inspired heading gradients

```
bg-linear-to-r from-[#a63d17] via-[#d97706] to-[#f59e0b]
bg-linear-to-r from-[#92400e] via-[#c2410c] to-[#ea580c]
```

Use with

```
bg-clip-text text-transparent
```

---

# Card Design

Cards must use

```
rounded-2xl
shadow-[0_8px_30px_rgba(146,64,14,0.08)]
```

Hover interaction

```
hover:-translate-y-1.5
hover:shadow-[0_20px_60px_rgba(166,61,23,0.18)]
```

---

# Borders

Borders must use gold/brass tones.

Examples

```
border-[#d8a25a]
border-[#c98a41]
border-[#e0a632]
```

Never use grey borders.

---

# Shadows

Shadows must be warm-toned.

Examples

```
shadow-[0_8px_30px_rgba(146,64,14,0.08)]
shadow-[0_20px_60px_rgba(166,61,23,0.18)]
```

Never use grey shadows.

---

# Layout Guidelines

Cards

```
rounded-2xl or rounded-3xl
```

Images

```
rounded-t-[999px]
```

Sections

* alternating background shells
* gold ornamental separators
* warm glow backgrounds

---

# Decorative Elements

Allowed decorative elements

* temple pillar gradients
* diamond separators
* bronze hover shimmer
* glow background blobs

Accent colors should be used sparingly:

```
teal #1a6e5c
indigo #3b3270
```

Maximum one accent per section.

---

# Motion

Interactive elements should lift slightly

```
hover:-translate-y-1.5
transition-all duration-300
```

Images should scale on hover

```
hover:scale-105
```

---

# Accessibility

UI must maintain:

* readable contrast
* keyboard navigation
* semantic HTML
* ARIA labels