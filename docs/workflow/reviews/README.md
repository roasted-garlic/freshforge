# Reviews

This directory holds **review**, **test report**, and **signoff** documents.

## Naming

| Type | Pattern | Example |
|------|---------|---------|
| Review | `*-review.md` | `2025-06-01-auth-review.md` |
| Test report | `*-test-report.md` | `2025-06-01-auth-test-report.md` |
| Signoff | `*-signoff.md` | `2025-06-01-auth-signoff.md` |
| Intake signoff | `project-intake-signoff.md` | |
| Bootstrap signoff | `new-project-bootstrap-signoff.md` | |
| Human checkpoint | `*-checkpoint.md` | optional |

## Templates

- Review: `.cursor/workflow/review-template.md`
- Test report: `.cursor/workflow/test-report-template.md`
- Signoff: `.cursor/workflow/signoff-template.md`
- Human checkpoint: `.cursor/workflow/human-checkpoint-template.md`

## Verdicts

**Review:** approved | approved_with_changes | blocked

**Signoff:** approved | approved_with_notes | blocked

Implementation requires review approval. Signoff requires completed or documented tests.
