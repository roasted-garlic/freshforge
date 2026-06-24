---
name: managed-phase
description: Run Plan → Review → Implement → Test → Signoff. Use for Managed Phase or aliases (Continue Workflow, Next Phase, Run Phase, Continue AppForge, etc.).
---

# Managed Phase

## Command Aliases

If the user says any of the following, **start or continue this skill** (case-insensitive):

`Managed Phase` · `Start Phase` · `Run Phase` · `Next Phase` · `Continue Workflow` · `Continue AppForge`

Equivalent: **Start or continue managed phase** using `.cursor/workflow/state.md`. See `.cursor/workflow/command-aliases.md`.

**On alias:**
1. Read state — if workflow in progress, continue from `Next Required Step`
2. If idle/DONE and user included phase/goal in message, start new managed phase
3. If idle/DONE with no goal, ask for phase name and goal
4. Follow Plan → Review → Implement → Test → Signoff; stop for human checkpoints

## Purpose

Execute the complete managed development workflow for a single goal from planning through signoff.

## When to Use

- User sends a **managed phase alias** (e.g. `Continue Workflow`, `Next Phase`, `Run Phase`)
- User says "Start Managed Phase" with a phase name and goal
- Feature development, bug fix, refactor, or docs+code change with clear scope
- Any work that should follow Plan → Review → Implement → Test → Signoff

## Inputs

- Phase name and plain-English goal (from user or `phase-request-template.md`)
- `.cursor/workflow/state.md`
- Project docs per reading order in `documentation.mdc`
- User autonomy preferences (continue unless checkpoint required)

## Steps

1. **Initialize state**
   - Set `Current Mode: managed-phase`
   - Set `Current Goal`, reset phase statuses appropriately
   - Set `Allowed Actions` for Plan phase

2. **Plan phase** (skill: `plan-phase`)
   - Planning Agent creates plan in `docs/plans/`
   - Set `Plan Status: complete`, `Review Status: pending`

3. **Review phase** (skill: `review-phase`)
   - Review Agent produces review in `docs/reviews/`
   - If `blocked` → stop, update state, request plan revision
   - If `approved` or `approved_with_changes` → proceed

4. **Implement phase** (skill: `implement-phase`)
   - Only after review approved
   - Implementation Agent executes approved scope
   - Stop for human checkpoints as needed

5. **Test phase** (skill: `test-phase`)
   - Test Agent runs and records tests
   - Manual checkpoint if UI/visual coverage needed

6. **Signoff phase** (skill: `signoff-phase`)
   - Signoff Agent creates signoff doc
   - Set `DONE: yes` when approved

7. **Throughout**
   - Managing Agent updates `.cursor/workflow/state.md` after each step
   - Never skip gates

## Outputs

- Plan, review, test report, signoff in `docs/plans/` and `docs/reviews/`
- Updated workflow state with `DONE: yes` or clear blocker
- Summary for user: completed work, open items, follow-ups on roadmap

## Stop Conditions

- Human checkpoint required
- Review blocked
- Tests failed and not in scope to fix
- Missing docs for safe planning → run intake or bootstrap first
- User revokes autonomy for production/destructive steps
