---
name: MySQL backend architecture
description: How the api-server connects to MySQL (Hostinger), why it bypasses @workspace/db, and the graceful DB fallback pattern.
---

## Rule
Do NOT import `@workspace/db` in new api-server routes. That package uses pg (PostgreSQL). The MySQL connection lives in `artifacts/api-server/src/db.ts` using `mysql2/promise` directly.

**Why:** Hostinger uses MySQL; @workspace/db uses Drizzle+pg. To stay Hostinger-compatible we use mysql2 directly in the api-server.

**How to apply:**
- New routes import from `../db` (the local db.ts)
- Check `dbConfigured` at the top of each router; return 503+`DB_UNAVAILABLE` if false
- Env vars required: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (DB_PORT optional, defaults 3306)
- `setup.sql` in artifacts/api-server has CREATE TABLE scripts for Hostinger MySQL
