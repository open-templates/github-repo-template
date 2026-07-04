# Supabase setup

Guide for configuring Supabase Auth with this template (email/password + Google OAuth). No custom database tables are required for the default app.

## Prerequisites

- Supabase account (free tier)
- [cf-hono-supabase-api-template](../cf-hono-supabase-api-template) running locally or deployed (for `/health` and `/me`)

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. Note your **Project URL** and **anon/publishable key** under **Settings → API**.

## 2. Frontend environment

```bash
cp .env.example .env.local
```

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_API_BASE_URL=http://localhost:8787
```

## 3. Email / password auth

1. **Authentication → Providers** — Email should be enabled.
2. Optionally enable email confirmation under provider settings.

## 4. Google OAuth

1. In [Google Cloud Console](https://console.cloud.google.com), create OAuth credentials (Web application).
2. Add authorized redirect URI:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
3. In Supabase **Authentication → Providers → Google**, enable and paste Client ID + Secret.

## 5. URL configuration

Under **Authentication → URL Configuration**:

| Setting | Example (local) | Example (production) |
|---------|-----------------|----------------------|
| Site URL | `http://localhost:5173` | `https://your-app.pages.dev` |
| Redirect URLs | `http://localhost:5173` | `https://your-app.pages.dev` |

Add every origin you use (local Vite port and Cloudflare Pages URL).

## 6. Backend worker secrets

In `cf-hono-supabase-api-template`, set the same Supabase URL and keys in `.dev.vars` (local) or Wrangler secrets (production). See that repo's `SETUP.md`.

Set `ALLOWED_ORIGINS` to your frontend URL for CORS.

## 7. Test locally

```bash
# Terminal 1 — API worker
cd ../cf-hono-supabase-api-template && npm run dev

# Terminal 2 — React app
bun run dev
```

1. Open `http://localhost:5173/login`
2. Confirm the header shows **API online** (green dot)
3. Sign in with Google or email
4. On `/`, confirm the **Profile (API /me)** card loads JSON

## 8. Deploy (Cloudflare Pages)

- Build command: `bun run build`
- Output directory: `dist`
- Environment variables: same `VITE_*` values as `.env.local`
- Update Supabase redirect URLs to your Pages domain

## Troubleshooting

**OAuth redirect fails** — Redirect URI in Google must match Supabase callback exactly; Site URL must match your app origin.

**API offline in header** — Start the worker; check `VITE_API_BASE_URL` and `ALLOWED_ORIGINS` on the worker.

**/me returns 401** — Ensure you are logged in; token is stored as `x-auth-token`. Check worker Supabase keys.

## References

- [Supabase Auth docs](https://supabase.com/docs/guides/auth)
- [Template features spec](../specs/FEATURES.md)
