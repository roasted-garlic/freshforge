# Security

> Universal security baseline. Project-specific rules and providers are documented in `BACKEND.md` and optional supplements.

---

## Principles

1. **Never trust client input** — validate server-side or in trusted backend rules
2. **Least privilege** — minimum permissions for users, services, and keys
3. **Default deny** — explicit allow for sensitive operations
4. **Defense in depth** — UI + API + database layers
5. **Fail closed** — when uncertain, deny access

---

## Authentication

- Use established identity providers or vetted libraries
- Secure session/token storage (httpOnly cookies where applicable, secure mobile storage)
- Logout invalidates sessions server-side when supported
- Protect against CSRF for cookie-based sessions
- Document auth flows in `BACKEND.md`

---

## Authorization

- Separate authentication (who) from authorization (what)
- Central permission model documented in this file and `DATA_MODEL.md`
- Enforce on every sensitive read/write — not only on "admin pages"
- **Never rely on UI hiding alone**

---

## Input Validation

- Validate type, length, format, and allowed values
- Sanitize for context (HTML, SQL, shell — use parameterized queries, no string concat)
- Reject invalid input early with safe error messages

---

## Secrets & Environment Variables

- **Never commit** secrets, API keys, tokens, or private certificates
- Use secret managers or CI secrets in production
- Document variable **names** and purpose in `BACKEND.md` / `DEPLOYMENT.md` — not values
- Rotate credentials when exposed
- **Human approval** required for production secret changes

---

## API Security

- Authenticate API requests appropriately
- Rate limit public and expensive endpoints
- CORS configured minimally for production
- Validate webhook signatures
- Avoid verbose errors that leak stack traces or schema details to clients

---

## Database Security

- Parameterized queries / ORM — no raw concatenated SQL from user input
- Row/collection-level security rules where supported (Firestore, Supabase RLS, etc.)
- Separate dev/staging/prod data; no production dumps in dev without sanitization
- **Human approval** for production migrations and destructive changes

---

## File Uploads

- Validate file type, size, and content
- Store outside executable paths; use object storage
- Scan when appropriate for malware
- Serve via signed URLs or controlled download endpoints
- Never execute user-uploaded content

---

## Dependency Risk

- Review new dependencies in plan/review
- Monitor CVEs; patch critical issues promptly
- Prefer well-maintained libraries

---

## Logging & Privacy

- No secrets, tokens, or full payment data in logs
- Minimize PII in logs; comply with retention policy
- Redact sensitive fields in error reports

---

## Production Deployment

- HTTPS everywhere for web-facing services
- Security headers (CSP, HSTS where applicable)
- Separate build-time and runtime secrets
- **Human approval** before production deploy and production security rule changes

---

## Human Approval Gates

Stop and require human approval for:

- Production auth provider changes
- Relaxing security rules in production
- Production secret rotation or env changes
- Permission model changes affecting real users
- Exposing new public endpoints with sensitive data

Record approvals in workflow state and signoff docs.

---

## Incident Response (Baseline)

- Document security contacts and process in `[TBD]` section per project
- Revoke compromised credentials immediately
- Add incident to `RISK_REGISTER.md` and `DECISIONS.md` when resolved
