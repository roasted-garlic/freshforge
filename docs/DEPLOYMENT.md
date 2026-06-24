# Deployment

> Customize during intake or bootstrap. **Human approval required for production releases.**

---

## Overview
`[TBD — deployment model summary]`

---

## Environments

| Environment | Purpose | URL | Branch / trigger |
|-------------|---------|-----|------------------|
| Local | Development | localhost | n/a |
| Staging | Pre-production verification | `[TBD]` | `[TBD]` |
| Production | Live users | `[TBD]` | `[TBD]` |

---

## Hosting & Infrastructure

| Component | Provider | Notes |
|-----------|----------|-------|
| Frontend | `[TBD]` | |
| Backend | `[TBD]` | |
| Database | `[TBD]` | |
| CDN / assets | `[TBD]` | |
| DNS | `[TBD]` | |

Infrastructure docs: `[INFRASTRUCTURE.md if created]`

---

## Build Process

### Frontend Build
```bash
[TBD]
```

Artifacts: `[TBD output path]`

### Backend Build
```bash
[TBD]
```

---

## Deployment Process

### Staging
1. `[TBD steps]`
2. 
3. Verify: `[smoke tests, health checks]`

### Production
1. **Human approval required**
2. `[TBD steps]`
3. Post-deploy verification: `[TBD]`

---

## CI/CD

| Pipeline | Config | Triggers |
|----------|--------|----------|
| CI (test/build) | `[TBD path]` | PR, push |
| CD (deploy) | `[TBD path]` | `[manual / tag / main]` |

---

## Rollback Procedure

| Component | Rollback method | RTO target |
|-----------|-----------------|------------|
| Frontend | `[revert deploy / previous artifact]` | |
| Backend | `[TBD]` | |
| Database | `[migration rollback — see DATA_MODEL.md]` | |

---

## Secrets & Configuration

- Secrets stored in: `[CI secrets, cloud secret manager — TBD]`
- Never commit production secrets
- Env var documentation: `BACKEND.md`
- **Human approval** for production env changes

---

## Release Checklist

- [ ] Plan and review approved
- [ ] All required tests pass
- [ ] `DEPLOYMENT.md` and `BACKEND.md` current
- [ ] Migration plan approved (if applicable)
- [ ] Rollback plan documented
- [ ] Human approval for production
- [ ] Post-deploy smoke tests pass
- [ ] Signoff doc updated

---

## Monitoring & Alerts

| Signal | Tool | On-call / owner |
|--------|------|-----------------|
| Errors | `[TBD]` | |
| Uptime | `[TBD]` | |
| Performance | `[TBD]` | |

---

## Revision History

| Date | Summary |
|------|---------|
| YYYY-MM-DD | Initial template |
