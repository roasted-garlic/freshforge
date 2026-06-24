# Backend

> **Project-specific** — customize during intake or bootstrap. Describes backend services, access patterns, and environment.

---

## Overview
<!-- Self-hosted API, serverless, BaaS, hybrid -->

`[TBD]`

---

## Backend Provider

| Topic | Value |
|-------|-------|
| Primary provider | `[AWS / GCP / Firebase / Supabase / Vercel / custom / TBD]` |
| Region(s) | `[TBD]` |
| Account / project ID | `[NEEDS HUMAN INPUT — do not store secrets here]` |

### Project-Specific Backend Docs (add when needed)

Create separate docs and link from here when detail grows:

- `FIREBASE.md` — Firebase Auth, Firestore, Functions, Storage, Rules
- `SUPABASE.md` — Supabase Auth, Postgres, RLS, Edge Functions
- `DATABASE.md` — SQL schema, migrations, connection pooling
- `API.md` — REST/GraphQL endpoint catalog
- `INFRASTRUCTURE.md` — Terraform, CDK, Kubernetes, networking

---

## Authentication

| Topic | Value |
|-------|-------|
| Provider | `[TBD]` |
| Flows | `[email, OAuth, magic link, SSO]` |
| Session / token | `[JWT, session cookie, refresh rotation]` |
| Local dev auth | `[TBD — emulators, mock users]` |

---

## Database / Primary Store

| Topic | Value |
|-------|-------|
| Type | `[TBD]` |
| Access pattern | `[ORM, SDK, raw SQL, rules]` |
| Local development | `[TBD — docker, emulator]` |
| Backup strategy | `[TBD]` |

See `DATA_MODEL.md` for entities.

---

## Storage (Files / Media)

| Topic | Value |
|-------|-------|
| Provider | `[S3, GCS, Firebase Storage, local, N/A]` |
| Public vs private | `[TBD]` |
| Access control | `[signed URLs, rules, IAM]` |

---

## APIs

### Internal API
| Base URL (local) | `[TBD]` |
| Base URL (staging) | `[TBD]` |
| Base URL (production) | `[TBD]` |
| Style | `[REST / GraphQL / tRPC / etc.]` |

### External Integrations

| Service | Purpose | Auth method | Doc |
|---------|---------|-------------|-----|
| | | | |

---

## Serverless / Edge Functions

| Function | Trigger | Purpose |
|----------|---------|---------|
| | HTTP / schedule / event | |

Location: `[TBD path]`

---

## Jobs, Queues & Background Work

| Job | Schedule / trigger | Purpose |
|-----|-------------------|---------|
| | | |

---

## Webhooks

### Inbound
| Source | Path | Verification |
|--------|------|--------------|
| | | signature |

### Outbound
| Target | Event | Retry policy |
|--------|-------|--------------|
| | | |

---

## Environment Variables

> Document **names and purpose only**. Never commit values.

| Variable | Required | Environments | Purpose |
|----------|----------|--------------|---------|
| `[EXAMPLE_API_URL]` | yes | all | Base URL for API |
| | | | |

Template file: `[.env.example path — TBD]`

---

## Local Development

### Prerequisites
- `[TBD — runtime versions, Docker, CLI tools]`

### Start Backend
```bash
# [TBD — document actual commands after stack is chosen]
```

### Emulators / Mocks
`[TBD]`

---

## Production Considerations

- Rate limits: `[TBD]`
- Monitoring: `[TBD]`
- Error tracking: `[TBD]`
- **Human approval** required for production config changes

---

## Security Notes
See `SECURITY.md`. Backend-specific rules: `[TBD — link to rules files or provider console docs]`

---

## Revision History

| Date | Summary |
|------|---------|
| YYYY-MM-DD | Initial template |
