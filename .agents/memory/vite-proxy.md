---
name: Vite proxy for API calls
description: How radhe-digital frontend reaches the api-server in dev, and the VITE_API_URL pattern for production.
---

## Rule
The radhe-digital vite.config.ts has a proxy: `/api → http://localhost:${API_PORT|8080}`. Frontend code calls `/api/...` with no base URL (VITE_API_URL defaults to empty string).

**Why:** In development the frontend and api-server are separate processes on different ports. Vite proxy avoids CORS issues and lets the frontend use root-relative /api paths.

**How to apply:**
- Dev: just call `/api/orders` — Vite proxies it automatically
- Production (Hostinger): set `VITE_API_URL=https://your-api-server.com` before building, then build static files
- The api.ts base is: `(import.meta.env.VITE_API_URL ?? '') + '/api'`
