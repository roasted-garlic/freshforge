# Architecture

> **Project-specific** — customize during intake or bootstrap. Describes structure, boundaries, and dependency rules.

> **FreshForge starter note:** In the FreshForge workflow starter repository, this file is a **template for target application architecture**. The starter's own layout (`AGENTS.md`, `.cursor/`, `docs/`) is described in `README.md`.

---

## Overview
<!-- High-level system description and diagram reference -->

`[TBD — 2–3 paragraphs]`

### System Context Diagram
```
[Optional: users → app → backend → external services]
```

---

## Architectural Style
<!-- e.g. monolith, modular monolith, microservices, serverless, mobile client + API, SPA + BaaS -->

`[TBD]`

---

## Layers & Responsibilities

| Layer | Location | Responsibility |
|-------|----------|----------------|
| UI | `[path pattern]` | Rendering, layout, user events |
| State / coordination | `[path pattern]` | Hooks, stores, view models |
| Services | `[path pattern]` | Business logic, orchestration |
| Data access | `[path pattern]` | API clients, repositories, SDK adapters |
| Shared types | `[path pattern]` | Cross-layer contracts |

---

## Dependency Rules

1. UI must not call backend/database directly
2. Services must not import UI
3. Data access must not contain business rules
4. Shared types must not depend on feature modules
5. No circular dependencies between modules

---

## Frontend (if applicable)

| Topic | Choice |
|-------|--------|
| Framework | `[React / Vue / Svelte / Native / etc.]` |
| Routing | `[TBD]` |
| State management | `[TBD]` |
| Styling | `[TBD]` |
| Build tool | `[TBD]` |

### Entry Points
- `[TBD — main.tsx, App.vue, etc.]`

---

## Backend (if applicable)

See `BACKEND.md` for detail. Summary:

| Topic | Choice |
|-------|--------|
| Style | `[REST / GraphQL / RPC / BaaS / serverless]` |
| Runtime | `[TBD]` |
| Hosting | `[TBD]` |

---

## Data Layer

See `DATA_MODEL.md`. Summary:

| Topic | Choice |
|-------|--------|
| Primary store | `[PostgreSQL / Firestore / MongoDB / etc.]` |
| Caching | `[TBD / none]` |
| Search | `[TBD / none]` |

---

## Authentication & Authorization

| Topic | Choice |
|-------|--------|
| Auth provider | `[TBD]` |
| Session / token model | `[TBD]` |
| Permission model | `[Link to DATA_MODEL.md or SECURITY.md section]` |

---

## Integrations

| Service | Purpose | Doc reference |
|---------|---------|---------------|
| | | `BACKEND.md` |

---

## Deployment Architecture

See `DEPLOYMENT.md`. Environments: `[local, staging, production]`

---

## Folder Structure

```
[TBD — document actual or planned tree]
project-root/
├── ...
└── ...
```

---

## Feature Organization
<!-- How features/modules are grouped -->

`[Feature-based / layer-based / hybrid — explain]`

---

## Cross-Cutting Concerns

| Concern | Approach |
|---------|----------|
| Error handling | `[TBD]` |
| Logging | `[TBD]` |
| Config / feature flags | `[TBD]` |
| i18n | `[TBD / N/A]` |

---

## Scalability & Performance Notes
`[TBD]`

---

## Architecture Decision Records
Significant decisions: `DECISIONS.md`

---

## Revision History

| Date | Summary |
|------|---------|
| YYYY-MM-DD | Initial template |
