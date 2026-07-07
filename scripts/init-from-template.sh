#!/usr/bin/env bash
set -euo pipefail

# Copies personalized files from templates/ to the repo root with placeholder substitution.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
TEMPLATES_DIR="templates"

OWNER=""
REPO=""
DISPLAY=""
OWNER_ID=""
ASSUME_YES=false

# templates/<from> → <to>
COPY_MANIFEST=(
  "README.md|README.md"
  "LICENSE|LICENSE"
  "CHANGELOG.md|CHANGELOG.md"
  "CONTRIBUTING.md|CONTRIBUTING.md"
  "SECURITY.md|SECURITY.md"
  "CODE_OF_CONDUCT.md|CODE_OF_CONDUCT.md"
  "INSTRUCTIONS.md|INSTRUCTIONS.md"
  "dependabot.yml|.github/dependabot.yml"
  "CODEOWNERS|.github/CODEOWNERS"
)

usage() {
  cat <<EOF
Usage: ./scripts/init-from-template.sh [options]

Copies personalized files from ${TEMPLATES_DIR}/ to the repository root.

Options:
  --owner <login>       GitHub username or org
  --repo <name>         Repository name
  --display-name <name> Maintainer display name
  --owner-id <id>       GitHub numeric user id
  --yes, -y             Non-interactive (use git remote)
  -h, --help            Show help
EOF
}

parse_remote() {
  if [[ -n "$OWNER" && -n "$REPO" ]]; then
    return 0
  fi
  if ! git remote get-url origin >/dev/null 2>&1; then
    return 0
  fi
  local url
  url="$(git remote get-url origin)"
  if [[ "$url" =~ github\.com[:/]([^/]+)/([^/.]+) ]]; then
    OWNER="${BASH_REMATCH[1]}"
    REPO="${BASH_REMATCH[2]%.git}"
  fi
}

fetch_owner_id() {
  local login="$1"
  if ! command -v curl >/dev/null 2>&1; then
    return 0
  fi
  curl -fsSL "https://api.github.com/users/${login}" | sed -n 's/.*"id": \([0-9]*\).*/\1/p' | head -n 1
}

title_case() {
  echo "$1" | awk 'BEGIN{FS="[-_]"} {for(i=1;i<=NF;i++){s=$i; $i=toupper(substr(s,1,1)) substr(s,2)}; print}' OFS=' '
}

apply_placeholders() {
  local content="$1"
  content="${content//https:\/\/github.com\/owner-username\/repo-name/${REPO_URL}}"
  content="${content//owner-username\/repo-name/${SLUG}}"
  content="${content//owner-id+owner-username@users.noreply.github.com/${AUTHOR_EMAIL}}"
  content="${content//@owner-username/@${OWNER}}"
  content="${content//owner-display-name/${DISPLAY}}"
  content="${content//repo-name/${REPO}}"
  content="${content//owner-username/${OWNER}}"
  printf '%s' "$content"
}

copy_template() {
  local from_rel="$1"
  local to_rel="$2"
  local src="${ROOT}/${TEMPLATES_DIR}/${from_rel}"
  local dest="${ROOT}/${to_rel}"

  if [[ ! -f "$src" ]]; then
    echo "⚠ Skipped missing template: ${TEMPLATES_DIR}/${from_rel}" >&2
    return 0
  fi

  mkdir -p "$(dirname "$dest")"
  apply_placeholders "$(cat "$src")" >"$dest"
  echo "✓ ${to_rel} ← ${TEMPLATES_DIR}/${from_rel}"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --owner) OWNER="$2"; shift 2 ;;
    --repo) REPO="$2"; shift 2 ;;
    --display-name) DISPLAY="$2"; shift 2 ;;
    --owner-id) OWNER_ID="$2"; shift 2 ;;
    --yes|-y) ASSUME_YES=true; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 1 ;;
  esac
done

parse_remote

if [[ -z "$OWNER" || -z "$REPO" ]]; then
  if [[ "$ASSUME_YES" == true ]]; then
    echo "❌ Could not detect owner/repo from git remote." >&2
    exit 1
  fi
  read -r -p "GitHub owner (username or org): " OWNER
  read -r -p "Repository name: " REPO
fi

if [[ -z "$DISPLAY" ]]; then
  if [[ "$ASSUME_YES" == true ]]; then
    DISPLAY="$(title_case "$OWNER")"
  else
    default_display="$(title_case "$OWNER")"
    read -r -p "Maintainer display name [${default_display}]: " DISPLAY
    DISPLAY="${DISPLAY:-$default_display}"
  fi
fi

if [[ -z "$OWNER_ID" ]]; then
  OWNER_ID="$(fetch_owner_id "$OWNER" || true)"
fi

if [[ -n "$OWNER_ID" ]]; then
  AUTHOR_EMAIL="${OWNER_ID}+${OWNER}@users.noreply.github.com"
else
  AUTHOR_EMAIL="${OWNER}@users.noreply.github.com"
fi

SLUG="${OWNER}/${REPO}"
REPO_URL="https://github.com/${SLUG}"

echo ""
echo "🔧 Initializing from template..."
echo "   Owner:  ${OWNER}"
echo "   Repo:   ${REPO}"
echo "   Author: ${DISPLAY} <${AUTHOR_EMAIL}>"
echo ""

copied=0
for entry in "${COPY_MANIFEST[@]}"; do
  from_rel="${entry%%|*}"
  to_rel="${entry#*|}"
  copy_template "$from_rel" "$to_rel"
  copied=$((copied + 1))
done

echo ""
echo "✅ Copied ${copied} file(s) from ${TEMPLATES_DIR}/."
echo "Next: review git diff, then commit."
