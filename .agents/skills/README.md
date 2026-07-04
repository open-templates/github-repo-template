# react-supabase-auth-template — Agent Skills Index

Skills in `.agents/skills/` teach agents how this repository works and how to extend it safely.

## Project status (current template)

Minimal **React + Supabase Auth** SPA paired with **cf-hono-supabase-api-template**:

- **Auth:** Google OAuth + email/password (`src/auth/`)
- **API calls:** `GET /health` (header indicator), `GET /me` (home page) via `apiFetch`
- **Routes:** `/`, `/login`, `/signup`, `/recover-password`, `/reset-password`
- **No** invoices, clients, providers, orgs, or domain tables in the default template

Canonical feature list: [`specs/FEATURES.md`](../../specs/FEATURES.md)

## Skills

| Skill | Use when |
|-------|----------|
| [api-architecture](api-architecture/SKILL.md) | Adding or changing worker API client modules (`src/api/`) |
| [auth-routing](auth-routing/SKILL.md) | Auth flows, guards, OAuth, protected routes |
| [page-architecture](page-architecture/SKILL.md) | New pages, layout, header, home page patterns |
| [supabase](supabase/SKILL.md) | Supabase Auth, dashboard config, MCP, CLI |
| [supabase-postgres-best-practices](supabase-postgres-best-practices/SKILL.md) | Schema design, RLS, query performance (when adding DB features) |

## Project layout

```
src/
├── api/           # health.ts, me.ts, api.ts (apiFetch)
├── auth/          # AuthContext, AuthGuard, forms, pages
├── layout/        # AppLayout, AppHeader (health indicator)
├── pages/         # HomePage
├── hooks/         # use-api-health.ts
├── components/    # theme-provider, error boundaries, ui primitives
├── lib/           # supabase.ts, i18n, utils
└── specs/         # FEATURES.md (repo root)
```

## Extension order

1. **Backend first** — add route in `cf-hono-supabase-api-template`, document in its `specs/FEATURES.md`
2. **Frontend API module** — `src/api/<feature>.ts` using `apiFetch`
3. **Page or component** — register route in `App.tsx` with `AuthGuard`
4. **Update** `specs/FEATURES.md` and this skills index if patterns change

## Removed legacy skills

The following referred to the old Krill Bill invoice demo and were removed:

- `context-provider-pattern`, `modal-components`, `table-ui-components`, `type-system-patterns`

Re-add domain-specific skills only when that functionality exists again in the fork.
