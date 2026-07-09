# Signoff: Multi-Agent Entry Points (Cursor + Claude + Codex)

| Field | Value |
|-------|-------|
| Date | 2026-07-09 |
| Signoff by | Signoff Agent |
| Plan | docs/freshforge-development/plans/multi-agent-entry-points-plan.md |
| Review | docs/freshforge-development/reviews/multi-agent-entry-points-review.md |
| Test report | docs/freshforge-development/reviews/multi-agent-entry-points-test-report.md |
| Final status | **approved** |

---

## Summary

FreshForge now supports Cursor, Claude Code, and Codex out of the box with minimal maintenance: `AGENTS.md` remains canonical; `CLAUDE.md` is a thin `@AGENTS.md` bridge for Claude Code; Codex reads `AGENTS.md` natively.

---

## Changes Delivered

- Root `CLAUDE.md` with `@AGENTS.md` import
- `AGENTS.md` multi-agent compatibility section
- Default install/export includes `CLAUDE.md`
- Migration `add-claude-md-bridge` for existing installs
- Doctor checks for `CLAUDE.md`
- Version bump to `0.2.1`
- Distribution and starter-facing docs updated
- ADR-007 in `docs/project/DECISIONS.md`

---

## Tests

All automated checks passed (export, validate, validate:migrations, doctor).

---

## Verdict

**Approved.**

---

## Recommended next action

Existing installs without `CLAUDE.md`:

```bash
npx github:roasted-garlic/freshforge migrate
```
