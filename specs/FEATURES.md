# Frontend features specification

This document describes the intentional, production-ready surface of **react-supabase-auth-template**. Use it when extending the UI or wiring new backend endpoints.

## Purpose

A minimal authenticated SPA template: Supabase handles identity on the client; a Hono worker on Cloudflare validates JWTs for API calls. Users can fork and add domain features without removing the auth + API skeleton.

## Authentication

### Providers

- **Google OAuth** — primary social login (`loginWithGoogle` in `AuthContext`)
- **Email/password** — sign up, sign in, recover password, reset password

OAuth is configured entirely in the Supabase dashboard (no Google client ID in frontend env vars).

### Session storage

- Supabase session via `onAuthStateChange`
- Access token mirrored to `localStorage['x-auth-token']` for API `Authorization: Bearer` headers
- On `401`, `apiFetch` attempts `supabase.auth.refreshSession()` and retries once

### Auth routes

| Route | Guard | Component |
|-------|-------|-----------|
| `/login` | Guest only | `LogInPage` |
| `/signup` | Guest only | `SignUpPage` |
| `/recover-password` | Guest only | `RecoverPasswordPage` |
| `/reset-password` | Authenticated | `ResetPasswordPage` |

Guests hitting `/` are redirected to `/login`. Authenticated users hitting auth pages are redirected to `/`.

## API integration

Configured in `src/api/`:

| Module | Endpoint | Auth | Used by |
|--------|----------|------|---------|
| `health.ts` | `GET /health` | No | `useApiHealth` → `AppHeader` |
| `me.ts` | `GET /me` | Bearer JWT | `HomePage` |

Base URL: `import.meta.env.VITE_API_BASE_URL` (default `http://localhost:8787`).

### Health indicator (`AppHeader`)

- Polls every **30 seconds**
- States: `checking` (yellow), `online` (green), `offline` (red)
- Visible on **all** pages (including login) so users always see API connectivity

### Home page (`/`)

- Shows Supabase session email/ID (client-side)
- Fetches and displays JSON from `GET /me` (server-validated profile)

## Layout

```
App
└── ThemeProvider
    └── Router
        └── AuthProvider
            └── AppLayout
                ├── AppHeader   (health + sign out when logged in)
                └── Outlet      (HomePage or auth pages)
```

## Key files

| Path | Role |
|------|------|
| `src/auth/AuthContext.tsx` | Supabase auth state and methods |
| `src/auth/AuthGuard.tsx` | Route protection |
| `src/api/api.ts` | Shared `apiFetch` with JWT + retry |
| `src/layout/AppHeader.tsx` | Global header + health dot |
| `src/pages/HomePage.tsx` | Authenticated landing page |

## Extension guidelines

1. Add new API modules under `src/api/` using `apiFetch`.
2. Register routes in `src/App.tsx` inside `AppLayout` with appropriate `AuthGuard`.
3. Keep `specs/FEATURES.md` updated when adding user-visible behavior.
4. Do not put service role keys or secrets in `VITE_*` variables.

## Backend pairing

Requires **cf-hono-supabase-api-template** (or any API that implements the same `/health` and `/me` contracts). See that repo's `specs/FEATURES.md` for response shapes.
