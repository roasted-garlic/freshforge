# FreshForge Development Archive

> **Not part of the clean starter package.** This folder holds historical records from building and maintaining FreshForge inside its own workflow. Do **not** copy this folder when dropping FreshForge into another project.

---

## Purpose

When FreshForge is developed using its own managed phases, generated artifacts accumulate:

- Plans, reviews, test reports, and signoffs
- Intake findings (when run on the starter repo)
- Health snapshots

These files are useful for FreshForge maintainers but confuse adopters who expect empty `docs/workflow/plans/` and `docs/workflow/reviews/` folders ready for **their** project work.

---

## Folder Layout

| Path | Contents |
|------|----------|
| `plans/` | Completed managed phase plans for FreshForge development |
| `reviews/` | Reviews, test reports, and signoffs from FreshForge development |
| `intake/` | Intake findings if Existing Project Intake is run on the starter repo |
| `health/` | Optional health snapshots from starter maintenance |

---

## Clean Starter Copy

Before copying FreshForge into another repository:

1. Run the **starter-package-cleanup** managed phase (or follow `docs/freshforge-development/distribution/PACKAGING.md` manually).
2. **Exclude** `docs/freshforge-development/` from the copy.
3. Confirm `docs/workflow/plans/`, `docs/workflow/reviews/`, and `docs/workflow/setup/` contain only `README.md` and `.gitkeep`.
4. Confirm `.cursor/workflow/state.md` is idle.

See `docs/freshforge-development/distribution/PACKAGING.md` for the full checklist.

---

## After Copying Into a Target Repo

| Target | Next step |
|--------|-----------|
| Existing application codebase | **Existing Project Intake** |
| New / blank project | **New Project Bootstrap** |
