---
name: auth-routing
description: Supabase authentication and React Router guards in react-supabase-auth-template. Use when working on login, signup, Google OAuth, password reset, AuthContext, AuthGuard, session tokens, or protected vs guest routes.
---

# Auth & Routing

## Overview

- **Identity:** Supabase Auth on the client (`src/lib/supabase.ts`, `src/auth/AuthContext.tsx`)
- **API auth:** Access token copied to `localStorage['x-auth-token']` for worker calls
- **Routing:** `react-router` with `AuthGuard` per route in `src/App.tsx`

## Routes

| Path | `AuthGuard` | Purpose |
|------|-------------|---------|
| `/` | `requireAuth` | `HomePage` — calls `GET /me` |
| `/login` | `requireAuth={false}` | Google + email login |
| `/signup` | `requireAuth={false}` | Registration |
| `/recover-password` | `requireAuth={false}` | Email reset link |
| `/reset-password` | `requireAuth` | New password (session from email link) |

Logged-in users on guest auth pages → redirect to `/`. Guests on `/` → redirect to `/login`.

## AuthContext methods

| Method | Supabase API |
|--------|--------------|
| `signIn` | `signInWithPassword` |
| `signUp` | `signUp` |
| `loginWithGoogle` | `signInWithOAuth({ provider: 'google' })` |
| `resetPassword` | `resetPasswordForEmail` → `/reset-password` |
| `updatePassword` | `updateUser({ password })` |
| `signOut` | `signOut()` → navigate `/login` |
| `refreshToken` | `refreshSession()` |

OAuth redirect: `${window.location.origin}/`

## Provider placement

`AuthProvider` wraps `AppLayout` once in `App.tsx`. It must sit inside the router (uses `useNavigate`).

```tsx
<AuthProvider>
  <AppLayout />
</AuthProvider>
```

## Adding a protected route

```tsx
{
  path: "/dashboard",
  element: (
    <AuthGuard requireAuth>
      <DashboardPage />
    </AuthGuard>
  ),
},
```

Guest-only route: `requireAuth={false}`.

## Google OAuth setup

Configured in **Supabase dashboard**, not frontend env vars. See `docs/SUPABASE_SETUP.md`.

Redirect URI in Google Cloud Console:

```
https://<project-ref>.supabase.co/auth/v1/callback
```

## Session → API token flow

1. `onAuthStateChange` fires with session
2. `localStorage.setItem('x-auth-token', session.access_token)`
3. `apiFetch` reads token for `Authorization: Bearer ...`
4. On 401, `apiFetch` calls `refreshSession()` and retries once

## Forms

Auth UI lives in `src/auth/components/` (`login-form`, `signup-form`, etc.) using shadcn `Button`, `Card`, `Input`, `Label`.

## See also

- [`specs/FEATURES.md`](../../specs/FEATURES.md)
- [api-architecture](../api-architecture/SKILL.md)
