# Human Checkpoint

| Field | Value |
|-------|-------|
| Date | YYYY-MM-DD |
| Workflow | [mode / phase / goal] |
| Reason | [why human input is required] |
| Status | **pending** / **resolved** |
| Resolution | pending |

---

## What We Need From You
<!-- One clear sentence -->

---

## Context
<!-- Brief background; link to plan or PR scope -->

---

## Decision Required (if applicable)

**Question:**
 

**Options:**
1. 
2. 
3. 

**Recommendation (agent):** [optional, with tradeoffs]

**Your decision:** _pending_

---

## Manual Test Required (if applicable)

**Feature / area:** 

**Environment:** local / staging / production-like

**Prerequisites:**
- 

### Steps
1. [Action] → **Expected:** [result]
2. [Action] → **Expected:** [result]

### Pass criteria
- [ ] 

### Please reply with
- `PASS` — all criteria met
- `FAIL: [description]` — what failed
- `PASS WITH NOTES: [notes]` — acceptable with follow-ups

**Your result:** _pending_

---

## Suggested Next Prompt
<!-- REQUIRED: exact text the human should paste into chat to continue -->

Paste this to continue:

`[PRIMARY_REPLY]`

**Other valid replies (if any):**
- `[ALTERNATIVE_1]`
- `[ALTERNATIVE_2]`

### Examples (replace with the real primary reply)

| Situation | Primary prompt |
|-----------|----------------|
| Manual test passed | `PASS` |
| Manual test failed | `FAIL: button overlap on mobile` |
| Choose option 2 | `Option 2` |
| Approve deploy / design | `APPROVED` |
| Finished setting secrets in console | `DONE: secrets set` |
| Resume after prior feedback | `Continue Workflow` |

---

## Impact If Delayed
<!-- What is blocked while waiting -->

---

## Agent Actions While Paused

**Allowed:** Read docs, update checkpoint doc, answer clarifying questions

**Forbidden:** Implement, deploy, migrate, change secrets, expand scope

---

## Resolution Record

| Date | User response | Recorded in state | Follow-up |
|------|---------------|-------------------|-----------|
| | | | |

---

## Resume Checklist
- [ ] User feedback recorded in `.cursor/workflow/state.md` Decision Log
- [ ] `Human Checkpoint Required` set to `no`
- [ ] Plan/review updated if scope changed
- [ ] `Next Required Step` set for current phase
- [ ] Workflow resumed autonomously when safe (or new Suggested Next Prompt issued if still blocked)
