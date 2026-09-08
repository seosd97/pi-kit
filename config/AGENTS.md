# Global agent instructions

Behavioral guidelines to reduce common LLM coding mistakes. Applies to all
projects alongside project-specific instructions.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial
tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.
- Briefly explain your reasoning and approach before non-trivial edits.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- Handle realistic failure modes; avoid speculative defensive code.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes,
simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

- Prefer minimal, surgical changes over rewrites.
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.
- Remove imports, variables, and functions that YOUR changes made unused.
  Leave pre-existing dead code alone.

The test: every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals, using tests when practical and an
existing test harness is available:

- "Add validation" → "Add or update tests for invalid inputs, then make them pass"
- "Fix the bug" → "Reproduce it with a test, then fix it"
- "Refactor X" → "Ensure relevant tests pass before and after"

For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]

Run available checks (tests, typecheck) after changes when the project has
them.

## 5. Tool Preferences

- For code exploration prefer the `ffgrep` / `fffind` tools over bash `grep`,
  `find`, `rg`, `ls` — they are pre-indexed, frecency-ranked, and git-aware.

## 6. Delegation

**Lean toward acting as a guide model: plan, write clear instructions,
delegate, verify. Delegate whenever the test below passes; edit directly
otherwise.**

The one test for whether to delegate:

- **"Does writing the instruction make the success criteria and verification
  method concrete?"** Yes → delegate. No (exploration, design, or judgment
  must continue interactively) → do it directly.

Delegate these (expand aggressively, in this order of safety):

- **Bounded, well-scoped exploration** first — it is read-only (no writer
  conflict) and isolates heavy intermediate reads from main context. Delegate
  when a distilled answer suffices ("where is X handled?", "map this flow").
- **Bulk, mechanical, repeated edits** — write the guide once, fan out.
- **Test writing** — scope is clear, verification is self-evident.
- **Spec-clear independent implementation and isolated refactors.**

Keep these direct:

- **Trivial edits (1–2 lines)** — writing the instruction costs more than the
  edit.
- **Interleaved exploration** where the next edit depends on what was just
  read — round trips exceed the benefit.
- **Entangled, sequential, dependency-heavy edits** requiring ongoing design
  decisions.

Rules that always hold:

- **One writer per cwd/worktree.** Direct-edit or delegate editing, never
  both on the same scope at once. Parallel writers require isolated worktrees.
- **"One writer" and "one reviewer" are separate.** Editing directly does not
  preclude delegating a read-only reviewer for candidate-finding or final
  diff review.
- **Main owns final verification** — reclaim the diff, tests, and typecheck
  even when the edit was delegated.

---

**These guidelines are working if:** fewer unnecessary changes in diffs,
fewer rewrites due to overcomplication, clarifying questions come before
implementation rather than after mistakes, and delegated work comes back
verified by main without bloating main context.
