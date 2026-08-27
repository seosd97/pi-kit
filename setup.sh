#!/usr/bin/env bash
# pi-kit consumer machine setup
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/seosd97/pi-kit/main/setup.sh | bash
set -euo pipefail

REPO="git:github.com/seosd97/pi-kit"
AGENT_DIR="${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}"
AGENTS_SRC="$AGENT_DIR/git/github.com/seosd97/pi-kit/config/AGENTS.md"

command -v pi >/dev/null 2>&1 || {
  echo "error: pi not found" >&2
  echo "install first: npm install -g --ignore-scripts @earendil-works/pi-coding-agent" >&2
  exit 1
}

echo "==> installing pi-kit package"
pi install "$REPO"

echo "==> linking global AGENTS.md"
if [ -L "$AGENT_DIR/AGENTS.md" ] && [ "$(readlink "$AGENT_DIR/AGENTS.md")" = "$AGENTS_SRC" ]; then
  echo "    already linked, skipping"
else
  if [ -e "$AGENT_DIR/AGENTS.md" ] || [ -L "$AGENT_DIR/AGENTS.md" ]; then
    mv "$AGENT_DIR/AGENTS.md" "$AGENT_DIR/AGENTS.md.bak.$(date +%s)"
    echo "    backed up existing AGENTS.md"
  fi
  ln -sf "$AGENTS_SRC" "$AGENT_DIR/AGENTS.md"
fi

echo "==> done"
echo "    update later with: pi update --extensions"
echo "    settings.json stays machine-local; recommended values are in README.md"
