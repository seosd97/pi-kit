# pi-kit

Personal pi coding-agent kit. Single source of truth for extensions, skills,
prompt templates, and themes, deployed to multiple machines as a local-path
pi package.

Tested with:
- Pi 0.84.x
- Node.js 24.x
- macOS / Linux (Windows needs a bootstrap script — not included)

## Layout

```
pi-kit/
├── package.json     # root pi manifest (do NOT move into a subdirectory)
├── extensions/      # pi loads *.ts / */index.ts
├── skills/          # pi loads SKILL.md folders
├── prompts/         # pi loads *.md as /name templates
├── themes/          # pi loads *.json themes
└── config/
    └── AGENTS.md    # global context file -> symlinked to ~/.pi/agent/AGENTS.md
```

## Setup — first machine (this repo already exists)

```bash
cd ~/Documents/works/pi-kit
git remote add origin git@github.com:seosd/pi-kit.git
git push -u origin main
```

## Setup — additional machine

```bash
git clone git@github.com:seosd/pi-kit.git ~/Documents/works/pi-kit
pi install "$HOME/Documents/works/pi-kit"

# symlink global AGENTS.md (backs up an existing file first)
[ -f ~/.pi/agent/AGENTS.md ] && mv ~/.pi/agent/AGENTS.md ~/.pi/agent/AGENTS.md.bak.$(date +%s)
ln -sf ~/Documents/works/pi-kit/config/AGENTS.md ~/.pi/agent/AGENTS.md
```

Verify: start `pi` — the startup header must list `plan` under prompt templates.

## Update flow

```bash
git -C ~/Documents/works/pi-kit pull --ff-only
```
then `/reload` inside pi (or restart pi).

If a runtime npm dependency is ever added to package.json, also run
`npm install` inside the repo after pulling.

## Read-only plan mode

`prompts/plan.md` is guidance only — it does not block write tools.
For a tool-level read-only session:

```bash
alias pi-plan='pi --tools read,grep,find,ls'
```

Then run `/plan` inside that session.

## Environment matrix

| Environment | Package source | Global AGENTS.md | Update |
|---|---|---|---|
| Personal machine | local path (`pi install <repo>`) | symlinked from repo | `git pull --ff-only` + `/reload` |
| CI / one-off | `pi install git:github.com/seosd/pi-kit@<commit>` | not applied by default | reinstall at new commit |
| Team project | project `.pi/settings.json` team package | project `AGENTS.md` | pinned ref: edit ref + reinstall (NOT `pi update --extensions`) |

Note: pinned (`@ref`) packages are skipped by `pi update --extensions`.
Move them with `pi install git:...@<new-ref>`.

## settings.json policy

`~/.pi/agent/settings.json` stays machine-local (pi writes to it: installs,
`/settings`, changelog version). Do not symlink or commit it.

Current desired values (apply manually on a new machine):

```json
{
  "defaultProvider": "anthropic",
  "defaultModel": "claude-opus-4-8",
  "theme": "dark"
}
```

## Never sync

`auth.json`, `trust.json`, `sessions/`, `models-store.json` — machine/secret state.

## Extension authoring notes

- One extension per file in `extensions/`, with a header comment stating
  purpose and how to remove it (kickstart-style).
- Iterate locally: edits apply on `/reload`; no reinstall needed for
  local-path packages.
- Heavy/rarely-used tools: defer activation via `pi.setActiveTools()` when
  the active tool set grows enough to matter.
