# Agent & developer instructions — react-supabase-auth-template

Use this file when turning this template into a **production SPA** with Supabase Auth and a Cloudflare Worker backend. This repository is **self-contained** for the UI and client-side auth; API calls require a separate worker (this template pairs with [cf-hono-supabase-api-template](https://github.com/open-templates/cf-hono-supabase-api-template) as the demo backend).

## What ships out of the box

| Feature | Description |
|---------|-------------|
| Google OAuth | Sign in / sign up via Supabase |
| Email auth | Login, signup, password recovery & reset |
| API health indicator | Header polls `GET /health` |
| Protected home | Calls `GET /me` with JWT |

Details: [`specs/FEATURES.md`](specs/FEATURES.md)

---

## Prerequisites (required before development)

### 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. **Settings → API** — copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / publishable key** → `VITE_SUPABASE_PUBLISHABLE_KEY`
3. **Authentication → Providers → Email** — enable (default).

### 2. Google Cloud OAuth application (required for Google sign-in)

1. Open [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services**.
2. **OAuth consent screen** — configure (External), scopes: `email`, `profile`.
3. **Credentials → Create OAuth client ID** — type **Web application**.
4. **Authorized redirect URIs** — add exactly:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
   Find `<your-project-ref>` in your Supabase project URL.
5. Copy **Client ID** and **Client secret**.

### 3. Integrate Google with Supabase

1. Supabase dashboard → **Authentication → Providers → Google**.
2. Enable Google, paste Client ID and Client secret, save.

### 4. Supabase URL configuration

**Authentication → URL Configuration**:

| Setting | Local dev | Production |
|---------|-----------|------------|
| Site URL | `http://localhost:5173` | `https://your-app.pages.dev` |
| Redirect URLs | `http://localhost:5173` | `https://your-app.pages.dev` |

Add every origin you use (no trailing slash mismatches).

Step-by-step UI guide: [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md)

---

## Setup checklist

```bash
bun install
cp .env.example .env.local
```

`.env.local`:

```bash
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
VITE_API_BASE_URL=http://localhost:8787
```

```bash
bun run dev   # http://localhost:5173
```

Test:

1. Open `/login` — header should show API status (requires worker; see below).
2. Sign in with Google or email.
3. On `/` — session card + **Profile (API /me)** JSON.

---

## Connecting the backend (missing piece for API calls)

This frontend does **not** include the API worker. For `/health` and `/me`:

1. Clone or fork **[cf-hono-supabase-api-template](https://github.com/open-templates/cf-hono-supabase-api-template)**.
2. Complete **its** `INSTRUCTIONS.md` (same Supabase project credentials in worker `.dev.vars`).
3. Start worker: `npm run dev` (port `8787`).
4. Set worker `ALLOWED_ORIGINS=http://localhost:5173` (and production URL when deployed).
5. Deploy worker to Cloudflare; set `VITE_API_BASE_URL` to the worker URL in production.

Use the **same Supabase project** for both templates so JWTs issued to the browser are valid on the worker.

---

## Agent workflow (extending to production)

Read in order:

1. **`INSTRUCTIONS.md`** (this file) — OAuth + env setup
2. **`specs/FEATURES.md`** — routes and API contract
3. **`.agents/skills/README.md`** — skill index

### Adding a feature page

1. **Backend route** in cf-hono template (if new API) — document in both `specs/FEATURES.md` files
2. **API module**: `src/api/<feature>.ts` using `apiFetch` — see `api-architecture` skill
3. **Page**: `src/pages/` + route in `src/App.tsx` with `AuthGuard`
4. **i18n**: keys in `src/locales/en.json` and `es.json`

### Rules

- Auth stays on Supabase client; domain data goes through the worker (`VITE_API_BASE_URL`).
- Never put service role keys in `VITE_*` variables.
- Token for API: `localStorage['x-auth-token']` (managed by `AuthContext`).
- Run `bun run typecheck` before finishing.

---

## Repository map

```
src/auth/           AuthContext, guards, forms, auth pages
src/api/            apiFetch, health, me (+ your modules)
src/layout/         AppLayout, AppHeader (health dot)
src/pages/          HomePage (+ your pages)
specs/FEATURES.md   Feature specification
.agents/skills/     Agent skills
.cursor/rules/      Cursor IDE rules
docs/               Supabase setup guide
```

---

## Deployment (Cloudflare Pages)

- Build: `bun run build`
- Output: `dist`
- Env vars: same `VITE_*` as `.env.local`
- Update Supabase redirect URLs to Pages domain

---

## Troubleshooting

| Issue | Check |
|-------|--------|
| Google OAuth redirect error | Redirect URI in Google = `https://<ref>.supabase.co/auth/v1/callback`; Site URL matches app origin |
| API offline in header | Worker running; `VITE_API_BASE_URL` correct |
| `/me` fails after login | Same Supabase project on worker; CORS `ALLOWED_ORIGINS` |

---

## License

MIT — see `LICENSE`.
