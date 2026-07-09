# Plan: Multi-Agent Entry Points (Cursor + Claude + Codex)

| Field | Value |
|-------|-------|
| Date | 2026-07-09 |
| Author | Planning Agent |
| Status | ready_for_review |
| Workflow | managed-phase |
| Phase | `multi-agent-entry-points` |

## Goal

Make FreshForge work out of the box with Cursor, Claude Code, and Codex, with easiest long-term maintenance: one canonical instruction file (`AGENTS.md`) plus a thin Claude bridge (`CLAUDE.md`).

## Decision

Thin bridge only — `CLAUDE.md` imports `@AGENTS.md`; no `.claude/` mirroring or deep rule parity.

## Scope

In: `CLAUDE.md`, distribution, validation, migration `add-claude-md-bridge`, doctor check, docs, version bump to 0.2.1.

Out: symlinks, full AGENTS duplication, `.claude/` parity, app code changes.

## Test strategy

`export:starter --clean`, `validate`, doctor on export, migrate on fixture missing CLAUDE.md.
