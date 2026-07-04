# Dependabot commit signer workflow

**Source:** [`.github/workflows/dependabot-signature.yml`](../.github/workflows/dependabot-signature.yml)

## Purpose

When Dependabot opens a pull request, this workflow amends the latest commit message to append a `Co-authored-by` trailer for a human maintainer. That keeps authorship visible in git history alongside the bot commit.

## Trigger

| Setting | Value |
|---------|--------|
| Event | `pull_request_target` |
| Types | `opened` |
| Condition | `github.actor == 'dependabot[bot]'` |

`pull_request_target` runs in the context of the base repository with access to `GITHUB_TOKEN` write permissions, so the workflow can push back to Dependabot’s head branch.

## Job: `append-signature`

1. **Checkout** — Checks out the Dependabot PR head branch (`fetch-depth: 0`).
2. **Configure Git identity** — Sets `github-actions[bot]` as committer.
3. **Inject trailer** — Reads the current commit message, appends `Co-authored-by: NAME <EMAIL>`, amends the commit, and force-pushes to the PR branch.

## Permissions

```yaml
permissions:
  contents: write
```

Required to amend and push the Dependabot branch.

## Customize after using the template

Update the `env` block in the **Inject Valid Co-authored Trailer** step:

| Variable | Set to |
|----------|--------|
| `COAUTHOR_NAME` | Maintainer GitHub username |
| `COAUTHOR_EMAIL` | Maintainer noreply email (`{id}+{user}@users.noreply.github.com`) |

Find the noreply address on GitHub under **Settings → Emails**.

## Security notes

- Runs only for Dependabot PRs (`if: github.actor == 'dependabot[bot]'`).
- Force-pushes only to the Dependabot head ref for that PR.
- [CODEOWNERS](../.github/CODEOWNERS) should require review for changes under `.github/workflows/`.

---

[← Docs index](README.md)
