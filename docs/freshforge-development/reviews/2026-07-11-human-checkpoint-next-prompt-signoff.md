# Signoff: Human Checkpoint Suggested Next Prompt

| Field | Value |
|-------|-------|
| Date | 2026-07-11 |
| Plan | docs/freshforge-development/plans/2026-07-11-human-checkpoint-next-prompt-plan.md |
| Review | docs/freshforge-development/reviews/2026-07-11-human-checkpoint-next-prompt-review.md |
| Test report | docs/freshforge-development/reviews/2026-07-11-human-checkpoint-next-prompt-test-report.md |
| Final status | **approved** |

---

## Summary

Starter surface now requires a copy-pasteable **Suggested Next Prompt** whenever the workflow pauses for human intervention. Managing Agent, always-applied human-checkpoint rules, checkpoint template, manual-test skill, and entry docs (`AGENTS.md`, `AI_RULES.md`) all enforce the same behavior.

## Starter surface files changed

- `.cursor/agents/managing-agent.md`
- `.cursor/rules/human-checkpoints.mdc`
- `.cursor/workflow/human-checkpoint-template.md`
- `.cursor/skills/manual-test-checkpoint/SKILL.md`
- `AGENTS.md`
- `docs/AI_RULES.md`

## Installed projects affected?

**Yes** — default install/export includes these starter files. Existing installs pick this up via reinstall/migrate of starter surface content (no dedicated migration id; file sync on next install/migrate of rules/agents/docs).

## Tests

- Content checks: passed
- `npm run validate`: passed after archiving workflow artifacts and resetting idle state

## Manual tests / human approvals

None required for this phase.

## Risks / follow-ups

- Agents may still occasionally omit the block; always-applied rule is the primary enforcement.
- Optional later: dedicated migrate that only refreshes these files for older installs (not required — covered by normal surface updates).

## FreshForge packaging

- Plan/review/test/signoff archived under `docs/freshforge-development/`
- `docs/workflow/plans/` and `docs/workflow/reviews/` returned to README + `.gitkeep` only
- Workflow state reset to idle template
