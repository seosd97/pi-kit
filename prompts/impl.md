---
description: PLAN.md 단계별 실행
argument-hint: "[<plan-file>]"
---

Implement the plan in ${@:-PLAN.md}.

## Rules

1. Read the plan file first. If it doesn't exist, say so and stop. If it has unresolved "Open questions", stop and ask me before touching anything.
2. Work through unchecked (`[ ]`) steps in order, one at a time.
3. For each step: make the change, run the verification from the plan (tests/commands), then mark the step `[x]` in the plan file before moving to the next.
4. If verification fails, fix it before proceeding. If it cannot be fixed cleanly, stop and report what you found.
5. Keep changes surgical — no refactoring beyond what the plan says.
6. When every step is checked, summarize what changed and the verification results.
