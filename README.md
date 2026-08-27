# pi-kit

개인용 pi 설정 패키지. `pi install`로 배포하고, 새 머신에는 setup.sh로 설치한다.

## 구성

| 경로 | 내용 |
| --- | --- |
| `config/AGENTS.md` | 전역 에이전트 지시문. 코딩 실수를 줄이는 행동 강령 4가지 — 1) Think Before Coding, 2) Simplicity First, 3) Surgical Changes, 4) Goal-Driven Execution. setup.sh가 `~/.pi/agent/AGENTS.md`로 심볼릭 링크 |
| `prompts/plan.md` | `/plan` 프롬프트 템플릿. 구현 전 계획 수립용 — 관련 파일 전체 읽기 → 단계(what/why/risk)·수정 파일·테스트·미결정 사항 출력 |
| `extensions/` | pi 확장 (현재 비어 있음, 예약) |
| `skills/` | agent 스킬 (현재 비어 있음, 예약) |
| `themes/` | 커스텀 테마 (현재 비어 있음, 예약) |
| `package.json` | pi 패키지 매니페스트 — 위 디렉터리들을 pi에 등록 |
| `setup.sh` | 새 머신 설치 스크립트 (`pi install` + AGENTS.md 심볼릭 링크) |

`settings.json`, `auth.json` 등 머신 로컬 파일은 repo에 넣지 않는다.

## 새 머신에 설치

pi가 먼저 깔려 있어야 한다.

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
curl -fsSL https://raw.githubusercontent.com/seosd97/pi-kit/main/setup.sh | bash
```

setup.sh는 `pi install`을 실행하고 전역 AGENTS.md를 링크한다. 기존 AGENTS.md가 있으면 백업해 둔다.

## settings.json

머신 로컬로만 두고 repo에는 넣지 않는다. 권장값:

```json
{
  "defaultProvider": "zai-coding-cn",
  "defaultModel": "glm-5.3",
  "defaultThinkingLevel": "max",
  "theme": "tokyo-night"
}
```

## 수정과 갱신

- 작업은 이 repo(`~/Documents/works/pi-kit`)에서 한다. 수정 후 pi에서 `/reload`.
- `~/.pi/agent/git/` 아래는 pi가 받아 둔 복사본이므로 직접 고치지 않는다.
- 다른 머신에는 `pi update --extensions`로 반영한다.

## /plan

`/plan`은 계획을 세우는 프롬프트일 뿐 쓰기 도구를 막지는 않는다. 읽기 전용으로 쓰려면 도구를 제한해서 실행한다.

```bash
alias pi-plan='pi --tools read,grep,find,ls'
```
