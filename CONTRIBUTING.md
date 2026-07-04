# Contributing to Template

Thanks for helping improve Template.

## Code of Conduct

Participation in this project means agreeing to the rules in `CODE_OF_CONDUCT.md`.

## Local Setup

```bash
git clone https://github.com/open-templates/react-supabase-auth-template.git
cd react-supabase-auth-template
bun install
bun run dev
```

## What to Work On

- Invoice creation/editing flows
- Billing automation and mail dispatch
- Local-first persistence model
- UX improvements for dashboard and forms

## Pull Requests

1. Create a branch from `main`.
2. Keep changes focused and small.
3. Run checks before opening PR:

```bash
bun run lint
bun run typecheck
bun run build
```

4. Open PR with a clear description and link related issues.

## Commit Style

Conventional commits are preferred, for example:

- `feat: add invoice draft save flow`
- `fix: handle empty customer email`
- `docs: update local setup section`

## License

By contributing, you agree your changes are licensed under MIT.
