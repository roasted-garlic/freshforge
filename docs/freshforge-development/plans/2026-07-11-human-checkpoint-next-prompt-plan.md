# Plan: Human Checkpoint Suggested Next Prompt

| Field | Value |
|-------|-------|
| Date | 2026-07-11 |
| Author | Agent |
| Status | approved / signed_off |
| Workflow | managed-phase |
| Related | docs/freshforge-development/reviews/2026-07-11-human-checkpoint-next-prompt-review.md |

---

## Goal

Make it mandatory that whenever the workflow pauses for human intervention, the agent ends its message with a clear, **copy-pasteable Suggested Next Prompt** the human can send to unblock and continue — not only a vague “please review.”

## Background

Autonomy through Plan → Review → Implement → Test → Signoff is already encoded. Pause behavior asks for clear decisions and sets `Next Required Step`, but it does not hard-require a user-facing next message. Manual tests have reply formats (`PASS` / `FAIL`); other checkpoints do not. Users need a single obvious reply to resume.

## FreshForge Impact Classification

| Area | Impacted? | Notes |
|------|-----------|-------|
| **Starter Surface** | Yes | `.cursor/agents/managing-agent.md`, `.cursor/rules/human-checkpoints.mdc`, `.cursor/workflow/human-checkpoint-template.md`; related skill + brief AGENTS/AI_RULES pointers |
| **Development Tooling** | No | |
| **Distribution/Installer** | No | Behavior ships via starter surface only |
| **Documentation** | Light | `docs/AI_RULES.md` Human Checkpoints section |
| **Development History** | Yes | Archived under `docs/freshforge-development/` |

### Starter files expected to change

- `.cursor/agents/managing-agent.md`
- `.cursor/rules/human-checkpoints.mdc`
- `.cursor/workflow/human-checkpoint-template.md`
- `.cursor/skills/manual-test-checkpoint/SKILL.md`
- `AGENTS.md` and `docs/AI_RULES.md`

## Scope

### In Scope

- Require a **Suggested Next Prompt** block on every human pause (chat + checkpoint doc)
- Update Managing Agent, `human-checkpoints.mdc`, checkpoint template
- Align `manual-test-checkpoint` skill
- Brief consistency line in `AGENTS.md` and `docs/AI_RULES.md`

### Out of Scope

- Changing which situations require human approval
- Changing phase gate logic
- Migrations / version bump
- Auto-hooks or UI for prompts

---

## Approach

Encoded conventions for Suggested Next Prompt (manual test / decision / approval / secrets done / Continue Workflow). Hard-forbid vague pause endings.

---

## Success Criteria

- [x] Managing Agent requires Suggested Next Prompt on every human pause
- [x] `human-checkpoints.mdc` forbids vague pause endings and mandates the block
- [x] Checkpoint template has a mandatory Suggested Next Prompt section with examples
- [x] manual-test-checkpoint skill aligns
- [x] AGENTS.md / AI_RULES.md mention the requirement
- [x] `npm run validate` passes after archive
- [x] Artifacts archived under `docs/freshforge-development/`
