---
description: 스테이징된 변경사항 컨벤션 커밋
argument-hint: "[<scope-hint>]"
---

Commit the staged changes with a conventional commit message.

## Steps

1. `git log --oneline -5` — learn this repo's commit style (type, language, tone).
2. `git diff --cached` — if empty, stop and tell me nothing is staged.
3. Analyze what changed and why. If staged changes span unrelated concerns, stop and
   suggest splitting instead of committing a mixed commit.
4. Write `<type>: <summary>` — feat | fix | docs | chore | refactor | test.
   Match the repo's language for the summary; keep it one line unless the change
   needs a body. ${@:-(infer scope from the diff)}
5. Commit, then show me the final message.

Do not stage anything yourself. Do not push.
