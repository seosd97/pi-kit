---
description: 변경사항 코드 리뷰 (버그·보안·에러처리)
argument-hint: "[staged|last|<commit>]"
---

Review code changes. Do not modify anything.

## Target

- `staged` or no argument — uncommitted changes: `git diff HEAD`
- `last` — the latest commit: `git show HEAD`
- anything else — treat the argument as a commit ref: `git show <ref>`

## Focus

1. Bugs and logic errors
2. Security issues (injection, secrets, unsafe deserialization)
3. Error-handling gaps
4. Edge cases the change misses

## Output format

- Issues by severity — critical / major / minor / nit — each with `file:line` and why
- Missing tests, if any
- One-line verdict: ship / fix-first / needs-discussion
