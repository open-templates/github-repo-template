---
name: api-architecture
description: Patterns for calling the Cloudflare Worker backend from this React app. Use when adding API modules in src/api/, wiring apiFetch, health checks, authenticated /me calls, or integrating new worker endpoints from cf-hono-supabase-api-template.
---

# API Architecture (Frontend)

## Overview

This template does **not** call Supabase Postgres directly from the browser for app data. Supabase is used for **auth only**. Business API calls go to the Hono worker (`VITE_API_BASE_URL`).

## Core files

| File | Role |
|------|------|
| `src/api/api.ts` | `API_BASE_URL`, `apiFetch()` — JWT header, 401 refresh retry, toast on errors |
| `src/api/health.ts` | `GET /health` (no auth) |
| `src/api/me.ts` | `GET /me` (authenticated) |

Token source: `localStorage['x-auth-token']` (set by `AuthContext` from Supabase session).

## apiFetch contract

```typescript
import { API_BASE_URL, apiFetch } from "@/api/api";

const url = new URL("/me", API_BASE_URL);
const { data, error } = await apiFetch(url, { method: "GET" });
// auth defaults to true — pass false for public routes like /health
```

- Success: `{ data }` — `data` is unwrapped from worker `{ success: true, data: ... }`
- Failure: `{ error: string }` — toasts already shown for 4xx/5xx in many cases

## Adding a new API module

1. Define response types in the same file (or `src/types/` when shared)
2. Use `new URL("/path", API_BASE_URL)` — path must exist on the worker
3. Use `apiFetch(url, options, requiresAuth)` — `false` only for public routes
4. Return `{ data?, error? }` from your wrapper; do not throw

### Template

```typescript
import { API_BASE_URL, apiFetch } from "@/api/api";

export interface Widget {
  id: string;
  name: string;
}

export async function fetchWidgets(): Promise<{
  data?: Widget[];
  error?: string;
}> {
  const url = new URL("/widgets", API_BASE_URL);
  return apiFetch(url, { method: "GET" });
}
```

## Health polling pattern

See `src/hooks/use-api-health.ts` and `src/layout/AppHeader.tsx`:

- Poll `GET /health` on an interval (30s)
- Expose `online` | `offline` | `checking` for UI
- Keep health checks **unauthenticated**

## Backend pairing

Implement the route in **cf-hono-supabase-api-template** first. Response shape:

```json
{ "success": true, "data": { ... } }
```

Document both sides in each repo's `specs/FEATURES.md`.

## Do not

- Put `SUPABASE_SERVICE_ROLE_KEY` in `VITE_*` env vars
- Use `supabase.from()` for domain data unless you intentionally bypass the worker
- Duplicate JWT refresh logic outside `apiFetch`

## See also

- [`specs/FEATURES.md`](../../specs/FEATURES.md)
- Backend skill: `cf-hono-supabase-api-template/.agents/skills/create-api-endpoint/SKILL.md`
