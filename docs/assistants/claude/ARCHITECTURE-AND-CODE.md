# [PROJECT_NAME] — Architecture & Code Reference

> Technical structure, file layout, APIs/routes, data model, scripts, and conventions. For product context see `PROJECT-OVERVIEW.md`.

**Last updated:** [TBD]  
**Source:** `docs/architecture/`, `docs/standards/`, codebase inspection

---

## Stack

| Layer | Technology | Version / notes |
|-------|------------|-----------------|
| [TBD] | | |

---

## System Diagram

```
[TBD] — replace with a simple ASCII or mermaid diagram of major components
```

---

## Repository Layout

```
project-root/
├── [TBD]
├── docs/                      # FreshForge permanent documentation
├── docs/assistants/           # External AI handoff packs
├── .cursor/                   # FreshForge workflow
├── AGENTS.md
└── CLAUDE.md
```

---

## Data Model (summary)

| Entity | Purpose | Key fields |
|--------|---------|------------|
| [TBD] | | |

See: `docs/architecture/DATA_MODEL.md`

---

## Key Routes / APIs

| Path / endpoint | Auth | Purpose |
|-----------------|------|---------|
| [TBD] | | |

---

## Auth & Permissions

[TBD] — See `docs/architecture/BACKEND.md` and `docs/standards/SECURITY.md`

---

## Environment & Config

Document **names only** — never paste secret values.

| Variable | Purpose | Required |
|----------|---------|----------|
| [TBD] | | |

---

## Scripts & Commands

| Command | Purpose |
|---------|---------|
| [TBD] | |

---

## Deployment

[TBD] — See `docs/standards/DEPLOYMENT.md`

---

## Conventions

[TBD] — See `docs/standards/CODING_STANDARDS.md`

---

## How Agents Should Update This File

When structure, APIs, schema, or env change:

1. Update **Last updated**
2. Refresh from `docs/architecture/` and `docs/standards/`
3. Update `CURRENT-STATE.md` in both assistant packs

**Skill:** `.cursor/skills/assistant-handoff`
