# FreshForge — Project Overview

> Product context for the FreshForge workflow starter. For technical structure see `ARCHITECTURE-AND-CODE.md`. For what's happening now see `CURRENT-STATE.md`.

**Last updated:** 2026-07-09  
**Source:** `README.md`, `AGENTS.md`, `docs/freshforge-development/distribution/`

---

## One-Line Summary

**FreshForge** is a reusable Cursor AI workflow starter that enforces safe, repeatable agent-driven development: **Plan → Review → Implement → Test → Signoff**.

---

## Problem It Solves

Teams using AI coding agents often get inconsistent results: skipped reviews, silent scope expansion, undocumented changes, and unsafe production actions. FreshForge installs a shared workflow surface (`AGENTS.md`, `.cursor/`, `docs/`) so agents start from the same rules, docs, and gates in any app repo.

---

## What This Is / Is Not

| Is | Is not |
|----|--------|
| A workflow kit you install into app repos | An application product |
| Stack-agnostic (web, mobile, API, BaaS, etc.) | A React/Firebase/etc. scaffold |
| Docs + rules + skills + CLI for install/migrate | A replacement for human product judgment |

---

## Target Users

| Persona | Who | What they do |
|---------|-----|--------------|
| **App developer** | Builds an app with Cursor / Codex / Claude Code | Installs FreshForge; runs Intake or Bootstrap; managed phases |
| **FreshForge maintainer** | Owns this GitHub repo | Improves starter surface, CLI, migrations, distribution |
| **External thinking partner** | ChatGPT / Claude web (via these packs) | Helps plan prompts and reason about FreshForge — not implement in-repo |

---

## Core Workflows

### 1. Install into a target project

```bash
npx github:roasted-garlic/freshforge install
```

Copies starter surface: `AGENTS.md`, `CLAUDE.md`, `.cursor/`, `docs/`, `.freshforge/version.json`.

### 2. Existing Project Intake

Inspect codebase → generate/update project docs → health / tech debt — **no app code changes**.

### 3. New Project Bootstrap

Questionnaire → docs first → no app code until user approves implementation.

### 4. Managed Phase

Plan → Review → Implement → Test → Signoff, with human checkpoints for production/secrets/design.

### 5. Migrate / Doctor

Upgrade older AppForge or FreshForge installs safely; inspect health with `doctor`.

### 6. External assistant packs (apps)

Target apps use `docs/assistants/chatgpt/` and `docs/assistants/claude/` (templates filled via **Assistant Handoff**).

---

## Feature Inventory

| Feature | Status | Description |
|---------|--------|-------------|
| AGENTS.md entry | Done | Universal agent entry; Cursor + Codex |
| CLAUDE.md bridge | Done | Claude Code imports `@AGENTS.md` |
| `.cursor/` rules/agents/skills | Done | Workflow behavior |
| Install / export CLI | Done | `bin/freshforge.mjs` |
| Migrate / doctor | Done | Versioned migrations + health check |
| `.freshforge/version.json` | Done | Install metadata |
| External assistant templates | Done | `docs/assistants/` for target apps |
| Maintainer handoff packs | Done | This folder (dev-only) |
| npm publish (`npx freshforge`) | Planned | Documented; GitHub install works today |

---

## Integrations / Distribution

| Channel | Notes |
|---------|-------|
| GitHub | `npx github:roasted-garlic/freshforge …` |
| Future npm | `npx freshforge …` when published |

---

## Risks & Constraints

| Risk | Notes |
|------|-------|
| Starter vs maintainer docs drift | Keep `docs/assistants/` templates clean; FreshForge-specific content only under `docs/freshforge-development/` |
| Overwriting project docs on migrate | Migrate preserves `docs/project/`, architecture, standards, intake |
| Secrets in handoff packs | Never upload `.env` or keys |

---

## Roadmap (maintainer)

Recent completed: migration system, multi-agent entry points, external assistant handoff templates.  
Likely next: npm publish, more migrations as starter evolves, optional CURRENT-STATE automation.
