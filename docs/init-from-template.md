# Initialize from template

Stack-agnostic — copies personalized files from `templates/` to the repository root.

## Two layers

| Location | Purpose |
|----------|---------|
| **Root** (hosted template) | Public face with `@open-templates` branding |
| **`templates/`** | Adopter files with `owner-username` placeholders |

`./scripts/init-from-template.sh` copies and substitutes; it does **not** scan the whole repo.

## Run

```bash
chmod +x scripts/init-from-template.sh   # once
./scripts/init-from-template.sh
```

```bash
./scripts/init-from-template.sh --yes
./scripts/init-from-template.sh --owner acme --repo my-app
```

## After init

- Review `git diff`
- Customize `.github/dependabot.yml` ecosystem blocks
- Uncomment `# assignees: # - owner-username` if desired

`.github/workflows/dependabot-signature.yml` needs no edit (`github.repository_owner` at runtime).

---

[← Docs index](README.md)
