---
name: page-architecture
description: Page and layout patterns for react-supabase-auth-template. Use when adding pages, changing AppLayout or AppHeader, implementing data loading on pages, or extending the authenticated home experience.
---

# Page Architecture

## Current structure

```
ThemeProvider
└── Router
    └── AuthProvider
        └── AppLayout
            ├── AppHeader     ← health dot, email, sign out
            └── <Outlet />    ← page content
```

- **Layout:** `src/layout/AppLayout.tsx` — full-height shell with header
- **Header:** `src/layout/AppHeader.tsx` — always visible; polls API health
- **Home:** `src/pages/HomePage.tsx` — reference for authenticated data loading

Auth pages (`LogInPage`, etc.) render inside the same layout so the health indicator is always shown.

## Reference: HomePage

Pattern for an authenticated page that loads worker data:

1. `useAuth()` for client-side session display
2. `useEffect` + API module (`fetchMe`) on mount
3. Local `loading` / `error` / `data` state
4. `Card` components for sections

```typescript
useEffect(() => {
  let cancelled = false;
  (async () => {
    const { data, error } = await fetchMe();
    if (!cancelled) { /* set state */ }
  })();
  return () => { cancelled = true; };
}, []);
```

## Adding a new page

1. Create `src/pages/YourPage.tsx`
2. Register in `src/App.tsx` under `AppLayout` children
3. Wrap with `<AuthGuard requireAuth>` unless guest-only
4. Add API module in `src/api/` if the page calls the worker
5. Update `specs/FEATURES.md`

## Auth page shell

Auth pages use centered content (see `LogInPage.tsx`):

```tsx
<div className="ambient-bg flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-4">
  <div className="w-full max-w-4xl">
    <LoginForm />
  </div>
</div>
```

Subtract header height (`h-14`) when centering below `AppHeader`.

## i18n

Auth strings use `react-i18next` (`src/locales/en.json`, `es.json`). Add keys to both files when adding user-visible text.

## UI primitives available

Keep imports minimal — template ships with:

- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/label.tsx`

Add more shadcn components only when needed.

## Do not recreate removed patterns

The old demo used `PageHeader`, org sidebars, TanStack tables, and domain modals under `src/app/`. Those paths no longer exist. Build new features under `src/pages/` following `HomePage` unless the fork reintroduces a larger shell.

## See also

- [auth-routing](../auth-routing/SKILL.md)
- [api-architecture](../api-architecture/SKILL.md)
