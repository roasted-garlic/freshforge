# Style Guide

> **Project-specific** — customize during intake or bootstrap. Defines UI/UX conventions for *this* app. Does not impose one global visual identity.

---

## Design Principles
<!-- 3–5 principles for this product's UX -->

1. `[TBD — e.g. Clarity over density]`
2. `[TBD]`
3. `[TBD]`

---

## Brand & Tone (if applicable)

| Element | Value |
|---------|-------|
| Brand name usage | `[TBD]` |
| Voice / tone | `[professional, friendly, technical, etc.]` |
| Logo assets | `[path or TBD]` |

---

## Layout

| Topic | Rule |
|-------|------|
| Max content width | `[TBD]` |
| Grid system | `[TBD — 12-col, flex, etc.]` |
| Page structure | `[header, sidebar, main, footer patterns]` |
| Spacing scale | `[4px base / 8px base — TBD]` |

---

## Colors

> Define semantic tokens, not only raw hex — supports theming and dark mode.

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-primary` | `[TBD]` | `[TBD]` | Primary actions |
| `--color-background` | `[TBD]` | `[TBD]` | Page background |
| `--color-text` | `[TBD]` | `[TBD]` | Body text |
| `--color-error` | `[TBD]` | `[TBD]` | Errors |
| `--color-success` | `[TBD]` | `[TBD]` | Success states |

---

## Typography

| Token | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| heading-xl | `[TBD]` | | | Page titles |
| body | `[TBD]` | | | Paragraphs |
| caption | `[TBD]` | | | Helper text |

---

## Components

Document existing or planned design system:

| Component | Source | Notes |
|-----------|--------|-------|
| Buttons | `[MUI / shadcn / custom / native]` | |
| Forms | | |
| Modals | | |
| Tables | | |
| Navigation | | |

### Component Rules
- Primary action: one per view when possible
- Destructive actions: require confirmation
- Loading states: skeleton or spinner — `[choose and document]`
- Empty states: helpful message + action

---

## Icons & Imagery
- Icon set: `[TBD — Lucide, Heroicons, SF Symbols, etc.]`
- Image aspect ratios: `[TBD]`
- Placeholder strategy: `[TBD]`

---

## Accessibility

| Requirement | Standard |
|-------------|----------|
| Target | `[WCAG 2.1 AA recommended]` |
| Color contrast | Minimum 4.5:1 for body text |
| Focus indicators | Visible on all interactive elements |
| Screen readers | Labels on inputs; aria where needed |
| Keyboard | All flows operable without mouse |

---

## Responsive Behavior

| Breakpoint | Min width | Layout notes |
|------------|-----------|--------------|
| mobile | `[TBD]` | |
| tablet | `[TBD]` | |
| desktop | `[TBD]` | |

Mobile-first: `[yes/no — TBD]`

---

## Motion & Animation
- Duration tokens: `[TBD]`
- Reduce motion: respect `prefers-reduced-motion`

---

## Content & Microcopy
- Error messages: plain language, actionable
- Button labels: verb-first (`Save`, `Create order`)
- Date/time format: `[TBD locale]`

---

## Do / Don't

| Do | Don't |
|----|-------|
| Use semantic color tokens | Hardcode one-off colors in components |
| Match existing patterns in codebase | Introduce new patterns without plan |
| Request human review for major visual changes | Ship large UI overhauls without checkpoint |

---

## Revision History

| Date | Summary |
|------|---------|
| YYYY-MM-DD | Initial template |
