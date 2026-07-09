# FreshForge — Architecture & Code Reference

> Technical structure of the FreshForge **development repository** and what gets distributed. For product context see `PROJECT-OVERVIEW.md`.

**Last updated:** 2026-07-09  
**Source:** `README.md`, `docs/freshforge-development/distribution/`, `scripts/`, `bin/`

---

## Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Language | Node.js 18+ | CLI and validation scripts |
| Package | `freshforge` (private) | `bin/freshforge.mjs` |
| Content | Markdown | Rules, skills, docs |
| Lint | markdownlint-cli2 | `npm run validate:markdown` |
| CI | GitHub Actions | Export then validate |

No application runtime. No database. This repo is a **markdown + Node tooling** kit.

---

## System Diagram

```
┌─────────────────────┐     install/export/migrate/doctor     ┌──────────────────────┐
│ FreshForge dev repo │ ───────────────────────────────────► │ Target app project   │
│ (this GitHub repo)  │                                       │ AGENTS.md, .cursor/, │
│ scripts/, bin/,     │                                       │ docs/, .freshforge/  │
│ docs/freshforge-…/  │                                       │ (+ CLAUDE.md)        │
└─────────────────────┘                                       └──────────────────────┘
```

---

## Repository Layout (development)

```
FreshForge/
├── AGENTS.md                 # Canonical agent entry (Cursor, Codex)
├── CLAUDE.md                 # Claude Code bridge (@AGENTS.md)
├── bin/freshforge.mjs        # CLI
├── scripts/                  # install, export, validate, migrate libs
├── .cursor/                  # rules, agents, skills, workflow
├── .freshforge/version.json  # Template metadata for installs
├── docs/                     # Starter-facing docs (installed)
│   ├── AI_RULES.md, WORKFLOWS.md
│   ├── project/, architecture/, standards/, intake/
│   ├── assistants/           # App handoff TEMPLATES (installed)
│   ├── workflow/             # Clean plans/reviews/setup
│   └── freshforge-development/  # Maintainer-only (NOT installed)
│       ├── distribution/
│       ├── migrations/
│       ├── plans/, reviews/
│       └── assistants/       # THIS pack (FreshForge product handoff)
├── reference/                # Example app handoff (NOT installed)
├── package.json
└── dist/                     # Local export output (gitignored)
```

---

## Starter Surface (default install/export)

| Path | Role |
|------|------|
| `AGENTS.md` | Session entry |
| `CLAUDE.md` | Claude Code import bridge |
| `.cursor/` | Rules, agents, skills, workflow templates |
| `docs/` | Baseline + templates (excludes `freshforge-development/`) |
| `.freshforge/version.json` | Install metadata |

**Excluded:** `docs/freshforge-development/`, `reference/`, `scripts/`, `bin/`, `package.json`, `.github/`, `README.md` (unless flags).

---

## CLI Commands

| Command | Purpose |
|---------|---------|
| `freshforge install` | Copy starter into target |
| `freshforge export` | Export clean starter to `dist/` |
| `freshforge migrate` | Upgrade existing installs |
| `freshforge doctor` | Read-only health check |
| `freshforge validate` | Dev-repo validation |

Flags (migrate): `--target`, `--dry-run`, `--from appforge`, `--force-workflow`.

---

## Migrations (registry)

| id | Purpose |
|----|---------|
| `legacy-appforge-to-freshforge` | Rename + doc path moves + metadata |
| `add-claude-md-bridge` | Add `CLAUDE.md` |
| `add-assistant-handoff-packs` | Add `docs/assistants/` templates if missing |

Metadata: `.freshforge/version.json` → `migrationHistory`.

---

## Validation

```bash
npm run export:starter -- --clean
npm run validate                 # structure + markdown + links
npm run validate:migrations
```

---

## Multi-Agent Entry Points

| Tool | Entry |
|------|-------|
| Cursor | `AGENTS.md` + `.cursor/` |
| Codex | `AGENTS.md` |
| Claude Code | `CLAUDE.md` → `@AGENTS.md` |

---

## App External Packs vs Maintainer Packs

| Path | Installed? |
|------|------------|
| `docs/assistants/{chatgpt,claude}/` | Yes — blank templates for apps |
| `docs/freshforge-development/assistants/` | No — FreshForge product context |

---

## Conventions

- Managed phases for FreshForge itself; archive plans/signoffs under `docs/freshforge-development/`
- Keep starter `docs/workflow/plans|reviews` clean (README + `.gitkeep` only)
- Never commit secrets; never put secrets in handoff packs
