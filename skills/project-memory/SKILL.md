---
name: project-memory
description: Use when starting work in a project that has a .pi/memory directory, or when the user asks to remember, recall, or tidy project-specific facts. Provides persistent per-project memory conventions.
---

# Project memory

Per-project knowledge base at `.pi/memory/` — an index plus topic files. It survives
sessions and compaction, unlike conversation context.

## Layout

- `.pi/memory/MEMORY.md` — index: one line per topic file with a short description
- `.pi/memory/<topic>.md` — facts for one topic (e.g. `architecture.md`, `decisions.md`, `conventions.md`)

## Rules

1. **Read** — at task start, if `.pi/memory/MEMORY.md` exists, read it. Follow into a
   topic file only when it is relevant to the current task.
2. **Write** — only when the user explicitly asks ("remember this", "기록해둬").
   Append or update a topic file, keep entries short and dated (`YYYY-MM-DD` prefix),
   and update `MEMORY.md` if a new file was created. Create the directory on first write.
3. **Privacy** — memory is machine-local. On first write, add `.pi/memory/` to the
   project's `.git/info/exclude` (not `.gitignore`) unless the user asks for shared memory.
4. **Tidy** — when asked, merge duplicates and drop entries that no longer match the
   code. Show the diff of what you changed; never silently rewrite history.

Do not extract memory from the user's code or conversation proactively. No silent writes.
