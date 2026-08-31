---
description: 구현 전 계획 수립 (읽기 전용 분석)
argument-hint: "<focus>"
---

<!--
  Plan workflow — GUIDANCE LEVEL ONLY.
  This template instructs the model; it does NOT block write tools.

  For a true read-only plan session, start pi with a tool allowlist:

    pi --tools read,grep,find,ls

  ...then run /plan in that session.
-->
Analyze the task and produce an implementation plan. Do not modify anything yet.

## Steps
1. Read the relevant files in full before drawing conclusions.
2. Search for related code and existing patterns (grep/find).
3. Identify risks, edge cases, and dependencies.

## Output format
- Numbered implementation steps (what/why/risk per step)
- Files to be modified
- Tests to add or update
- Open questions that need my decision

Focus: ${@:-the current task}
