# github-repo-template

A **minimal GitHub repository template** from [open-templates](https://github.com/open-templates). Use it to start any new project with community docs, dependency automation, and CODEOWNERS already in place—no application code or stack-specific tooling included.

## What you get out of the box

### GitHub automation (included)

| File | Purpose |
|------|---------|
| [`.github/dependabot.yml`](.github/dependabot.yml) | Scheduled dependency update PRs (customize ecosystem and directory) |
| [`.github/workflows/dependabot-signature.yml`](.github/workflows/dependabot-signature.yml) | Adds a `Co-authored-by` trailer to Dependabot PR commits |
| [`.github/CODEOWNERS`](.github/CODEOWNERS) | Default review ownership for the repo and workflow files |

There are **no other GitHub Actions workflows** in this template (no CI build/test until you add them).

### GitHub UI configuration (included)

| File | Purpose |
|------|---------|
| [`.github/pull_request_template.md`](.github/pull_request_template.md) | PR description scaffold |
| [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/) | Structured bug, feature, and documentation issue forms |

Full reference for every workflow and template: **[docs/README.md](docs/README.md)**.

### Markdown documents (root)

These render in the GitHub web UI and cross-link at the bottom of each file for easy navigation:

| Document | Purpose |
|----------|---------|
| **README.md** (this file) | Project overview and template scope |
| [docs/README.md](docs/README.md) | Index for workflow and GitHub template documentation |
| [INSTRUCTIONS.md](INSTRUCTIONS.md) | Maintainer and agent guide: fork setup, CHANGELOG workflow, automation |
| [CHANGELOG.md](CHANGELOG.md) | Version history ([Keep a Changelog](https://keepachangelog.com/)) |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute |
| [SECURITY.md](SECURITY.md) | Vulnerability reporting |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Community standards |

Also included: [LICENSE](LICENSE) (MIT).

## Quick start

1. Click **Use this template** on GitHub (or fork/clone).
2. Rename the repository and update placeholders (`@xarlizard`, project name in docs).
3. Customize [`.github/dependabot.yml`](.github/dependabot.yml) for your package manager (the default example uses `bun`).
4. Read [INSTRUCTIONS.md](INSTRUCTIONS.md) for CHANGELOG automation and release batching.
5. Add your application code, CI workflows, and stack-specific config as needed.

```bash
git clone https://github.com/open-templates/github-repo-template.git my-new-repo
cd my-new-repo
```

## Customize after creating from template

- **Dependabot** — Change `package-ecosystem`, `directory`, assignees, and ignore rules.
- **CODEOWNERS** — Replace `@xarlizard` with your team or username.
- **Dependabot signer workflow** — Update `COAUTHOR_NAME` / `COAUTHOR_EMAIL` in the workflow file.
- **`.gitignore`** — Already broad and stack-agnostic; trim or extend sections when you pick a stack.

## License

MIT — see [LICENSE](LICENSE).

---

## Repository documents

**README** | [INSTRUCTIONS](INSTRUCTIONS.md) | [CHANGELOG](CHANGELOG.md) | [CONTRIBUTING](CONTRIBUTING.md) | [SECURITY](SECURITY.md) | [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md)
